import { signal, type Signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { CartRepository } from '@cleanup/data-access-cart';
import { OrdersRepository } from '@cleanup/data-access-orders';
import {
  CHECKOUT_CART_PORT,
  CHECKOUT_ORDER_PORT,
  CheckoutCartRepository,
  CheckoutOrderRepository,
  type CheckoutCartPort,
  type CheckoutOrderPort,
} from '@cleanup/data-access-checkout';
import { type SubmitCheckoutRequest } from '@cleanup/models-checkout';
import { provideCheckoutRouteAdapters } from './checkout-route.providers';

describe('provideCheckoutRouteAdapters', () => {
  it('should register checkout repositories and adapter providers', () => {
    const providers = provideCheckoutRouteAdapters();

    expect(providers[0]).toBe(CheckoutOrderRepository);
    expect(providers[1]).toBe(CheckoutCartRepository);

    const orderProvider = findProviderWithFactory<CheckoutOrderPort>(
      providers,
      CHECKOUT_ORDER_PORT,
    );
    const cartProvider = findProviderWithFactory<CheckoutCartPort>(
      providers,
      CHECKOUT_CART_PORT,
    );

    expect(orderProvider.deps).toEqual([OrdersRepository]);
    expect(cartProvider.deps).toEqual([CartRepository]);
  });

  it('should map create order response into checkout response shape', async () => {
    const providers = provideCheckoutRouteAdapters();
    const orderProvider = findProviderWithFactory<CheckoutOrderPort>(
      providers,
      CHECKOUT_ORDER_PORT,
    );

    const ordersRepository = {
      createOrder: vi.fn(() =>
        of({
          success: true,
          order: {
            id: 'order-1',
          },
        }),
      ),
      getOrderById: vi.fn(() =>
        of({
          success: true,
          order: {
            id: 'order-1',
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            context: 'storefront',
            createdAt: '2026-03-03T10:00:00.000Z',
          },
        }),
      ),
    } as unknown as OrdersRepository;

    const orderPort = orderProvider.useFactory(ordersRepository);

    const request: SubmitCheckoutRequest = {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      context: 'storefront',
    };

    const submitResult = await firstValueFrom(orderPort.submit(request));
    const getResult = await firstValueFrom(orderPort.getById('order-1'));

    expect(submitResult).toEqual({
      success: true,
      orderId: 'order-1',
      message: undefined,
      error: undefined,
    });
    expect(getResult.success).toBe(true);
    expect(ordersRepository.getOrderById).toHaveBeenCalledWith('order-1');
  });

  it('should proxy cart state and commands through checkout cart port', () => {
    const providers = provideCheckoutRouteAdapters();
    const cartProvider = findProviderWithFactory<CheckoutCartPort>(
      providers,
      CHECKOUT_CART_PORT,
    );

    const cartItems = signal([]) as Signal<
      Array<{
        id: string;
        slug: string;
        name: string;
        price: number;
        imageSrc: string;
        imageAlt: string;
        quantity: number;
      }>
    >;
    const itemCount = signal(0);
    const subtotal = signal(0);

    const cartRepository = {
      items: cartItems,
      itemCount,
      subtotal,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as unknown as CartRepository;

    const cartPort = cartProvider.useFactory(cartRepository);

    expect(cartPort.items()).toEqual([]);
    expect(cartPort.itemCount()).toBe(0);
    expect(cartPort.subtotal()).toBe(0);

    cartPort.updateQuantity('item-1', 3);
    cartPort.removeItem('item-2');
    cartPort.clear();

    expect(cartRepository.updateQuantity).toHaveBeenCalledWith('item-1', 3);
    expect(cartRepository.removeItem).toHaveBeenCalledWith('item-2');
    expect(cartRepository.clear).toHaveBeenCalled();
  });
});

type FactoryProvider<TPort> = {
  provide: unknown;
  useFactory: (dependency: unknown) => TPort;
  deps: unknown[];
};

function findProviderWithFactory<TPort>(
  providers: Array<unknown>,
  token: unknown,
): FactoryProvider<TPort> {
  const provider = providers.find(
    (entry): entry is FactoryProvider<TPort> =>
      typeof entry === 'object' &&
      entry !== null &&
      'provide' in entry &&
      (entry as { provide: unknown }).provide === token &&
      'useFactory' in entry,
  );

  if (!provider) {
    throw new Error('Expected provider with useFactory to be registered.');
  }

  return provider;
}
