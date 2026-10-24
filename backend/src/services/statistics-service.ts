import { PortfolioAnalysis } from "../domain/portfolio-analysis.js";
import type { StatisticsRepository } from "../repositories/contracts.js";

export class StatisticsService {
  constructor(private readonly statistics: StatisticsRepository) {}

  async portfolio(ownerId: number) {
    return new PortfolioAnalysis(await this.statistics.clientLoads(ownerId)).toReport();
  }
}
