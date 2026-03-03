import { InjectionToken, Provider } from '@angular/core';

export const DEMO_STOREFRONT_URL = new InjectionToken<string>(
  'DEMO_STOREFRONT_URL',
  {
    factory: () => 'https://demo.angularcleanup.shop',
  },
);

export function provideDemoStorefrontUrl(url: string): Provider {
  return {
    provide: DEMO_STOREFRONT_URL,
    useValue: url,
  };
}
