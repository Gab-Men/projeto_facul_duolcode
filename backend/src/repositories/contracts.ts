import type { BusinessRecord, Page, RecordInput, Resource, User } from "../domain/validation.js";
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: Omit<User, "id">): Promise<User>;
  update(id: number, data: Pick<User, "name" | "cpf" | "passwordHash">): Promise<User>;
}
export interface RecordRepository {
  list(
    resource: Resource,
    ownerId: number,
    page: number,
    pageSize: number,
  ): Promise<Page<BusinessRecord>>;
  find(resource: Resource, ownerId: number, id: number): Promise<BusinessRecord | null>;
  create(resource: Resource, ownerId: number, data: RecordInput): Promise<BusinessRecord>;
  update(
    resource: Resource,
    ownerId: number,
    id: number,
    data: RecordInput,
  ): Promise<BusinessRecord>;
  remove(resource: Resource, ownerId: number, id: number): Promise<void>;
}
