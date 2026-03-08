import { Provider } from '@angular/core';
import { map } from 'rxjs';
import {
  CHECKOUT_CART_PORT,
  CHECKOUT_ORDER_PORT,
  CheckoutCartRepository,
  type CheckoutCartPort,
  CheckoutOrderRepository,
  type CheckoutOrderPort,
} from '@cleanup/data-access-checkout';
import { CartRepository } from '@cleanup/data-access-cart';
import { OrdersRepository } from '@cleanup/data-access-orders';
import { type SubmitCheckoutRequest } from '@cleanup/models-checkout';

function createCheckoutOrderPort(
  ordersRepository: OrdersRepository,
): CheckoutOrderPort {
  return {
    submit: (request: SubmitCheckoutRequest) =>
      ordersRepository.createOrder(request).pipe(
        map((response) => ({
          success: response.success,
          orderId: response.order?.id,
          message: response.message,
          error: response.error,
        })),
      ),
    getById: (orderId: string) => ordersRepository.getOrderById(orderId),
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
    CheckoutOrderRepository,
    CheckoutCartRepository,
    {
      provide: CHECKOUT_ORDER_PORT,
      useFactory: createCheckoutOrderPort,
      deps: [OrdersRepository],
    },
    {
      provide: CHECKOUT_CART_PORT,
      useFactory: createCheckoutCartPort,
      deps: [CartRepository],
    },
  ];
}
