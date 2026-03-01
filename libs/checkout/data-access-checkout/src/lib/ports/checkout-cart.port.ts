import { InjectionToken, type Signal } from '@angular/core';
import { type CheckoutCartItem } from '@cleanup/models-checkout';

export interface CheckoutCartPort {
  readonly items: Signal<CheckoutCartItem[]>;
  readonly itemCount: Signal<number>;
  readonly subtotal: Signal<number>;
  updateQuantity(id: string, quantity: number): void;
  removeItem(id: string): void;
  clear(): void;
}

export const CHECKOUT_CART_PORT = new InjectionToken<CheckoutCartPort>(
  'CHECKOUT_CART_PORT',
  {
    factory: () => {
      throw new Error(
        'CHECKOUT_CART_PORT is not configured. Provide checkout adapters at the checkout route.',
      );
    },
  },
);
