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
} from "lucide-react";
import { Footer, Header } from "../components/site-shell";

const services = [
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

export default function Home() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
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
            <p className="kicker light">DESIGN + TECNOLOGIA + PARCERIA</p>
            <h1 id="hero-title">
              Toda grande ideia merece
              <br />
              <span>um lugar no digital.</span>
            </h1>
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

        <section className="home-statement" id="essencia">
          <div className="wrap statement-layout">
            <p className="kicker">O DIGITAL COM PROPÓSITO</p>
            <h2>
              Menos ruído.
              <br />
              Mais <em>resultado.</em>
            </h2>
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

        <section className="home-services wrap">
          <div className="home-section-head">
            <div>
              <p className="kicker">O QUE CRIAMOS</p>
              <h2>
                Soluções que movem
                <br />
                <em>empresas adiante.</em>
              </h2>
            </div>
            <Braces size={46} strokeWidth={1} />
          </div>
          <div className="service-lines">
            {services.map(({ number, icon: Icon, title, text, href }) => (
              <Link href={href} className="service-line" key={title}>
                <span>{number}</span>
                <Icon />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <MoveUpRight />
              </Link>
            ))}
          </div>
        </section>

        <section className="digital-showcase">
          <div className="wrap showcase-grid">
            <div className="showcase-copy">
              <p className="kicker light">FEITO PARA FUNCIONAR</p>
              <h2>
                Bonito no primeiro olhar.
                <br />
                <em>Intuitivo em cada clique.</em>
              </h2>
              <p>
                Cada tela nasce de uma decisão consciente: guiar pessoas, comunicar valor e
                facilitar a próxima ação.
              </p>
              <Link className="button primary" href="/servicos">
                Explorar serviços <ArrowRight size={19} />
              </Link>
            </div>
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
          </div>
        </section>

        <section className="home-process wrap">
          <div className="home-process-intro">
            <p className="kicker">NOSSO PROCESSO</p>
            <h2>
              Direto, próximo e <em>transparente.</em>
            </h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Entender</h3>
                <p>Ouvimos o cenário e encontramos a direção certa.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Criar</h3>
                <p>Design e tecnologia avançam juntos, com propósito.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Entregar</h3>
                <p>Revisamos, publicamos e preparamos o próximo passo.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="home-closing">
          <div className="wrap">
            <p className="kicker light">COMECE UMA CONVERSA</p>
            <h2>
              Sua próxima ideia pode <em>começar agora.</em>
            </h2>
            <Link className="button primary" href="/contato">
              Falar com a DuolCode <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
