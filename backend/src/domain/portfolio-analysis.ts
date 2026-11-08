import { ValidationError } from "../errors/app-error.js";

export interface ClientLoad {
  clientId: number;
  name: string;
  projects: number;
}
export interface HistogramBin {
  from: number;
  to: number;
  clients: number;
}
export interface ParetoPoint {
  clientId: number;
  name: string;
  projects: number;
  /** Percentage of all projects held by this client and every client before it. */
  cumulativeShare: number;
}
export interface Quartiles {
  q1: number;
  q3: number;
  /** Interquartile range: q3 - q1. */
  iqr: number;
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
  quartiles: Quartiles | null;
  coefficientOfVariation: number | null;
  topFifthShare: number | null;
  pareto: ParetoPoint[];
  clients: ClientLoad[];
  histogram: HistogramBin[];
}

// Complete population: all clients of the account, including those with zero projects.
// Native private state cannot be accessed even from JavaScript outside this class.
export class PortfolioAnalysis {
  readonly #clients: readonly Readonly<ClientLoad>[];

  constructor(clients: readonly ClientLoad[]) {
    const ids = new Set<number>();
    this.#clients = clients.map((client) => {
      const name = client.name.trim();
      if (
        !Number.isSafeInteger(client.clientId) || client.clientId <= 0 ||
        ids.has(client.clientId) || !name ||
        !Number.isSafeInteger(client.projects) || client.projects < 0
      ) throw new ValidationError("Dados da análise inválidos.");
      ids.add(client.clientId);
      return Object.freeze({ clientId: client.clientId, name, projects: client.projects });
    });
    if (!Number.isSafeInteger(this.#clients.reduce((sum, client) => sum + client.projects, 0)))
      throw new ValidationError("Quantidade de projetos fora do limite da análise.");
    Object.freeze(this.#clients);
  }

  // Getters perform business calculations; there are no setters for derived indicators.
  get totalProjects(): number {
    return this.#clients.reduce((sum, client) => sum + client.projects, 0);
  }
  get mean(): number | null {
    return this.#clients.length ? this.totalProjects / this.#clients.length : null;
  }
  get median(): number | null {
    if (!this.#clients.length) return null;
    const values = this.#clients.map((client) => client.projects).sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    const upper = values[middle];
    const lower = values[middle - 1];
    if (upper === undefined) return null;
    return values.length % 2 || lower === undefined ? upper : (lower + upper) / 2;
  }
  get populationStdDev(): number | null {
    const mean = this.mean;
    if (mean === null) return null;
    return Math.sqrt(
      this.#clients.reduce((sum, client) => sum + (client.projects - mean) ** 2, 0) /
      this.#clients.length,
    );
  }
  /** Coefficient of variation (%): standard deviation relative to the mean. */
  get coefficientOfVariation(): number | null {
    const mean = this.mean;
    const deviation = this.populationStdDev;
    return mean && deviation !== null ? deviation / mean * 100 : null;
  }
  /** Q1 and Q3 by linear interpolation (same method as Excel QUARTIL.INC / Sheets QUARTILE). */
  get quartiles(): Quartiles | null {
    if (!this.#clients.length) return null;
    const values = this.#clients.map((client) => client.projects).sort((a, b) => a - b);
    const quantile = (p: number): number => {
      const position = (values.length - 1) * p;
      const lower = Math.floor(position);
      const below = values[lower] ?? 0;
      const above = values[Math.min(lower + 1, values.length - 1)] ?? below;
      return below + (position - lower) * (above - below);
    };
    const q1 = quantile(0.25);
    const q3 = quantile(0.75);
    return { q1, q3, iqr: q3 - q1 };
  }
  /** Share (%) of projects held by the top 20% clients (at least one client). */
  get topFifthShare(): number | null {
    const total = this.totalProjects;
    if (!total) return null;
    const top = this.#sortedByProjects().slice(0, Math.ceil(this.#clients.length * 0.2));
    return top.reduce((sum, client) => sum + client.projects, 0) / total * 100;
  }
  #sortedByProjects(): ClientLoad[] {
    return this.#clients.map((client) => ({ ...client })).sort(
      (a, b) => b.projects - a.projects || a.clientId - b.clientId,
    );
  }
  private pareto(): ParetoPoint[] {
    const total = this.totalProjects;
    if (!total) return [];
    let accumulated = 0;
    return this.#sortedByProjects().map((client) => {
      accumulated += client.projects;
      return { ...client, cumulativeShare: accumulated / total * 100 };
    });
  }
  private histogram(): HistogramBin[] {
    if (!this.#clients.length) return [];
    const maximum = this.#clients.reduce((max, client) => Math.max(max, client.projects), 0);
    // At most six bins, all with equal width; zero-project clients remain visible.
    const width = Math.max(1, Math.ceil((maximum + 1) / 6));
    const bins = Array.from({ length: Math.floor(maximum / width) + 1 }, (_, index) => ({
      from: index * width, to: (index + 1) * width - 1, clients: 0,
    }));
    for (const client of this.#clients) {
      const bin = bins[Math.floor(client.projects / width)];
      if (!bin) throw new Error("Intervalo da análise estatística não encontrado.");
      bin.clients++;
    }
    return bins;
  }
  toReport(): PortfolioReport {
    const totalProjects = this.totalProjects;
    const clients = this.#sortedByProjects();
    const activeClients = clients.filter((client) => client.projects > 0).length;
    const largest = clients[0];
    return {
      generatedAt: new Date().toISOString(),
      totalClients: clients.length,
      totalProjects,
      activeClients,
      inactiveClients: clients.length - activeClients,
      mean: this.mean,
      median: this.median,
      populationStdDev: this.populationStdDev,
      largestClientShare: totalProjects && largest ? largest.projects / totalProjects * 100 : null,
      quartiles: this.quartiles,
      coefficientOfVariation: this.coefficientOfVariation,
      topFifthShare: this.topFifthShare,
      pareto: this.pareto(),
      clients,
      histogram: this.histogram(),
    };
  }
}
