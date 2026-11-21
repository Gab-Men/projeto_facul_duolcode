import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/** Link "Voltar ao início" usado nas páginas internas do site. */
export function BackLink({ light = false }: { light?: boolean }) {
  return (
    <Link className={light ? "back-link light-link" : "back-link"} href="/">
      <ArrowLeft size={17} />
      Voltar ao início
    </Link>
  );
}

/** Abertura padrão das páginas internas: voltar, rótulo, título e texto. */
export function PageHero({
  variant,
  kicker,
  lightKicker = false,
  title,
  children,
}: {
  variant: "pale" | "green" | "about-hero";
  kicker: string;
  lightKicker?: boolean;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`page-hero ${variant}`}>
      <div className="wrap">
        <BackLink />
        <p className={lightKicker ? "kicker light" : "kicker"}>{kicker}</p>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </section>
  );
}
