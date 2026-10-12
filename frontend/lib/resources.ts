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
