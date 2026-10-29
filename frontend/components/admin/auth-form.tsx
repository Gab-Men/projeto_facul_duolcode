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
  const [visible, setVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
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
      <div className="auth-layout">
      <aside className="auth-story">
        <Link href="/" className="auth-brand">duolcode<span>®</span></Link>
        <div><p className="auth-kicker">MENOS RUÍDO. MAIS DIREÇÃO.</p>
        <h2>Boas ideias.<br />Grandes<br /><em>conexões.</em></h2>
        <p>Seu espaço para conectar clientes, organizar projetos e enxergar novas possibilidades.</p></div>
        <div className="auth-story-footer"><span>01 / ORGANIZE</span><span>02 / CONECTE</span><span>03 / EVOLUA</span></div>
      </aside>
      <div className="admin-card auth-card">
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
            type={visible ? "text" : "password"}
            minLength={register ? 8 : 1}
            maxLength={128}
            autoComplete={register ? "new-password" : "current-password"}
            onChange={(event) => setPasswordValue(event.target.value)}
          />
          {register && (
            <>
              <ul className="password-rules" aria-label="Requisitos da senha">
                {[["8 caracteres", passwordValue.length >= 8], ["Maiúscula", /[A-Z]/.test(passwordValue)], ["Minúscula", /[a-z]/.test(passwordValue)], ["Número", /\d/.test(passwordValue)]].map(([label, valid]) => <li key={String(label)} data-valid={valid}>{valid ? "✓" : "○"} {label}</li>)}
              </ul>
              <Field
                name="confirm"
                label="Confirmar senha"
                type={visible ? "text" : "password"}
                maxLength={128}
                autoComplete="new-password"
              />
            </>
          )}
          <button className="password-toggle" type="button" aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? "Ocultar senhas" : "Mostrar senhas"}</button>
          <Feedback message={message} />
          <button disabled={busy} className="admin-button">
            {busy ? "Aguarde…" : register ? "Cadastrar" : "Entrar"}
          </button>
        </form>
        <Link href={register ? "/login" : "/cadastro"}>
          {register ? "Já tenho uma conta" : "Criar minha conta"}
        </Link>
      </div>
      </div>
    </main>
  );
}
