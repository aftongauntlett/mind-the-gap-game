import type { EntityId } from './Entity';

/**
 * Base component interface for ECS architecture.
 * All components must implement this interface.
 */
export interface Component {
  readonly entityId: EntityId;
}

/**
 * Component type registry for type-safe component management.
 */
export type ComponentType<T extends Component = Component> = new (
  _entityId: EntityId,
  ..._args: unknown[]
) => T;

/**
 * Abstract base class for components.
 */
export abstract class BaseComponent implements Component {
  constructor(public readonly entityId: EntityId) {
    // EntityId is stored as a public readonly property for component identification
    void entityId; // Explicitly mark as used to satisfy linter
  }
}
