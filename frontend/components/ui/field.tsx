import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FieldBase {
  label: string;
  name: string;
}

/** Campo de texto com rótulo; obrigatório por padrão. */
export function Field({
  label,
  name,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & FieldBase) {
  return (
    <label className="admin-field" htmlFor={name}>
      {label}
      <input id={name} name={name} required {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldBase) {
  return (
    <label className="admin-field" htmlFor={name}>
      {label}
      <textarea id={name} name={name} required {...props} />
    </label>
  );
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export function SelectField({
  label,
  name,
  options,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> &
  FieldBase & { options: SelectOption[]; placeholder?: string }) {
  return (
    <label className="admin-field" htmlFor={name}>
      {label}
      <select id={name} name={name} required {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Mensagem de retorno: erro (padrão) ou sucesso. */
export function Feedback({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "success";
}) {
  if (!message) return null;
  return tone === "success" ? (
    <p className="admin-feedback is-success" role="status">
      {message}
    </p>
  ) : (
    <p className="admin-feedback" role="alert">
      {message}
    </p>
  );
}
