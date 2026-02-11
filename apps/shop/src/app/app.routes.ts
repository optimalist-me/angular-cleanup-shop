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
    path: 'playbook',
    loadChildren: () =>
      import('@cleanup/feature-marketing-playbook').then(
        (m) => m.marketingPlaybookRoutes,
      ),
  },
  {
    path: 'architecture',
    loadChildren: () =>
      import('@cleanup/feature-marketing-architecture').then(
        (m) => m.marketingArchitectureRoutes,
      ),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('@cleanup/feature-marketing-faq').then(
        (m) => m.marketingFaqRoutes,
      ),
  },
];
