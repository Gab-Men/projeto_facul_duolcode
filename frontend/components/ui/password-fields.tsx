"use client";
import { useState } from "react";
import { passwordLevel, passwordRules } from "../../lib/validation";
import { Field } from "./field";

/**
 * Senha com botão de mostrar/ocultar.
 * - `mode="login"`: só a senha atual.
 * - `mode="new"`: nível da senha, regras e confirmação (cadastro e perfil).
 */
export function PasswordFields({ mode }: { mode: "login" | "new" }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const isNew = mode === "new";
  return (
    <>
      <Field
        name="password"
        label="Senha"
        type={visible ? "text" : "password"}
        minLength={isNew ? 8 : 1}
        maxLength={128}
        autoComplete={isNew ? "new-password" : "current-password"}
        onChange={(event) => setValue(event.target.value)}
      />
      {isNew && (
        <>
          <PasswordStrength value={value} />
          <Field
            name="confirm"
            label="Confirmar senha"
            type={visible ? "text" : "password"}
            maxLength={128}
            autoComplete="new-password"
          />
        </>
      )}
      <button
        className="password-toggle"
        type="button"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Ocultar senhas" : "Mostrar senhas"}
      </button>
    </>
  );
}

/** Mostra o nível da senha e quais regras já foram cumpridas. */
export function PasswordStrength({ value }: { value: string }) {
  const level = passwordLevel(value);
  return (
    <div className="password-strength" aria-live="polite">
      {value && (
        <p className="password-level" data-level={level}>
          Nível da senha: <strong>{level}</strong>
        </p>
      )}
      <ul className="password-rules" aria-label="Requisitos da senha">
        {passwordRules.map((rule) => {
          const valid = rule.test(value);
          return (
            <li key={rule.label} data-valid={valid}>
              {valid ? "✓" : "○"} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
