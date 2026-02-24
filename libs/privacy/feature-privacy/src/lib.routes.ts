import { Route } from '@angular/router';

export const privacyRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./privacy/privacy').then((m) => m.PrivacyPrivacy),
  },
];
