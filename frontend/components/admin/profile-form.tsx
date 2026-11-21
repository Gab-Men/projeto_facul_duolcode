"use client";
import { useState, type FormEvent } from "react";
import { useAuth, type User } from "../../contexts/auth-context";
import { api, errorMessage } from "../../lib/api";
import { validateAccount } from "../../lib/validation";
import { Button } from "../ui/button";
import { CpfField } from "../ui/cpf-field";
import { Feedback, Field } from "../ui/field";
import { PasswordFields } from "../ui/password-fields";

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get("name") ?? "").trim(),
      cpf: String(form.get("cpf") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    setSaved(false);
    const invalid = validateAccount({ ...data, confirm: String(form.get("confirm") ?? "") }, true);
    if (invalid) {
      setMessage(invalid);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      // O e-mail não é enviado: a API não permite alterá-lo.
      const updated = await api<User>("/users/me", { method: "PUT", body: JSON.stringify(data) });
      setUser(updated);
      setResetKey((value) => value + 1);
      setSaved(true);
      setMessage("Perfil atualizado.");
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  if (!user) return null;
  return (
    <>
      <h1>Meu perfil</h1>
      <p>
        O e-mail não pode ser alterado. Para salvar, informe todos os campos e confirme a senha.
      </p>
      <form className="admin-card admin-form" onSubmit={submit}>
        <Field name="name" label="Nome" minLength={2} maxLength={120} defaultValue={user.name} />
        <Field name="email" label="E-mail" type="email" value={user.email} readOnly />
        <CpfField defaultValue={user.cpf} />
        <PasswordFields key={resetKey} mode="new" />
        <Feedback message={message} tone={saved ? "success" : "error"} />
        <Button loading={busy} loadingText="Salvando…">
          Salvar perfil
        </Button>
      </form>
    </>
  );
}
