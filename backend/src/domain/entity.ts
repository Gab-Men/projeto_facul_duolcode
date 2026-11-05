import { AppError } from "../errors/app-error.js";
import type { RecordInput } from "./records.js";
// Shared invariant: entities expose snapshots, never their internal mutable object.
export class Entity {
  readonly #state: Readonly<RecordInput>;
  constructor(data: RecordInput) {
    this.#state = Object.freeze({ ...data, name: data.name.trim() });
  }
  toRecord(): RecordInput {
    return { ...this.#state };
  }
}
export class Project extends Entity {
  constructor(data: RecordInput) {
    if (!("clientId" in data) || !Number.isSafeInteger(data.clientId) || data.clientId <= 0)
      throw new AppError(400, "Selecione um cliente.");
    super(data);
  }
}
