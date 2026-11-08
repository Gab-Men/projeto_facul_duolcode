import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

// WhatsApp contact information
const whatsappNumero = "5544997155774";
const whatsappMensagem = "Olá, DuolCode! Quero conversar sobre um projeto.";
export const whatsappUrl = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(whatsappMensagem)}`;

export function Header() {
  return (
    <header className="site-header" id="top">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark" aria-label="DuolCode, página inicial">
          <Image unoptimized src="/logo-approved.png" alt="DuolCode" width={420} height={80} />
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/servicos">Serviços</Link>
          <Link href="/quem-somos">Quem somos</Link>
          <Link href="/parceiros">Parceiros</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/login">Área de gestão</Link>
        </nav>
        <Link className="nav-cta" href="/contato">
          Iniciar projeto <ArrowUpRight size={18} />
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <Link href="/" className="wordmark">
            <Image unoptimized src="/logo-approved.png" alt="DuolCode" width={420} height={80} />
          </Link>
          <p>
            Seu sonho merece um site.
            <br />E um site vale um sonho.
          </p>
          <div className="footer-nav">
            <Link href="/servicos">Serviços</Link>
            <Link href="/parceiros">Parceiros</Link>
            <a href="#top">Voltar ao topo</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DuolCode</span>
          <span>Sites e sistemas para empresas.</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-fixed"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar com a DuolCode pelo WhatsApp"
      title="Falar pelo WhatsApp"
    >
      <MessageCircle size={25} />
      <span>WhatsApp</span>
    </a>
  );
}
