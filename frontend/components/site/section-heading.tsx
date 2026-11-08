import type { ReactNode } from "react";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  /** Light kicker for dark/green backgrounds. */
  light?: boolean;
  /** Heading level; sections use h2 and page heroes use h1. */
  level?: "h1" | "h2";
  id?: string;
}

/** Kicker (small uppercase label) followed by the section title. */
export function SectionHeading({ kicker, title, light = false, level = "h2", id }: SectionHeadingProps) {
  const Heading = level;
  return (
    <>
      <p className={light ? "kicker light" : "kicker"}>{kicker}</p>
      <Heading id={id}>{title}</Heading>
    </>
  );
}
