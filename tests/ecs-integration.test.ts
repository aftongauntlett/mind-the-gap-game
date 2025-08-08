import { EcsWorld } from '@core/ecs/ecs-world';
import { BaseSystem } from '@core/ecs/System';
import type { Body, Ion } from '@game/components';
import { beforeEach, describe, expect, it } from 'vitest';

// Mock Matter.js Body for testing
const createMockBody = () =>
  ({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    angle: 0,
  }) as unknown as import('matter-js').Body;

class TestSystem extends BaseSystem {
  public updateCount = 0;

  public update(_deltaTime: number, _world: EcsWorld): void {
    this.updateCount++;
  }
}

describe('ECS Integration', () => {
  let world: EcsWorld;
  let testSystem: TestSystem;

  beforeEach(() => {
    world = new EcsWorld();
    testSystem = new TestSystem();
  });

  it('should create and manage entities', () => {
    const entity1 = world.createEntity();
    const entity2 = world.createEntity();

    expect(entity1).toBeTypeOf('number');
    expect(entity2).toBeTypeOf('number');
    expect(entity1).not.toBe(entity2);
    expect(world.getEntityCount()).toBe(2);
  });

  it('should add and retrieve components', () => {
    const entity = world.createEntity();

    const ionComponent: Ion = {
      type: 'Na',
      charge: 1,
      mass: 23,
    };

    world.addComponent(entity, 'Ion', ionComponent);

    const retrievedIon = world.getComponent<Ion>(entity, 'Ion');
    expect(retrievedIon).toEqual(ionComponent);
    expect(world.hasComponent(entity, 'Ion')).toBe(true);
  });

  it('should query entities with components', () => {
    const entity1 = world.createEntity();
    const entity2 = world.createEntity();
    const entity3 = world.createEntity();

    // Entity 1: Ion only
    world.addComponent<Ion>(entity1, 'Ion', {
      type: 'Na',
      charge: 1,
      mass: 23,
    });

    // Entity 2: Ion and Body
    world.addComponent<Ion>(entity2, 'Ion', {
      type: 'Ca',
      charge: 2,
      mass: 40,
    });
    world.addComponent<Body>(entity2, 'Body', { matterBody: createMockBody() });

    // Entity 3: Body only
    world.addComponent<Body>(entity3, 'Body', { matterBody: createMockBody() });

    const ionEntities = world.getEntitiesWithComponents('Ion');
    const bodyEntities = world.getEntitiesWithComponents('Body');
    const ionAndBodyEntities = world.getEntitiesWithComponents('Ion', 'Body');

    expect(ionEntities).toHaveLength(2);
    expect(ionEntities).toContain(entity1);
    expect(ionEntities).toContain(entity2);

    expect(bodyEntities).toHaveLength(2);
    expect(bodyEntities).toContain(entity2);
    expect(bodyEntities).toContain(entity3);

    expect(ionAndBodyEntities).toHaveLength(1);
    expect(ionAndBodyEntities).toContain(entity2);
  });

  it('should manage systems', () => {
    world.addSystem(testSystem);

    expect(testSystem.updateCount).toBe(0);

    world.update(16); // 16ms delta
    expect(testSystem.updateCount).toBe(1);

    world.update(16);
    expect(testSystem.updateCount).toBe(2);
  });

  it('should handle events', () => {
    const eventBus = world.getEventBus();
    let receivedEvent: {
      type: 'ION_LOCKED';
      ionId: number;
      targetId: number;
      timestamp: number;
    } | null = null;

    eventBus.on('ION_LOCKED', (event) => {
      receivedEvent = event;
    });

    const testEvent = {
      type: 'ION_LOCKED' as const,
      ionId: 1,
      targetId: 2,
      timestamp: Date.now(),
    };

    eventBus.emit(testEvent);
    expect(receivedEvent).toEqual(testEvent);
  });

  it('should destroy entities and clean up components', () => {
    const entity = world.createEntity();

    world.addComponent<Ion>(entity, 'Ion', { type: 'Na', charge: 1, mass: 23 });
    world.addComponent<Body>(entity, 'Body', { matterBody: createMockBody() });

    expect(world.hasComponent(entity, 'Ion')).toBe(true);
    expect(world.hasComponent(entity, 'Body')).toBe(true);

    world.destroyEntity(entity);

    expect(world.hasComponent(entity, 'Ion')).toBe(false);
    expect(world.hasComponent(entity, 'Body')).toBe(false);
    expect(world.getEntityCount()).toBe(0);
  });
});
