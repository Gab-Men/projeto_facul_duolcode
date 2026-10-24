"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage } from "../../lib/api";
import { formatNumber, type PortfolioReport } from "../../lib/statistics";
import { ClientBars, WorkloadHistogram } from "./portfolio-charts";
import { Feedback } from "./field";

function Metrics({ report }: { report: PortfolioReport }) {
  const metrics = [
    ["Clientes", report.totalClients, "Todos os clientes cadastrados"],
    ["Projetos", report.totalProjects, "Trabalhos vinculados aos clientes"],
    ["Média por cliente", report.mean, "Total de projetos ÷ total de clientes"],
    ["Mediana", report.median, "Valor central da distribuição ordenada"],
    ["Desvio padrão", report.populationStdDev, "Dispersão da população de clientes"],
    ["Maior participação", report.largestClientShare, "Parcela dos projetos do maior cliente"],
  ] as const;
  return <div className="stats-metrics">
    {metrics.map(([label, value, explanation]) => <article className="admin-card stats-metric" key={label}>
      <h2>{label}</h2>
      <strong>{formatNumber(value)}{label === "Maior participação" && value !== null ? "%" : ""}</strong>
      <small>{explanation}</small>
    </article>)}
  </div>;
}

function Findings({ report }: { report: PortfolioReport }) {
  return <section className="admin-card stats-findings" aria-labelledby="findings-title">
    <h2 id="findings-title">O que os dados mostram</h2>
    <p>Clientes com projetos: {report.activeClients} de {report.totalClients}.
      {" "}Clientes sem projetos: {report.inactiveClients}. Esse grupo pode orientar o acompanhamento comercial.</p>
    {report.totalProjects > 0 ? <>
      <p>O cliente com mais projetos reúne {formatNumber(report.largestClientShare)}% dos trabalhos.
        Uma parcela elevada indica concentração em volume e merece atenção na distribuição da carteira.</p>
      <p>A média é {formatNumber(report.mean)} e a mediana é {formatNumber(report.median)} projetos por cliente.
        O desvio padrão de {formatNumber(report.populationStdDev)} mostra quanto as quantidades se
        afastam da média.</p>
    </> : <p>Ainda não há projetos. Cadastre trabalhos vinculados aos clientes para analisar o volume.</p>}
    <p><strong>Limite da análise:</strong> quantidade de projetos não representa faturamento,
      horas trabalhadas ou satisfação. Os dados mostram a carteira atual; não permitem concluir
      tendências no tempo ou relações de causa e efeito.</p>
  </section>;
}

function DataTable({ report }: { report: PortfolioReport }) {
  return <div className="admin-table-wrap">
    <table>
      <caption>Base completa da análise: {report.totalClients} clientes desta conta</caption>
      <thead><tr><th scope="col">Cliente</th><th scope="col">Projetos</th><th scope="col">Participação nos projetos</th></tr></thead>
      <tbody>{report.clients.map((client) => <tr key={client.clientId}>
        <th scope="row">{client.name}</th><td>{client.projects}</td>
        <td>{report.totalProjects ? `${formatNumber(client.projects / report.totalProjects * 100)}%` : "Sem projetos"}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

export function StatisticsPanel() {
  const [report, setReport] = useState<PortfolioReport | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setMessage("");
    void api<PortfolioReport>("/statistics/portfolio", { signal: controller.signal, cache: "no-store" })
      .then((value) => { if (!controller.signal.aborted) setReport(value); })
      .catch((error: unknown) => { if (!controller.signal.aborted) { setReport(null); setMessage(errorMessage(error)); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  return <>
    <p className="admin-eyebrow">PROBABILIDADE E ESTATÍSTICA · ANÁLISE DESCRITIVA</p>
    <div className="admin-title"><h1>Estatísticas da carteira</h1>
      <button className="admin-secondary" disabled={loading} onClick={() => setRevision((value) => value + 1)}>
        {loading ? "Atualizando…" : "Atualizar análise"}
      </button>
    </div>
    <p>Entenda como os projetos se distribuem entre seus clientes para acompanhar concentração
      e oportunidades de novos trabalhos.</p>
    <Feedback message={message} />
    {loading ? <p role="status">Consultando os dados da sua conta…</p> : report && <>
      <p className="stats-source">Fonte: clientes e projetos cadastrados nesta conta.
        {" "}Consulta em {new Date(report.generatedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} (Brasília).
        {" "}Os indicadores usam todos os clientes, incluindo os que têm zero projetos.</p>
      <Metrics report={report} />
      {report.totalClients === 0 ? <section className="admin-card stats-findings">
        <h2>Sua análise começa com os cadastros</h2>
        <p>Cadastre clientes e vincule projetos a eles. Os gráficos serão calculados com esses dados,
          sem preencher valores fictícios automaticamente.</p>
        <Link className="admin-button" href="/painel/clientes/novo">Cadastrar primeiro cliente</Link>
      </section> : <>
        <div className="stats-charts"><ClientBars report={report} /><WorkloadHistogram report={report} /></div>
        <Findings report={report} />
        <DataTable report={report} />
      </>}
      <details className="admin-card stats-method">
        <summary>Como os indicadores são calculados</summary>
        <p>Unidade de análise: um cliente. Variável quantitativa discreta: quantidade de projetos.
          A população é a carteira completa desta conta no momento da consulta.</p>
        <p>Média = soma das quantidades ÷ número de clientes. Mediana = valor central das quantidades
          ordenadas; para número par de clientes, média dos dois valores centrais.</p>
        <p>Desvio padrão populacional = raiz quadrada da média dos quadrados dos desvios em relação
          à média. Maior participação = projetos do maior cliente ÷ total de projetos × 100.</p>
        <p>Sem clientes, média, mediana e desvio padrão ficam sem dados. Sem projetos, a participação
          não é calculada. O histograma tem até seis intervalos de largura igual, iniciando em zero.</p>
        <p>Barras comparam categorias; o histograma mostra a distribuição da variável numérica.
          Séries temporais, dispersão e regressão exigiriam datas ou outras variáveis que esta etapa
          ainda não coleta.</p>
      </details>
    </>}
  </>;
}
