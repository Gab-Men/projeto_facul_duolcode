import assert from "node:assert/strict";
import test from "node:test";
import {
  BusinessEntity, ClientEntity, PartnerEntity, ProjectEntity, ServiceEntity, createEntity,
} from "../src/domain/entity.js";
import {
  AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError,
} from "../src/errors/app-error.js";

test("fábrica cria a subclasse correta para cada recurso (polimorfismo)", () => {
  const base = { name: "Nome", description: "Descrição" };
  const entities = [
    createEntity("clientes", { ...base, email: "a@b.com" }),
    createEntity("servicos", base),
    createEntity("parceiros", { ...base, website: "https://parceiro.com" }),
    createEntity("projetos", { ...base, clientId: 3 }),
  ];
  const classes = [ClientEntity, ServiceEntity, PartnerEntity, ProjectEntity];
  entities.forEach((entity, index) => {
    assert.ok(entity instanceof BusinessEntity);
    assert.ok(entity instanceof classes[index]!);
  });
  assert.deepEqual(entities.map((entity) => entity.resource), ["clientes", "servicos", "parceiros", "projetos"]);
});

test("somente projeto declara relação obrigatória com cliente", () => {
  const project = new ProjectEntity({ name: "Site", description: "Institucional", clientId: 7 });
  assert.deepEqual(project.relations.map(({ resource, id }) => ({ resource, id })), [{ resource: "clientes", id: 7 }]);
  assert.equal(new ServiceEntity({ name: "SEO", description: "Otimização" }).relations.length, 0);
});

test("hooks normalizam e validam conforme o recurso", () => {
  const client = new ClientEntity({ name: "  Loja  ", description: " Varejo ", email: " Contato@Loja.COM " });
  assert.deepEqual(client.toRecord(), { name: "Loja", description: "Varejo", email: "contato@loja.com" });
  assert.throws(() => new PartnerEntity({ name: "Parceiro", description: "Agência", website: "ftp://x.com" }), ValidationError);
  assert.throws(() => new ServiceEntity({ name: " a ", description: "Descrição" }), ValidationError);
});

test("estado interno congelado não aceita alteração externa", () => {
  const service = new ServiceEntity({ name: "SEO", description: "Otimização" });
  const copy = service.toRecord();
  copy.name = "Alterado";
  assert.equal(service.toRecord().name, "SEO");
  assert.equal(Object.keys(service).length, 0);
});

test("exceções customizadas carregam status HTTP e nome da classe", () => {
  const cases: [AppError, number, string][] = [
    [new ValidationError("x"), 400, "ValidationError"],
    [new UnauthorizedError(), 401, "UnauthorizedError"],
    [new NotFoundError(), 404, "NotFoundError"],
    [new ConflictError("x"), 409, "ConflictError"],
  ];
  for (const [error, status, name] of cases) {
    assert.ok(error instanceof AppError);
    assert.equal(error.status, status);
    assert.equal(error.name, name);
  }
});
