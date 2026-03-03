import { signal, type Signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { BookingsRepository } from '@cleanup/data-access-booking';
import { CartRepository } from '@cleanup/data-access-cart';
import {
  CHECKOUT_BOOKING_PORT,
  CHECKOUT_CART_PORT,
  CheckoutBookingRepository,
  CheckoutCartRepository,
  type CheckoutBookingPort,
  type CheckoutCartPort,
} from '@cleanup/data-access-checkout';
import { PRIVACY_POLICY_VERSION } from '@cleanup/models-booking';
import { SubmitCheckoutRequest } from '@cleanup/models-checkout';
import { provideCheckoutRouteAdapters } from './checkout-route.providers';

describe('provideCheckoutRouteAdapters', () => {
  it('should register checkout repositories and adapter providers', () => {
    const providers = provideCheckoutRouteAdapters();

    expect(providers[0]).toBe(CheckoutBookingRepository);
    expect(providers[1]).toBe(CheckoutCartRepository);

    const bookingProvider = findProviderWithFactory<CheckoutBookingPort>(
      providers,
      CHECKOUT_BOOKING_PORT,
    );
    const cartProvider = findProviderWithFactory<CheckoutCartPort>(
      providers,
      CHECKOUT_CART_PORT,
    );

    expect(bookingProvider.deps).toEqual([BookingsRepository]);
    expect(cartProvider.deps).toEqual([CartRepository]);
  });

  it('should append privacy policy version when submitting booking requests', async () => {
    const providers = provideCheckoutRouteAdapters();
    const bookingProvider = findProviderWithFactory<CheckoutBookingPort>(
      providers,
      CHECKOUT_BOOKING_PORT,
    );

    const bookingsRepository = {
      createBooking: vi.fn(() =>
        of({ success: true, bookingId: 'booking-1', message: 'ok' }),
      ),
    } as unknown as BookingsRepository;

    const bookingPort = bookingProvider.useFactory(bookingsRepository);

    const request: SubmitCheckoutRequest = {
      name: 'Maya Stone',
      email: 'maya@example.com',
      company: 'Cleanup Labs',
      teamSize: 8,
      angularVersion: '21',
      usesNx: true,
      notes: 'Need governance support',
      preferredDates: ['2026-03-10'],
      privacyPolicyAccepted: true,
    };

    await firstValueFrom(bookingPort.submit(request));

    expect(bookingsRepository.createBooking).toHaveBeenCalledWith({
      ...request,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    });
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
