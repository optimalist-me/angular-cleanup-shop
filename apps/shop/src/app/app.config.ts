import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideDesignTheming } from '@cleanup/shared-util-design-theming';
import { provideSharedHeaderConfig } from '@cleanup/shared-ui-header';
import { provideSharedFooterConfig } from '@cleanup/shared-ui-footer';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  createShopFooterConfig,
  createShopHeaderConfig,
} from './shop-shell-content';

const DEMO_STOREFRONT_URL = 'https://demo.angularcleanup.shop';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideDesignTheming(),
    provideSharedHeaderConfig(createShopHeaderConfig(DEMO_STOREFRONT_URL)),
    provideSharedFooterConfig(createShopFooterConfig(DEMO_STOREFRONT_URL)),
  ],
};
