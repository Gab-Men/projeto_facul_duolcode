import { ArrowUpRight, Clock3, Mail, MessageCircle } from "lucide-react";
import { Footer, Header, whatsappUrl } from "../../components/site-shell";
import { BackLink } from "../../components/site/page-hero";

const topics = [
  "O que sua empresa faz e para quem.",
  "Qual problema o novo site ou sistema precisa resolver.",
  "Se existe uma data ou objetivo importante para o projeto.",
];

export default function Contact() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <TopicsSection />
        <MetaSection />
      </main>
      <Footer />
    </>
  );
}

function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="wrap contact-grid">
        <div>
          <BackLink light />
          <p className="kicker light">CONTATO</p>
          <h1>
            Vamos tirar sua ideia
            <br />
            <em>do papel?</em>
          </h1>
          <p>
            Conte um pouco sobre o que sua empresa precisa. A primeira conversa serve para entender
            o momento, organizar possibilidades e encontrar o melhor caminho.
          </p>
        </div>
        <WhatsAppPanel />
      </div>
    </section>
  );
}

function WhatsAppPanel() {
  return (
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
  );
}

function TopicsSection() {
  return (
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
        {topics.map((topic, index) => (
          <li key={topic}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{topic}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function MetaSection() {
  return (
    <section className="contact-meta">
      <div className="wrap">
        <MetaItem icon={<Clock3 />} label="ATENDIMENTO">
          Retornamos assim que possível, com atenção ao seu projeto.
        </MetaItem>
        <MetaItem icon={<Mail />} label="PRIMEIRO CONTATO">
          O WhatsApp é o caminho mais rápido para iniciar a conversa.
        </MetaItem>
      </div>
    </section>
  );
}

function MetaItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      {icon}
      <div>
        <span>{label}</span>
        <p>{children}</p>
      </div>
    </article>
  );
}
