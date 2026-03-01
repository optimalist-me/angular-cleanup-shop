import { Route } from '@angular/router';
import { provideCheckoutRouteAdapters } from './checkout-route.providers';

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
  {
    path: 'privacy',
    loadChildren: () =>
      import('@cleanup/feature-privacy').then((m) => m.privacyRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@cleanup/feature-products-list').then(
        (m) => m.productsListRoutes,
      ),
  },
  {
    path: 'products/:slug',
    loadChildren: () =>
      import('@cleanup/feature-product-detail').then(
        (m) => m.productDetailRoutes,
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('@cleanup/feature-cart').then((m) => m.cartRoutes),
  },
  {
    path: 'checkout',
    providers: [provideCheckoutRouteAdapters()],
    loadChildren: () =>
      import('@cleanup/feature-checkout').then((m) => m.checkoutRoutes),
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
