import { Route } from '@angular/router';
import { CheckoutCheckout } from './checkout/checkout';
import { CheckoutSuccess } from './success/success';

export const checkoutRoutes: Route[] = [
  {
    path: '',
    component: CheckoutCheckout,
  },
  {
    path: 'success/:orderId',
    component: CheckoutSuccess,
  },
];
