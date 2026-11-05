import type { Pool, RowDataPacket } from "mysql2/promise";
import type { ClientLoad } from "../../domain/portfolio-analysis.js";
import type { StatisticsRepository } from "../contracts.js";
import { mapClientLoad } from "./row-mappers.js";

export class MysqlStatisticsRepository implements StatisticsRepository {
  constructor(private readonly db: Pool) {}

  async clientLoads(ownerId: number): Promise<ClientLoad[]> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT c.id AS clientId, c.name, COUNT(p.id) AS projects
       FROM clientes c
       LEFT JOIN projetos p ON p.clientId = c.id AND p.ownerId = c.ownerId
       WHERE c.ownerId = ?
       GROUP BY c.id, c.name ORDER BY c.id`, [ownerId],
    );
    return rows.map(mapClientLoad);
  }
}
