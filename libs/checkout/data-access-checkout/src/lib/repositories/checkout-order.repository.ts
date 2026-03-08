import { inject, Injectable } from '@angular/core';
import {
  CHECKOUT_ORDER_PORT,
  type CheckoutOrderPort,
} from '../ports/checkout-order.port';
import {
  type GetCheckoutOrderResponse,
  type SubmitCheckoutRequest,
  type SubmitCheckoutResponse,
} from '@cleanup/models-checkout';
import { type Observable } from 'rxjs';

@Injectable()
export class CheckoutOrderRepository {
  private readonly port = inject<CheckoutOrderPort>(CHECKOUT_ORDER_PORT);

  submit(request: SubmitCheckoutRequest): Observable<SubmitCheckoutResponse> {
    return this.port.submit(request);
  }

  getById(orderId: string): Observable<GetCheckoutOrderResponse> {
    return this.port.getById(orderId);
  }
}
