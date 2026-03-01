import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  CHECKOUT_BOOKING_PORT,
  CheckoutBookingPort,
} from '../ports/checkout-booking.port';
import { CheckoutBookingRepository } from './checkout-booking.repository';
import { SubmitCheckoutRequest } from '@cleanup/models-checkout';

describe('CheckoutBookingRepository', () => {
  const request: SubmitCheckoutRequest = {
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    angularVersion: '21',
    usesNx: true,
    notes: 'Need a calmer review flow.',
    preferredDates: ['2026-03-20'],
    privacyPolicyAccepted: true,
  };

  it('proxies submit to configured checkout booking port', () => {
    const port: CheckoutBookingPort = {
      submit: vi.fn(() =>
        of({
          success: true,
          bookingId: 'booking-123',
          message: 'Created',
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: CHECKOUT_BOOKING_PORT, useValue: port }],
    });

    const repository = TestBed.inject(CheckoutBookingRepository);
    repository.submit(request).subscribe();

    expect(port.submit).toHaveBeenCalledWith(request);
  });
});
