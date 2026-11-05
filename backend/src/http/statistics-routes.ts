import { Router } from "express";
import type { PortfolioReport } from "../domain/portfolio-analysis.js";
import type { StatisticsService } from "../services/statistics-service.js";
import { currentUser, type ApiHandler } from "./types.js";

export function statisticsRoutes(statistics: StatisticsService): Router {
  const router = Router();
  const portfolio: ApiHandler<PortfolioReport> = async (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await statistics.portfolio(currentUser(res).id));
  };
  router.get("/portfolio", portfolio);
  return router;
}
