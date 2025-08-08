import { EcsWorld } from '@core/ecs/ecs-world';
import type {
  Body,
  GateState,
  Ion,
  Potential,
  Renderable,
  Target,
} from '@game/components';
import { CursorFieldSystem } from '@game/systems/cursor-field-system';
import { GateRotationSystem } from '@game/systems/gate-rotation-system';
import { IntegrationSystem } from '@game/systems/integration-system';
import { LockingSystem } from '@game/systems/locking-system';
import { THEME } from '@game/theme';
import Phaser from 'phaser';

/**
 * Main play scene that integrates the ECS with Phaser.
 */
export class PlayScene extends Phaser.Scene {
  private ecsWorld!: EcsWorld;
  private graphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PlayScene' });
  }

  public create(): void {
    console.log('PlayScene: Initializing ECS world');

    this.setupECS();
    this.setupGraphics();
    this.createTestEntities();
    this.setupEventListeners();
  }

  private setupECS(): void {
    this.ecsWorld = new EcsWorld();

    // Add systems to the world
    this.ecsWorld.addSystem(new CursorFieldSystem(this));
    this.ecsWorld.addSystem(new GateRotationSystem());
    this.ecsWorld.addSystem(new LockingSystem());
    this.ecsWorld.addSystem(new IntegrationSystem());

    console.log('PlayScene: ECS systems initialized');
  }

  private setupGraphics(): void {
    this.graphics = this.add.graphics();

    // Set background color from theme
    this.cameras.main.setBackgroundColor(THEME.colors.BACKGROUND);
  }

  private createTestEntities(): void {
    // Create a test sodium ion
    const ionEntity = this.ecsWorld.createEntity();

    // Create Matter.js body for the ion
    const ionBody = this.matter.add.circle(
      200,
      200,
      THEME.sizes.ION_RADIUS_SMALL,
      {
        frictionAir: 0.01,
        restitution: 0.8,
      }
    );

    this.ecsWorld.addComponent<Ion>(ionEntity, 'Ion', {
      type: 'Na',
      charge: 1,
      mass: 23,
    });

    this.ecsWorld.addComponent<Body>(ionEntity, 'Body', {
      matterBody: ionBody as unknown as import('matter-js').Body,
    });

    this.ecsWorld.addComponent<Renderable>(ionEntity, 'Renderable', {
      layer: 'ions',
    });

    // Create a test AMPA receptor
    const targetEntity = this.ecsWorld.createEntity();

    const targetBody = this.matter.add.rectangle(
      400,
      300,
      THEME.sizes.CHANNEL_WIDTH,
      THEME.sizes.CHANNEL_HEIGHT,
      {
        isStatic: true,
      }
    );

    this.ecsWorld.addComponent<Target>(targetEntity, 'Target', {
      kind: 'AMPA',
      gateSpeed: Math.PI / 2, // 90 degrees per second
      arc: Math.PI / 3, // 60 degree acceptance window
      openAngle: 0,
      cooldownMs: 2000,
    });

    this.ecsWorld.addComponent<GateState>(targetEntity, 'GateState', {
      isOpen: true,
      lastLockAt: 0,
    });

    this.ecsWorld.addComponent<Body>(targetEntity, 'Body', {
      matterBody: targetBody as unknown as import('matter-js').Body,
    });

    this.ecsWorld.addComponent<Potential>(targetEntity, 'Potential', {
      vm: -70, // Resting potential
      vrest: -70,
      threshold: -55,
    });

    this.ecsWorld.addComponent<Renderable>(targetEntity, 'Renderable', {
      layer: 'targets',
    });

    console.log('PlayScene: Test entities created');
  }

  private setupEventListeners(): void {
    const eventBus = this.ecsWorld.getEventBus();

    eventBus.on('ION_LOCKED', (event) => {
      console.log(`Ion ${event.ionId} locked to target ${event.targetId}`);
    });

    eventBus.on('ACTION_POTENTIAL', (event) => {
      console.log(`Action potential triggered on entity ${event.entityId}`);
    });

    eventBus.on('GATE_OPENED', (event) => {
      console.log(`Gate opened on entity ${event.entityId}`);
    });
  }

  public update(_time: number, delta: number): void {
    // Update ECS world
    this.ecsWorld.update(delta);

    // Render entities
    this.renderEntities();
  }

  private renderEntities(): void {
    this.graphics.clear();

    // Render ions
    const ionEntities = this.ecsWorld.getEntitiesWithComponents(
      'Ion',
      'Body',
      'Renderable'
    );
    for (const entityId of ionEntities) {
      const ion = this.ecsWorld.getComponent<Ion>(entityId, 'Ion');
      const body = this.ecsWorld.getComponent<Body>(entityId, 'Body');
      const renderable = this.ecsWorld.getComponent<Renderable>(
        entityId,
        'Renderable'
      );

      if (!ion || !body || !renderable || renderable.layer !== 'ions') continue;

      const color = this.getIonColor(ion.type);
      const position = body.matterBody.position;
      const radius = this.getIonRadius(ion.type);

      this.graphics.fillStyle(color);
      this.graphics.fillCircle(position.x, position.y, radius);
    }

    // Render targets
    const targetEntities = this.ecsWorld.getEntitiesWithComponents(
      'Target',
      'GateState',
      'Body',
      'Renderable'
    );
    for (const entityId of targetEntities) {
      const target = this.ecsWorld.getComponent<Target>(entityId, 'Target');
      const gateState = this.ecsWorld.getComponent<GateState>(
        entityId,
        'GateState'
      );
      const body = this.ecsWorld.getComponent<Body>(entityId, 'Body');
      const renderable = this.ecsWorld.getComponent<Renderable>(
        entityId,
        'Renderable'
      );

      if (
        !target ||
        !gateState ||
        !body ||
        !renderable ||
        renderable.layer !== 'targets'
      )
        continue;

      const position = body.matterBody.position;
      const color = gateState.isOpen
        ? THEME.colors.UI_SUCCESS
        : THEME.colors.UI_DANGER;

      this.graphics.fillStyle(color);
      this.graphics.fillRect(
        position.x - THEME.sizes.CHANNEL_WIDTH / 2,
        position.y - THEME.sizes.CHANNEL_HEIGHT / 2,
        THEME.sizes.CHANNEL_WIDTH,
        THEME.sizes.CHANNEL_HEIGHT
      );

      // Draw gate opening indicator
      if (gateState.isOpen) {
        this.graphics.lineStyle(2, THEME.colors.GLOW_INTENSE);
        const startAngle = target.openAngle - target.arc / 2;
        const endAngle = target.openAngle + target.arc / 2;
        this.graphics.arc(position.x, position.y, 30, startAngle, endAngle);
        this.graphics.strokePath();
      }
    }
  }

  private getIonColor(ionType: Ion['type']): number {
    const colorMap = {
      Na: THEME.colors.ION_SODIUM,
      Ca: THEME.colors.ION_CALCIUM,
      Cl: THEME.colors.ION_CHLORIDE,
      K: THEME.colors.ION_POTASSIUM,
    };
    return colorMap[ionType];
  }

  private getIonRadius(ionType: Ion['type']): number {
    const sizeMap = {
      Na: THEME.sizes.ION_RADIUS_SMALL,
      Ca: THEME.sizes.ION_RADIUS_LARGE,
      Cl: THEME.sizes.ION_RADIUS_SMALL,
      K: THEME.sizes.ION_RADIUS_MEDIUM,
    };
    return sizeMap[ionType];
  }

  public destroy(): void {
    this.ecsWorld.clear();
    // Phaser Scene cleanup happens automatically
  }
}
