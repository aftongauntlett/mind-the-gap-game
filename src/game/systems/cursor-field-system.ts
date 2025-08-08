import type { EcsWorld } from '@core/ecs/ecs-world';
import { BaseSystem } from '@core/ecs/System';
import type { Body, Ion } from '@game/components';
import * as Matter from 'matter-js';
import Phaser from 'phaser';

/**
 * System that applies forces to ions based on cursor polarity.
 */
export class CursorFieldSystem extends BaseSystem {
  private scene: Phaser.Scene;
  private polarity = 1; // 1 for positive, -1 for negative

  constructor(scene: Phaser.Scene) {
    super();
    this.scene = scene;
    this.setupInput();
  }

  private setupInput(): void {
    this.scene.input.on('pointerdown', () => {
      this.polarity *= -1; // Toggle polarity on click
    });
  }

  public update(_deltaTime: number, world: EcsWorld): void {
    const pointer = this.scene.input.activePointer;
    const cursorX = pointer.x;
    const cursorY = pointer.y;

    // Get all entities with Ion and Body components
    const ionEntities = world.getEntitiesWithComponents('Ion', 'Body');

    for (const entityId of ionEntities) {
      const ion = world.getComponent<Ion>(entityId, 'Ion');
      const body = world.getComponent<Body>(entityId, 'Body');

      if (!ion || !body) continue;

      const matterBody = body.matterBody;
      const dx = cursorX - matterBody.position.x;
      const dy = cursorY - matterBody.position.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared === 0) continue;

      const distance = Math.sqrt(distanceSquared);
      const maxDistance = 200; // Maximum influence distance

      if (distance > maxDistance) continue;

      // Force calculation: F = k * q1 * q2 / r^2
      // Simplified for gameplay: force magnitude based on charge and polarity
      const forceMagnitude =
        (ion.charge * this.polarity * 0.001) / distanceSquared;
      const forceX = (dx / distance) * forceMagnitude;
      const forceY = (dy / distance) * forceMagnitude;

      // Apply force to Matter.js body
      if (this.scene.matter && this.scene.matter.world) {
        this.scene.matter.world.engine.world.gravity.scale = 0; // Disable gravity for ions
        Matter.Body.applyForce(matterBody, matterBody.position, {
          x: forceX,
          y: forceY,
        });
      }
    }
  }

  public destroy(): void {
    // Clean up input listeners if needed
  }
}
