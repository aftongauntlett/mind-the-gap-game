import type { EcsWorld } from '@core/ecs/ecs-world';
import { BaseSystem } from '@core/ecs/System';
import type { Potential } from '@game/components';

/**
 * Synaptic event for integration.
 */
interface SynapticEvent {
  strength: number;
  timestamp: number;
  decayConstant: number;
}

/**
 * System that integrates synaptic inputs and generates action potentials.
 */
export class IntegrationSystem extends BaseSystem {
  private synapticEvents = new Map<number, SynapticEvent[]>();
  private readonly TAU_EPSP = 500; // EPSP decay time constant (ms)
  private readonly TAU_IPSP = 800; // IPSP decay time constant (ms)

  public update(_deltaTime: number, world: EcsWorld): void {
    const potentialEntities = world.getEntitiesWithComponents('Potential');
    const currentTime = Date.now();

    // Listen for synaptic events
    this.setupEventListeners(world);

    for (const entityId of potentialEntities) {
      const potential = world.getComponent<Potential>(entityId, 'Potential');
      if (!potential) continue;

      // Exponential decay toward resting potential
      const decayRate = 0.01; // Decay rate per millisecond
      potential.vm += (potential.vrest - potential.vm) * decayRate;

      // Process synaptic events
      const events = this.synapticEvents.get(entityId) ?? [];
      const activeEvents: SynapticEvent[] = [];

      for (const event of events) {
        const age = currentTime - event.timestamp;
        const decayedStrength =
          event.strength * Math.exp(-age / event.decayConstant);

        // Remove events that have decayed below threshold
        if (decayedStrength > 0.001) {
          potential.vm += decayedStrength * 0.001; // Scale for gameplay
          activeEvents.push(event);
        }
      }

      // Update events list
      this.synapticEvents.set(entityId, activeEvents);

      // Check for action potential threshold
      if (potential.vm >= potential.threshold) {
        this.triggerActionPotential(entityId, world);
        potential.vm = potential.vrest; // Reset after spike
      }

      // Clamp membrane potential to reasonable bounds
      potential.vm = Math.max(-100, Math.min(50, potential.vm));
    }
  }

  private setupEventListeners(world: EcsWorld): void {
    const eventBus = world.getEventBus();

    // Clear existing listeners to avoid duplicates
    eventBus.off('EPSP', this.handleEPSP.bind(this));
    eventBus.off('IPSP', this.handleIPSP.bind(this));

    // Add listeners
    eventBus.on('EPSP', this.handleEPSP.bind(this));
    eventBus.on('IPSP', this.handleIPSP.bind(this));
  }

  private handleEPSP(event: {
    entityId: number;
    strength: number;
    timestamp: number;
  }): void {
    this.addSynapticEvent(event.entityId, {
      strength: event.strength,
      timestamp: event.timestamp,
      decayConstant: this.TAU_EPSP,
    });
  }

  private handleIPSP(event: {
    entityId: number;
    strength: number;
    timestamp: number;
  }): void {
    this.addSynapticEvent(event.entityId, {
      strength: -event.strength, // Negative for inhibition
      timestamp: event.timestamp,
      decayConstant: this.TAU_IPSP,
    });
  }

  private addSynapticEvent(entityId: number, event: SynapticEvent): void {
    if (!this.synapticEvents.has(entityId)) {
      this.synapticEvents.set(entityId, []);
    }
    this.synapticEvents.get(entityId)?.push(event);
  }

  private triggerActionPotential(entityId: number, world: EcsWorld): void {
    world.getEventBus().emit({
      type: 'ACTION_POTENTIAL',
      entityId,
      timestamp: Date.now(),
    });
  }

  public destroy(): void {
    this.synapticEvents.clear();
  }
}
