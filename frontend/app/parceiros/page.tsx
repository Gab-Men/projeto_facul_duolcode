import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Handshake, Megaphone, Palette } from "lucide-react";
import { SitePage } from "../../components/site/site-page";
import { PageHero } from "../../components/site/page-hero";
import { SectionHeading } from "../../components/site/section-heading";
import { FeatureCard, type Feature } from "../../components/site/feature-card";
import { PartnerCard, type Partner } from "../../components/site/partner-card";

const profiles: Feature[] = [
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

const partners: Partner[] = [
  {
    slug: "droz",
    name: "DROZ Robótica",
    shortName: "DROZ",
    logo: "/partners/droz.png",
    caption: "Engenharia que transforma processos.",
    segment: "ROBÓTICA E AUTOMAÇÃO INDUSTRIAL",
    location: "Campo Mourão · Paraná",
    description:
      "Empresa de Campo Mourão especializada em automação industrial e células robotizadas de solda, unindo engenharia e capacitação técnica para aprimorar processos produtivos.",
    tags: ["Soldagem robotizada", "Capacitação técnica"],
    website: "https://drozrobotica.com/",
  },
  {
    slug: "vollenz",
    name: "Vollenz",
    shortName: "Vollenz",
    logo: "/partners/vollenz.webp",
    caption: "Tecnologia que aproxima possibilidades.",
    segment: "REABILITAÇÃO E ACESSIBILIDADE",
    location: "Tecnologia para recuperação e bem-estar",
    description:
      "Empresa que desenvolve e fabrica equipamentos para reabilitação e acessibilidade, com foco em melhorar a qualidade de vida e apoiar os desafios do dia a dia.",
    tags: ["Reabilitação", "Acessibilidade"],
    website: "https://www.vollenz.com/",
  },
];

export default function Partners() {
  return (
    <SitePage>
      <PageHero
        variant="pale"
        light={false}
        kicker="EMPRESAS PARCEIRAS"
        title={<>Boas conexões criam <br /><em>projetos melhores.</em></>}
        lead="Uma rede pensada para reunir competências e entregar mais valor a cada empresa."
      />
      <Manifesto />
      <section className="partner-profiles">
        <div className="wrap">
          <p className="kicker light">QUEM PODE SOMAR COM A GENTE</p>
          <div className="profile-grid">
            {profiles.map((profile) => <FeatureCard key={profile.title} {...profile} />)}
          </div>
        </div>
      </section>
      <PartnerDirectory />
    </SitePage>
  );
}

function Manifesto() {
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
          Estamos formando uma rede de empresas e profissionais que compartilham cuidado,
          clareza e compromisso com cada entrega.
        </p>
        <p>
          Conheça as organizações que fazem parte da nossa rede e conectam inovação, tecnologia
          e cuidado com as pessoas.
        </p>
      </div>
    </section>
  );
}

function PartnerDirectory() {
  return (
    <section className="partner-directory wrap" aria-labelledby="partners-title">
      <BadgeCheck size={35} aria-hidden="true" />
      <SectionHeading id="partners-title" kicker="NOSSA REDE" title={<>Conheça nossos<br /><em>parceiros.</em></>} />
      <div className="partner-card-grid">
        {partners.map((partner, index) => (
          <PartnerCard key={partner.slug} partner={partner} position={index + 1} />
        ))}
      </div>
      <Link className="text-link partner-invite" href="/contato">
        Faça parte dessa rede <ArrowRight size={19} />
      </Link>
    </section>
  );
}
