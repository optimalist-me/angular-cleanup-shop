import { TestBed } from '@angular/core/testing';
import { CHECKOUT_BOOKING_PORT } from './checkout-booking.port';

describe('CHECKOUT_BOOKING_PORT', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('throws when checkout booking port is not configured', () => {
    expect(() => TestBed.inject(CHECKOUT_BOOKING_PORT)).toThrowError(
      'CHECKOUT_BOOKING_PORT is not configured. Provide checkout adapters at the checkout route.',
    );
  });
});
