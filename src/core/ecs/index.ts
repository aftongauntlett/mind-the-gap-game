/**
 * Core ECS exports for the game engine.
 */
export { ComponentStore } from './component-store';
export { EcsWorld } from './ecs-world';
export { EntityManager, type EntityId } from './entity-manager';
export { EventBus, type GameEvent } from './event-bus';
export { BaseSystem, type System } from './System';

// Legacy exports for compatibility
export { BaseComponent, type Component, type ComponentType } from './Component';
export { Entity } from './Entity';
export { World } from './World';
