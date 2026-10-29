import Link from "next/link";
import { Users, Layers, Handshake, FolderKanban, ChartNoAxesCombined, ArrowUpRight } from "lucide-react";
const icons = [Users, Layers, Handshake, FolderKanban, ChartNoAxesCombined];
export default function Dashboard() {
  return (
    <>
      <section className="dashboard-hero"><p className="admin-eyebrow">SEU ESPAÇO DE TRABALHO</p>
      <h1>Seu trabalho, organizado.</h1>
      <p>Comece cadastrando um cliente. Depois, registre um projeto vinculado a ele.</p>
      <div className="dashboard-hero-actions"><Link className="admin-button" href="/painel/clientes/novo">+ Cadastrar cliente</Link><Link href="/painel/estatisticas">Explorar estatísticas →</Link></div></section>
      <div className="admin-section-heading"><h2>Tudo no seu lugar</h2><span>Escolha por onde começar</span></div>
      <div className="admin-grid">
        {[
          ["clientes", "Clientes", "Empresas e pessoas que você atende."],
          ["servicos", "Serviços", "Soluções que sua empresa oferece."],
          ["parceiros", "Parceiros", "Contatos que colaboram com seu trabalho."],
          ["projetos", "Projetos", "Trabalhos vinculados aos seus clientes."],
          ["estatisticas", "Estatísticas", "Gráficos e indicadores da distribuição de projetos por cliente."],
        ].map(([slug, name, text], index) => { const Icon = icons[index]; return (
          <Link className="admin-card" href={`/painel/${slug}`} key={slug}>
            <div className="dashboard-card-top"><span className="dashboard-icon"><Icon size={23} aria-hidden="true" /></span><ArrowUpRight size={20} aria-hidden="true" /></div><h2>{name}</h2>
            <p>{text}</p>
            <span>Abrir →</span>
          </Link>
        ); })}
      </div>
    </>
  );
}
