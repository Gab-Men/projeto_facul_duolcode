// Runs against the real HTTP API and MySQL. Creates only isolated, labeled test data.
// Never reads .env or prints passwords, CPFs, tokens or authentication bodies.
import assert from "node:assert/strict";
import { randomBytes, randomInt } from "node:crypto";

const baseUrl = (process.argv[2] ?? "http://localhost:8080").replace(/\/$/, "");
function cpf() {
  const digits = Array.from({ length: 9 }, () => randomInt(10));
  for (let length = 9; length <= 10; length++) {
    const sum = digits.reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    digits.push(((sum * 10) % 11) % 10);
  }
  return digits.join("");
}
async function call(path: string, expected: number, body?: unknown, token?: string) {
  const response = await fetch(`${baseUrl}/api${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  assert.equal(response.status, expected, `Status inesperado em ${path}: ${response.status} (esperado ${expected})`);
  const data = await response.json() as Record<string, unknown>;
  return { data, response };
}
async function main() {
  await call("/health", 200);
  const stamp = randomBytes(6).toString("hex");
  const account = {
    name: "Verificação da sprint",
    email: `sprint-${stamp}@example.com`,
    password: `Teste${randomBytes(16).toString("hex")}9`,
    cpf: cpf(),
  };
  for (const change of [{ name: "" }, { email: "invalido" }, { cpf: "11111111111" }, { password: "fraca" }]) {
    const result = await call("/auth/register", 400, { ...account, ...change });
    assert.equal(typeof result.data.message, "string");
  }
  for (const field of ["name", "email", "password", "cpf"] as const) {
    const incomplete: Record<string, string> = { ...account };
    delete incomplete[field];
    await call("/auth/register", 400, incomplete);
  }
  const created = await call("/auth/register", 201, account);
  assert.equal(created.data.passwordHash, undefined);
  assert.equal(created.data.password, undefined);
  await call("/auth/register", 409, account);
  await call("/auth/register", 409, { ...account, email: `duplicate-${stamp}@example.com` });
  console.log("OK: cadastro real, campos obrigatórios, validações e duplicidade no MySQL.");
  const login = await call("/auth/login", 200, { email: account.email, password: account.password });
  assert.equal(typeof login.data.token, "string");
  const token = login.data.token as string;
  await call("/statistics/portfolio", 401);
  const empty = await call("/statistics/portfolio", 200, undefined, token);
  assert.equal(empty.data.totalClients, 0);
  assert.equal(empty.data.mean, null);
  for (let projects = 0; projects < 5; projects++) {
    const client = await call("/clientes", 201, {
      name: `Cliente de teste ${projects + 1}`,
      description: "Dados simulados para verificar a sprint",
      email: `cliente${projects}-${stamp}@example.com`,
    }, token);
    for (let index = 0; index < projects; index++)
      await call("/projetos", 201, {
        name: `Projeto de teste ${projects}-${index + 1}`,
        description: "Dados simulados para verificar a sprint",
        clientId: client.data.id,
      }, token);
  }
  const result = await call("/statistics/portfolio", 200, undefined, token);
  assert.equal(result.data.totalClients, 5);
  assert.equal(result.data.totalProjects, 10);
  assert.equal(result.data.mean, 2);
  assert.equal(result.data.median, 2);
  assert.ok(Math.abs(Number(result.data.populationStdDev) - Math.sqrt(2)) < 1e-12);
  assert.equal(result.data.largestClientShare, 40);
  assert.equal(result.data.inactiveClients, 1);
  assert.equal(result.response.headers.get("cache-control"), "no-store");
  console.log("OK: análise SQL completa; 5 clientes, 10 projetos, média/mediana 2 e participação 40%.");
  await call("/auth/register", 201, {
    ...account, email: `other-${stamp}@example.com`, cpf: cpf(),
  });
  const other = await call("/auth/login", 200, {
    email: `other-${stamp}@example.com`, password: account.password,
  });
  const isolated = await call("/statistics/portfolio", 200, undefined, other.data.token as string);
  assert.equal(isolated.data.totalClients, 0);
  assert.deepEqual(isolated.data.clients, []);
  console.log("OK: outra conta não acessa os clientes ou indicadores da primeira.");
  console.log("Integração da sprint aprovada. Dados simulados permanecem somente nas contas de teste criadas.");
}
main().catch(() => {
  console.error("Falha na verificação. Confirme os serviços em execução e rode os testes do back-end para o diagnóstico detalhado.");
  process.exitCode = 1;
});
