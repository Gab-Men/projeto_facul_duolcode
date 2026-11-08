import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
  number?: string;
}

/** Icon + optional number + title + text. Used in values and partner profiles. */
export function FeatureCard({ icon: Icon, title, text, number }: Feature) {
  return (
    <article>
      <Icon />
      {number && <span>{number}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
