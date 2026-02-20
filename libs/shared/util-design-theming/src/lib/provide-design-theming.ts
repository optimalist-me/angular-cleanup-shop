import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { DesignThemingOptions, DESIGN_THEMING_OPTIONS } from './theme-options';
import { DesignThemeService } from './theme.service';

export function provideDesignTheming(
  options: DesignThemingOptions = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DESIGN_THEMING_OPTIONS,
      useValue: options,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        inject(DesignThemeService).initialize();
      },
    },
  ]);
}
