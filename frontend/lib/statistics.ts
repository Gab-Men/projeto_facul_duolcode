export interface ClientLoad {
  clientId: number;
  name: string;
  projects: number;
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
  clients: ClientLoad[];
  histogram: { from: number; to: number; clients: number }[];
}
export const formatNumber = (value: number | null) =>
  value === null ? "Sem dados" : new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
