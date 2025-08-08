import { useTheme } from '@game/theme';
import Phaser from 'phaser';

/**
 * Main game scene with Matter.js physics enabled.
 * Demonstrates usage of theme tokens for consistent styling.
 */
export class MainScene extends Phaser.Scene {
  private theme = useTheme();

  constructor() {
    super({ key: 'MainScene' });
  }

  public create(): void {
    // Scene is ready with black background and Matter.js physics
    console.log('Synapse Sim initialized with Matter.js physics');

    // Add a simple white circle to test rendering (using theme tokens)
    this.add.circle(
      512,
      384,
      this.theme.sizes.ION_RADIUS_LARGE * 6,
      this.theme.colors.WHITE
    );

    // Add text to confirm the scene is working (using theme colors)
    this.add.text(400, 300, 'Synapse Sim', {
      fontSize: '32px',
      color: `#${this.theme.colors.WHITE.toString(16).padStart(6, '0')}`,
    });

    // Test Matter.js physics with a simple physics body
    if (this.matter && this.matter.world) {
      this.matter.add.rectangle(512, 200, 100, 100);
      console.log('Matter.js physics body added');
    }

    // Add ion visualization using theme colors
    this.createIonDemonstration();
  }

  /**
   * Creates a demonstration of different ion types using theme colors.
   */
  private createIonDemonstration(): void {
    const centerX = 512;
    const centerY = 500;
    const spacing = 100;

    // Create different ion types with their characteristic colors
    const ions = [
      {
        name: 'Na⁺',
        color: this.theme.colors.ION_SODIUM,
        x: centerX - spacing * 1.5,
      },
      {
        name: 'Ca²⁺',
        color: this.theme.colors.ION_CALCIUM,
        x: centerX - spacing * 0.5,
      },
      {
        name: 'Cl⁻',
        color: this.theme.colors.ION_CHLORIDE,
        x: centerX + spacing * 0.5,
      },
      {
        name: 'K⁺',
        color: this.theme.colors.ION_POTASSIUM,
        x: centerX + spacing * 1.5,
      },
    ];

    ions.forEach((ion) => {
      // Create ion circle
      this.add
        .circle(ion.x, centerY, this.theme.sizes.ION_RADIUS_MEDIUM, ion.color)
        .setDepth(this.theme.zLayers.IONS);

      // Create glow effect
      this.add
        .circle(
          ion.x,
          centerY,
          this.theme.sizes.ION_RADIUS_MEDIUM * 2,
          ion.color
        )
        .setAlpha(0.3)
        .setDepth(this.theme.zLayers.EFFECTS);

      // Add ion label
      this.add
        .text(ion.x, centerY + 30, ion.name, {
          fontSize: '14px',
          color: `#${this.theme.colors.NEUTRAL_LIGHT.toString(16).padStart(6, '0')}`,
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(this.theme.zLayers.UI_CONTENT);
    });
  }

  public update(_time: number, _delta: number): void {
    // Game loop updates go here
  }
}
