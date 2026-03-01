import { inject, Injectable } from '@angular/core';
import { CHECKOUT_CART_PORT, CheckoutCartPort } from '../ports/checkout-cart.port';

@Injectable()
export class CheckoutCartRepository {
  private readonly port = inject<CheckoutCartPort>(CHECKOUT_CART_PORT);

  readonly items = this.port.items;
  readonly itemCount = this.port.itemCount;
  readonly subtotal = this.port.subtotal;

  updateQuantity(id: string, quantity: number): void {
    this.port.updateQuantity(id, quantity);
  }

  removeItem(id: string): void {
    this.port.removeItem(id);
  }

  clear(): void {
    this.port.clear();
  }
}
