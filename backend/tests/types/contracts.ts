import type { Page } from "../../src/domain/pagination.js";
import type { BusinessRecord, RecordInput } from "../../src/domain/records.js";
import type { PublicUser } from "../../src/domain/user.js";
import type { RecordRepository } from "../../src/repositories/contracts.js";

// Compiled, never executed. Each expected error protects a public type contract.
export function verifyContracts(repository: RecordRepository, user: PublicUser): void {
  const client: RecordInput<"clientes"> = { name: "Cliente", description: "Empresa", email: "cliente@example.com" };
  const project: RecordInput<"projetos"> = { name: "Projeto", description: "Site", clientId: 1 };
  const page: Page<BusinessRecord<"projetos">> = { items: [{ id: 1, ...project }], total: 1, page: 1, pageSize: 10 };
  void repository.create("clientes", 1, client);
  void repository.update("projetos", 1, 1, project);
  void page;
  // @ts-expect-error A client requires email; the resource cannot be widened to bypass it.
  void repository.create("clientes", 1, { name: "Cliente", description: "Empresa" });
  // @ts-expect-error A project requires its client relationship.
  void repository.update("projetos", 1, 1, { name: "Projeto", description: "Site" });
  // @ts-expect-error Partners require a website, not a client email.
  void repository.create("parceiros", 1, client);
  // @ts-expect-error A paginated project must retain the numeric client identifier.
  const invalidPage: Page<BusinessRecord<"projetos">> = { items: [{ id: 1, name: "Projeto", description: "Site", clientId: "1" }], total: 1, page: 1, pageSize: 10 };
  void invalidPage;
  // @ts-expect-error Public users never expose the stored password hash.
  void user.passwordHash;
}
