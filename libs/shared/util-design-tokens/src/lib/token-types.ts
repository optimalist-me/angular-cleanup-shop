export type CssTokenMap = Record<string, string>;

export type DesignThemeName = 'light' | 'dark';

export type DesignColorScheme = 'light' | 'dark';

export interface DesignThemeDefinition {
  colorScheme: DesignColorScheme;
  semanticTokens: CssTokenMap;
}
