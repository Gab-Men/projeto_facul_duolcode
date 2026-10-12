import { z } from "zod";
export function validCpf(value: string): boolean {
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
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido.");
export const password = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "A senha precisa de maiúscula, minúscula e número.");
const name = z.string().trim().min(2, "Informe ao menos 2 caracteres.").max(120);
const cpf = z
  .string()
  .refine(validCpf, "CPF inválido.")
  .transform((value) => value.replace(/\D/g, ""));
export const registerSchema = z.object({ name, email, password, cpf }).strict();
export const profileSchema = z.object({ name, password, cpf }).strict();
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) }).strict();
export const resourceNames = ["clientes", "servicos", "parceiros", "projetos"] as const;
export type Resource = (typeof resourceNames)[number];
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
export interface RecordInput {
  name: string;
  description: string;
  email?: string;
  website?: string;
  clientId?: number;
}
export interface BusinessRecord extends RecordInput {
  id: number;
}
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  passwordHash: string;
}
export type PublicUser = Omit<User, "passwordHash">;
export function publicUser(user: User): PublicUser {
  const { passwordHash, ...safe } = user;
  return safe;
}
