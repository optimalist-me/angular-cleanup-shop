import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CheckoutCartItem } from '@cleanup/models-checkout';
import { CHECKOUT_CART_PORT, CheckoutCartPort } from '../ports/checkout-cart.port';
import { CheckoutCartRepository } from './checkout-cart.repository';

describe('CheckoutCartRepository', () => {
  it('exposes cart state and proxies cart operations', () => {
    const items = signal<CheckoutCartItem[]>([
      {
        id: 'boundary-polish',
        slug: 'boundary-polish',
        name: 'Boundary Polish',
        price: 2400,
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Boundary Polish image',
        quantity: 2,
      },
    ]);

    const port: CheckoutCartPort = {
      items,
      itemCount: computed(() =>
        items().reduce((total, item) => total + item.quantity, 0),
      ),
      subtotal: computed(() =>
        items().reduce((total, item) => total + item.quantity * item.price, 0),
      ),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutCartRepository,
        { provide: CHECKOUT_CART_PORT, useValue: port },
      ],
    });

    const repository = TestBed.inject(CheckoutCartRepository);

    expect(repository.items()).toEqual(items());
    expect(repository.itemCount()).toBe(2);
    expect(repository.subtotal()).toBe(4800);

    repository.updateQuantity('boundary-polish', 3);
    repository.removeItem('boundary-polish');
    repository.clear();

    expect(port.updateQuantity).toHaveBeenCalledWith('boundary-polish', 3);
    expect(port.removeItem).toHaveBeenCalledWith('boundary-polish');
    expect(port.clear).toHaveBeenCalled();
  });
});
