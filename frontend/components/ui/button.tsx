import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const classes: Record<Variant, string> = {
  primary: "admin-button",
  secondary: "admin-secondary",
};

/** Botão padrão da área de gestão, com estado de carregamento. */
export function Button({
  variant = "primary",
  loading = false,
  loadingText = "Aguarde…",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
}) {
  return (
    <button className={classes[variant]} disabled={disabled || loading} {...props}>
      {loading ? loadingText : children}
    </button>
  );
}
