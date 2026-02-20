import {
  CssTokenMap,
  designComponentTokens,
  designCoreTokens,
  designSemanticThemes,
  DesignThemeName,
  mergeTokenMaps,
  toCssVariables,
} from '@cleanup/shared-util-design-tokens';

const staticThemeTokens = toCssVariables(
  mergeTokenMaps(designCoreTokens, designComponentTokens),
);

const semanticThemeTokens: Record<DesignThemeName, CssTokenMap> = {
  light: toCssVariables(designSemanticThemes.light.semanticTokens),
  dark: toCssVariables(designSemanticThemes.dark.semanticTokens),
};

export const designThemeNames = Object.keys(
  designSemanticThemes,
) as DesignThemeName[];

export function applyDesignStaticTokens(rootElement: HTMLElement): void {
  applyCssVariables(rootElement, staticThemeTokens);
}

export function applyDesignTheme(
  rootElement: HTMLElement,
  themeName: DesignThemeName,
): void {
  const themeDefinition = designSemanticThemes[themeName];
  rootElement.dataset['theme'] = themeName;
  rootElement.style.setProperty('color-scheme', themeDefinition.colorScheme);
  applyCssVariables(rootElement, semanticThemeTokens[themeName]);
}

export function isDesignThemeName(
  value: string | null,
): value is DesignThemeName {
  if (!value) {
    return false;
  }

  return designThemeNames.includes(value as DesignThemeName);
}

function applyCssVariables(
  rootElement: HTMLElement,
  cssVariables: CssTokenMap,
): void {
  for (const [propertyName, propertyValue] of Object.entries(cssVariables)) {
    rootElement.style.setProperty(propertyName, propertyValue);
  }
}
