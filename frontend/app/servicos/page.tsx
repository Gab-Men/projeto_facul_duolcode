import Link from "next/link";
import { ArrowRight, LayoutTemplate, MonitorCog, Workflow, type LucideIcon } from "lucide-react";
import { SitePage } from "../../components/site/site-page";
import { PageHero } from "../../components/site/page-hero";
import { SectionHeading } from "../../components/site/section-heading";
import { CheckList } from "../../components/site/check-list";

interface Offer {
  id: string;
  icon: LucideIcon;
  number: string;
  title: string;
  intro: string;
  items: string[];
}

const offers: Offer[] = [
  {
    id: "sites",
    icon: LayoutTemplate,
    number: "01",
    title: "Sites institucionais",
    intro: "Uma presença digital que apresenta sua empresa com clareza e transmite confiança.",
    items: [
      "Estratégia e arquitetura de conteúdo",
      "Design exclusivo e responsivo",
      "Desenvolvimento e publicação",
      "Otimização básica para mecanismos de busca",
    ],
  },
  {
    id: "landing-pages",
    icon: MonitorCog,
    number: "02",
    title: "Landing pages",
    intro:
      "Páginas focadas em uma oferta, campanha ou lançamento, guiando o visitante para a ação principal.",
    items: [
      "Página orientada à conversão",
      "Hierarquia visual e chamadas claras",
      "Adaptação para celular",
      "Integração com os canais definidos no projeto",
    ],
  },
  {
    id: "sistemas",
    icon: Workflow,
    number: "03",
    title: "Sistemas web",
    intro:
      "Ferramentas que organizam tarefas, informações e processos importantes para a sua operação.",
    items: [
      "Mapeamento do fluxo de trabalho",
      "Painéis e áreas administrativas",
      "Automação de processos",
      "Evolução planejada da solução",
    ],
  },
];

const deliverySteps = [
  "Diagnóstico e direcionamento",
  "Design pensado para sua marca",
  "Desenvolvimento responsivo",
  "Revisão e publicação",
];

export default function Services() {
  return (
    <SitePage>
      <PageHero
        variant="green"
        kicker="SERVIÇOS DUOLCODE"
        title={<>Da ideia ao digital.<br /><em>Do seu jeito.</em></>}
        lead="Sites e sistemas criados para o momento, a rotina e os objetivos da sua empresa."
      />
      <section className="services-page wrap">
        {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
      </section>
      <DeliverySection />
      <section className="page-cta wrap">
        <SectionHeading
          kicker="SEU PROJETO COMEÇA AQUI"
          title={<>Qual dessas soluções<br /><em>leva sua empresa adiante?</em></>}
        />
        <Link href="/contato" className="text-link">
          Começar uma conversa <ArrowRight size={19} />
        </Link>
      </section>
    </SitePage>
  );
}

function OfferCard({ offer: { id, icon: Icon, number, title, intro, items } }: { offer: Offer }) {
  return (
    <article id={id} className="offer">
      <div className="offer-title">
        <span>{number}</span>
        <Icon size={32} />
        <h2>{title}</h2>
      </div>
      <div className="offer-body">
        <p>{intro}</p>
        <CheckList items={items} iconSize={17} />
      </div>
    </article>
  );
}

function DeliverySection() {
  return (
    <section className="delivery">
      <div className="wrap delivery-grid">
        <div>
          <SectionHeading kicker="EM TODO PROJETO" title={<>Uma entrega completa, <em>sem complicação.</em></>} />
        </div>
        <div className="delivery-list">
          {deliverySteps.map((step, index) => (
            <p key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
