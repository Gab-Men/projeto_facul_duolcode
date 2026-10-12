import type { InputHTMLAttributes } from "react";
export function Field({
  label,
  name,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="admin-field" htmlFor={name}>
      {label}
      <input id={name} name={name} required {...props} />
    </label>
  );
}
export function Feedback({ message }: { message: string }) {
  return message ? (
    <p className="admin-feedback" role="alert">
      {message}
    </p>
  ) : null;
}
