import type { EcsWorld } from '@core/ecs/ecs-world';
import { BaseSystem } from '@core/ecs/System';
import type { GateState, Target } from '@game/components';

/**
 * System that handles gate rotation and opening/closing mechanics.
 */
export class GateRotationSystem extends BaseSystem {
  public update(deltaTime: number, world: EcsWorld): void {
    const gateEntities = world.getEntitiesWithComponents('Target', 'GateState');

    for (const entityId of gateEntities) {
      const target = world.getComponent<Target>(entityId, 'Target');
      const gateState = world.getComponent<GateState>(entityId, 'GateState');

      if (!target || !gateState) continue;

      const currentTime = Date.now();
      const timeSinceLastLock = currentTime - gateState.lastLockAt;

      // Check if gate should open (cooldown period passed)
      const shouldOpen = timeSinceLastLock > target.cooldownMs;

      if (shouldOpen && !gateState.isOpen) {
        gateState.isOpen = true;
        world.getEventBus().emit({
          type: 'GATE_OPENED',
          entityId,
          timestamp: currentTime,
        });
      }

      // Update gate angle based on rotation speed
      const rotationSpeed = target.gateSpeed * (deltaTime / 1000);
      target.openAngle = (target.openAngle + rotationSpeed) % (Math.PI * 2);
    }
  }
}

/**
 * Utility function to check if an angle is within the gate's acceptance window.
 */
export function isAngleInGateWindow(
  ionAngle: number,
  gateAngle: number,
  gateArc: number
): boolean {
  // Normalize angles to [0, 2π]
  const normalizeAngle = (angle: number): number => {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  };

  const normalizedIonAngle = normalizeAngle(ionAngle);
  const normalizedGateAngle = normalizeAngle(gateAngle);

  const halfArc = gateArc / 2;
  const minAngle = normalizeAngle(normalizedGateAngle - halfArc);
  const maxAngle = normalizeAngle(normalizedGateAngle + halfArc);

  // Handle wraparound case
  if (minAngle > maxAngle) {
    return normalizedIonAngle >= minAngle || normalizedIonAngle <= maxAngle;
  }

  return normalizedIonAngle >= minAngle && normalizedIonAngle <= maxAngle;
}
