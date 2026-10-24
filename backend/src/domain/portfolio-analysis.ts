import { AppError } from "../errors/app-error.js";

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
      ) throw new AppError(400, "Dados da análise inválidos.");
      ids.add(client.clientId);
      return Object.freeze({ clientId: client.clientId, name, projects: client.projects });
    });
    if (!Number.isSafeInteger(this.#clients.reduce((sum, client) => sum + client.projects, 0)))
      throw new AppError(400, "Quantidade de projetos fora do limite da análise.");
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
    return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  }
  get populationStdDev(): number | null {
    const mean = this.mean;
    if (mean === null) return null;
    return Math.sqrt(
      this.#clients.reduce((sum, client) => sum + (client.projects - mean) ** 2, 0) /
      this.#clients.length,
    );
  }
  private histogram(): HistogramBin[] {
    if (!this.#clients.length) return [];
    const maximum = this.#clients.reduce((max, client) => Math.max(max, client.projects), 0);
    // At most six bins, all with equal width; zero-project clients remain visible.
    const width = Math.max(1, Math.ceil((maximum + 1) / 6));
    const bins = Array.from({ length: Math.floor(maximum / width) + 1 }, (_, index) => ({
      from: index * width, to: (index + 1) * width - 1, clients: 0,
    }));
    for (const client of this.#clients) bins[Math.floor(client.projects / width)].clients++;
    return bins;
  }
  toReport(): PortfolioReport {
    const totalProjects = this.totalProjects;
    const clients = this.#clients.map((client) => ({ ...client })).sort(
      (a, b) => b.projects - a.projects || a.clientId - b.clientId,
    );
    const activeClients = clients.filter((client) => client.projects > 0).length;
    return {
      generatedAt: new Date().toISOString(),
      totalClients: clients.length,
      totalProjects,
      activeClients,
      inactiveClients: clients.length - activeClients,
      mean: this.mean,
      median: this.median,
      populationStdDev: this.populationStdDev,
      largestClientShare: totalProjects ? clients[0].projects / totalProjects * 100 : null,
      clients,
      histogram: this.histogram(),
    };
  }
}
