import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { BookingsApi } from '../api/bookings.api';
import {
  BookingDraft,
  BookingRequest,
  BookingResponse,
  BookingStatus,
  BookingStep,
} from '@cleanup/models-booking';

@Injectable({
  providedIn: 'root',
})
export class BookingsRepository {
  private readonly api = inject(BookingsApi);

  readonly step = signal<BookingStep>('info');
  readonly draft = signal<BookingDraft>({});
  readonly status = signal<BookingStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly confirmation = signal<BookingResponse | null>(null);

  readonly canSubmit = computed(() => {
    const draft = this.draft();
    return Boolean(
      draft.name &&
        draft.email &&
        draft.company &&
        typeof draft.teamSize === 'number',
    );
  });

  updateDraft(patch: BookingDraft): void {
    this.draft.update((current) => ({ ...current, ...patch }));
  }

  nextStep(): void {
    this.step.update((current) =>
      current === 'info' ? 'schedule' : 'confirm',
    );
  }

  previousStep(): void {
    this.step.update((current) =>
      current === 'confirm' ? 'schedule' : 'info',
    );
  }

  reset(): void {
    this.step.set('info');
    this.draft.set({});
    this.status.set('idle');
    this.error.set(null);
    this.confirmation.set(null);
  }

  submit(): void {
    const request = buildRequest(this.draft());
    if (!request) {
      this.error.set('Missing required booking details.');
      this.status.set('error');
      return;
    }

    this.status.set('submitting');
    this.error.set(null);

    this.api
      .createBooking(request)
      .pipe(
        take(1),
        catchError(() => {
          this.status.set('error');
          this.error.set('Booking failed. Try again.');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }

        this.status.set('success');
        this.confirmation.set(response);
        this.step.set('confirm');
      });
  }
}

// Accepts preferredDates array
const buildRequest = (draft: BookingDraft): BookingRequest | null => {
  if (!draft.name || !draft.email || !draft.company) {
    return null;
  }

  if (typeof draft.teamSize !== 'number') {
    return null;
  }

  const request: BookingRequest = {
    name: draft.name,
    email: draft.email,
    company: draft.company,
    teamSize: draft.teamSize,
    notes: draft.notes ?? '',
  };

  if (draft.preferredDates && draft.preferredDates.length > 0) {
    request.preferredDates = draft.preferredDates;
  }

  return request;
};
