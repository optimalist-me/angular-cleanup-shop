import { TestBed } from '@angular/core/testing';
import { CHECKOUT_ORDER_PORT } from './checkout-order.port';

describe('CHECKOUT_ORDER_PORT', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('throws when checkout order port is not configured', () => {
    expect(() => TestBed.inject(CHECKOUT_ORDER_PORT)).toThrowError(
      'CHECKOUT_ORDER_PORT is not configured. Provide checkout adapters at the checkout route.',
    );
  });
});
