import { Entity } from '@core/ecs/Entity';
import { describe, expect, it } from 'vitest';

describe('Entity', () => {
  it('should create entity with unique id', () => {
    const entity1 = Entity.create();
    const entity2 = Entity.create();

    expect(entity1.id).toBeDefined();
    expect(entity2.id).toBeDefined();
    expect(entity1.id).not.toBe(entity2.id);
  });

  it('should increment ids sequentially', () => {
    const entity1 = Entity.create();
    const entity2 = Entity.create();

    expect(entity2.id).toBe(entity1.id + 1);
  });
});
