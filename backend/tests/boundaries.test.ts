import { test } from "node:test";
import assert from "node:assert/strict";
import { mapClientLoad, mapCount, mapRecord, mapUser } from "../src/repositories/mysql/row-mappers.js";
import { hashPassword, verifyPassword } from "../src/services/password.js";
import { Project } from "../src/domain/entity.js";

test("mapeamento SQL valida tipos, relacionamentos e contagens sem expor a linha inválida", () => {
  const project = { id: 1, name: "Site", description: "Projeto institucional", clientId: 2 };
  assert.deepEqual(mapRecord("projetos", project), project);
  assert.equal(mapCount({ total: "12" }), 12);
  assert.deepEqual(mapClientLoad({ clientId: 2, name: "Cliente", projects: "0" }), {
    clientId: 2, name: "Cliente", projects: 0,
  });
  assert.throws(() => mapRecord("projetos", { ...project, clientId: null }));
  assert.throws(() => mapRecord("clientes", { id: 1, name: "Cliente", description: "Empresa" }));
  assert.throws(() => mapCount(undefined));
  assert.throws(() => mapCount({ total: -1 }));
  for (const total of [null, true, "", "1.5", Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => mapCount({ total }));
  assert.throws(() => mapClientLoad({ clientId: 2, name: "Cliente", projects: "invalido" }));
  assert.throws(() => mapUser({ id: "incorreto", passwordHash: "dado-privado" }), (error: unknown) => {
    return error instanceof Error && !error.message.includes("dado-privado");
  });
});

test("senha usa salt independente e recusa hash malformado sem quebrar o login", async () => {
  const password = "SenhaDeTeste123";
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("Incorreta123", first), false);
  for (const malformed of ["", "sem-separador", "salt:hash", `${first}:extra`])
    assert.equal(await verifyPassword(password, malformed), false);
});

test("entidade Project rejeita identificadores de cliente não positivos ou fracionados", () => {
  for (const clientId of [0, -1, 0.5, Number.NaN, Infinity])
    assert.throws(() => new Project({ name: "Projeto", description: "Site", clientId }));
});
