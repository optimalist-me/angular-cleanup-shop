import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  type BookingRequest,
  type BookingResponse,
} from '@cleanup/models-booking';

@Injectable({
  providedIn: 'root',
})
export class BookingsApi {
  private readonly http = inject(HttpClient);

  createBooking(request: BookingRequest) {
    return this.http.post<BookingResponse>('/api/bookings', request);
  }
}
