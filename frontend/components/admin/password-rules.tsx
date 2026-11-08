import { passwordChecks } from "../../lib/validation";

/** Live checklist of the password strength rules (same rules enforced by the API). */
export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="password-rules" aria-label="Requisitos da senha" aria-live="polite">
      {passwordChecks(value).map(({ label, valid }) => (
        <li key={label} data-valid={valid}>
          {valid ? "✓" : "○"} {label}
        </li>
      ))}
    </ul>
  );
}
