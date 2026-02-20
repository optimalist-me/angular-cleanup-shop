import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BookingRequest,
  CreateBookingResponse,
  GetBookingResponse,
} from '@cleanup/models-booking';
import { provideHttpClient } from '@angular/common/http';

import { BookingsApi } from './bookings.api';

describe('BookingsApi', () => {
  let service: BookingsApi;
  let httpMock: HttpTestingController;

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
  const createResponse: CreateBookingResponse = {
    success: true,
    bookingId: 'booking_123',
    message: 'Booking submitted successfully',
  };
  const detailsResponse: GetBookingResponse = {
    success: true,
    booking: {
      id: 'booking_123',
      name: 'Maya Stone',
      email: 'maya@cleanup.shop',
      company: 'Cleanup Labs',
      teamSize: 8,
      angularVersion: '21',
      usesNx: true,
      painArea: 'boundaries',
      notes: 'Interested in a fit check.',
      preferredDates: ['2026-03-12'],
      createdAt: '2026-02-12T12:00:00Z',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookingsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a booking request', () => {
    service.createBooking(request).subscribe((result) => {
      expect(result).toEqual(createResponse);
    });

    const httpRequest = httpMock.expectOne('/api/bookings');
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush(createResponse);
  });

  it('should fetch booking by id', () => {
    service.getBookingById('booking_123').subscribe((result) => {
      expect(result).toEqual(detailsResponse);
    });

    const httpRequest = httpMock.expectOne('/api/bookings/booking_123');
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(detailsResponse);
  });
});
