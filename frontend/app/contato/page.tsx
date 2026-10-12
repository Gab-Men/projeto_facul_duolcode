import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, Mail, MessageCircle } from "lucide-react";
import { Footer, Header, whatsappUrl } from "../../components/site-shell";

export default function Contact() {
  return (
    <>
      <Header />
      <main>
        <section className="contact-hero">
          <div className="wrap contact-grid">
            <div>
              <Link className="back-link light-link" href="/">
                <ArrowLeft size={17} />
                Voltar ao início
              </Link>
              <p className="kicker light">CONTATO</p>
              <h1>
                Vamos tirar sua ideia
                <br />
                <em>do papel?</em>
              </h1>
              <p>
                Conte um pouco sobre o que sua empresa precisa. A primeira conversa serve para
                entender o momento, organizar possibilidades e encontrar o melhor caminho.
              </p>
            </div>
            <div className="contact-panel">
              <span className="contact-number">01</span>
              <p className="kicker">CANAL PRINCIPAL</p>
              <h2>
                Fale com a gente
                <br />
                pelo WhatsApp.
              </h2>
              <p>Uma conversa simples para conhecer sua ideia e dar o primeiro passo.</p>
              <a className="contact-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle />
                Abrir WhatsApp <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
        <section className="contact-details wrap">
          <div>
            <p className="kicker">ANTES DE COMEÇAR</p>
            <h2>
              O que você pode
              <br />
              <em>contar para nós.</em>
            </h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p>O que sua empresa faz e para quem.</p>
            </li>
            <li>
              <span>02</span>
              <p>Qual problema o novo site ou sistema precisa resolver.</p>
            </li>
            <li>
              <span>03</span>
              <p>Se existe uma data ou objetivo importante para o projeto.</p>
            </li>
          </ol>
        </section>
        <section className="contact-meta">
          <div className="wrap">
            <article>
              <Clock3 />
              <div>
                <span>ATENDIMENTO</span>
                <p>Retornamos assim que possível, com atenção ao seu projeto.</p>
              </div>
            </article>
            <article>
              <Mail />
              <div>
                <span>PRIMEIRO CONTATO</span>
                <p>O WhatsApp é o caminho mais rápido para iniciar a conversa.</p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
