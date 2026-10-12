import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Code2, HeartHandshake, Lightbulb } from "lucide-react";
import { Footer, Header } from "../../components/site-shell";

export default function About() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero about-hero">
          <div className="wrap">
            <Link className="back-link" href="/">
              <ArrowLeft size={17} />
              Voltar ao início
            </Link>
            <p className="kicker light">QUEM SOMOS</p>
            <h1>
              Dois sócios.
              <br />
              <em>Uma visão em comum.</em>
            </h1>
            <p>
              A DuolCode nasceu da parceria entre duas pessoas que acreditam que tecnologia boa
              começa com escuta, clareza e cuidado.
            </p>
          </div>
        </section>
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
              transparente. Cada projeto recebe atenção de verdade, do primeiro encontro ao
              lançamento.
            </p>
          </div>
        </section>
        <section className="values-band">
          <div className="wrap values-grid">
            <article>
              <Lightbulb />
              <span>01</span>
              <h3>Clareza antes de criar</h3>
              <p>Entendemos o problema e definimos a direção antes de desenhar qualquer tela.</p>
            </article>
            <article>
              <Code2 />
              <span>02</span>
              <h3>Design que funciona</h3>
              <p>Beleza e usabilidade caminham juntas em todas as decisões.</p>
            </article>
            <article>
              <HeartHandshake />
              <span>03</span>
              <h3>Parceria de verdade</h3>
              <p>Você acompanha o processo e participa das decisões importantes.</p>
            </article>
          </div>
        </section>
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
            <li>
              <Check />
              Soluções sob medida
            </li>
            <li>
              <Check />
              Comunicação sem complicação
            </li>
            <li>
              <Check />
              Cuidado em cada entrega
            </li>
            <li>
              <Check />
              Evolução com propósito
            </li>
          </ul>
        </section>
        <section className="page-contact-strip">
          <div className="wrap">
            <p>Tem uma ideia em mente?</p>
            <Link href="/contato">
              Vamos conversar <ArrowUpRight />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
