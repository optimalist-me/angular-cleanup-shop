import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookingRequest } from '@cleanup/models-booking';
import { BookingsApi } from '../api/bookings.api';
import { BookingsRepository } from './bookings.repository';

describe('BookingsRepository', () => {
  let repository: BookingsRepository;
  let api: {
    createBooking: ReturnType<typeof vi.fn>;
    getBookingById: ReturnType<typeof vi.fn>;
  };

  const request: BookingRequest = {
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    angularVersion: '21',
    usesNx: true,
    painArea: 'boundaries',
    notes: 'Interested in a fit check.',
    preferredDates: ['2026-03-12'],
  };

  beforeEach(() => {
    api = {
      createBooking: vi.fn(() =>
        of({
          success: true,
          bookingId: 'booking-123',
          message: 'Booking submitted successfully',
        }),
      ),
      getBookingById: vi.fn(() =>
        of({
          success: true,
          booking: {
            id: 'booking-123',
            name: request.name,
            email: request.email,
            company: request.company,
            teamSize: request.teamSize,
            angularVersion: request.angularVersion,
            usesNx: request.usesNx,
            painArea: request.painArea,
            notes: request.notes,
            preferredDates: request.preferredDates,
            createdAt: '2026-03-01T00:00:00.000Z',
          },
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        BookingsRepository,
        {
          provide: BookingsApi,
          useValue: api,
        },
      ],
    });

    repository = TestBed.inject(BookingsRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should proxy createBooking', () => {
    repository.createBooking(request).subscribe();
    expect(api.createBooking).toHaveBeenCalledWith(request);
  });

  it('should proxy getBookingById', () => {
    repository.getBookingById('booking-123').subscribe();
    expect(api.getBookingById).toHaveBeenCalledWith('booking-123');
  });
});
