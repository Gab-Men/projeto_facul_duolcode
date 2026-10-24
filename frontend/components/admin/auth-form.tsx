"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, errorMessage, TOKEN_KEY } from "../../lib/api";
import { validateAccount } from "../../lib/validation";
import { Field, Feedback } from "./field";
export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setMessage("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (register && name.length < 2) {
      setMessage("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const cpf = String(form.get("cpf") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    const invalid = validateAccount({ email, password, cpf, confirm }, register);
    if (invalid) {
      setMessage(invalid);
      return;
    }
    setBusy(true);
    try {
      if (register) {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password, cpf }),
        });
        router.push("/login?cadastro=ok");
      } else {
        const result = await api<{ token: string }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(TOKEN_KEY, result.token);
        router.push("/painel");
      }
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin auth-page">
      <div className="admin-card">
        <Link href="/">← Voltar ao site</Link>
        <p className="admin-eyebrow">DUOLCODE · GESTÃO</p>
        <h1>{register ? "Criar conta" : "Entrar"}</h1>
        <p>
          {register
            ? "Preencha seus dados para começar."
            : "Acesse seus clientes, serviços e projetos."}
        </p>
        <form onSubmit={submit}>
          {register && (
            <Field name="name" label="Nome" minLength={2} maxLength={120} autoComplete="name" />
          )}
          <Field name="email" label="E-mail" type="email" maxLength={254} autoComplete="email" />
          {register && <Field name="cpf" label="CPF" inputMode="numeric" maxLength={14} />}
          <Field
            name="password"
            label="Senha"
            type="password"
            minLength={register ? 8 : 1}
            maxLength={128}
            autoComplete={register ? "new-password" : "current-password"}
          />
          {register && (
            <>
              <small>Use maiúscula, minúscula e número, com pelo menos 8 caracteres.</small>
              <Field
                name="confirm"
                label="Confirmar senha"
                type="password"
                maxLength={128}
                autoComplete="new-password"
              />
            </>
          )}
          <Feedback message={message} />
          <button disabled={busy} className="admin-button">
            {busy ? "Aguarde…" : register ? "Cadastrar" : "Entrar"}
          </button>
        </form>
        <Link href={register ? "/login" : "/cadastro"}>
          {register ? "Já tenho uma conta" : "Criar minha conta"}
        </Link>
      </div>
    </main>
  );
}
