import type { Body as MatterBody } from 'matter-js';

/**
 * Ion component representing charged particles.
 */
export interface Ion {
  type: 'Na' | 'Ca' | 'Cl' | 'K';
  charge: number;
  mass: number;
}

/**
 * Physics body component wrapping Matter.js Body.
 */
export interface Body {
  matterBody: MatterBody;
}

/**
 * Target component for ion channels and receptors.
 */
export interface Target {
  kind: 'AMPA' | 'NMDA' | 'GABAA' | 'VGCC';
  gateSpeed: number;
  arc: number;
  openAngle: number;
  cooldownMs: number;
}

/**
 * Gate state component tracking open/closed status.
 */
export interface GateState {
  isOpen: boolean;
  lastLockAt: number;
}

/**
 * Membrane potential component for neural integration.
 */
export interface Potential {
  vm: number;
  vrest: number;
  threshold: number;
}

/**
 * Spline edge component for signal propagation paths.
 */
export interface SplineEdge {
  points: Array<{ x: number; y: number }>;
}

/**
 * Renderable component for layer-based rendering.
 */
export interface Renderable {
  layer: 'lines' | 'ions' | 'targets' | 'fx';
}

/**
 * Breathing animation component for pulsing effects.
 */
export interface Breathing {
  min: number;
  max: number;
  periodMs: number;
}
