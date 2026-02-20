import { InjectionToken } from '@angular/core';
import { DesignThemeName } from '@cleanup/shared-util-design-tokens';

export interface DesignThemingOptions {
  defaultTheme?: DesignThemeName;
  storageKey?: string;
}

export interface ResolvedDesignThemingOptions {
  defaultTheme: DesignThemeName;
  storageKey: string;
}

export const defaultDesignThemingOptions: ResolvedDesignThemingOptions = {
  defaultTheme: 'light',
  storageKey: 'cleanup-shop-theme',
};

export const DESIGN_THEMING_OPTIONS = new InjectionToken<DesignThemingOptions>(
  'DESIGN_THEMING_OPTIONS',
  {
    factory: () => defaultDesignThemingOptions,
  },
);
