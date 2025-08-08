/**
 * Unique identifier for entities in the ECS system.
 */
export type EntityId = number;

/**
 * Base entity class representing a game object in the ECS architecture.
 */
export class Entity {
  private static nextId = 1;

  public readonly id: EntityId;

  constructor() {
    this.id = Entity.nextId++;
  }

  /**
   * Creates a new entity with a unique identifier.
   */
  public static create(): Entity {
    return new Entity();
  }
}
