export type { Page } from "./api";

export interface BusinessRecord {
  id: number;
  name: string;
  description: string;
  email?: string;
  website?: string;
  clientId?: number;
}

/** Dados enviados ao criar ou editar: o servidor define o id. */
export type RecordPayload = Omit<BusinessRecord, "id">;

interface ResourceInfo {
  title: string;
  singular: string;
  summary: string;
}

export const resources = {
  clientes: { title: "Clientes", singular: "cliente", summary: "Empresas e pessoas que você atende." },
  servicos: { title: "Serviços", singular: "serviço", summary: "Soluções que sua empresa oferece." },
  parceiros: {
    title: "Parceiros",
    singular: "parceiro",
    summary: "Contatos que colaboram com seu trabalho.",
  },
  projetos: {
    title: "Projetos",
    singular: "projeto",
    summary: "Trabalhos vinculados aos seus clientes.",
  },
} satisfies Record<string, ResourceInfo>;

export type Resource = keyof typeof resources;

export const resourceNames = Object.keys(resources) as Resource[];

export function isResource(value: string): value is Resource {
  return Object.hasOwn(resources, value);
}
