import express, { type Express } from "express";
import helmet from "helmet";
import { AuthService } from "./services/auth-service.js";
import { RecordService } from "./services/record-service.js";
import { StatisticsService } from "./services/statistics-service.js";
import type { RecordRepository, UserRepository, StatisticsRepository } from "./repositories/contracts.js";
import { authRoutes, requireAuthentication } from "./http/auth-routes.js";
import { userRoutes } from "./http/user-routes.js";
import { recordRoutes } from "./http/record-routes.js";
import { statisticsRoutes } from "./http/statistics-routes.js";
import { errorHandler } from "./http/error-handler.js";
import type { ApiHandler } from "./http/types.js";

export interface AppDependencies {
  users: UserRepository;
  records: RecordRepository;
  statistics: StatisticsRepository;
  jwtSecret: string;
  health?: () => Promise<void>;
}

export function createApp(deps: AppDependencies): Express {
  if (deps.jwtSecret.length < 32)
    throw new Error("JWT_SECRET precisa de pelo menos 32 caracteres.");
  const app = express();
  app.disable("x-powered-by");
  // Exactly one reverse proxy in the Docker network.
  app.set("trust proxy", 1);
  app.use(helmet(), express.json({ limit: "16kb" }));
  const auth = new AuthService(deps.users, deps.jwtSecret);
  const health: ApiHandler<{ status: "ok" }> = async (_req, res) => {
    await deps.health?.();
    res.json({ status: "ok" });
  };
  app.get("/api/health", health);
  app.use("/api/auth", authRoutes(auth));
  app.use("/api", requireAuthentication(auth));
  app.use("/api/users", userRoutes(auth));
  app.use("/api/statistics", statisticsRoutes(new StatisticsService(deps.statistics)));
  app.use("/api", recordRoutes(new RecordService(deps.records)));
  app.use((_req, res) => { res.status(404).json({ message: "Rota não encontrada." }); });
  app.use(errorHandler);
  return app;
}
