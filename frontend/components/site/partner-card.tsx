import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface Partner {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  caption: string;
  segment: string;
  location: string;
  description: string;
  tags: readonly string[];
  website: string;
}

/** Public card of a partner company (logo, segment, description, tags and link). */
export function PartnerCard({ partner, position }: { partner: Partner; position: number }) {
  const number = String(position).padStart(2, "0");
  return (
    <article className={`partner-card partner-${partner.slug}`}>
      <div className="partner-brand">
        <span className="partner-number">{number} / {partner.shortName.toUpperCase()}</span>
        <Image unoptimized src={partner.logo} alt={`Logo ${partner.name}`} width={400} height={220} />
        <span className="partner-brand-caption">{partner.caption}</span>
      </div>
      <div className="partner-card-body">
        <p className="kicker">{partner.segment}</p>
        <h3>{partner.name}</h3>
        <p className="partner-location">{partner.location}</p>
        <p>{partner.description}</p>
        <div className="partner-tags">
          {partner.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <a
          className="text-link partner-visit"
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conhecer a ${partner.name} (abre em nova aba)`}
        >
          Conhecer a {partner.shortName} <ArrowRight size={19} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
