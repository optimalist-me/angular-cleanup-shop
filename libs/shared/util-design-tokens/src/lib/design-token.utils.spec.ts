import { designComponentTokens } from './design-component.tokens';
import { designCoreTokens } from './design-core.tokens';
import { designSemanticThemes } from './design-semantic.tokens';
import { mergeTokenMaps, toCssVariables, tokenVar } from './design-token.utils';

describe('design token utilities', () => {
  it('should format CSS token variable references', () => {
    expect(tokenVar('text-primary')).toBe('var(--ds-text-primary)');
  });

  it('should convert token maps to CSS custom property maps', () => {
    const cssVariables = toCssVariables({
      'text-primary': '#111111',
      'space-2': '0.5rem',
    });

    expect(cssVariables).toEqual({
      '--ds-text-primary': '#111111',
      '--ds-space-2': '0.5rem',
    });
  });

  it('should merge token maps left-to-right', () => {
    const merged = mergeTokenMaps(
      { 'text-primary': '#111111', 'space-2': '0.5rem' },
      { 'text-primary': '#222222' },
    );

    expect(merged).toEqual({
      'text-primary': '#222222',
      'space-2': '0.5rem',
    });
  });

  it('should expose light and dark semantic themes', () => {
    expect(Object.keys(designSemanticThemes)).toEqual(['light', 'dark']);
    expect(designSemanticThemes.light.semanticTokens['text-primary']).toBeTruthy();
    expect(designSemanticThemes.dark.semanticTokens['text-primary']).toBeTruthy();
  });

  it('should expose core and component token values', () => {
    expect(designCoreTokens['space-4']).toBe('1rem');
    expect(designComponentTokens['button-height-md']).toBe('2.5rem');
  });
});
