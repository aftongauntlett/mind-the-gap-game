import { MainScene } from '@game/scenes/MainScene';
import Phaser from 'phaser';

/**
 * Game configuration constants.
 */
export const GAME_CONFIG = {
  WIDTH: 1024,
  HEIGHT: 768,
  BACKGROUND_COLOR: 0x000000,
  PHYSICS_DEBUG: false,
} as const;

/**
 * Creates the Phaser game configuration with Matter.js physics enabled.
 */
export function createGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
    physics: {
      default: 'matter',
      matter: {
        gravity: { x: 0, y: 0.8 },
        debug: GAME_CONFIG.PHYSICS_DEBUG,
        enableSleeping: true,
      },
    },
    scene: [MainScene],
  };
}
