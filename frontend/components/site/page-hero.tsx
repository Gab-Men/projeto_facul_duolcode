import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeading } from "./section-heading";

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  lead: ReactNode;
  /** Visual variant defined in globals.css (green, pale, about-hero). */
  variant: string;
  light?: boolean;
}

/** Opening banner of the internal public pages, with the link back to the home page. */
export function PageHero({ kicker, title, lead, variant, light = true }: PageHeroProps) {
  return (
    <section className={`page-hero ${variant}`}>
      <div className="wrap">
        <BackLink />
        <SectionHeading kicker={kicker} title={title} light={light} level="h1" />
        <p>{lead}</p>
      </div>
    </section>
  );
}

export function BackLink({ className = "back-link" }: { className?: string }) {
  return (
    <Link className={className} href="/">
      <ArrowLeft size={17} />
      Voltar ao início
    </Link>
  );
}
