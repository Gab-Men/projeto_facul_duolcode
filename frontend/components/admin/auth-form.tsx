"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useAuth, type User } from "../../contexts/auth-context";
import { api, errorMessage } from "../../lib/api";
import { validateAccount } from "../../lib/validation";
import { Button } from "../ui/button";
import { CpfField } from "../ui/cpf-field";
import { Feedback, Field } from "../ui/field";
import { PasswordFields } from "../ui/password-fields";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { message, busy, run } = useSubmit();
  useRedirectWhenLoggedIn();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    void run(validateAccount({ email, password }), async () => {
      const result = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(result.token, result.user);
      router.push("/painel");
    });
  }
  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse seus clientes, serviços e projetos."
      footer={<Link href="/cadastro">Criar minha conta</Link>}
    >
      <form onSubmit={submit}>
        <Field name="email" label="E-mail" type="email" maxLength={254} autoComplete="email" />
        <PasswordFields mode="login" />
        <Feedback message={message} />
        <Button loading={busy}>Entrar</Button>
      </form>
    </AuthLayout>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { message, busy, run } = useSubmit();
  useRedirectWhenLoggedIn();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      cpf: String(form.get("cpf") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    void run(validateAccount({ ...data, confirm: String(form.get("confirm") ?? "") }, true), async () => {
      await api("/auth/register", { method: "POST", body: JSON.stringify(data) });
      router.push("/login?cadastro=ok");
    });
  }
  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Preencha seus dados para começar."
      footer={<Link href="/login">Já tenho uma conta</Link>}
    >
      <form onSubmit={submit}>
        <Field name="name" label="Nome" minLength={2} maxLength={120} autoComplete="name" />
        <Field name="email" label="E-mail" type="email" maxLength={254} autoComplete="email" />
        <CpfField />
        <PasswordFields mode="new" />
        <Feedback message={message} />
        <Button loading={busy}>Cadastrar</Button>
      </form>
    </AuthLayout>
  );
}

/** Moldura das telas de login e cadastro: história da marca + cartão do formulário. */
function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="admin auth-page">
      <div className="auth-layout">
        <AuthStory />
        <div className="admin-card auth-card">
          <Link href="/">← Voltar ao site</Link>
          <p className="admin-eyebrow">DUOLCODE · GESTÃO</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
          {footer}
        </div>
      </div>
    </main>
  );
}

function AuthStory() {
  return (
    <aside className="auth-story">
      <Link href="/" className="auth-brand">
        duolcode<span>®</span>
      </Link>
      <div>
        <p className="auth-kicker">MENOS RUÍDO. MAIS DIREÇÃO.</p>
        <h2>
          Boas ideias.
          <br />
          Grandes
          <br />
          <em>conexões.</em>
        </h2>
        <p>Seu espaço para conectar clientes, organizar projetos e enxergar novas possibilidades.</p>
      </div>
      <div className="auth-story-footer">
        <span>01 / ORGANIZE</span>
        <span>02 / CONECTE</span>
        <span>03 / EVOLUA</span>
      </div>
    </aside>
  );
}

/** Quem já está logado não precisa ver login nem cadastro. */
function useRedirectWhenLoggedIn() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && user) router.replace("/painel");
  }, [loading, user, router]);
}

/** Estado comum de envio: mensagem de erro e botão ocupado. */
function useSubmit() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(invalid: string | null, action: () => Promise<void>) {
    if (busy) return;
    setMessage(invalid ?? "");
    if (invalid) return;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return { message, busy, run };
}
