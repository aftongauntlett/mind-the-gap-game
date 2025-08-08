/**
 * Game event types using discriminated unions for type safety.
 */
export type GameEvent =
  | { type: 'EPSP'; entityId: number; strength: number; timestamp: number }
  | { type: 'IPSP'; entityId: number; strength: number; timestamp: number }
  | { type: 'ACTION_POTENTIAL'; entityId: number; timestamp: number }
  | { type: 'ION_LOCKED'; ionId: number; targetId: number; timestamp: number }
  | { type: 'GATE_OPENED'; entityId: number; timestamp: number }
  | { type: 'GATE_CLOSED'; entityId: number; timestamp: number }
  | {
      type: 'ASTROCYTE_UPTAKE';
      ionId: number;
      position: { x: number; y: number };
      timestamp: number;
    }
  | {
      type: 'NARRATOR_SPEAK';
      text: string;
      duration: number;
      timestamp: number;
    };

/**
 * Event listener function type.
 */
type EventListener<T extends GameEvent = GameEvent> = (_event: T) => void;

/**
 * Typed event bus for game events.
 */
export class EventBus {
  private listeners = new Map<GameEvent['type'], EventListener[]>();

  /**
   * Subscribes to events of a specific type.
   */
  public on<T extends GameEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<GameEvent, { type: T }>>
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(listener as EventListener);
  }

  /**
   * Unsubscribes from events of a specific type.
   */
  public off<T extends GameEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<GameEvent, { type: T }>>
  ): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener as EventListener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emits an event to all subscribed listeners.
   */
  public emit<T extends GameEvent>(event: T): void {
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(event);
      }
    }
  }

  /**
   * Clears all event listeners.
   */
  public clear(): void {
    this.listeners.clear();
  }

  /**
   * Gets the count of listeners for a specific event type.
   */
  public getListenerCount(eventType: GameEvent['type']): number {
    return this.listeners.get(eventType)?.length ?? 0;
  }
}
