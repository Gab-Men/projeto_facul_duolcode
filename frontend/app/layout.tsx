import type { Metadata } from "next";
import "./globals.css";
import ScrollEffects from "../components/scroll-effects";
import { WhatsAppButton } from "../components/site-shell";
export const metadata: Metadata = {
  title: "DuolCode",
  description: "Sites e sistemas para empresas.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <ScrollEffects />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
