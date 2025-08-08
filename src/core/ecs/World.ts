import type { Component, ComponentType } from './Component';
import type { Entity, EntityId } from './Entity';

/**
 * System interface forward declaration to avoid circular imports.
 */
interface System {
  update(_deltaTime: number, _world: World): void;
  destroy?(): void;
}

/**
 * Component storage for a specific component type.
 */
type ComponentStorage<T extends Component> = Map<EntityId, T>;

/**
 * ECS World manages entities, components, and systems.
 */
export class World {
  private entities = new Map<EntityId, Entity>();
  private components = new Map<ComponentType, ComponentStorage<Component>>();
  private systems: System[] = [];

  /**
   * Adds an entity to the world.
   */
  public addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  /**
   * Removes an entity and all its components from the world.
   */
  public removeEntity(entityId: EntityId): void {
    this.entities.delete(entityId);

    // Remove all components for this entity
    this.components.forEach((storage) => {
      storage.delete(entityId);
    });
  } /**
   * Adds a component to an entity.
   */
  public addComponent<T extends Component>(
    entityId: EntityId,
    componentType: ComponentType<T>,
    component: T
  ): void {
    if (!this.components.has(componentType)) {
      this.components.set(componentType, new Map());
    }

    const storage = this.components.get(componentType);
    storage?.set(entityId, component);
  }

  /**
   * Gets a component for an entity.
   */
  public getComponent<T extends Component>(
    entityId: EntityId,
    componentType: ComponentType<T>
  ): T | undefined {
    const storage = this.components.get(componentType);
    return storage?.get(entityId) as T | undefined;
  }

  /**
   * Removes a component from an entity.
   */
  public removeComponent<T extends Component>(
    entityId: EntityId,
    componentType: ComponentType<T>
  ): void {
    const storage = this.components.get(componentType);
    storage?.delete(entityId);
  }

  /**
   * Gets all entities that have the specified component types.
   */
  public getEntitiesWithComponents<T extends Component>(
    ...componentTypes: ComponentType<T>[]
  ): EntityId[] {
    const entityIds: EntityId[] = [];

    this.entities.forEach((_, entityId) => {
      const hasAllComponents = componentTypes.every((componentType) =>
        this.components.get(componentType)?.has(entityId)
      );

      if (hasAllComponents) {
        entityIds.push(entityId);
      }
    });

    return entityIds;
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
   * Updates all systems in the world.
   */
  public update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(deltaTime, this);
    }
  }

  /**
   * Destroys the world and all its systems.
   */
  public destroy(): void {
    for (const system of this.systems) {
      system.destroy?.();
    }

    this.systems.length = 0;
    this.entities.clear();
    this.components.clear();
  }
}
