import type { EcsWorld } from '@core/ecs/ecs-world';
import { BaseSystem } from '@core/ecs/System';
import type { Body, GateState, Ion, Target } from '@game/components';
import { isAngleInGateWindow } from './gate-rotation-system';

/**
 * System that handles ion-target locking mechanics.
 */
export class LockingSystem extends BaseSystem {
  private readonly LOCK_DISTANCE = 30; // Maximum distance for locking

  public update(_deltaTime: number, world: EcsWorld): void {
    const ionEntities = world.getEntitiesWithComponents('Ion', 'Body');
    const targetEntities = world.getEntitiesWithComponents(
      'Target',
      'GateState',
      'Body'
    );

    for (const ionId of ionEntities) {
      const ion = world.getComponent<Ion>(ionId, 'Ion');
      const ionBody = world.getComponent<Body>(ionId, 'Body');

      if (!ion || !ionBody) continue;

      for (const targetId of targetEntities) {
        const target = world.getComponent<Target>(targetId, 'Target');
        const gateState = world.getComponent<GateState>(targetId, 'GateState');
        const targetBody = world.getComponent<Body>(targetId, 'Body');

        if (!target || !gateState || !targetBody) continue;

        // Skip if gate is closed
        if (!gateState.isOpen) continue;

        // Check distance
        const dx =
          ionBody.matterBody.position.x - targetBody.matterBody.position.x;
        const dy =
          ionBody.matterBody.position.y - targetBody.matterBody.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.LOCK_DISTANCE) continue;

        // Check if ion type matches target requirements
        if (!this.isIonCompatibleWithTarget(ion, target)) continue;

        // Calculate approach angle
        const approachAngle = Math.atan2(dy, dx);

        // Check if angle is within gate window
        if (!isAngleInGateWindow(approachAngle, target.openAngle, target.arc))
          continue;

        // Lock successful - emit events and update state
        this.handleSuccessfulLock(ionId, targetId, ion, target, world);
      }
    }
  }

  private isIonCompatibleWithTarget(ion: Ion, target: Target): boolean {
    const compatibilityMap = {
      AMPA: ['Na', 'K'], // Excitatory - sodium and potassium
      NMDA: ['Na', 'Ca'], // Excitatory - sodium and calcium
      GABAA: ['Cl'], // Inhibitory - chloride
      VGCC: ['Ca'], // Voltage-gated calcium channel
    };

    return compatibilityMap[target.kind]?.includes(ion.type) ?? false;
  }

  private handleSuccessfulLock(
    ionId: number,
    targetId: number,
    ion: Ion,
    target: Target,
    world: EcsWorld
  ): void {
    const currentTime = Date.now();

    // Update gate state
    const gateState = world.getComponent<GateState>(targetId, 'GateState');
    if (gateState) {
      gateState.isOpen = false;
      gateState.lastLockAt = currentTime;
    }

    // Emit locking event
    world.getEventBus().emit({
      type: 'ION_LOCKED',
      ionId,
      targetId,
      timestamp: currentTime,
    });

    // Emit appropriate synaptic event
    const isExcitatory =
      target.kind === 'AMPA' ||
      target.kind === 'NMDA' ||
      target.kind === 'VGCC';
    const strength = this.calculateSynapticStrength(ion, target);

    if (isExcitatory) {
      world.getEventBus().emit({
        type: 'EPSP',
        entityId: targetId,
        strength,
        timestamp: currentTime,
      });
    } else {
      world.getEventBus().emit({
        type: 'IPSP',
        entityId: targetId,
        strength,
        timestamp: currentTime,
      });
    }

    // Remove the ion (it has been consumed)
    world.destroyEntity(ionId);
  }

  private calculateSynapticStrength(ion: Ion, target: Target): number {
    // Base strength calculation based on ion charge and target type
    const baseStrength = Math.abs(ion.charge) * 0.1;

    // Target-specific multipliers
    const targetMultipliers = {
      AMPA: 1.0,
      NMDA: 1.5, // Stronger and longer lasting
      GABAA: 0.8,
      VGCC: 2.0, // Calcium channels have strong effects
    };

    return baseStrength * (targetMultipliers[target.kind] ?? 1.0);
  }
}
