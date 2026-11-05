import type { BusinessRecord, RecordInput, Resource } from "../domain/records.js";
import type { Page } from "../domain/pagination.js";
import type { NewUser, User, UserUpdate } from "../domain/user.js";
import type { ClientLoad } from "../domain/portfolio-analysis.js";
export interface StatisticsRepository {
  clientLoads(ownerId: number): Promise<ClientLoad[]>;
}
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: NewUser): Promise<User>;
  update(id: number, data: UserUpdate): Promise<User>;
}
export interface RecordRepository {
  list(
    resource: Resource,
    ownerId: number,
    page: number,
    pageSize: number,
  ): Promise<Page<BusinessRecord>>;
  find(resource: Resource, ownerId: number, id: number): Promise<BusinessRecord | null>;
  create<R extends Resource>(resource: R, ownerId: number, data: RecordInput<NoInfer<R>>): Promise<BusinessRecord>;
  update<R extends Resource>(
    resource: R,
    ownerId: number,
    id: number,
    data: RecordInput<NoInfer<R>>,
  ): Promise<BusinessRecord>;
  remove(resource: Resource, ownerId: number, id: number): Promise<void>;
}
