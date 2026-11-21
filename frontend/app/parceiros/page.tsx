import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Handshake,
  Megaphone,
  Palette,
} from "lucide-react";
import { Footer, Header } from "../../components/site-shell";
import { PageHero } from "../../components/site/page-hero";

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

interface Partner {
  slug: string;
  number: string;
  logo: string;
  logoAlt: string;
  caption: string;
  area: string;
  name: string;
  location: string;
  text: string;
  tags: string[];
  href: string;
  linkLabel: string;
}

const partners: Partner[] = [
  {
    slug: "droz",
    number: "01 / DROZ",
    logo: "/partners/droz.png",
    logoAlt: "Logo DROZ Robótica",
    caption: "Engenharia que transforma processos.",
    area: "ROBÓTICA E AUTOMAÇÃO INDUSTRIAL",
    name: "DROZ Robótica",
    location: "Campo Mourão · Paraná",
    text: "Empresa de Campo Mourão especializada em automação industrial e células robotizadas de solda, unindo engenharia e capacitação técnica para aprimorar processos produtivos.",
    tags: ["Soldagem robotizada", "Capacitação técnica"],
    href: "https://drozrobotica.com/",
    linkLabel: "Conhecer a DROZ",
  },
  {
    slug: "vollenz",
    number: "02 / VOLLENZ",
    logo: "/partners/vollenz.webp",
    logoAlt: "Logo Vollenz",
    caption: "Tecnologia que aproxima possibilidades.",
    area: "REABILITAÇÃO E ACESSIBILIDADE",
    name: "Vollenz",
    location: "Tecnologia para recuperação e bem-estar",
    text: "Empresa que desenvolve e fabrica equipamentos para reabilitação e acessibilidade, com foco em melhorar a qualidade de vida e apoiar os desafios do dia a dia.",
    tags: ["Reabilitação", "Acessibilidade"],
    href: "https://www.vollenz.com/",
    linkLabel: "Conhecer a Vollenz",
  },
];

export default function Partners() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          variant="pale"
          kicker="EMPRESAS PARCEIRAS"
          title={
            <>
              Boas conexões criam <br />
              <em>projetos melhores.</em>
            </>
          }
        >
          Uma rede pensada para reunir competências e entregar mais valor a cada empresa.
        </PageHero>
        <ManifestoSection />
        <ProfilesSection />
        <DirectorySection />
      </main>
      <Footer />
    </>
  );
}

function ManifestoSection() {
  return (
    <section className="partner-manifesto wrap">
      <Handshake size={44} />
      <div>
        <h2>
          Parceria, para nós, <em>é soma.</em>
        </h2>
      </div>
      <div>
        <p>
          Estamos formando uma rede de empresas e profissionais que compartilham cuidado, clareza
          e compromisso com cada entrega.
        </p>
        <p>
          Conheça as organizações que fazem parte da nossa rede e conectam inovação, tecnologia e
          cuidado com as pessoas.
        </p>
      </div>
    </section>
  );
}

function ProfilesSection() {
  return (
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
  );
}

function DirectorySection() {
  return (
    <section className="partner-directory wrap" aria-labelledby="partners-title">
      <BadgeCheck size={35} aria-hidden="true" />
      <p className="kicker">NOSSA REDE</p>
      <h2 id="partners-title">
        Conheça nossos
        <br />
        <em>parceiros.</em>
      </h2>
      <div className="partner-card-grid">
        {partners.map((partner) => (
          <PartnerCard key={partner.slug} partner={partner} />
        ))}
      </div>
      <Link className="text-link partner-invite" href="/contato">
        Faça parte dessa rede <ArrowRight size={19} />
      </Link>
    </section>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className={`partner-card partner-${partner.slug}`}>
      <div className="partner-brand">
        <span className="partner-number">{partner.number}</span>
        <Image unoptimized src={partner.logo} alt={partner.logoAlt} width={400} height={220} />
        <span className="partner-brand-caption">{partner.caption}</span>
      </div>
      <div className="partner-card-body">
        <p className="kicker">{partner.area}</p>
        <h3>{partner.name}</h3>
        <p className="partner-location">{partner.location}</p>
        <p>{partner.text}</p>
        <div className="partner-tags">
          {partner.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a
          className="text-link partner-visit"
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conhecer a ${partner.name} (abre em nova aba)`}
        >
          {partner.linkLabel} <ArrowRight size={19} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
