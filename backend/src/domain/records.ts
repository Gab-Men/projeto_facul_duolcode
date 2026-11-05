import type { z } from "zod";
import type { schemas } from "./validation.js";

export const resourceNames = ["clientes", "servicos", "parceiros", "projetos"] as const;
export type Resource = (typeof resourceNames)[number];
// Required fields come from the same schemas that validate input.
export type RecordInputMap = { [R in Resource]: z.output<(typeof schemas)[R]> };
export type RecordInput<R extends Resource = Resource> = RecordInputMap[R];
export type BusinessRecord<R extends Resource = Resource> = RecordInput<R> & { id: number };
