import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BookingRequest, BookingResponse } from '@cleanup/models-booking';

import { BookingsApi } from './bookings.api';

describe('BookingsApi', () => {
  let service: BookingsApi;
  let httpMock: HttpTestingController;

  const request: BookingRequest = {
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    notes: 'Interested in a fit check.',
  };
  const response: BookingResponse = {
    id: 'booking_123',
    createdAt: '2026-02-12T12:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
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
      expect(result).toEqual(response);
    });

    const httpRequest = httpMock.expectOne('/api/bookings');
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush(response);
  });
});
