import { InjectionToken } from '@angular/core';
import {
  type SubmitCheckoutRequest,
  type SubmitCheckoutResponse,
} from '@cleanup/models-checkout';
import { type Observable } from 'rxjs';

export interface CheckoutBookingPort {
  submit(request: SubmitCheckoutRequest): Observable<SubmitCheckoutResponse>;
}

export const CHECKOUT_BOOKING_PORT = new InjectionToken<CheckoutBookingPort>(
  'CHECKOUT_BOOKING_PORT',
  {
    factory: () => {
      throw new Error(
        'CHECKOUT_BOOKING_PORT is not configured. Provide checkout adapters at the checkout route.',
      );
    },
  },
);
