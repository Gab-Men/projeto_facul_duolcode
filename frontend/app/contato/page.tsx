import { ArrowUpRight, Clock3, Mail, MessageCircle, type LucideIcon } from "lucide-react";
import { whatsappUrl } from "../../components/site/site-shell";
import { SitePage } from "../../components/site/site-page";
import { BackLink } from "../../components/site/page-hero";
import { SectionHeading } from "../../components/site/section-heading";
import { NumberedSteps } from "../../components/site/numbered-steps";

const briefing = [
  { text: "O que sua empresa faz e para quem." },
  { text: "Qual problema o novo site ou sistema precisa resolver." },
  { text: "Se existe uma data ou objetivo importante para o projeto." },
];

const contactNotes: { icon: LucideIcon; label: string; text: string }[] = [
  { icon: Clock3, label: "ATENDIMENTO", text: "Retornamos assim que possível, com atenção ao seu projeto." },
  { icon: Mail, label: "PRIMEIRO CONTATO", text: "O WhatsApp é o caminho mais rápido para iniciar a conversa." },
];

export default function Contact() {
  return (
    <SitePage>
      <ContactHero />
      <section className="contact-details wrap">
        <div>
          <SectionHeading kicker="ANTES DE COMEÇAR" title={<>O que você pode<br /><em>contar para nós.</em></>} />
        </div>
        <NumberedSteps steps={briefing} />
      </section>
      <section className="contact-meta">
        <div className="wrap">
          {contactNotes.map(({ icon: Icon, label, text }) => (
            <article key={label}>
              <Icon />
              <div>
                <span>{label}</span>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SitePage>
  );
}

function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="wrap contact-grid">
        <div>
          <BackLink className="back-link light-link" />
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
  );
}
