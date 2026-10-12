"use client";
import { useState, type FormEvent } from "react";
import { useAuth, type User } from "../../contexts/auth-context";
import { api, errorMessage } from "../../lib/api";
import { validateAccount } from "../../lib/validation";
import { Field, Feedback } from "./field";
export function ProfileForm() {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get("password"));
    const cpf = String(form.get("cpf"));
    const invalid = validateAccount({ cpf, password, confirm: String(form.get("confirm")) }, true);
    if (invalid) {
      setMessage(invalid);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const updated = await api<User>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name: form.get("name"), cpf, password }),
      });
      setUser(updated);
      for (const field of ["password", "confirm"]) {
        const input = formElement.elements.namedItem(field);
        if (input instanceof HTMLInputElement) input.value = "";
      }
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
        <Field name="cpf" label="CPF" maxLength={14} defaultValue={user.cpf} />
        <Field
          name="password"
          label="Senha"
          type="password"
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
        />
        <small>Use maiúscula, minúscula e número.</small>
        <Field
          name="confirm"
          label="Confirmar senha"
          type="password"
          maxLength={128}
          autoComplete="new-password"
        />
        <Feedback message={message} />
        <button className="admin-button" disabled={busy}>
          {busy ? "Salvando…" : "Salvar perfil"}
        </button>
      </form>
    </>
  );
}
