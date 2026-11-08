// Checks every back-end rubric item against the REAL API + MySQL (Docker or local).
// Usage: npm run verify:rubrica [-- http://localhost:8080]
// Creates isolated, labeled test accounts. Never reads .env; never prints passwords, CPFs or tokens.
import assert from "node:assert/strict";
import { randomBytes, randomInt } from "node:crypto";

const baseUrl = (process.argv[2] ?? "http://localhost:8080").replace(/\/$/, "");
type Json = Record<string, unknown>;
interface Page { items: Json[]; total: number; page: number; pageSize: number }

function cpf(): string {
  const digits = Array.from({ length: 9 }, () => randomInt(10));
  for (let length = 9; length <= 10; length++) {
    const sum = digits.reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    digits.push(((sum * 10) % 11) % 10);
  }
  return digits.join("");
}

async function call<T = Json>(method: string, path: string, expected: number, body?: unknown, token?: string): Promise<T> {
  const response = await fetch(`${baseUrl}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  assert.equal(response.status, expected, `${method} ${path}: status ${response.status}, esperado ${expected}`);
  return (response.status === 204 ? undefined : await response.json()) as T;
}

let passed = 0;
async function check(label: string, run: () => Promise<void>): Promise<void> {
  await run();
  passed++;
  console.log(`OK  ${label}`);
}

function newAccount() {
  const stamp = randomBytes(6).toString("hex");
  return {
    name: "Verificação rubrica",
    email: `rubrica-${stamp}@example.com`,
    password: `Rubrica${randomBytes(8).toString("hex")}7`,
    cpf: cpf(),
  };
}

async function login(account: { email: string; password: string }): Promise<string> {
  const session = await call<{ token: string }>("POST", "/auth/login", 200, { email: account.email, password: account.password });
  return session.token;
}

async function main(): Promise<void> {
  await call("GET", "/health", 200);
  const account = newAccount();
  let token = "";

  // ---- Cadastro ----
  await check("Cadastro: exige nome, e-mail, senha e CPF", async () => {
    for (const field of ["name", "email", "password", "cpf"] as const) {
      const incomplete: Record<string, string> = { ...account };
      delete incomplete[field];
      await call("POST", "/auth/register", 400, incomplete);
    }
  });
  await check("Cadastro: valida CPF, nível de senha e e-mail", async () => {
    await call("POST", "/auth/register", 400, { ...account, cpf: "123.456.789-00" });
    await call("POST", "/auth/register", 400, { ...account, password: "semnumero" });
    await call("POST", "/auth/register", 400, { ...account, email: "sem-arroba.com" });
  });
  await check("Cadastro: cria conta e recusa e-mail duplicado (409)", async () => {
    const created = await call("POST", "/auth/register", 201, account);
    assert.equal("passwordHash" in created, false);
    await call("POST", "/auth/register", 409, { ...account, cpf: cpf() });
  });

  // ---- Autenticação ----
  await check("Login: valida e-mail por regex e só aceita usuário existente", async () => {
    await call("POST", "/auth/login", 400, { email: "invalido", password: "x" });
    await call("POST", "/auth/login", 401, { email: `nao-existe-${randomBytes(4).toString("hex")}@example.com`, password: account.password });
    await call("POST", "/auth/login", 401, { email: account.email, password: "SenhaErrada123" });
  });
  await check("Login: retorna JWT (header.payload.assinatura)", async () => {
    token = await login(account);
    assert.equal(token.split(".").length, 3);
  });

  // ---- Edição de usuário ----
  await check("Edição: rota autenticada (sem token → 401)", async () => {
    await call("GET", "/users/me", 401);
    await call("PUT", "/users/me", 401, { name: "X", cpf: account.cpf, password: account.password });
  });
  await check("Edição: todos os campos obrigatórios, CPF e senha validados", async () => {
    await call("PUT", "/users/me", 400, { name: "Novo nome", cpf: account.cpf }, token);
    await call("PUT", "/users/me", 400, { name: "Novo nome", cpf: "11111111111", password: account.password }, token);
    await call("PUT", "/users/me", 400, { name: "Novo nome", cpf: account.cpf, password: "fraca" }, token);
  });
  await check("Edição: não permite alterar o e-mail", async () => {
    await call("PUT", "/users/me", 400, { name: "Novo nome", cpf: account.cpf, password: account.password, email: "outro@example.com" }, token);
  });
  await check("Edição: edita somente o próprio usuário e a nova senha passa a valer", async () => {
    const newPassword = `Nova${randomBytes(6).toString("hex")}9A`;
    const updated = await call("PUT", "/users/me", 200, { name: "Nome editado", cpf: account.cpf, password: newPassword }, token);
    assert.equal(updated["name"], "Nome editado");
    assert.equal(updated["email"], account.email);
    account.password = newPassword;
    token = await login(account);
  });

  // ---- CRUDs ----
  const samples = {
    clientes: { name: "Cliente teste", description: "Empresa de teste", email: "cliente@example.com" },
    servicos: { name: "Serviço teste", description: "Site institucional" },
    parceiros: { name: "Parceiro teste", description: "Agência parceira", website: "https://parceiro.example.com" },
  } as const;
  const ids: Record<string, number> = {};

  await check("CRUDs: as 4 rotas exigem autenticação", async () => {
    for (const resource of ["clientes", "servicos", "parceiros", "projetos"]) await call("GET", `/${resource}`, 401);
  });
  await check("CRUDs: criar, ler, editar (clientes, serviços, parceiros)", async () => {
    for (const [resource, data] of Object.entries(samples)) {
      const created = await call<Json & { id: number }>("POST", `/${resource}`, 201, data, token);
      ids[resource] = created.id;
      await call("GET", `/${resource}/${created.id}`, 200, undefined, token);
      const edited = await call("PUT", `/${resource}/${created.id}`, 200, { ...data, name: `${data.name} editado` }, token);
      assert.equal(edited["name"], `${data.name} editado`);
    }
  });
  await check("CRUDs: valida campos obrigatórios (400)", async () => {
    await call("POST", "/clientes", 400, { name: "Sem e-mail", description: "Teste" }, token);
    await call("POST", "/parceiros", 400, { name: "Sem site", description: "Teste" }, token);
    await call("POST", "/projetos", 400, { name: "Sem cliente", description: "Teste" }, token);
  });
  await check("Relacionamento: projeto pertence a um cliente existente da conta", async () => {
    await call("POST", "/projetos", 400, { name: "Projeto", description: "Inexistente", clientId: 999999999 }, token);
    const project = await call<Json & { id: number }>("POST", "/projetos", 201, { name: "Projeto teste", description: "Site", clientId: ids["clientes"] }, token);
    ids["projetos"] = project.id;
    await call("PUT", `/projetos/${project.id}`, 200, { name: "Projeto editado", description: "Site", clientId: ids["clientes"] }, token);
  });
  await check("Relacionamento: cliente com projetos não pode ser excluído (409)", async () => {
    await call("DELETE", `/clientes/${ids["clientes"]}`, 409, undefined, token);
  });
  await check("Paginação: page, pageSize e total nas listagens", async () => {
    for (let index = 0; index < 3; index++) await call("POST", "/servicos", 201, { name: `Serviço ${index}`, description: "Paginação" }, token);
    const first = await call<Page>("GET", "/servicos?page=1&pageSize=2", 200, undefined, token);
    const second = await call<Page>("GET", "/servicos?page=2&pageSize=2", 200, undefined, token);
    assert.equal(first.items.length, 2);
    assert.equal(first.total, 4);
    assert.equal(second.page, 2);
    assert.notDeepEqual(first.items.map((item) => item["id"]), second.items.map((item) => item["id"]));
    await call("GET", "/servicos?page=0", 400, undefined, token);
  });
  await check("Inexistentes: editar/excluir registro que não existe → 404", async () => {
    for (const resource of ["clientes", "servicos", "parceiros", "projetos"]) {
      await call("PUT", `/${resource}/999999999`, 404,
        resource === "projetos" ? { name: "X1", description: "X1", clientId: ids["clientes"] } : { ...samples[resource as keyof typeof samples] }, token);
      await call("DELETE", `/${resource}/999999999`, 404, undefined, token);
    }
  });
  await check("Isolamento: outra conta não vê, edita nem exclui os registros", async () => {
    const other = newAccount();
    await call("POST", "/auth/register", 201, other);
    const otherToken = await login(other);
    const list = await call<Page>("GET", "/clientes", 200, undefined, otherToken);
    assert.equal(list.total, 0);
    await call("GET", `/clientes/${ids["clientes"]}`, 404, undefined, otherToken);
    await call("DELETE", `/servicos/${ids["servicos"]}`, 404, undefined, otherToken);
    await call("POST", "/projetos", 400, { name: "Invasão", description: "Cliente alheio", clientId: ids["clientes"] }, otherToken);
  });
  await check("CRUDs: excluir (projeto, depois cliente, serviço e parceiro)", async () => {
    await call("DELETE", `/projetos/${ids["projetos"]}`, 204, undefined, token);
    for (const resource of ["clientes", "servicos", "parceiros"]) {
      await call("DELETE", `/${resource}/${ids[resource]}`, 204, undefined, token);
      await call("GET", `/${resource}/${ids[resource]}`, 404, undefined, token);
    }
  });
  await check("Estatística: relatório com quartis, CV, top 20% e Pareto", async () => {
    const report = await call("GET", "/statistics/portfolio", 200, undefined, token);
    for (const key of ["mean", "median", "populationStdDev", "quartiles", "coefficientOfVariation", "topFifthShare", "pareto", "histogram"])
      assert.ok(key in report, `campo ${key} ausente`);
  });

  console.log(`\n${passed} verificações aprovadas contra a API e o banco reais (${baseUrl}).`);
}

main().catch((error: unknown) => {
  console.error(`FALHA: ${error instanceof Error ? error.message : "erro inesperado"}`);
  process.exit(1);
});
