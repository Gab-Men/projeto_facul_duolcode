export function validCpf(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) return false;
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let size = 9; size <= 10; size++) {
    let sum = 0;
    for (let i = 0; i < size; i++) sum += Number(cpf[i]) * (size + 1 - i);
    if (((sum * 10) % 11) % 10 !== Number(cpf[size])) return false;
  }
  return true;
}
export interface PasswordCheck {
  label: string;
  valid: boolean;
}
/** Password strength rules shown to the user; must match the API schema. */
export function passwordChecks(password: string): PasswordCheck[] {
  return [
    { label: "8 caracteres", valid: password.length >= 8 },
    { label: "Maiúscula", valid: /[A-Z]/.test(password) },
    { label: "Minúscula", valid: /[a-z]/.test(password) },
    { label: "Número", valid: /\d/.test(password) },
  ];
}
export function validateAccount(
  data: { email?: string; cpf?: string; password: string; confirm?: string },
  full = false,
): string | null {
  if (data.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Informe um e-mail válido.";
  if (full) {
    if (!validCpf(data.cpf ?? "")) return "Informe um CPF válido.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/.test(data.password))
      return "A senha precisa de 8 a 128 caracteres, maiúscula, minúscula e número.";
    if (data.password !== data.confirm) return "As senhas precisam ser iguais.";
  }
  return null;
}
