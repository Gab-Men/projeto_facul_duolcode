import { PortfolioAnalysis, type PortfolioReport } from "../domain/portfolio-analysis.js";
import type { StatisticsRepository } from "../repositories/contracts.js";

export class StatisticsService {
  constructor(private readonly statistics: StatisticsRepository) {}

  async portfolio(ownerId: number): Promise<PortfolioReport> {
    return new PortfolioAnalysis(await this.statistics.clientLoads(ownerId)).toReport();
  }
}
