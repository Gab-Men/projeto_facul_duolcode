import { ValidationError } from "../errors/app-error.js";
import type { RecordInput, Resource } from "./records.js";

/** A link from one record to another record of the same account (e.g. project → client). */
export interface Relation {
  readonly resource: Resource;
  readonly id: number;
  readonly message: string;
}

/**
 * Template for every business record (clientes, serviços, parceiros, projetos).
 *
 * - Encapsulation: the state lives in a native private field (#state), is frozen and is only
 *   exposed as a copy through toRecord().
 * - Template Method: the constructor always runs the same steps (common normalization →
 *   specific normalization → specific validation) and subclasses only override the hooks.
 * - Polymorphism: `relations` is overridden by entities that depend on other records, so the
 *   service checks relationships without knowing which resource it is handling.
 */
export abstract class BusinessEntity<R extends Resource = Resource> {
  readonly #state: RecordInput<R>;

  constructor(data: RecordInput<R>) {
    const common = { ...data, name: data.name.trim(), description: data.description.trim() };
    const normalized = this.normalize(common);
    this.validate(normalized);
    // Frozen: even code inside the class cannot mutate the stored state by accident.
    this.#state = normalized;
    Object.freeze(this.#state);
  }

  /** Resource (table/route) this entity belongs to. */
  abstract get resource(): R;

  /** Hook: resource-specific normalization. Default keeps the data unchanged. */
  protected normalize(data: RecordInput<R>): RecordInput<R> {
    return data;
  }

  /** Hook: resource-specific invariants that must hold before the entity exists. */
  protected validate(data: RecordInput<R>): void {
    if (data.name.length < 2) throw new ValidationError("O nome precisa ter pelo menos 2 caracteres.");
    if (data.description.length < 2) throw new ValidationError("Descreva o registro.");
  }

  /** Records that must exist in the same account. Most entities have none. */
  get relations(): readonly Relation[] {
    return [];
  }

  toRecord(): RecordInput<R> {
    return { ...this.#state };
  }
}

export class ClientEntity extends BusinessEntity<"clientes"> {
  get resource(): "clientes" {
    return "clientes";
  }
  protected override normalize(data: RecordInput<"clientes">): RecordInput<"clientes"> {
    return { ...data, email: data.email.trim().toLowerCase() };
  }
}

export class ServiceEntity extends BusinessEntity<"servicos"> {
  get resource(): "servicos" {
    return "servicos";
  }
}

export class PartnerEntity extends BusinessEntity<"parceiros"> {
  get resource(): "parceiros" {
    return "parceiros";
  }
  protected override validate(data: RecordInput<"parceiros">): void {
    super.validate(data);
    if (!/^https?:\/\//i.test(data.website)) throw new ValidationError("Use um endereço http ou https.");
  }
}

export class ProjectEntity extends BusinessEntity<"projetos"> {
  get resource(): "projetos" {
    return "projetos";
  }
  protected override validate(data: RecordInput<"projetos">): void {
    super.validate(data);
    if (!Number.isSafeInteger(data.clientId) || data.clientId <= 0)
      throw new ValidationError("Selecione um cliente.");
  }
  override get relations(): readonly Relation[] {
    return [{
      resource: "clientes",
      id: this.toRecord().clientId,
      message: "Selecione um cliente cadastrado na sua conta.",
    }];
  }
}

type EntityFactories = { [R in Resource]: (data: RecordInput<R>) => BusinessEntity<R> };

// Open/Closed: a new resource registers its class here; services do not change.
const factories: EntityFactories = {
  clientes: (data) => new ClientEntity(data),
  servicos: (data) => new ServiceEntity(data),
  parceiros: (data) => new PartnerEntity(data),
  projetos: (data) => new ProjectEntity(data),
};

export function createEntity<R extends Resource>(resource: R, data: RecordInput<R>): BusinessEntity<R> {
  const factory: EntityFactories[R] = factories[resource];
  return factory(data);
}
