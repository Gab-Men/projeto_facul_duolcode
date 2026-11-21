/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
export function formatCpf(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}
