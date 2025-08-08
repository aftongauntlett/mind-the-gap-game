import {
  COLORS,
  SIZES,
  THEME,
  TIMINGS,
  Z_LAYERS,
  getScaledSize,
  hexToRgb,
  hexToRgba,
} from '@game/theme/tokens';
import { describe, expect, it } from 'vitest';

describe('Design Tokens', () => {
  describe('Theme Structure', () => {
    it('should have all required theme sections', () => {
      expect(THEME).toHaveProperty('colors');
      expect(THEME).toHaveProperty('sizes');
      expect(THEME).toHaveProperty('timings');
      expect(THEME).toHaveProperty('zLayers');
    });

    it('should export individual token sections', () => {
      expect(COLORS).toBeDefined();
      expect(SIZES).toBeDefined();
      expect(TIMINGS).toBeDefined();
      expect(Z_LAYERS).toBeDefined();
    });
  });

  describe('Color Tokens', () => {
    it('should have all required color categories', () => {
      // Background and neutrals
      expect(COLORS).toHaveProperty('BACKGROUND');
      expect(COLORS).toHaveProperty('SURFACE');
      expect(COLORS).toHaveProperty('WHITE');

      // Ion colors
      expect(COLORS).toHaveProperty('ION_SODIUM');
      expect(COLORS).toHaveProperty('ION_CALCIUM');
      expect(COLORS).toHaveProperty('ION_CHLORIDE');
      expect(COLORS).toHaveProperty('ION_POTASSIUM');

      // Neural activity
      expect(COLORS).toHaveProperty('EXCITATORY');
      expect(COLORS).toHaveProperty('INHIBITORY');

      // Glow effects
      expect(COLORS).toHaveProperty('GLOW_SOFT');
      expect(COLORS).toHaveProperty('GLOW_INTENSE');
    });

    it('should have valid hex color values', () => {
      Object.values(COLORS).forEach((color) => {
        expect(typeof color).toBe('number');
        expect(color).toBeGreaterThanOrEqual(0x000000);
        expect(color).toBeLessThanOrEqual(0xffffff);
      });
    });
  });

  describe('Size Tokens', () => {
    it('should have all required size categories', () => {
      // Ion radii
      expect(SIZES).toHaveProperty('ION_RADIUS_SMALL');
      expect(SIZES).toHaveProperty('ION_RADIUS_MEDIUM');
      expect(SIZES).toHaveProperty('ION_RADIUS_LARGE');

      // Line widths
      expect(SIZES).toHaveProperty('LINE_THIN');
      expect(SIZES).toHaveProperty('LINE_MEDIUM');
      expect(SIZES).toHaveProperty('LINE_THICK');

      // UI elements
      expect(SIZES).toHaveProperty('UI_BUTTON_HEIGHT');
      expect(SIZES).toHaveProperty('UI_PADDING_SMALL');
    });

    it('should have positive size values', () => {
      Object.values(SIZES).forEach((size) => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });

    it('should have logical size relationships', () => {
      // Ion radii should be in ascending order
      expect(SIZES.ION_RADIUS_SMALL).toBeLessThan(SIZES.ION_RADIUS_MEDIUM);
      expect(SIZES.ION_RADIUS_MEDIUM).toBeLessThan(SIZES.ION_RADIUS_LARGE);

      // Line widths should be in ascending order
      expect(SIZES.LINE_THIN).toBeLessThan(SIZES.LINE_MEDIUM);
      expect(SIZES.LINE_MEDIUM).toBeLessThan(SIZES.LINE_THICK);

      // Padding should be in ascending order
      expect(SIZES.UI_PADDING_SMALL).toBeLessThan(SIZES.UI_PADDING_MEDIUM);
      expect(SIZES.UI_PADDING_MEDIUM).toBeLessThan(SIZES.UI_PADDING_LARGE);
    });
  });

  describe('Timing Tokens', () => {
    it('should have all required timing categories', () => {
      // Breathing animations
      expect(TIMINGS).toHaveProperty('BREATHING_SLOW');
      expect(TIMINGS).toHaveProperty('BREATHING_MEDIUM');
      expect(TIMINGS).toHaveProperty('BREATHING_FAST');

      // Gate animations
      expect(TIMINGS).toHaveProperty('GATE_ROTATION_SLOW');
      expect(TIMINGS).toHaveProperty('GATE_ROTATION_MEDIUM');
      expect(TIMINGS).toHaveProperty('GATE_ROTATION_FAST');

      // Neural signals
      expect(TIMINGS).toHaveProperty('EPSP_DECAY');
      expect(TIMINGS).toHaveProperty('IPSP_DECAY');
      expect(TIMINGS).toHaveProperty('ACTION_POTENTIAL');
    });

    it('should have positive timing values', () => {
      Object.values(TIMINGS).forEach((timing) => {
        expect(typeof timing).toBe('number');
        expect(timing).toBeGreaterThan(0);
      });
    });

    it('should have logical timing relationships', () => {
      // Breathing should be in descending order (slow > medium > fast)
      expect(TIMINGS.BREATHING_SLOW).toBeGreaterThan(TIMINGS.BREATHING_MEDIUM);
      expect(TIMINGS.BREATHING_MEDIUM).toBeGreaterThan(TIMINGS.BREATHING_FAST);

      // Gate rotation should be in descending order
      expect(TIMINGS.GATE_ROTATION_SLOW).toBeGreaterThan(
        TIMINGS.GATE_ROTATION_MEDIUM
      );
      expect(TIMINGS.GATE_ROTATION_MEDIUM).toBeGreaterThan(
        TIMINGS.GATE_ROTATION_FAST
      );

      // UI transitions should be in ascending order
      expect(TIMINGS.UI_TRANSITION_FAST).toBeLessThan(
        TIMINGS.UI_TRANSITION_MEDIUM
      );
      expect(TIMINGS.UI_TRANSITION_MEDIUM).toBeLessThan(
        TIMINGS.UI_TRANSITION_SLOW
      );
    });
  });

  describe('Z-Layer Tokens', () => {
    it('should have all required z-layer categories', () => {
      expect(Z_LAYERS).toHaveProperty('BACKGROUND');
      expect(Z_LAYERS).toHaveProperty('MEMBRANE');
      expect(Z_LAYERS).toHaveProperty('CHANNELS');
      expect(Z_LAYERS).toHaveProperty('IONS');
      expect(Z_LAYERS).toHaveProperty('SIGNALS');
      expect(Z_LAYERS).toHaveProperty('EFFECTS');
      expect(Z_LAYERS).toHaveProperty('UI_BACKGROUND');
      expect(Z_LAYERS).toHaveProperty('UI_CONTENT');
      expect(Z_LAYERS).toHaveProperty('UI_OVERLAY');
      expect(Z_LAYERS).toHaveProperty('DEBUG');
    });

    it('should have non-negative z-layer values', () => {
      Object.values(Z_LAYERS).forEach((layer) => {
        expect(typeof layer).toBe('number');
        expect(layer).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have logical z-layer ordering', () => {
      const layers = Object.values(Z_LAYERS);
      const sortedLayers = [...layers].sort((a, b) => a - b);
      expect(layers).toEqual(sortedLayers);

      // Specific ordering checks
      expect(Z_LAYERS.BACKGROUND).toBeLessThan(Z_LAYERS.MEMBRANE);
      expect(Z_LAYERS.MEMBRANE).toBeLessThan(Z_LAYERS.CHANNELS);
      expect(Z_LAYERS.CHANNELS).toBeLessThan(Z_LAYERS.IONS);
      expect(Z_LAYERS.IONS).toBeLessThan(Z_LAYERS.SIGNALS);
      expect(Z_LAYERS.EFFECTS).toBeLessThan(Z_LAYERS.UI_BACKGROUND);
      expect(Z_LAYERS.UI_CONTENT).toBeLessThan(Z_LAYERS.UI_OVERLAY);
      expect(Z_LAYERS.UI_OVERLAY).toBeLessThan(Z_LAYERS.DEBUG);
    });
  });

  describe('Utility Functions', () => {
    describe('getScaledSize', () => {
      it('should scale sizes correctly', () => {
        expect(getScaledSize(10, 1)).toBe(10);
        expect(getScaledSize(10, 2)).toBe(20);
        expect(getScaledSize(10, 0.5)).toBe(5);
      });

      it('should enforce minimum size', () => {
        expect(getScaledSize(0.1, 1)).toBe(0.5);
        expect(getScaledSize(0.1, 0.1)).toBe(0.5);
      });

      it('should use default pixel ratio', () => {
        expect(getScaledSize(10)).toBe(10);
      });
    });

    describe('hexToRgb', () => {
      it('should convert hex colors to RGB', () => {
        expect(hexToRgb(0xff0000)).toEqual({ r: 255, g: 0, b: 0 });
        expect(hexToRgb(0x00ff00)).toEqual({ r: 0, g: 255, b: 0 });
        expect(hexToRgb(0x0000ff)).toEqual({ r: 0, g: 0, b: 255 });
        expect(hexToRgb(0xffffff)).toEqual({ r: 255, g: 255, b: 255 });
        expect(hexToRgb(0x000000)).toEqual({ r: 0, g: 0, b: 0 });
      });
    });

    describe('hexToRgba', () => {
      it('should convert hex colors to RGBA strings', () => {
        expect(hexToRgba(0xff0000)).toBe('rgba(255, 0, 0, 1)');
        expect(hexToRgba(0x00ff00, 0.5)).toBe('rgba(0, 255, 0, 0.5)');
        expect(hexToRgba(0x0000ff, 0)).toBe('rgba(0, 0, 255, 0)');
      });

      it('should use default alpha of 1', () => {
        expect(hexToRgba(0xffffff)).toBe('rgba(255, 255, 255, 1)');
      });
    });
  });
});
