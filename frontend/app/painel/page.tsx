import Link from "next/link";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  FolderKanban,
  Handshake,
  Layers,
  Users,
  type LucideIcon,
} from "lucide-react";
import { resources, type Resource } from "../../lib/resources";

const resourceIcons: Record<Resource, LucideIcon> = {
  clientes: Users,
  servicos: Layers,
  parceiros: Handshake,
  projetos: FolderKanban,
};

const cards = [
  ...(Object.keys(resourceIcons) as Resource[]).map((slug) => ({
    slug,
    title: resources[slug].title,
    text: resources[slug].summary,
    icon: resourceIcons[slug],
  })),
  {
    slug: "estatisticas",
    title: "Estatísticas",
    text: "Gráficos e indicadores da distribuição de projetos por cliente.",
    icon: ChartNoAxesCombined,
  },
];

export default function Dashboard() {
  return (
    <>
      <DashboardHero />
      <div className="admin-section-heading">
        <h2>Tudo no seu lugar</h2>
        <span>Escolha por onde começar</span>
      </div>
      <div className="admin-grid">
        {cards.map((card) => (
          <ShortcutCard key={card.slug} {...card} />
        ))}
      </div>
    </>
  );
}

function DashboardHero() {
  return (
    <section className="dashboard-hero">
      <p className="admin-eyebrow">SEU ESPAÇO DE TRABALHO</p>
      <h1>Seu trabalho, organizado.</h1>
      <p>Comece cadastrando um cliente. Depois, registre um projeto vinculado a ele.</p>
      <div className="dashboard-hero-actions">
        <Link className="admin-button" href="/painel/clientes/novo">
          + Cadastrar cliente
        </Link>
        <Link href="/painel/estatisticas">Explorar estatísticas →</Link>
      </div>
    </section>
  );
}

function ShortcutCard({
  slug,
  title,
  text,
  icon: Icon,
}: {
  slug: string;
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <Link className="admin-card" href={`/painel/${slug}`}>
      <div className="dashboard-card-top">
        <span className="dashboard-icon">
          <Icon size={23} aria-hidden="true" />
        </span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <span>Abrir →</span>
    </Link>
  );
}
