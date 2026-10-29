import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app.js";
import {
  validCpf,
  type User,
  type BusinessRecord,
  type RecordInput,
  type Resource,
} from "../src/domain/validation.js";
import type { UserRepository, RecordRepository } from "../src/repositories/contracts.js";
import { AppError, NotFoundError } from "../src/errors/app-error.js";
import { Entity, Project } from "../src/domain/entity.js";
import { validateAccount } from "../../frontend/lib/validation.js";

// Test doubles only: production always uses MySQL.
class MemoryUsers implements UserRepository {
  rows: User[] = [];
  async findByEmail(email: string) {
    return this.rows.find((user) => user.email === email) ?? null;
  }
  async findById(id: number) {
    return this.rows.find((user) => user.id === id) ?? null;
  }
  async create(data: Omit<User, "id">) {
    if (this.rows.some((user) => user.cpf === data.cpf || user.email === data.email))
      throw new AppError(409, "Duplicado.");
    const user = { id: this.rows.length + 1, ...data };
    this.rows.push(user);
    return user;
  }
  async update(id: number, data: Pick<User, "name" | "cpf" | "passwordHash">) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundError();
    Object.assign(user, data);
    return user;
  }
}
class MemoryRecords implements RecordRepository {
  rows: (BusinessRecord & { ownerId: number; resource: Resource })[] = [];
  nextId = 1;
  async list(resource: Resource, ownerId: number, page: number, pageSize: number) {
    const rows = this.rows
      .filter((row) => row.resource === resource && row.ownerId === ownerId)
      .reverse();
    return {
      items: rows.slice((page - 1) * pageSize, page * pageSize),
      total: rows.length,
      page,
      pageSize,
    };
  }
  async find(resource: Resource, ownerId: number, id: number) {
    return (
      this.rows.find(
        (row) => row.resource === resource && row.ownerId === ownerId && row.id === id,
      ) ?? null
    );
  }
  async create(resource: Resource, ownerId: number, data: RecordInput) {
    const row = { ...data, id: this.nextId++, ownerId, resource };
    this.rows.push(row);
    return row;
  }
  async update(resource: Resource, ownerId: number, id: number, data: RecordInput) {
    const row = await this.find(resource, ownerId, id);
    if (!row) throw new NotFoundError();
    Object.assign(row, data);
    return row;
  }
  async remove(resource: Resource, ownerId: number, id: number) {
    const row = await this.find(resource, ownerId, id);
    if (!row) throw new NotFoundError();
    if (
      resource === "clientes" &&
      this.rows.some((item) => item.resource === "projetos" && item.clientId === id)
    )
      throw new AppError(409, "Cliente vinculado.");
    this.rows = this.rows.filter((item) => item !== row);
  }
}
const secret = "test-only-secret-do-not-use-in-production-000";
const account = {
  name: "Pessoa Teste",
  email: "teste@example.com",
  cpf: "52998224725",
  password: "Teste1234",
};
function fixture() {
  const users = new MemoryUsers();
  const records = new MemoryRecords();
  const statistics = {
    async clientLoads(ownerId: number) {
      return records.rows.filter((row) => row.resource === "clientes" && row.ownerId === ownerId)
        .map((client) => ({
          clientId: client.id, name: client.name,
          projects: records.rows.filter((row) => row.resource === "projetos" &&
            row.ownerId === ownerId && row.clientId === client.id).length,
        }));
    },
  };
  return { users, records, statistics, app: createApp({ users, records, statistics, jwtSecret: secret }) };
}
async function session(app: ReturnType<typeof createApp>, data = account) {
  await request(app).post("/api/auth/register").send(data).expect(201);
  return (
    await request(app)
      .post("/api/auth/login")
      .send({ email: data.email, password: data.password })
      .expect(200)
  ).body.token as string;
}
test("CPF e validações do front-end rejeitam dados inválidos", () => {
  assert.equal(validCpf("529.982.247-25"), true);
  assert.equal(validCpf("11111111111"), false);
  assert.equal(validCpf("52998224724"), false);
  assert.equal(validateAccount({ ...account, confirm: account.password }, true), null);
  assert.ok(validateAccount({ ...account, confirm: "outra" }, true));
  assert.ok(validateAccount({ ...account, cpf: "00000000000", confirm: account.password }, true));
});
test("entidades protegem estado interno e projeto exige cliente", () => {
  const input = { name: " Teste ", description: "Descrição" };
  const entity = new Entity(input);
  input.name = "Alterado";
  const snapshot = entity.toRecord();
  snapshot.name = "Outro";
  assert.equal(entity.toRecord().name, "Teste");
  Object.assign(entity, { state: { name: "Invasão", description: "Outro valor" } });
  assert.equal(entity.toRecord().name, "Teste");
  assert.throws(() => new Project(input));
});
test("cadastro protege senha, evita duplicados e login emite JWT verificável", async () => {
  const { app, users } = fixture();
  const token = await session(app);
  assert.notEqual(users.rows[0].passwordHash, account.password);
  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
    issuer: "duolcode",
    audience: "duolcode-web",
  });
  assert.equal(typeof payload === "object" ? payload.sub : "", "1");
  const response = await request(app)
    .get("/api/users/me")
    .auth(token, { type: "bearer" })
    .expect(200);
  assert.equal(response.body.passwordHash, undefined);
  await request(app).post("/api/auth/register").send(account).expect(409);
  await request(app)
    .post("/api/auth/login")
    .send({ email: account.email, password: "incorreta" })
    .expect(401);
  await request(app)
    .post("/api/auth/login")
    .send({ email: "ausente@example.com", password: account.password })
    .expect(401);
});
test("cadastro exige campos, CPF, email e senha forte", async () => {
  const { app } = fixture();
  for (const change of [
    { cpf: "11111111111" },
    { email: "invalido" },
    { password: "fraca" },
    { name: "" },
  ])
    await request(app)
      .post("/api/auth/register")
      .send({ ...account, ...change })
      .expect(400);
  await request(app).post("/api/auth/register").send({ email: account.email }).expect(400);
});
test("todas as operações dos quatro recursos exigem autenticação", async () => {
  const { app } = fixture();
  for (const resource of ["clientes", "servicos", "parceiros", "projetos"]) {
    await request(app).get(`/api/${resource}`).expect(401);
    await request(app).get(`/api/${resource}/1`).expect(401);
    await request(app).post(`/api/${resource}`).send({}).expect(401);
    await request(app).put(`/api/${resource}/1`).send({}).expect(401);
    await request(app).delete(`/api/${resource}/1`).expect(401);
  }
});
test("token inválido, expirado e de usuário removido são recusados", async () => {
  const { app, users } = fixture();
  const token = await session(app);
  await request(app).get("/api/users/me").auth("invalido", { type: "bearer" }).expect(401);
  const expired = jwt.sign({}, secret, {
    subject: "1",
    expiresIn: -1,
    issuer: "duolcode",
    audience: "duolcode-web",
  });
  await request(app).get("/api/users/me").auth(expired, { type: "bearer" }).expect(401);
  users.rows = [];
  await request(app).get("/api/users/me").auth(token, { type: "bearer" }).expect(401);
});
test("perfil atualiza somente o próprio usuário e bloqueia email", async () => {
  const { app } = fixture();
  const token = await session(app);
  const auth = { type: "bearer" as const };
  const data = { name: "Nome atualizado", cpf: account.cpf, password: "NovaSenha123" };
  await request(app)
    .put("/api/users/me")
    .auth(token, auth)
    .send({ ...data, email: "outro@example.com" })
    .expect(400);
  await request(app)
    .put("/api/users/me")
    .auth(token, auth)
    .send({ ...data, id: 2 })
    .expect(400);
  await request(app).put("/api/users/me").auth(token, auth).send({ name: "Nome" }).expect(400);
  const response = await request(app).put("/api/users/me").auth(token, auth).send(data).expect(200);
  assert.equal(response.body.email, account.email);
  assert.equal(response.body.name, data.name);
  await request(app)
    .post("/api/auth/login")
    .send({ email: account.email, password: data.password })
    .expect(200);
});
test("CRUD completo dos quatro recursos, paginação e registros inexistentes", async () => {
  const { app } = fixture();
  const token = await session(app);
  const auth = { type: "bearer" as const };
  const client = (
    await request(app)
      .post("/api/clientes")
      .auth(token, auth)
      .send({ name: "Cliente base", description: "Empresa", email: "cliente@example.com" })
      .expect(201)
  ).body;
  const inputs: Record<Resource, RecordInput> = {
    clientes: { name: "Outro cliente", description: "Contato", email: "outro@example.com" },
    servicos: { name: "Site", description: "Site institucional" },
    parceiros: { name: "Parceiro", description: "Design", website: "https://example.com" },
    projetos: { name: "Projeto", description: "Novo site", clientId: client.id },
  };
  for (const resource of Object.keys(inputs) as Resource[]) {
    const input = inputs[resource];
    const created = (
      await request(app).post(`/api/${resource}`).auth(token, auth).send(input).expect(201)
    ).body;
    await request(app).get(`/api/${resource}/${created.id}`).auth(token, auth).expect(200);
    const list = await request(app)
      .get(`/api/${resource}?page=1&pageSize=1`)
      .auth(token, auth)
      .expect(200);
    assert.equal(list.body.items.length, 1);
    assert.ok(list.body.total >= 1);
    const edited = await request(app)
      .put(`/api/${resource}/${created.id}`)
      .auth(token, auth)
      .send({ ...input, name: "Nome editado" })
      .expect(200);
    assert.equal(edited.body.name, "Nome editado");
    await request(app).put(`/api/${resource}/99999`).auth(token, auth).send(input).expect(404);
    await request(app).delete(`/api/${resource}/${created.id}`).auth(token, auth).expect(204);
    await request(app).delete(`/api/${resource}/${created.id}`).auth(token, auth).expect(404);
  }
  await request(app).get("/api/clientes?page=0").auth(token, auth).expect(400);
  await request(app).get("/api/clientes?pageSize=1000").auth(token, auth).expect(400);
});
test("contas não acessam nem alteram registros ou relacionamentos de outra conta", async () => {
  const { app } = fixture();
  const token1 = await session(app);
  const token2 = await session(app, {
    ...account,
    email: "segunda@example.com",
    cpf: "11144477735",
  });
  const auth = { type: "bearer" as const };
  const data = { name: "Cliente privado", description: "Empresa", email: "cliente@example.com" };
  const client = (
    await request(app).post("/api/clientes").auth(token1, auth).send(data).expect(201)
  ).body;
  const list = await request(app).get("/api/clientes").auth(token2, auth).expect(200);
  assert.equal(list.body.total, 0);
  await request(app).get(`/api/clientes/${client.id}`).auth(token2, auth).expect(404);
  await request(app).put(`/api/clientes/${client.id}`).auth(token2, auth).send(data).expect(404);
  await request(app).delete(`/api/clientes/${client.id}`).auth(token2, auth).expect(404);
  await request(app)
    .post("/api/projetos")
    .auth(token2, auth)
    .send({ name: "Projeto", description: "Teste", clientId: client.id })
    .expect(400);
  await request(app)
    .post("/api/clientes")
    .auth(token2, auth)
    .send({ ...data, ownerId: 1 })
    .expect(400);
});
test("projeto exige cliente existente e cliente vinculado não pode ser excluído", async () => {
  const { app } = fixture();
  const token = await session(app);
  const auth = { type: "bearer" as const };
  await request(app)
    .post("/api/projetos")
    .auth(token, auth)
    .send({ name: "Projeto", description: "Teste", clientId: 999 })
    .expect(400);
  const client = (
    await request(app)
      .post("/api/clientes")
      .auth(token, auth)
      .send({ name: "Cliente", description: "Empresa", email: "cliente@example.com" })
      .expect(201)
  ).body;
  await request(app)
    .post("/api/projetos")
    .auth(token, auth)
    .send({ name: "Projeto", description: "Teste", clientId: client.id })
    .expect(201);
  await request(app).delete(`/api/clientes/${client.id}`).auth(token, auth).expect(409);
});
test("falhas inesperadas não expõem detalhes internos", async () => {
  const { users, records, statistics } = fixture();
  const app = createApp({
    users,
    records,
    statistics,
    jwtSecret: secret,
    health: async () => {
      throw new Error("detalhe privado");
    },
  });
  const response = await request(app).get("/api/health").expect(500);
  assert.equal(JSON.stringify(response.body).includes("privado"), false);
});

test("estatísticas exigem sessão, incluem clientes sem projetos e isolam contas", async () => {
  const { app } = fixture();
  await request(app).get("/api/statistics/portfolio").expect(401);
  const token = await session(app);
  const other = await session(app, { ...account, email: "outra@example.com", cpf: "11144477735" });
  const auth = { type: "bearer" as const };
  const createClient = async (name: string) => (await request(app).post("/api/clientes").auth(token, auth)
    .send({ name, description: "Base estatística", email: `${name}@example.com` }).expect(201)).body.id as number;
  const first = await createClient("Primeiro");
  await createClient("Segundo");
  await request(app).post("/api/projetos").auth(token, auth)
    .send({ name: "Site", description: "Projeto de teste", clientId: first }).expect(201);
  const result = await request(app).get("/api/statistics/portfolio").auth(token, auth).expect(200);
  assert.equal(result.headers["cache-control"], "no-store");
  assert.equal(result.body.totalClients, 2);
  assert.equal(result.body.totalProjects, 1);
  assert.equal(result.body.mean, 0.5);
  assert.equal(result.body.median, 0.5);
  assert.equal(result.body.populationStdDev, 0.5);
  assert.equal(result.body.inactiveClients, 1);
  const isolated = await request(app).get("/api/statistics/portfolio").auth(other, auth).expect(200);
  assert.equal(isolated.body.totalClients, 0);
  assert.deepEqual(isolated.body.clients, []);
});
