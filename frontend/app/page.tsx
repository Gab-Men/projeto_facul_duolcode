import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  LayoutTemplate,
  MoveUpRight,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SitePage } from "../components/site/site-page";
import { SectionHeading } from "../components/site/section-heading";
import { NumberedSteps } from "../components/site/numbered-steps";

interface ServiceSummary {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}

const services: ServiceSummary[] = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Sites institucionais",
    text: "Presença digital clara, rápida e criada para transmitir confiança.",
    href: "/servicos#sites",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Landing pages",
    text: "Experiências focadas em campanhas, lançamentos e conversão.",
    href: "/servicos#landing-pages",
  },
  {
    number: "03",
    icon: Workflow,
    title: "Sistemas web",
    text: "Ferramentas sob medida para organizar e simplificar operações.",
    href: "/servicos#sistemas",
  },
];

const processSteps = [
  { title: "Entender", text: "Ouvimos o cenário e encontramos a direção certa." },
  { title: "Criar", text: "Design e tecnologia avançam juntos, com propósito." },
  { title: "Entregar", text: "Revisamos, publicamos e preparamos o próximo passo." },
];

export default function Home() {
  return (
    <SitePage>
      <HeroSection />
      <StatementSection />
      <ServicesSection />
      <ShowcaseSection />
      <ProcessSection />
      <ClosingSection />
    </SitePage>
  );
}

function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image
        unoptimized
        className="hero-background"
        src="/hero-studio-4k.webp"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="wrap hero-inner">
        <SectionHeading
          light
          level="h1"
          id="hero-title"
          kicker="DESIGN + TECNOLOGIA + PARCERIA"
          title={<>Toda grande ideia merece<br /><span>um lugar no digital.</span></>}
        />
        <p className="hero-slogan">Da primeira conversa ao lançamento.</p>
        <p className="hero-lead">
          Criamos sites e sistemas que apresentam sua empresa, simplificam sua rotina e ajudam o
          negócio a avançar.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/servicos">
            Conheça nossos serviços <ArrowUpRight size={20} />
          </Link>
          <Link className="button ghost" href="/parceiros">
            Empresas parceiras
          </Link>
        </div>
        <a className="hero-scroll" href="#essencia">
          Descubra a DuolCode <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}

function StatementSection() {
  return (
    <section className="home-statement" id="essencia">
      <div className="wrap statement-layout">
        <SectionHeading kicker="O DIGITAL COM PROPÓSITO" title={<>Menos ruído.<br />Mais <em>resultado.</em></>} />
        <div className="statement-copy">
          <p>
            Unimos estratégia, design e desenvolvimento para transformar uma necessidade real em
            uma experiência digital simples de usar e difícil de esquecer.
          </p>
          <Link href="/contato">
            Conte sua ideia <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="home-services wrap">
      <div className="home-section-head">
        <div>
          <SectionHeading kicker="O QUE CRIAMOS" title={<>Soluções que movem<br /><em>empresas adiante.</em></>} />
        </div>
        <Braces size={46} strokeWidth={1} />
      </div>
      <div className="service-lines">
        {services.map((service) => <ServiceLine key={service.title} {...service} />)}
      </div>
    </section>
  );
}

function ServiceLine({ number, icon: Icon, title, text, href }: ServiceSummary) {
  return (
    <Link href={href} className="service-line">
      <span>{number}</span>
      <Icon />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <MoveUpRight />
    </Link>
  );
}

function ShowcaseSection() {
  return (
    <section className="digital-showcase">
      <div className="wrap showcase-grid">
        <div className="showcase-copy">
          <SectionHeading
            light
            kicker="FEITO PARA FUNCIONAR"
            title={<>Bonito no primeiro olhar.<br /><em>Intuitivo em cada clique.</em></>}
          />
          <p>
            Cada tela nasce de uma decisão consciente: guiar pessoas, comunicar valor e
            facilitar a próxima ação.
          </p>
          <Link className="button primary" href="/servicos">
            Explorar serviços <ArrowRight size={19} />
          </Link>
        </div>
        <InterfaceArt />
      </div>
    </section>
  );
}

function InterfaceArt() {
  return (
    <div className="interface-art" aria-hidden="true">
      <div className="interface-top">
        <i />
        <i />
        <i />
        <span>duolcode.digital</span>
      </div>
      <div className="interface-body">
        <div className="art-copy">
          <small>PROJETO DIGITAL</small>
          <strong>
            Ideias ganham
            <br />
            <em>forma.</em>
          </strong>
          <b />
        </div>
        <div className="art-card">
          <span>01</span>
          <p>
            Clareza
            <br />
            Experiência
            <br />
            Resultado
          </p>
        </div>
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="home-process wrap">
      <div className="home-process-intro">
        <SectionHeading kicker="NOSSO PROCESSO" title={<>Direto, próximo e <em>transparente.</em></>} />
      </div>
      <NumberedSteps steps={processSteps} />
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="home-closing">
      <div className="wrap">
        <SectionHeading light kicker="COMECE UMA CONVERSA" title={<>Sua próxima ideia pode <em>começar agora.</em></>} />
        <Link className="button primary" href="/contato">
          Falar com a DuolCode <ArrowUpRight size={20} />
        </Link>
      </div>
    </section>
  );
}
