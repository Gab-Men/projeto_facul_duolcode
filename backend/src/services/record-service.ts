import { Entity, Project } from "../domain/entity.js";
import { schemas } from "../domain/validation.js";
import type { BusinessRecord, Resource, RecordInput } from "../domain/records.js";
import type { Page } from "../domain/pagination.js";
import { AppError, NotFoundError } from "../errors/app-error.js";
import type { RecordRepository } from "../repositories/contracts.js";
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
  async save(resource: Resource, ownerId: number, input: unknown, id?: number): Promise<BusinessRecord> {
    const data: RecordInput = schemas[resource].parse(input);
    if (id) await this.get(resource, ownerId, id);
    if (
      resource === "projetos" &&
      "clientId" in data &&
      typeof data.clientId === "number" &&
      !(await this.records.find("clientes", ownerId, data.clientId))
    ) {
      throw new AppError(400, "Selecione um cliente cadastrado na sua conta.");
    }
    const entity: Entity = resource === "projetos" ? new Project(data) : new Entity(data);
    return id
      ? this.records.update(resource, ownerId, id, entity.toRecord())
      : this.records.create(resource, ownerId, entity.toRecord());
  }
  async remove(resource: Resource, ownerId: number, id: number): Promise<void> {
    await this.get(resource, ownerId, id);
    await this.records.remove(resource, ownerId, id);
  }
}
