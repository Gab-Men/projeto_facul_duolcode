import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { RecordRepository, UserRepository } from "./contracts.js";
import type { BusinessRecord, Page, RecordInput, Resource, User } from "../domain/validation.js";
import { NotFoundError } from "../errors/app-error.js";
import type { StatisticsRepository } from "./contracts.js";
import type { ClientLoad } from "../domain/portfolio-analysis.js";

export class MysqlStatisticsRepository implements StatisticsRepository {
  constructor(private readonly db: Pool) {}
  async clientLoads(ownerId: number): Promise<ClientLoad[]> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT c.id AS clientId, c.name, COUNT(p.id) AS projects
       FROM clientes c
       LEFT JOIN projetos p ON p.clientId = c.id AND p.ownerId = c.ownerId
       WHERE c.ownerId = ?
       GROUP BY c.id, c.name ORDER BY c.id`,
      [ownerId],
    );
    return rows.map((row) => ({
      clientId: Number(row.clientId), name: String(row.name), projects: Number(row.projects),
    }));
  }
}
// Table and column identifiers are fixed in source; values always use parameters.
const extraColumns: Record<Resource, string[]> = {
  clientes: ["email"],
  servicos: [],
  parceiros: ["website"],
  projetos: ["clientId"],
};
export class MysqlUserRepository implements UserRepository {
  constructor(private readonly db: Pool) {}
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return (rows[0] as User | undefined) ?? null;
  }
  async findById(id: number): Promise<User | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
    return (rows[0] as User | undefined) ?? null;
  }
  async create(data: Omit<User, "id">): Promise<User> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, cpf, passwordHash) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.cpf, data.passwordHash],
    );
    return { id: result.insertId, ...data };
  }
  async update(id: number, data: Pick<User, "name" | "cpf" | "passwordHash">): Promise<User> {
    await this.db.execute("UPDATE users SET name = ?, cpf = ?, passwordHash = ? WHERE id = ?", [
      data.name,
      data.cpf,
      data.passwordHash,
      id,
    ]);
    const user = await this.findById(id);
    if (!user) throw new NotFoundError();
    return user;
  }
}
export class MysqlRecordRepository implements RecordRepository {
  constructor(private readonly db: Pool) {}
  private projection(resource: Resource): string {
    return ["id", "name", "description", ...extraColumns[resource]]
      .map((column) => `\`${column}\``)
      .join(", ");
  }
  async list(
    resource: Resource,
    ownerId: number,
    page: number,
    pageSize: number,
  ): Promise<Page<BusinessRecord>> {
    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT ${this.projection(resource)} FROM ${resource} WHERE ownerId = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
      [ownerId, pageSize, (page - 1) * pageSize],
    );
    const [count] = await this.db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM ${resource} WHERE ownerId = ?`,
      [ownerId],
    );
    return { items: rows as BusinessRecord[], total: Number(count[0].total), page, pageSize };
  }
  async find(resource: Resource, ownerId: number, id: number): Promise<BusinessRecord | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT ${this.projection(resource)} FROM ${resource} WHERE id = ? AND ownerId = ?`,
      [id, ownerId],
    );
    return (rows[0] as BusinessRecord | undefined) ?? null;
  }
  async create(resource: Resource, ownerId: number, data: RecordInput): Promise<BusinessRecord> {
    const fields = ["name", "description", ...extraColumns[resource]] as (keyof RecordInput)[];
    const [result] = await this.db.execute<ResultSetHeader>(
      `INSERT INTO ${resource} (ownerId, ${fields.map((field) => `\`${field}\``).join(", ")}) VALUES (?, ${fields.map(() => "?").join(", ")})`,
      [ownerId, ...fields.map((field) => data[field] ?? null)],
    );
    return { id: result.insertId, ...data };
  }
  async update(
    resource: Resource,
    ownerId: number,
    id: number,
    data: RecordInput,
  ): Promise<BusinessRecord> {
    const fields = ["name", "description", ...extraColumns[resource]] as (keyof RecordInput)[];
    await this.db.execute(
      `UPDATE ${resource} SET ${fields.map((field) => `\`${field}\` = ?`).join(", ")} WHERE id = ? AND ownerId = ?`,
      [...fields.map((field) => data[field] ?? null), id, ownerId],
    );
    const record = await this.find(resource, ownerId, id);
    if (!record) throw new NotFoundError();
    return record;
  }
  async remove(resource: Resource, ownerId: number, id: number): Promise<void> {
    const [result] = await this.db.execute<ResultSetHeader>(
      `DELETE FROM ${resource} WHERE id = ? AND ownerId = ?`,
      [id, ownerId],
    );
    if (!result.affectedRows) throw new NotFoundError();
  }
}
