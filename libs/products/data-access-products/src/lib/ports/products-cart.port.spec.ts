import { TestBed } from '@angular/core/testing';
import { PRODUCTS_CART_PORT } from './products-cart.port';

describe('PRODUCTS_CART_PORT', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('throws when products cart port is not configured', () => {
    expect(() => TestBed.inject(PRODUCTS_CART_PORT)).toThrowError(
      'PRODUCTS_CART_PORT is not configured. Provide products adapters at the product detail route.',
    );
  });
});
