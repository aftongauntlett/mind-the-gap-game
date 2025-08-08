import type { EntityId } from './entity-manager';

/**
 * Component storage using Maps for efficient lookups.
 */
export class ComponentStore<T> {
  private components = new Map<EntityId, T>();

  /**
   * Adds a component to an entity.
   */
  public add(entityId: EntityId, component: T): void {
    this.components.set(entityId, component);
  }

  /**
   * Gets a component for an entity.
   */
  public get(entityId: EntityId): T | undefined {
    return this.components.get(entityId);
  }

  /**
   * Removes a component from an entity.
   */
  public remove(entityId: EntityId): boolean {
    return this.components.delete(entityId);
  }

  /**
   * Checks if an entity has this component.
   */
  public has(entityId: EntityId): boolean {
    return this.components.has(entityId);
  }

  /**
   * Gets all entities that have this component.
   */
  public getEntities(): EntityId[] {
    return Array.from(this.components.keys());
  }

  /**
   * Gets all component instances.
   */
  public getAll(): T[] {
    return Array.from(this.components.values());
  }

  /**
   * Gets all entity-component pairs.
   */
  public getEntries(): Array<[EntityId, T]> {
    return Array.from(this.components.entries());
  }

  /**
   * Clears all components.
   */
  public clear(): void {
    this.components.clear();
  }

  /**
   * Gets the count of components.
   */
  public getCount(): number {
    return this.components.size;
  }
}
