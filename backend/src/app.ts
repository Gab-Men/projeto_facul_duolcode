import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { AuthService } from "./services/auth-service.js";
import { RecordService } from "./services/record-service.js";
import type { RecordRepository, UserRepository, StatisticsRepository } from "./repositories/contracts.js";
import { StatisticsService } from "./services/statistics-service.js";
import { resourceNames, type PublicUser } from "./domain/validation.js";
import { AppError } from "./errors/app-error.js";
export function createApp(deps: {
  users: UserRepository;
  records: RecordRepository;
  statistics: StatisticsRepository;
  jwtSecret: string;
  health?: () => Promise<void>;
}) {
  if (deps.jwtSecret.length < 32)
    throw new Error("JWT_SECRET precisa de pelo menos 32 caracteres.");
  const app = express();
  app.disable("x-powered-by");
  // Exactly one reverse proxy in the Docker network.
  app.set("trust proxy", 1);
  app.use(helmet(), express.json({ limit: "16kb" }));
  const auth = new AuthService(deps.users, deps.jwtSecret);
  const records = new RecordService(deps.records);
  const statistics = new StatisticsService(deps.statistics);
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { message: "Muitas tentativas. Aguarde alguns minutos." },
  });
  app.get("/api/health", async (_req, res) => {
    await deps.health?.();
    res.json({ status: "ok" });
  });
  app.post("/api/auth/register", loginLimiter, async (req, res) => {
    res.status(201).json(await auth.register(req.body));
  });
  app.post("/api/auth/login", loginLimiter, async (req, res) => {
    res.json(await auth.login(req.body));
  });
  app.use("/api", async (req, res, next) => {
    res.locals.user = await auth.authenticate(req.headers.authorization);
    next();
  });
  const current = (locals: Record<string, unknown>) => locals.user as PublicUser;
  app.get("/api/users/me", (_req, res) => {
    res.json(current(res.locals));
  });
  app.get("/api/statistics/portfolio", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await statistics.portfolio(current(res.locals).id));
  });
  app.put("/api/users/me", async (req, res) => {
    res.json(await auth.update(current(res.locals).id, req.body));
  });
  const idSchema = z.coerce.number().int().positive();
  const querySchema = z.object({
    page: z.coerce.number().int().positive().max(100000).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
  });
  for (const resource of resourceNames) {
    const path = `/api/${resource}`;
    app.get(path, async (req, res) => {
      const q = querySchema.parse(req.query);
      res.json(await records.list(resource, current(res.locals).id, q.page, q.pageSize));
    });
    app.get(`${path}/:id`, async (req, res) => {
      res.json(await records.get(resource, current(res.locals).id, idSchema.parse(req.params.id)));
    });
    app.post(path, async (req, res) => {
      res.status(201).json(await records.save(resource, current(res.locals).id, req.body));
    });
    app.put(`${path}/:id`, async (req, res) => {
      res.json(
        await records.save(
          resource,
          current(res.locals).id,
          req.body,
          idSchema.parse(req.params.id),
        ),
      );
    });
    app.delete(`${path}/:id`, async (req, res) => {
      await records.remove(resource, current(res.locals).id, idSchema.parse(req.params.id));
      res.status(204).end();
    });
  }
  app.use((_req, res) => {
    res.status(404).json({ message: "Rota não encontrada." });
  });
  const errors: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0]?.message ?? "Dados inválidos." });
      return;
    }
    if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "E-mail ou CPF já cadastrado." });
      return;
    }
    if (code === "ER_ROW_IS_REFERENCED_2") {
      res
        .status(409)
        .json({
          message:
            "Este cliente tem projetos vinculados. Exclua ou transfira os projetos primeiro.",
        });
      return;
    }
    if (code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ message: "O registro relacionado não existe mais." });
      return;
    }
    if (error instanceof SyntaxError) {
      res.status(400).json({ message: "JSON inválido." });
      return;
    }
    res.status(500).json({ message: "Não foi possível concluir. Tente novamente." });
  };
  app.use(errors);
  return app;
}
