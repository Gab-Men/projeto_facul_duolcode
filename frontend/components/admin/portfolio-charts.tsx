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
