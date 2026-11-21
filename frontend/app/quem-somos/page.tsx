import Link from "next/link";
import { ArrowUpRight, Check, Code2, HeartHandshake, Lightbulb } from "lucide-react";
import { Footer, Header } from "../../components/site-shell";
import { PageHero } from "../../components/site/page-hero";

const values = [
  {
    icon: Lightbulb,
    title: "Clareza antes de criar",
    text: "Entendemos o problema e definimos a direção antes de desenhar qualquer tela.",
  },
  {
    icon: Code2,
    title: "Design que funciona",
    text: "Beleza e usabilidade caminham juntas em todas as decisões.",
  },
  {
    icon: HeartHandshake,
    title: "Parceria de verdade",
    text: "Você acompanha o processo e participa das decisões importantes.",
  },
];

const beliefs = [
  "Soluções sob medida",
  "Comunicação sem complicação",
  "Cuidado em cada entrega",
  "Evolução com propósito",
];

export default function About() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          variant="about-hero"
          lightKicker
          kicker="QUEM SOMOS"
          title={
            <>
              Dois sócios.
              <br />
              <em>Uma visão em comum.</em>
            </>
          }
        >
          A DuolCode nasceu da parceria entre duas pessoas que acreditam que tecnologia boa começa
          com escuta, clareza e cuidado.
        </PageHero>
        <StorySection />
        <ValuesSection />
        <BeliefSection />
        <ContactStrip />
      </main>
      <Footer />
    </>
  );
}

function StorySection() {
  return (
    <section className="founder-story wrap">
      <div>
        <p className="kicker">DUOLCODE</p>
        <h2>
          Ideias diferentes.
          <br />
          <em>O mesmo compromisso.</em>
        </h2>
      </div>
      <div className="story-lead">
        <p>
          Eu e Gabriel criamos a DuolCode para ajudar empresas a transformar planos em produtos
          digitais que realmente funcionam.
        </p>
        <p>
          Somamos estratégia, design e desenvolvimento em um processo próximo, direto e
          transparente. Cada projeto recebe atenção de verdade, do primeiro encontro ao lançamento.
        </p>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="values-band">
      <div className="wrap values-grid">
        {values.map(({ icon: Icon, title, text }, index) => (
          <article key={title}>
            <Icon />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeliefSection() {
  return (
    <section className="about-belief wrap">
      <div>
        <p className="kicker">NO QUE ACREDITAMOS</p>
        <h2>
          Seu sonho merece um site.
          <br />
          <em>E um site vale um sonho.</em>
        </h2>
      </div>
      <ul>
        {beliefs.map((belief) => (
          <li key={belief}>
            <Check />
            {belief}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactStrip() {
  return (
    <section className="page-contact-strip">
      <div className="wrap">
        <p>Tem uma ideia em mente?</p>
        <Link href="/contato">
          Vamos conversar <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
