/**
 * Design tokens for Synapse Sim neural network visualization.
 * All visual constants are centralized here to maintain consistency.
 */

/**
 * Color palette based on ionic and neural themes.
 */
export const COLORS = {
  // Background and neutrals
  BACKGROUND: 0x0a0a0a, // Near-black background
  SURFACE: 0x1a1a1a, // Slightly lighter surface
  NEUTRAL_DARK: 0x333333, // Dark neutral
  NEUTRAL_MID: 0x666666, // Mid neutral
  NEUTRAL_LIGHT: 0x999999, // Light neutral
  WHITE: 0xffffff, // Pure white

  // Ion colors based on real ionic properties
  ION_SODIUM: 0xff8c00, // Na⁺ - Orange (sodium flame test)
  ION_CALCIUM: 0xffc107, // Ca²⁺ - Amber (calcium flame test)
  ION_CHLORIDE: 0x007bff, // Cl⁻ - Blue (electronegative)
  ION_POTASSIUM: 0x6f42c1, // K⁺ - Violet (potassium flame test)

  // Neural activity colors
  EXCITATORY: 0x28a745, // Green for excitatory signals
  INHIBITORY: 0xdc3545, // Red for inhibitory signals

  // Glow and energy effects
  GLOW_SOFT: 0x4dabf7, // Soft blue glow
  GLOW_INTENSE: 0x00d4aa, // Intense cyan glow
  ENERGY_FLOW: 0xffeb3b, // Yellow energy flow

  // UI and interaction
  UI_PRIMARY: 0x007bff, // Primary UI blue
  UI_SUCCESS: 0x28a745, // Success green
  UI_WARNING: 0xffc107, // Warning amber
  UI_DANGER: 0xdc3545, // Danger red
} as const;

/**
 * Size constants for game objects and UI elements.
 */
export const SIZES = {
  // Ion radii (in pixels at base resolution)
  ION_RADIUS_SMALL: 4, // Small ions (Na⁺, Cl⁻)
  ION_RADIUS_MEDIUM: 6, // Medium ions (K⁺)
  ION_RADIUS_LARGE: 8, // Large ions (Ca²⁺)

  // Channel and membrane dimensions
  CHANNEL_WIDTH: 12, // Ion channel width
  CHANNEL_HEIGHT: 24, // Ion channel height
  MEMBRANE_THICKNESS: 4, // Cell membrane thickness

  // Target and interaction areas
  TARGET_RADIUS: 16, // Target hit radius
  INTERACTION_RADIUS: 32, // Interaction detection radius

  // Line widths (scaled for high DPI)
  LINE_THIN: 0.5, // Thin lines (membranes, guides)
  LINE_MEDIUM: 1.0, // Medium lines (connections)
  LINE_THICK: 2.0, // Thick lines (active paths)
  LINE_GLOW: 4.0, // Glow effect width

  // UI elements
  UI_BUTTON_HEIGHT: 40, // Standard button height
  UI_PADDING_SMALL: 8, // Small padding
  UI_PADDING_MEDIUM: 16, // Medium padding
  UI_PADDING_LARGE: 24, // Large padding
} as const;

/**
 * Timing constants for animations and game mechanics.
 */
export const TIMINGS = {
  // Breathing and oscillation animations (in milliseconds)
  BREATHING_SLOW: 3000, // Slow breathing cycle
  BREATHING_MEDIUM: 2000, // Medium breathing cycle
  BREATHING_FAST: 1000, // Fast breathing cycle

  // Gate and channel animations
  GATE_ROTATION_SLOW: 2000, // Slow gate rotation
  GATE_ROTATION_MEDIUM: 1500, // Medium gate rotation
  GATE_ROTATION_FAST: 1000, // Fast gate rotation

  // Neural signal timings
  EPSP_DECAY: 500, // Excitatory post-synaptic potential decay
  IPSP_DECAY: 800, // Inhibitory post-synaptic potential decay
  ACTION_POTENTIAL: 200, // Action potential duration

  // Particle and flow animations
  ION_FLOW_SPEED: 100, // Ion movement speed (pixels/second)
  GLOW_PULSE: 1500, // Glow pulsing cycle
  ENERGY_WAVE: 300, // Energy wave propagation

  // UI animations
  UI_TRANSITION_FAST: 150, // Fast UI transitions
  UI_TRANSITION_MEDIUM: 300, // Medium UI transitions
  UI_TRANSITION_SLOW: 500, // Slow UI transitions
} as const;

/**
 * Z-layer constants for rendering order.
 * Higher values render on top.
 */
export const Z_LAYERS = {
  BACKGROUND: 0, // Background elements
  MEMBRANE: 10, // Cell membranes
  CHANNELS: 20, // Ion channels
  IONS: 30, // Ion particles
  SIGNALS: 40, // Neural signals
  EFFECTS: 50, // Visual effects and glows
  UI_BACKGROUND: 60, // UI background elements
  UI_CONTENT: 70, // UI content
  UI_OVERLAY: 80, // UI overlays and modals
  DEBUG: 90, // Debug overlays
} as const;

/**
 * Complete theme object containing all design tokens.
 */
export const THEME = {
  colors: COLORS,
  sizes: SIZES,
  timings: TIMINGS,
  zLayers: Z_LAYERS,
} as const;

/**
 * Theme type for TypeScript inference.
 */
export type Theme = typeof THEME;

/**
 * Utility to get resolution-scaled sizes based on device pixel ratio.
 */
export function getScaledSize(baseSize: number, pixelRatio = 1): number {
  return Math.max(0.5, baseSize * pixelRatio);
}

/**
 * Utility to convert hex colors to RGB components.
 */
export function hexToRgb(hex: number): { r: number; g: number; b: number } {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
  };
}

/**
 * Utility to create RGBA color strings for CSS/Canvas usage.
 */
export function hexToRgba(hex: number, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
