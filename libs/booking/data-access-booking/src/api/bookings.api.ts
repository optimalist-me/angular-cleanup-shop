import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  type CreateBookingResponse,
  type GetBookingResponse,
  type BookingRequest,
} from '@cleanup/models-booking';

@Injectable({
  providedIn: 'root',
})
export class BookingsApi {
  private readonly http = inject(HttpClient);

  createBooking(request: BookingRequest) {
    return this.http.post<CreateBookingResponse>('/api/bookings', request);
  }

  getBookingById(bookingId: string) {
    return this.http.get<GetBookingResponse>(`/api/bookings/${bookingId}`);
  }
}
