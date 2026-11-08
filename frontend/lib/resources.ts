import { api } from "./api";
export interface BusinessRecord {
  id: number;
  name: string;
  description: string;
  email?: string;
  website?: string;
  clientId?: number;
}
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export const resources = {
  clientes: { title: "Clientes", singular: "cliente" },
  servicos: { title: "Serviços", singular: "serviço" },
  parceiros: { title: "Parceiros", singular: "parceiro" },
  projetos: { title: "Projetos", singular: "projeto" },
};
export type Resource = keyof typeof resources;
export function isResource(value: string): value is Resource {
  return Object.hasOwn(resources, value);
}

/** Loads every client of the account (all pages), used to pick and display a project's client. */
export async function fetchAllClients(isActive: () => boolean = () => true): Promise<BusinessRecord[]> {
  const items: BusinessRecord[] = [];
  for (let page = 1; isActive(); page++) {
    const result = await api<Page<BusinessRecord>>(`/clientes?page=${page}&pageSize=50`);
    items.push(...result.items);
    if (items.length >= result.total || result.items.length === 0) break;
  }
  return items;
}
