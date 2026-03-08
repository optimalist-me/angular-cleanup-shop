import { Route } from '@angular/router';
import { provideCheckoutRouteAdapters } from './checkout-route.providers';
import { provideProductsRouteAdapters } from './products-route.providers';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products/:slug',
    loadChildren: () =>
      import('@cleanup/feature-product-detail').then(
        (m) => m.productDetailRoutes,
      ),
    providers: [...provideProductsRouteAdapters()],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@cleanup/feature-products-list').then(
        (m) => m.productsListRoutes,
      ),
    providers: [...provideProductsRouteAdapters()],
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('@cleanup/feature-cart').then((m) => m.cartRoutes),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('@cleanup/feature-checkout').then((m) => m.checkoutRoutes),
    providers: [...provideCheckoutRouteAdapters()],
  },
];
