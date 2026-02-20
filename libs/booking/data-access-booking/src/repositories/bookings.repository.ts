import { inject, Injectable } from '@angular/core';
import { BookingsApi } from '../api/bookings.api';
import {
  type BookingRequest,
  type CreateBookingResponse,
  type GetBookingResponse,
} from '@cleanup/models-booking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingsRepository {
  private readonly api = inject(BookingsApi);

  createBooking(request: BookingRequest): Observable<CreateBookingResponse> {
    return this.api.createBooking(request);
  }

  getBookingById(bookingId: string): Observable<GetBookingResponse> {
    return this.api.getBookingById(bookingId);
  }
}
