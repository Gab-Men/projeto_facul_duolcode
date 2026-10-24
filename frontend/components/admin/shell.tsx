"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AuthProvider, useAuth } from "../../contexts/auth-context";
function Protected({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading || !user)
    return (
      <main className="admin">
        <p role="status">Carregando sua conta…</p>
      </main>
    );
  const links = [
    ["/painel", "Visão geral"],
    ["/painel/clientes", "Clientes"],
    ["/painel/servicos", "Serviços"],
    ["/painel/parceiros", "Parceiros"],
    ["/painel/projetos", "Projetos"],
    ["/painel/estatisticas", "Estatísticas"],
    ["/painel/perfil", "Meu perfil"],
  ];
  return (
    <div className="admin">
      <header className="admin-header">
        <Link href="/">DuolCode</Link>
        <span>Olá, {user.name}</span>
        <button onClick={logout} className="admin-secondary">
          Sair
        </button>
      </header>
      <nav className="admin-nav" aria-label="Gestão">
        {links.map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Protected>{children}</Protected>
    </AuthProvider>
  );
}
