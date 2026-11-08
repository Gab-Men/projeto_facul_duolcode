import Link from "next/link";
import { ArrowUpRight, Code2, HeartHandshake, Lightbulb } from "lucide-react";
import { SitePage } from "../../components/site/site-page";
import { PageHero } from "../../components/site/page-hero";
import { SectionHeading } from "../../components/site/section-heading";
import { FeatureCard, type Feature } from "../../components/site/feature-card";
import { CheckList } from "../../components/site/check-list";

const values: Feature[] = [
  {
    icon: Lightbulb,
    number: "01",
    title: "Clareza antes de criar",
    text: "Entendemos o problema e definimos a direção antes de desenhar qualquer tela.",
  },
  {
    icon: Code2,
    number: "02",
    title: "Design que funciona",
    text: "Beleza e usabilidade caminham juntas em todas as decisões.",
  },
  {
    icon: HeartHandshake,
    number: "03",
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
    <SitePage>
      <PageHero
        variant="about-hero"
        kicker="QUEM SOMOS"
        title={<>Dois sócios.<br /><em>Uma visão em comum.</em></>}
        lead="A DuolCode nasceu da parceria entre duas pessoas que acreditam que tecnologia boa começa com escuta, clareza e cuidado."
      />
      <FounderStory />
      <section className="values-band">
        <div className="wrap values-grid">
          {values.map((value) => <FeatureCard key={value.title} {...value} />)}
        </div>
      </section>
      <section className="about-belief wrap">
        <div>
          <SectionHeading
            kicker="NO QUE ACREDITAMOS"
            title={<>Seu sonho merece um site.<br /><em>E um site vale um sonho.</em></>}
          />
        </div>
        <CheckList items={beliefs} />
      </section>
      <ContactStrip />
    </SitePage>
  );
}

function FounderStory() {
  return (
    <section className="founder-story wrap">
      <div>
        <SectionHeading kicker="DUOLCODE" title={<>Ideias diferentes.<br /><em>O mesmo compromisso.</em></>} />
      </div>
      <div className="story-lead">
        <p>
          Eu e Gabriel criamos a DuolCode para ajudar empresas a transformar planos em produtos
          digitais que realmente funcionam.
        </p>
        <p>
          Somamos estratégia, design e desenvolvimento em um processo próximo, direto e
          transparente. Cada projeto recebe atenção de verdade, do primeiro encontro ao
          lançamento.
        </p>
      </div>
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
