import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DESIGN_THEMING_OPTIONS } from './theme-options';
import { DesignThemeService } from './theme.service';

describe('DesignThemeService', () => {
  let service: DesignThemeService;
  let rootElement: HTMLElement;
  let previousTheme: string | undefined;
  let previousStorage: string | null;

  beforeEach(() => {
    rootElement = document.documentElement;
    previousTheme = rootElement.dataset['theme'];
    previousStorage = localStorage.getItem('cleanup-shop-theme');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DESIGN_THEMING_OPTIONS,
          useValue: {
            defaultTheme: 'light',
            storageKey: 'cleanup-shop-theme',
          },
        },
      ],
    });
    service = TestBed.inject(DesignThemeService);
  });

  afterEach(() => {
    if (previousTheme) {
      rootElement.dataset['theme'] = previousTheme;
    } else {
      delete rootElement.dataset['theme'];
    }
    rootElement.style.removeProperty('color-scheme');
    rootElement.style.removeProperty('--ds-text-primary');

    if (previousStorage === null) {
      localStorage.removeItem('cleanup-shop-theme');
    } else {
      localStorage.setItem('cleanup-shop-theme', previousStorage);
    }
  });

  it('should initialize with stored theme when present', () => {
    localStorage.setItem('cleanup-shop-theme', 'dark');

    service.initialize();

    expect(service.activeThemeName()).toBe('dark');
    expect(service.activeTheme().colorScheme).toBe('dark');
    expect(rootElement.dataset['theme']).toBe('dark');
    expect(rootElement.style.getPropertyValue('color-scheme')).toBe('dark');
  });

  it('should switch themes and persist selection', () => {
    service.initialize();
    service.setTheme('dark');

    expect(service.activeThemeName()).toBe('dark');
    expect(localStorage.getItem('cleanup-shop-theme')).toBe('dark');

    service.toggleTheme();
    expect(service.activeThemeName()).toBe('light');
    expect(localStorage.getItem('cleanup-shop-theme')).toBe('light');
  });

  it('should be safe to initialize more than once', () => {
    service.initialize();
    const previousTheme = service.activeThemeName();

    service.initialize();

    expect(service.activeThemeName()).toBe(previousTheme);
  });

  it('should ignore storage read errors and use default theme', () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('unavailable');
      });

    service.initialize();

    expect(service.activeThemeName()).toBe('light');
    getItemSpy.mockRestore();
  });

  it('should ignore storage write errors when setting theme', () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('unavailable');
      });

    service.initialize();
    expect(() => service.setTheme('dark')).not.toThrow();
    expect(service.activeThemeName()).toBe('dark');

    setItemSpy.mockRestore();
  });

  it('should support non-browser platform mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        {
          provide: DESIGN_THEMING_OPTIONS,
          useValue: {
            defaultTheme: 'light',
            storageKey: 'cleanup-shop-theme',
          },
        },
      ],
    });

    const serverService = TestBed.inject(DesignThemeService);
    serverService.initialize();
    serverService.setTheme('dark');

    expect(serverService.activeThemeName()).toBe('dark');
  });
});
