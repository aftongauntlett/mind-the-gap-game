import Phaser from 'phaser';
import { createGameConfig } from './GameConfig';

/**
 * Initialize and start the Synapse Sim game.
 */
function startGame(): void {
  const config = createGameConfig();

  // Create and start the Phaser game
  new Phaser.Game(config);
}

// Start the game when the DOM is ready
document.addEventListener('DOMContentLoaded', startGame);
