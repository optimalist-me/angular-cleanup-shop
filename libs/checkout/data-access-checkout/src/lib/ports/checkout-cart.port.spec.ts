import { TestBed } from '@angular/core/testing';
import { CHECKOUT_CART_PORT } from './checkout-cart.port';

describe('CHECKOUT_CART_PORT', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('throws when checkout cart port is not configured', () => {
    expect(() => TestBed.inject(CHECKOUT_CART_PORT)).toThrowError(
      'CHECKOUT_CART_PORT is not configured. Provide checkout adapters at the checkout route.',
    );
  });
});
