import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  designSemanticThemes,
  DesignThemeName,
} from '@cleanup/shared-util-design-tokens';
import {
  defaultDesignThemingOptions,
  DESIGN_THEMING_OPTIONS,
  DesignThemingOptions,
  ResolvedDesignThemingOptions,
} from './theme-options';
import {
  applyDesignStaticTokens,
  applyDesignTheme,
  isDesignThemeName,
} from './theme-engine';

@Injectable({ providedIn: 'root' })
export class DesignThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly options = inject(DESIGN_THEMING_OPTIONS);

  private readonly resolvedOptions: ResolvedDesignThemingOptions =
    this.resolveOptions(this.options);

  private readonly initialized = signal(false);
  private readonly activeThemeNameState = signal<DesignThemeName>(
    this.resolvedOptions.defaultTheme,
  );

  readonly activeThemeName = this.activeThemeNameState.asReadonly();
  readonly activeTheme = computed(
    () => designSemanticThemes[this.activeThemeNameState()],
  );

  initialize(): void {
    if (this.initialized()) {
      return;
    }
    this.initialized.set(true);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rootElement = this.document.documentElement;
    applyDesignStaticTokens(rootElement);

    const storedThemeName = this.readStoredThemeName();
    const initialThemeName =
      storedThemeName ?? this.resolvedOptions.defaultTheme;
    this.applyTheme(initialThemeName, false);
  }

  setTheme(themeName: DesignThemeName): void {
    this.applyTheme(themeName, true);
  }

  toggleTheme(): void {
    this.setTheme(this.activeThemeNameState() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(themeName: DesignThemeName, persist: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.activeThemeNameState.set(themeName);
      return;
    }

    const rootElement = this.document.documentElement;
    applyDesignTheme(rootElement, themeName);
    this.activeThemeNameState.set(themeName);

    if (persist) {
      this.persistThemeName(themeName);
    }
  }

  private readStoredThemeName(): DesignThemeName | null {
    try {
      const storedThemeName = localStorage.getItem(
        this.resolvedOptions.storageKey,
      );
      return isDesignThemeName(storedThemeName) ? storedThemeName : null;
    } catch {
      return null;
    }
  }

  private persistThemeName(themeName: DesignThemeName): void {
    try {
      localStorage.setItem(this.resolvedOptions.storageKey, themeName);
    } catch {
      // Intentionally ignore persistence failures.
    }
  }

  private resolveOptions(
    options: DesignThemingOptions,
  ): ResolvedDesignThemingOptions {
    return {
      defaultTheme:
        options.defaultTheme ?? defaultDesignThemingOptions.defaultTheme,
      storageKey: options.storageKey ?? defaultDesignThemingOptions.storageKey,
    };
  }
}
