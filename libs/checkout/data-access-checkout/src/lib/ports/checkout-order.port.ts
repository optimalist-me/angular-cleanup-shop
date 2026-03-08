import { InjectionToken } from '@angular/core';
import {
  type GetCheckoutOrderResponse,
  type SubmitCheckoutRequest,
  type SubmitCheckoutResponse,
} from '@cleanup/models-checkout';
import { type Observable } from 'rxjs';

export interface CheckoutOrderPort {
  submit(request: SubmitCheckoutRequest): Observable<SubmitCheckoutResponse>;
  getById(orderId: string): Observable<GetCheckoutOrderResponse>;
}

export const CHECKOUT_ORDER_PORT = new InjectionToken<CheckoutOrderPort>(
  'CHECKOUT_ORDER_PORT',
  {
    factory: () => {
      throw new Error(
        'CHECKOUT_ORDER_PORT is not configured. Provide checkout adapters at the checkout route.',
      );
    },
  },
);
