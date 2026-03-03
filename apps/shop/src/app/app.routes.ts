import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@cleanup/feature-marketing-home').then(
        (m) => m.marketingHomeRoutes,
      ),
  },
  {
    path: 'for-managers',
    loadChildren: () =>
      import('@cleanup/feature-marketing-faq').then((m) => m.marketingFaqRoutes),
  },
  {
    path: 'for-technical-leads',
    loadChildren: () =>
      import('@cleanup/feature-marketing-architecture').then(
        (m) => m.marketingArchitectureRoutes,
      ),
  },
  {
    path: 'how-it-works',
    loadChildren: () =>
      import('@cleanup/feature-marketing-playbook').then(
        (m) => m.marketingPlaybookRoutes,
      ),
  },
  {
    path: 'ai-governance',
    loadChildren: () =>
      import('@cleanup/feature-marketing-architecture').then(
        (m) => m.marketingArchitectureRoutes,
      ),
  },
  {
    path: 'playbook',
    redirectTo: '/how-it-works',
    pathMatch: 'full',
  },
  {
    path: 'architecture',
    redirectTo: '/for-technical-leads',
    pathMatch: 'full',
  },
  {
    path: 'faq',
    redirectTo: '/for-managers',
    pathMatch: 'full',
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import('@cleanup/feature-privacy').then((m) => m.privacyRoutes),
  },
  {
    path: 'products/:slug',
    redirectTo: '/',
  },
  {
    path: 'products',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'checkout',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'book/confirmed/:bookingId',
    loadChildren: () =>
      import('@cleanup/feature-booking').then((m) => m.bookingRoutes),
  },
  {
    path: 'book/confirmed',
    redirectTo: '/book',
    pathMatch: 'full',
  },
  {
    path: 'book',
    loadChildren: () =>
      import('@cleanup/feature-booking').then((m) => m.bookingRoutes),
  },
];
