import type { Metadata } from "next";
import "./globals.css";
import ScrollEffects from "../components/scroll-effects";
import { WhatsAppButton } from "../components/site-shell";
import { AuthProvider } from "../contexts/auth-context";
export const metadata: Metadata = {
  title: "DuolCode",
  description: "Sites e sistemas para empresas.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ScrollEffects />
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
