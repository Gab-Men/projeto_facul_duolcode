import { createEntity } from "../domain/entity.js";
import { parseRecord } from "../domain/validation.js";
import type { BusinessRecord, Resource } from "../domain/records.js";
import type { Page } from "../domain/pagination.js";
import { NotFoundError, ValidationError } from "../errors/app-error.js";
import type { RecordRepository } from "../repositories/contracts.js";

// Single responsibility: business rules of the four CRUDs. Persistence is delegated to the
// RecordRepository contract (MySQL in production, memory in tests), so the service does not
// depend on a concrete database (Dependency Inversion).
export class RecordService {
  constructor(private readonly records: RecordRepository) {}

  list(resource: Resource, ownerId: number, page: number, pageSize: number): Promise<Page<BusinessRecord>> {
    return this.records.list(resource, ownerId, page, pageSize);
  }

  async get(resource: Resource, ownerId: number, id: number): Promise<BusinessRecord> {
    const record = await this.records.find(resource, ownerId, id);
    if (!record) throw new NotFoundError();
    return record;
  }

  async save<R extends Resource>(resource: R, ownerId: number, input: unknown, id?: number): Promise<BusinessRecord> {
    const entity = createEntity(resource, parseRecord(resource, input));
    if (id) await this.get(resource, ownerId, id);
    // Polymorphism: each entity declares the records it depends on.
    for (const relation of entity.relations) {
      if (!(await this.records.find(relation.resource, ownerId, relation.id)))
        throw new ValidationError(relation.message);
    }
    return id
      ? this.records.update(resource, ownerId, id, entity.toRecord())
      : this.records.create(resource, ownerId, entity.toRecord());
  }

  async remove(resource: Resource, ownerId: number, id: number): Promise<void> {
    await this.get(resource, ownerId, id);
    await this.records.remove(resource, ownerId, id);
  }
}
