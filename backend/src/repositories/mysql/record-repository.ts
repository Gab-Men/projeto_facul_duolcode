import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { schemas } from "../../domain/validation.js";
import type { BusinessRecord, RecordInput, Resource } from "../../domain/records.js";
import type { Page } from "../../domain/pagination.js";
import { NotFoundError } from "../../errors/app-error.js";
import type { RecordRepository } from "../contracts.js";
import { mapCount, mapRecord } from "./row-mappers.js";

type SqlValue = string | number;
interface RecordColumns<R extends Resource> {
  readonly fields: readonly (keyof RecordInput<R>)[];
  values(input: RecordInput): SqlValue[];
}

// Identifiers are fixed in source; values are validated and sent as parameters.
const columns = {
  clientes: {
    fields: ["name", "description", "email"],
    values(input) {
      const data = schemas.clientes.parse(input);
      return [data.name, data.description, data.email];
    },
  },
  servicos: {
    fields: ["name", "description"],
    values(input) {
      const data = schemas.servicos.parse(input);
      return [data.name, data.description];
    },
  },
  parceiros: {
    fields: ["name", "description", "website"],
    values(input) {
      const data = schemas.parceiros.parse(input);
      return [data.name, data.description, data.website];
    },
  },
  projetos: {
    fields: ["name", "description", "clientId"],
    values(input) {
      const data = schemas.projetos.parse(input);
      return [data.name, data.description, data.clientId];
    },
  },
} satisfies { [R in Resource]: RecordColumns<R> };

export class MysqlRecordRepository implements RecordRepository {
  constructor(private readonly db: Pool) {}

  private projection(resource: Resource): string {
    return ["id", ...columns[resource].fields].map((column) => `\`${column}\``).join(", ");
  }

  async list(resource: Resource, ownerId: number, page: number, pageSize: number): Promise<Page<BusinessRecord>> {
    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT ${this.projection(resource)} FROM ${resource} WHERE ownerId = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
      [ownerId, pageSize, (page - 1) * pageSize],
    );
    const [count] = await this.db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM ${resource} WHERE ownerId = ?`, [ownerId],
    );
    return { items: rows.map((row) => mapRecord(resource, row)), total: mapCount(count[0]), page, pageSize };
  }

  async find(resource: Resource, ownerId: number, id: number): Promise<BusinessRecord | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT ${this.projection(resource)} FROM ${resource} WHERE id = ? AND ownerId = ?`, [id, ownerId],
    );
    return rows[0] === undefined ? null : mapRecord(resource, rows[0]);
  }

  async create<R extends Resource>(resource: R, ownerId: number, data: RecordInput<NoInfer<R>>): Promise<BusinessRecord> {
    const { fields, values } = columns[resource];
    const [result] = await this.db.execute<ResultSetHeader>(
      `INSERT INTO ${resource} (ownerId, ${fields.map((field) => `\`${field}\``).join(", ")}) VALUES (?, ${fields.map(() => "?").join(", ")})`,
      [ownerId, ...values(data)],
    );
    return mapRecord(resource, { id: result.insertId, ...data });
  }

  async update<R extends Resource>(resource: R, ownerId: number, id: number, data: RecordInput<NoInfer<R>>): Promise<BusinessRecord> {
    const { fields, values } = columns[resource];
    await this.db.execute(
      `UPDATE ${resource} SET ${fields.map((field) => `\`${field}\` = ?`).join(", ")} WHERE id = ? AND ownerId = ?`,
      [...values(data), id, ownerId],
    );
    const record = await this.find(resource, ownerId, id);
    if (!record) throw new NotFoundError();
    return record;
  }

  async remove(resource: Resource, ownerId: number, id: number): Promise<void> {
    const [result] = await this.db.execute<ResultSetHeader>(
      `DELETE FROM ${resource} WHERE id = ? AND ownerId = ?`, [id, ownerId],
    );
    if (!result.affectedRows) throw new NotFoundError();
  }
}
