import { z } from "zod";
import { schemas } from "../../domain/validation.js";
import type { BusinessRecord, Resource } from "../../domain/records.js";
import type { User } from "../../domain/user.js";
import type { ClientLoad } from "../../domain/portfolio-analysis.js";

const id = z.number().int().positive();
const userRow = z.object({
  id,
  name: z.string(),
  email: z.string(),
  cpf: z.string(),
  passwordHash: z.string(),
});
const recordRows = {
  clientes: schemas.clientes.extend({ id }),
  servicos: schemas.servicos.extend({ id }),
  parceiros: schemas.parceiros.extend({ id }),
  projetos: schemas.projetos.extend({ id }),
};
// MySQL COUNT can be a number or a decimal string; null/booleans are not counts.
const count = z.union([z.number(), z.string().regex(/^\d+$/)])
  .transform(Number)
  .pipe(z.number().int().nonnegative().safe());
const countRow = z.object({ total: count });
const clientLoadRow = z.object({
  clientId: id,
  name: z.string(),
  projects: count,
});

// A database row is external data until validation succeeds.
function fromRow<T>(schema: z.ZodType<T>, row: unknown): T {
  const result = schema.safeParse(row);
  if (!result.success) throw new Error("O banco retornou dados incompatíveis com o domínio.");
  return result.data;
}

export function mapUser(row: unknown): User {
  return fromRow(userRow, row);
}
export function mapRecord(resource: Resource, row: unknown): BusinessRecord {
  return fromRow<BusinessRecord>(recordRows[resource], row);
}
export function mapCount(row: unknown): number {
  return fromRow(countRow, row).total;
}
export function mapClientLoad(row: unknown): ClientLoad {
  return fromRow(clientLoadRow, row);
}
