import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LayoutTemplate, MonitorCog, Workflow } from "lucide-react";
import { Footer, Header } from "../../components/site-shell";

const offers = [
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

export default function Services() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero green">
          <div className="wrap">
            <Link className="back-link" href="/">
              <ArrowLeft size={17} />
              Voltar ao início
            </Link>
            <p className="kicker light">SERVIÇOS DUOLCODE</p>
            <h1>
              Da ideia ao digital.
              <br />
              <em>Do seu jeito.</em>
            </h1>
            <p>Sites e sistemas criados para o momento, a rotina e os objetivos da sua empresa.</p>
          </div>
        </section>
        <section className="services-page wrap">
          {offers.map(({ id, icon: Icon, number, title, intro, items }) => (
            <article id={id} className="offer" key={id}>
              <div className="offer-title">
                <span>{number}</span>
                <Icon size={32} />
                <h2>{title}</h2>
              </div>
              <div className="offer-body">
                <p>{intro}</p>
                <ul>
                  {items.map((item) => (
                    <li key={item}>
                      <Check size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
        <section className="delivery">
          <div className="wrap delivery-grid">
            <div>
              <p className="kicker">EM TODO PROJETO</p>
              <h2>
                Uma entrega completa, <em>sem complicação.</em>
              </h2>
            </div>
            <div className="delivery-list">
              <p>
                <span>01</span>Diagnóstico e direcionamento
              </p>
              <p>
                <span>02</span>Design pensado para sua marca
              </p>
              <p>
                <span>03</span>Desenvolvimento responsivo
              </p>
              <p>
                <span>04</span>Revisão e publicação
              </p>
            </div>
          </div>
        </section>
        <section className="page-cta wrap">
          <p className="kicker">SEU PROJETO COMEÇA AQUI</p>
          <h2>
            Qual dessas soluções
            <br />
            <em>leva sua empresa adiante?</em>
          </h2>
          <Link href="/contato" className="text-link">
            Começar uma conversa <ArrowRight size={19} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
