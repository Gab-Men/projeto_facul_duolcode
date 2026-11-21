import type { RecordPayload, Resource } from "./resources";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

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

/** Regras do nível de senha: as mesmas exigidas pela API. */
export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

export const passwordRules: readonly PasswordRule[] = [
  { label: "8 caracteres", test: (value) => value.length >= 8 },
  { label: "Maiúscula", test: (value) => /[A-Z]/.test(value) },
  { label: "Minúscula", test: (value) => /[a-z]/.test(value) },
  { label: "Número", test: (value) => /\d/.test(value) },
];

export type PasswordLevel = "fraca" | "média" | "forte";

export function passwordLevel(value: string): PasswordLevel {
  const passed = passwordRules.filter((rule) => rule.test(value)).length;
  if (passed === passwordRules.length && value.length <= 128) return "forte";
  return passed >= 3 ? "média" : "fraca";
}

export interface AccountInput {
  name?: string;
  email?: string;
  cpf?: string;
  password: string;
  confirm?: string;
}

/**
 * Valida o login (`full = false`) ou o cadastro/edição da conta (`full = true`).
 * Devolve a primeira mensagem de erro ou `null` quando está tudo certo.
 */
export function validateAccount(data: AccountInput, full = false): string | null {
  if (data.name !== undefined) {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 120) return "Informe um nome com 2 a 120 caracteres.";
  }
  if (data.email !== undefined && !validEmail(data.email)) return "Informe um e-mail válido.";
  if (!full) return data.password ? null : "Informe sua senha.";
  if (!validCpf(data.cpf ?? "")) return "Informe um CPF válido.";
  if (passwordLevel(data.password) !== "forte")
    return "A senha precisa de 8 a 128 caracteres, maiúscula, minúscula e número.";
  if (data.password !== data.confirm) return "As senhas precisam ser iguais.";
  return null;
}

/** Campos obrigatórios de cada cadastro da área de gestão. */
export function validateRecord(resource: Resource, data: RecordPayload): string | null {
  if (data.name.length < 2 || data.name.length > 120)
    return "Informe um nome com 2 a 120 caracteres.";
  if (data.description.length < 2 || data.description.length > 1000)
    return "Informe uma descrição com 2 a 1000 caracteres.";
  if (resource === "clientes" && !validEmail(data.email ?? "")) return "Informe um e-mail válido.";
  if (resource === "parceiros" && !/^https?:\/\/\S+\.\S+/.test(data.website ?? ""))
    return "Informe o site completo, começando com http:// ou https://.";
  if (resource === "projetos" && !(Number.isInteger(data.clientId) && Number(data.clientId) > 0))
    return "Selecione o cliente do projeto.";
  return null;
}
