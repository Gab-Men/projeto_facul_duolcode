import { z } from "zod";
import type { RecordInput, Resource } from "./records.js";
export function validCpf(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) return false;
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let size = 9; size <= 10; size++) {
    let sum = 0;
    for (let i = 0; i < size; i++) sum += Number(cpf[i]) * (size + 1 - i);
    const digit = ((sum * 10) % 11) % 10;
    if (digit !== Number(cpf[size])) return false;
  }
  return true;
}
export const email = z
  .string({ error: "Informe um e-mail válido." })
  .trim()
  .toLowerCase()
  .max(254, "O e-mail deve ter no máximo 254 caracteres.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido.");
export const password = z
  .string({ error: "Informe uma senha." })
  .min(8, "Use pelo menos 8 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "A senha precisa de maiúscula, minúscula e número.");
const name = z.string({ error: "Informe o nome." }).trim()
  .min(2, "O nome precisa ter pelo menos 2 caracteres.").max(120, "O nome deve ter no máximo 120 caracteres.");
const cpf = z
  .string({ error: "Informe um CPF válido." })
  .refine(validCpf, "CPF inválido.")
  .transform((value) => value.replace(/\D/g, ""));
export const registerSchema = z.object({ name, email, password, cpf }).strict();
export const profileSchema = z.object({ name, password, cpf }).strict();
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) }).strict();
const base = { name, description: z.string().trim().min(2, "Descreva o registro.").max(1000) };
export const schemas = {
  clientes: z.object({ ...base, email }).strict(),
  servicos: z.object(base).strict(),
  parceiros: z
    .object({
      ...base,
      website: z
        .url()
        .max(500)
        .refine((value) => /^https?:\/\//.test(value), "Use um endereço http ou https."),
    })
    .strict(),
  projetos: z.object({ ...base, clientId: z.number().int().positive() }).strict(),
};
type RecordParsers = { [R in Resource]: (input: unknown) => RecordInput<R> };
const parsers: RecordParsers = {
  clientes: (input) => schemas.clientes.parse(input),
  servicos: (input) => schemas.servicos.parse(input),
  parceiros: (input) => schemas.parceiros.parse(input),
  projetos: (input) => schemas.projetos.parse(input),
};
/** Validates external input and returns data typed for the given resource. */
export function parseRecord<R extends Resource>(resource: R, input: unknown): RecordInput<R> {
  const parse: RecordParsers[R] = parsers[resource];
  return parse(input);
}
// Compatibility for existing consumers; new code imports models directly.
export { resourceNames } from "./records.js";
export type { Resource, RecordInput, BusinessRecord } from "./records.js";
export type { Page } from "./pagination.js";
export { publicUser } from "./user.js";
export type { User, PublicUser } from "./user.js";
