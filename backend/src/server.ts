import mysql from "mysql2/promise";
import { createApp } from "./app.js";
import { MysqlRecordRepository, MysqlUserRepository } from "./repositories/mysql.js";
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Configure ${name}.`);
  return value;
}
const db = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: required("MYSQL_USER"),
  password: required("MYSQL_PASSWORD"),
  database: required("MYSQL_DATABASE"),
  connectionLimit: 10,
});
const app = createApp({
  users: new MysqlUserRepository(db),
  records: new MysqlRecordRepository(db),
  jwtSecret: required("JWT_SECRET"),
  health: async () => {
    await db.query("SELECT 1");
  },
});
const server = app.listen(
  Number(process.env.PORT ?? 3001),
  process.env.BIND_HOST ?? "127.0.0.1",
  () => console.log("API DuolCode pronta na porta 3001."),
);
for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.on(signal, () => {
    server.close(() => {
      void db.end();
    });
  });
