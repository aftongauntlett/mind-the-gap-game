import type { Theme } from './tokens';
import { THEME } from './tokens';

/**
 * Theme provider utility for passing design tokens to systems.
 * Provides a centralized way to access theme tokens throughout the application.
 */
export class ThemeProvider {
  private theme: Theme;

  constructor(theme: Theme = THEME) {
    this.theme = theme;
  }

  /**
   * Gets the complete theme object.
   */
  public getTheme(): Theme {
    return this.theme;
  }

  /**
   * Gets color tokens.
   */
  public getColors() {
    return this.theme.colors;
  }

  /**
   * Gets size tokens.
   */
  public getSizes() {
    return this.theme.sizes;
  }

  /**
   * Gets timing tokens.
   */
  public getTimings() {
    return this.theme.timings;
  }

  /**
   * Gets z-layer tokens.
   */
  public getZLayers() {
    return this.theme.zLayers;
  }

  /**
   * Gets a specific color by key.
   */
  public getColor(colorKey: keyof Theme['colors']): number {
    return this.theme.colors[colorKey];
  }

  /**
   * Gets a specific size by key.
   */
  public getSize(sizeKey: keyof Theme['sizes']): number {
    return this.theme.sizes[sizeKey];
  }

  /**
   * Gets a specific timing by key.
   */
  public getTiming(timingKey: keyof Theme['timings']): number {
    return this.theme.timings[timingKey];
  }

  /**
   * Gets a specific z-layer by key.
   */
  public getZLayer(layerKey: keyof Theme['zLayers']): number {
    return this.theme.zLayers[layerKey];
  }

  /**
   * Updates the theme (useful for theme switching).
   */
  public setTheme(newTheme: Theme): void {
    this.theme = newTheme;
  }

  /**
   * Creates a scoped theme provider with overrides.
   */
  public withOverrides(overrides: Partial<Theme>): ThemeProvider {
    const mergedTheme = {
      ...this.theme,
      ...overrides,
      colors: { ...this.theme.colors, ...overrides.colors },
      sizes: { ...this.theme.sizes, ...overrides.sizes },
      timings: { ...this.theme.timings, ...overrides.timings },
      zLayers: { ...this.theme.zLayers, ...overrides.zLayers },
    };
    return new ThemeProvider(mergedTheme);
  }
}

/**
 * Default theme provider instance.
 */
export const defaultThemeProvider = new ThemeProvider();

/**
 * Hook-style function for getting theme values.
 * Useful for functional components and systems.
 */
export function useTheme(): Theme {
  return defaultThemeProvider.getTheme();
}

/**
 * Utility function to create theme-aware styles.
 */
export function createThemedStyles<T>(
  styleFactory: (_theme: Theme) => T,
  themeProvider: ThemeProvider = defaultThemeProvider
): T {
  return styleFactory(themeProvider.getTheme());
}
