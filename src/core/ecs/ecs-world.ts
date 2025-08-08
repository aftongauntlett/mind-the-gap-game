import { ComponentStore } from '@core/ecs/component-store';
import { EntityManager, type EntityId } from '@core/ecs/entity-manager';
import { EventBus } from '@core/ecs/event-bus';
import type { System } from '@core/ecs/System';

/**
 * Micro ECS World that manages entities, components, and systems.
 */
export class EcsWorld {
  private entityManager = new EntityManager();
  private componentStores = new Map<string, ComponentStore<unknown>>();
  private systems: System[] = [];
  private eventBus = new EventBus();

  /**
   * Creates a new entity.
   */
  public createEntity(): EntityId {
    return this.entityManager.create();
  }

  /**
   * Destroys an entity and removes all its components.
   */
  public destroyEntity(entityId: EntityId): void {
    // Remove all components for this entity
    for (const store of this.componentStores.values()) {
      store.remove(entityId);
    }
    this.entityManager.destroy(entityId);
  }

  /**
   * Gets or creates a component store for a given type.
   */
  private getComponentStore<T>(componentType: string): ComponentStore<T> {
    if (!this.componentStores.has(componentType)) {
      this.componentStores.set(componentType, new ComponentStore<T>());
    }
    return this.componentStores.get(componentType) as ComponentStore<T>;
  }

  /**
   * Adds a component to an entity.
   */
  public addComponent<T>(
    entityId: EntityId,
    componentType: string,
    component: T
  ): void {
    const store = this.getComponentStore<T>(componentType);
    store.add(entityId, component);
  }

  /**
   * Gets a component from an entity.
   */
  public getComponent<T>(
    entityId: EntityId,
    componentType: string
  ): T | undefined {
    const store = this.getComponentStore<T>(componentType);
    return store.get(entityId);
  }

  /**
   * Removes a component from an entity.
   */
  public removeComponent(entityId: EntityId, componentType: string): boolean {
    const store = this.componentStores.get(componentType);
    return store?.remove(entityId) ?? false;
  }

  /**
   * Checks if an entity has a component.
   */
  public hasComponent(entityId: EntityId, componentType: string): boolean {
    const store = this.componentStores.get(componentType);
    return store?.has(entityId) ?? false;
  }

  /**
   * Gets all entities that have the specified components.
   */
  public getEntitiesWithComponents(...componentTypes: string[]): EntityId[] {
    if (componentTypes.length === 0) {
      return this.entityManager.getAll();
    }

    const firstType = componentTypes[0];
    if (!firstType) {
      return [];
    }

    const firstStore = this.componentStores.get(firstType);
    if (!firstStore) {
      return [];
    }

    const candidates = firstStore.getEntities();
    return candidates.filter((entityId) =>
      componentTypes.every((type) => this.hasComponent(entityId, type))
    );
  }

  /**
   * Gets a component store by type (public access).
   */
  public getStore<T>(componentType: string): ComponentStore<T> {
    return this.getComponentStore<T>(componentType);
  }

  /**
   * Adds a system to the world.
   */
  public addSystem(system: System): void {
    this.systems.push(system);
  }

  /**
   * Removes a system from the world.
   */
  public removeSystem(system: System): void {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      this.systems.splice(index, 1);
      system.destroy?.();
    }
  }

  /**
   * Updates all systems.
   */
  public update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(
        deltaTime,
        this as unknown as import('@core/ecs/World').World
      );
    }
  }

  /**
   * Gets the event bus for inter-system communication.
   */
  public getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Clears all entities, components, and systems.
   */
  public clear(): void {
    for (const system of this.systems) {
      system.destroy?.();
    }
    this.systems.length = 0;

    for (const store of this.componentStores.values()) {
      store.clear();
    }
    this.componentStores.clear();

    this.eventBus.clear();
  }

  /**
   * Gets entity count for debugging.
   */
  public getEntityCount(): number {
    return this.entityManager.getCount();
  }
}
