import { InjectionToken } from '@angular/core';

export const MAIN_DOMAIN_URL = new InjectionToken<string>('MAIN_DOMAIN_URL', {
  factory: () => 'https://angularcleanup.shop',
});
