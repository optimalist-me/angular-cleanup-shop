import {
  applyDesignStaticTokens,
  applyDesignTheme,
  isDesignThemeName,
} from './theme-engine';

describe('theme engine', () => {
  let rootElement: HTMLElement;
  let previousTheme: string | undefined;

  beforeEach(() => {
    rootElement = document.documentElement;
    previousTheme = rootElement.dataset['theme'];
  });

  afterEach(() => {
    if (previousTheme) {
      rootElement.dataset['theme'] = previousTheme;
    } else {
      delete rootElement.dataset['theme'];
    }
    rootElement.style.removeProperty('--ds-font-family-base');
    rootElement.style.removeProperty('--ds-button-height-md');
    rootElement.style.removeProperty('--ds-text-primary');
    rootElement.style.removeProperty('color-scheme');
  });

  it('should apply static core and component tokens as CSS variables', () => {
    applyDesignStaticTokens(rootElement);

    expect(rootElement.style.getPropertyValue('--ds-font-family-base')).toContain(
      'Space Grotesk',
    );
    expect(rootElement.style.getPropertyValue('--ds-button-height-md')).toBe('2.5rem');
  });

  it('should apply semantic theme tokens and color scheme', () => {
    applyDesignTheme(rootElement, 'dark');

    expect(rootElement.dataset['theme']).toBe('dark');
    expect(rootElement.style.getPropertyValue('color-scheme')).toBe('dark');
    expect(rootElement.style.getPropertyValue('--ds-text-primary')).toBe('#e7f0f6');
  });

  it('should validate known theme names', () => {
    expect(isDesignThemeName('light')).toBe(true);
    expect(isDesignThemeName('dark')).toBe(true);
    expect(isDesignThemeName('nope')).toBe(false);
    expect(isDesignThemeName(null)).toBe(false);
  });
});
