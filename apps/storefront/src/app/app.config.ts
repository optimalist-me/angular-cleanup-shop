import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideDesignTheming } from '@cleanup/shared-util-design-theming';
import { MAIN_DOMAIN_URL } from '@cleanup/data-access-checkout';
import { provideSharedHeaderConfig } from '@cleanup/shared-ui-header';
import { provideSharedFooterConfig } from '@cleanup/shared-ui-footer';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import {
  createStorefrontFooterConfig,
  createStorefrontHeaderConfig,
} from './storefront-shell-content';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideDesignTheming(),
    provideSharedHeaderConfig(
      createStorefrontHeaderConfig(environment.MAIN_DOMAIN_URL),
    ),
    provideSharedFooterConfig(
      createStorefrontFooterConfig(environment.MAIN_DOMAIN_URL),
    ),
    {
      provide: MAIN_DOMAIN_URL,
      useValue: environment.MAIN_DOMAIN_URL,
    },
  ],
};
