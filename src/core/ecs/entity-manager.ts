/**
 * Simple integer-based entity identifier.
 */
export type EntityId = number;

/**
 * Entity manager for creating and tracking entities.
 */
export class EntityManager {
  private nextId = 1;
  private entities = new Set<EntityId>();

  /**
   * Creates a new entity with a unique ID.
   */
  public create(): EntityId {
    const id = this.nextId++;
    this.entities.add(id);
    return id;
  }

  /**
   * Destroys an entity and removes it from tracking.
   */
  public destroy(entityId: EntityId): void {
    this.entities.delete(entityId);
  }

  /**
   * Checks if an entity exists.
   */
  public exists(entityId: EntityId): boolean {
    return this.entities.has(entityId);
  }

  /**
   * Gets all active entity IDs.
   */
  public getAll(): EntityId[] {
    return Array.from(this.entities);
  }

  /**
   * Gets the count of active entities.
   */
  public getCount(): number {
    return this.entities.size;
  }
}
