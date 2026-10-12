import { AppError } from "../errors/app-error.js";
import type { RecordInput } from "./validation.js";
// Shared invariant: entities expose snapshots, never their internal mutable object.
export class Entity {
  private readonly state: RecordInput;
  constructor(data: RecordInput) {
    this.state = { ...data, name: data.name.trim() };
  }
  toRecord(): RecordInput {
    return { ...this.state };
  }
}
export class Project extends Entity {
  constructor(data: RecordInput) {
    if (!data.clientId || !Number.isInteger(data.clientId))
      throw new AppError(400, "Selecione um cliente.");
    super(data);
  }
}
