import type { ReactNode } from "react";
import { Footer, Header } from "./site-shell";

/** Common frame of every public page: skip link, header, main content and footer. */
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </>
  );
}
