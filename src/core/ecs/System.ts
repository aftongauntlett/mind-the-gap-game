/**
 * Forward declaration of World to avoid circular imports.
 */
declare class World {
  update(_deltaTime: number): void;
}

/**
 * Base system interface for ECS architecture.
 * Systems contain the logic that operates on entities and components.
 */
export interface System {
  /**
   * Updates the system with the given delta time.
   * @param deltaTime - Time elapsed since last update in milliseconds
   * @param world - The ECS world instance
   */
  update(_deltaTime: number, _world: World): void;

  /**
   * Called when the system is destroyed.
   */
  destroy?(): void;
}

/**
 * Abstract base class for systems.
 */
export abstract class BaseSystem implements System {
  public abstract update(_deltaTime: number, _world: World): void;

  public destroy(): void {
    // Override in subclasses if cleanup is needed
  }
}
