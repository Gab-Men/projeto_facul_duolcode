export interface ClientLoad {
  clientId: number;
  name: string;
  projects: number;
}
export interface ParetoPoint extends ClientLoad {
  cumulativeShare: number;
}
export interface PortfolioReport {
  generatedAt: string;
  totalClients: number;
  totalProjects: number;
  activeClients: number;
  inactiveClients: number;
  mean: number | null;
  median: number | null;
  populationStdDev: number | null;
  largestClientShare: number | null;
  quartiles: { q1: number; q3: number; iqr: number } | null;
  coefficientOfVariation: number | null;
  topFifthShare: number | null;
  pareto: ParetoPoint[];
  clients: ClientLoad[];
  histogram: { from: number; to: number; clients: number }[];
}
export const formatNumber = (value: number | null) =>
  value === null ? "Sem dados" : new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
