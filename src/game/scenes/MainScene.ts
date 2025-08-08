import Phaser from 'phaser';

/**
 * Main game scene with Matter.js physics enabled.
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  public create(): void {
    // Scene is ready with black background and Matter.js physics
    console.log('Synapse Sim initialized with Matter.js physics');

    // Add a simple white circle to test rendering
    this.add.circle(512, 384, 50, 0xffffff);

    // Add text to confirm the scene is working
    this.add.text(400, 300, 'Synapse Sim', {
      fontSize: '32px',
      color: '#ffffff',
    });

    // Test Matter.js physics with a simple physics body (red rectangle)
    if (this.matter && this.matter.world) {
      this.matter.add.rectangle(512, 200, 100, 100);
      console.log('Matter.js physics body added');
    }

    // Add a red rectangle using Phaser graphics for visibility
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(462, 150, 100, 100);
  }

  public update(_time: number, _delta: number): void {
    // Game loop updates go here
  }
}
