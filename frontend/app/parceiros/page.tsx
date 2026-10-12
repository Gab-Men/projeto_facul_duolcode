import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Handshake,
  Megaphone,
  Palette,
} from "lucide-react";
import { Footer, Header } from "../../components/site-shell";

const profiles = [
  {
    icon: Palette,
    title: "Design e branding",
    text: "Identidades visuais e materiais que fortalecem a presença da empresa.",
  },
  {
    icon: Megaphone,
    title: "Marketing e conteúdo",
    text: "Estratégias e campanhas que conectam o projeto digital ao público certo.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Consultoria e negócios",
    text: "Especialistas que ajudam empresas a organizar decisões e crescer com clareza.",
  },
];

export default function Partners() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero pale">
          <div className="wrap">
            <Link className="back-link" href="/">
              <ArrowLeft size={17} />
              Voltar ao início
            </Link>
            <p className="kicker">EMPRESAS PARCEIRAS</p>
            <h1>
              Boas conexões criam <br />
              <em>projetos melhores.</em>
            </h1>
            <p>Uma rede pensada para reunir competências e entregar mais valor a cada empresa.</p>
          </div>
        </section>
        <section className="partner-manifesto wrap">
          <Handshake size={44} />
          <div>
            <h2>
              Parceria, para nós, <em>é soma.</em>
            </h2>
          </div>
          <div>
            <p>
              Estamos formando uma rede de empresas e profissionais que compartilham cuidado,
              clareza e compromisso com cada entrega.
            </p>
            <p>
              Conheça as organizações que fazem parte da nossa rede e conectam inovação, tecnologia
              e cuidado com as pessoas.
            </p>
          </div>
        </section>
        <section className="partner-profiles">
          <div className="wrap">
            <p className="kicker light">QUEM PODE SOMAR COM A GENTE</p>
            <div className="profile-grid">
              {profiles.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="partner-directory wrap" aria-labelledby="partners-title">
          <BadgeCheck size={35} aria-hidden="true" />
          <p className="kicker">NOSSA REDE</p>
          <h2 id="partners-title">
            Conheça nossos
            <br />
            <em>parceiros.</em>
          </h2>
          <div className="partner-card-grid">
            <article className="partner-card partner-droz">
              <div className="partner-brand">
                <span className="partner-number">01 / DROZ</span>
                <Image
                  unoptimized
                  src="/partners/droz.png"
                  alt="Logo DROZ Robótica"
                  width={400}
                  height={220}
                />
                <span className="partner-brand-caption">Engenharia que transforma processos.</span>
              </div>
              <div className="partner-card-body">
                <p className="kicker">ROBÓTICA E AUTOMAÇÃO INDUSTRIAL</p>
                <h3>DROZ Robótica</h3>
                <p className="partner-location">Campo Mourão · Paraná</p>
                <p>
                  Empresa de Campo Mourão especializada em automação industrial e células
                  robotizadas de solda, unindo engenharia e capacitação técnica para aprimorar
                  processos produtivos.
                </p>
                <div className="partner-tags">
                  <span>Soldagem robotizada</span>
                  <span>Capacitação técnica</span>
                </div>
                <a
                  className="text-link partner-visit"
                  href="https://drozrobotica.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conhecer a DROZ Robótica (abre em nova aba)"
                >
                  Conhecer a DROZ <ArrowRight size={19} aria-hidden="true" />
                </a>
              </div>
            </article>
            <article className="partner-card partner-vollenz">
              <div className="partner-brand">
                <span className="partner-number">02 / VOLLENZ</span>
                <Image
                  unoptimized
                  src="/partners/vollenz.webp"
                  alt="Logo Vollenz"
                  width={400}
                  height={220}
                />
                <span className="partner-brand-caption">
                  Tecnologia que aproxima possibilidades.
                </span>
              </div>
              <div className="partner-card-body">
                <p className="kicker">REABILITAÇÃO E ACESSIBILIDADE</p>
                <h3>Vollenz</h3>
                <p className="partner-location">Tecnologia para recuperação e bem-estar</p>
                <p>
                  Empresa que desenvolve e fabrica equipamentos para reabilitação e acessibilidade,
                  com foco em melhorar a qualidade de vida e apoiar os desafios do dia a dia.
                </p>
                <div className="partner-tags">
                  <span>Reabilitação</span>
                  <span>Acessibilidade</span>
                </div>
                <a
                  className="text-link partner-visit"
                  href="https://www.vollenz.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conhecer a Vollenz (abre em nova aba)"
                >
                  Conhecer a Vollenz <ArrowRight size={19} aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>
          <Link className="text-link partner-invite" href="/contato">
            Faça parte dessa rede <ArrowRight size={19} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
