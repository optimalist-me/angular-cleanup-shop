import { inject, Injectable } from '@angular/core';
import {
  CHECKOUT_BOOKING_PORT,
  CheckoutBookingPort,
} from '../ports/checkout-booking.port';
import {
  type SubmitCheckoutRequest,
  type SubmitCheckoutResponse,
} from '@cleanup/models-checkout';
import { type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutBookingRepository {
  private readonly port = inject<CheckoutBookingPort>(CHECKOUT_BOOKING_PORT);

  submit(request: SubmitCheckoutRequest): Observable<SubmitCheckoutResponse> {
    return this.port.submit(request);
  }
}
