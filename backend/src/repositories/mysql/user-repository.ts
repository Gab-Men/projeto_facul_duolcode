import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { NewUser, User, UserUpdate } from "../../domain/user.js";
import { NotFoundError } from "../../errors/app-error.js";
import type { UserRepository } from "../contracts.js";
import { mapUser } from "./row-mappers.js";

export class MysqlUserRepository implements UserRepository {
  constructor(private readonly db: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT id, name, email, cpf, passwordHash FROM users WHERE email = ?", [email],
    );
    return rows[0] === undefined ? null : mapUser(rows[0]);
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      "SELECT id, name, email, cpf, passwordHash FROM users WHERE id = ?", [id],
    );
    return rows[0] === undefined ? null : mapUser(rows[0]);
  }

  async create(data: NewUser): Promise<User> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, cpf, passwordHash) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.cpf, data.passwordHash],
    );
    return { id: result.insertId, ...data };
  }

  async update(id: number, data: UserUpdate): Promise<User> {
    await this.db.execute("UPDATE users SET name = ?, cpf = ?, passwordHash = ? WHERE id = ?", [
      data.name, data.cpf, data.passwordHash, id,
    ]);
    const user = await this.findById(id);
    if (!user) throw new NotFoundError();
    return user;
  }
}
