/**
 * Theme system exports for Synapse Sim.
 * Provides centralized design tokens and theme utilities.
 */

export {
  COLORS,
  SIZES,
  THEME,
  TIMINGS,
  Z_LAYERS,
  getScaledSize,
  hexToRgb,
  hexToRgba,
  type Theme,
} from './tokens';

export {
  ThemeProvider,
  createThemedStyles,
  defaultThemeProvider,
  useTheme,
} from './theme-provider';
