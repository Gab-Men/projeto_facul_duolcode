import { useId } from "react";
import { formatNumber, type PortfolioReport } from "../../lib/statistics";

export function ClientBars({ report }: { report: PortfolioReport }) {
  const clients = report.clients.slice(0, 10);
  const max = Math.max(1, ...clients.map((client) => client.projects));
  return (
    <figure className="admin-card stats-chart">
      <figcaption>
        <h2>Projetos por cliente</h2>
        <p>Compare o volume de trabalhos. Exibindo os {clients.length} primeiros por quantidade.</p>
      </figcaption>
      <div className="stats-bars" role="img" aria-label={clients.map((client) =>
        `${client.name}: ${client.projects} projetos`).join("; ")}>
        {clients.map((client) => (
          <div className="stats-bar-row" key={client.clientId}>
            <span title={client.name}>{client.name}</span>
            <div className="stats-bar-track"><div style={{ width: `${client.projects / max * 100}%` }} /></div>
            <strong>{client.projects}</strong>
          </div>
        ))}
      </div>
      <p className="stats-axis">Comprimento da barra: número de projetos (origem em zero).</p>
    </figure>
  );
}

export function WorkloadHistogram({ report }: { report: PortfolioReport }) {
  const titleId = useId();
  const descId = useId();
  const max = Math.max(1, ...report.histogram.map((bin) => bin.clients));
  const tickSize = Math.max(1, Math.ceil(max / 4));
  const axisMax = Math.ceil(max / tickSize) * tickSize;
  const step = 480 / report.histogram.length;
  return (
    <figure className="admin-card stats-chart">
      <figcaption>
        <h2>Distribuição da carteira</h2>
        <p>Histograma com intervalos de mesma largura, incluindo clientes sem projetos.</p>
      </figcaption>
      <svg viewBox="0 0 580 300" role="img" aria-labelledby={`${titleId} ${descId}`}>
        <title id={titleId}>Histograma da quantidade de projetos por cliente</title>
        <desc id={descId}>{report.histogram.map((bin) =>
          `De ${bin.from} a ${bin.to} projetos: ${bin.clients} clientes`).join("; ")}</desc>
        {Array.from({ length: axisMax / tickSize + 1 }, (_, tick) => tick * tickSize).map((tick) => {
          const y = 230 - tick / axisMax * 180;
          return <g key={tick}>
            <line x1="60" x2="540" y1={y} y2={y} stroke="#d6dfd4" />
            <text x="50" y={y + 4} textAnchor="end">{tick}</text>
          </g>;
        })}
        {report.histogram.map((bin, index) => {
          const height = bin.clients / axisMax * 180;
          return <g key={bin.from}>
            <rect x={60 + index * step + 1} y={230 - height} width={step - 2} height={height}
              fill="#246449"><title>{bin.clients} clientes</title></rect>
            <text x={60 + index * step + step / 2} y={222 - height} textAnchor="middle">{bin.clients}</text>
            <text x={60 + index * step + step / 2} y="252" textAnchor="middle">
              {bin.from === bin.to ? bin.from : `${bin.from}–${bin.to}`}
            </text>
          </g>;
        })}
        <text x="300" y="285" textAnchor="middle">Quantidade de projetos por cliente</text>
        <text transform="translate(15 135) rotate(-90)" textAnchor="middle">Número de clientes</text>
      </svg>
    </figure>
  );
}

/** Pareto chart: columns = projects per client (descending); line = cumulative share (%). */
export function ParetoChart({ report }: { report: PortfolioReport }) {
  const titleId = useId();
  const descId = useId();
  const points = report.pareto.slice(0, 12);
  if (!points.length) return null;
  const left = 60;
  const right = 800;
  const top = 30;
  const bottom = 230;
  const height = bottom - top;
  const step = (right - left) / points.length;
  const maxProjects = Math.max(1, ...points.map((point) => point.projects));
  const line = points
    .map((point, index) => `${left + index * step + step / 2},${bottom - point.cumulativeShare / 100 * height}`)
    .join(" ");
  const eighty = bottom - 0.8 * height;
  return (
    <figure className="admin-card stats-chart stats-chart-wide">
      <figcaption>
        <h2>Concentração da carteira (Pareto)</h2>
        <p>
          Colunas: projetos por cliente, do maior para o menor. Linha: percentual acumulado dos
          projetos. Quanto mais rápido a linha chega a 80%, mais concentrada é a carteira.
        </p>
      </figcaption>
      <svg viewBox="0 0 860 300" role="img" aria-labelledby={`${titleId} ${descId}`}>
        <title id={titleId}>Gráfico de Pareto dos projetos por cliente</title>
        <desc id={descId}>{points.map((point) =>
          `${point.name}: ${point.projects} projetos, acumulado ${formatNumber(point.cumulativeShare)}%`).join("; ")}</desc>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = bottom - tick / 100 * height;
          return <g key={tick}>
            <line x1={left} x2={right} y1={y} y2={y} stroke="#d6dfd4" />
            <text x={right + 6} y={y + 4}>{tick}%</text>
          </g>;
        })}
        <text x={left - 8} y={top + 4} textAnchor="end">{maxProjects}</text>
        <text x={left - 8} y={bottom + 4} textAnchor="end">0</text>
        {points.map((point, index) => {
          const barHeight = point.projects / maxProjects * height;
          const x = left + index * step;
          return <g key={point.clientId}>
            <rect x={x + 3} y={bottom - barHeight} width={step - 6} height={barHeight} fill="#246449">
              <title>{`${point.name}: ${point.projects} projetos`}</title>
            </rect>
            <text x={x + step / 2} y={bottom + 18} textAnchor="middle">{String(index + 1)}</text>
          </g>;
        })}
        <line x1={left} x2={right} y1={eighty} y2={eighty} stroke="#c58b1a" strokeDasharray="6 4" />
        <text x={right - 6} y={eighty - 6} textAnchor="end">referência 80%</text>
        <polyline points={line} fill="none" stroke="#0f2f22" strokeWidth="2.5" />
        {points.map((point, index) => (
          <circle key={point.clientId} cx={left + index * step + step / 2}
            cy={bottom - point.cumulativeShare / 100 * height} r="4" fill="#0f2f22" />
        ))}
        <text x={(left + right) / 2} y="275" textAnchor="middle">Posição do cliente no ranking de projetos</text>
        <text transform="translate(15 130) rotate(-90)" textAnchor="middle">Projetos</text>
      </svg>
      {report.pareto.length > points.length && (
        <p className="stats-axis">Exibindo os 12 primeiros de {report.pareto.length} clientes; o acumulado considera todos.</p>
      )}
    </figure>
  );
}
