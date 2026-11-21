"use client";
import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";
import { firstName } from "../../lib/format";

/** Link do cabeçalho público: usa o contexto para saudar quem está logado. */
export function AccountLink() {
  const { user } = useAuth();
  if (!user) return <Link href="/login">Área de gestão</Link>;
  return (
    <Link href="/painel" className="account-link">
      Olá, {firstName(user.name)} · Painel
    </Link>
  );
}
