"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, type User } from "../../contexts/auth-context";

const links = [
  ["/painel", "Visão geral"],
  ["/painel/clientes", "Clientes"],
  ["/painel/servicos", "Serviços"],
  ["/painel/parceiros", "Parceiros"],
  ["/painel/projetos", "Projetos"],
  ["/painel/estatisticas", "Estatísticas"],
  ["/painel/perfil", "Meu perfil"],
] as const;

/** Área logada: protege as rotas e monta cabeçalho + navegação. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading || !user)
    return (
      <main className="admin">
        <p role="status">Carregando sua conta…</p>
      </main>
    );
  return (
    <div className="admin">
      <AdminHeader user={user} onLogout={logout} />
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}

function AdminHeader({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <header className="admin-header">
      <Link href="/">DuolCode</Link>
      <span className="admin-user">
        <span className="admin-avatar" aria-hidden="true">
          {user.name.slice(0, 1).toUpperCase()}
        </span>{" "}
        Olá, {user.name}
      </span>
      <button onClick={onLogout} className="admin-secondary">
        Sair
      </button>
    </header>
  );
}

function AdminNav() {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    href === "/painel" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <nav className="admin-nav" aria-label="Gestão">
      {links.map(([href, label]) => (
        <Link key={href} href={href} aria-current={isCurrent(href) ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
