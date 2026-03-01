import { Provider } from '@angular/core';
import {
  CHECKOUT_BOOKING_PORT,
  CHECKOUT_CART_PORT,
  CheckoutBookingPort,
  CheckoutCartPort,
} from '@cleanup/data-access-checkout';
import { BookingsRepository } from '@cleanup/data-access-booking';
import { CartRepository } from '@cleanup/data-access-cart';
import { PRIVACY_POLICY_VERSION } from '@cleanup/models-booking';
import { type SubmitCheckoutRequest } from '@cleanup/models-checkout';

function createCheckoutBookingPort(
  bookingsRepository: BookingsRepository,
): CheckoutBookingPort {
  return {
    submit: (request: SubmitCheckoutRequest) =>
      bookingsRepository.createBooking({
        ...request,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      }),
  };
}

function createCheckoutCartPort(
  cartRepository: CartRepository,
): CheckoutCartPort {
  return {
    items: cartRepository.items,
    itemCount: cartRepository.itemCount,
    subtotal: cartRepository.subtotal,
    updateQuantity: (id: string, quantity: number) =>
      cartRepository.updateQuantity(id, quantity),
    removeItem: (id: string) => cartRepository.removeItem(id),
    clear: () => cartRepository.clear(),
  };
}

export function provideCheckoutRouteAdapters(): Provider[] {
  return [
    {
      provide: CHECKOUT_BOOKING_PORT,
      useFactory: createCheckoutBookingPort,
      deps: [BookingsRepository],
    },
    {
      provide: CHECKOUT_CART_PORT,
      useFactory: createCheckoutCartPort,
      deps: [CartRepository],
    },
  ];
}
