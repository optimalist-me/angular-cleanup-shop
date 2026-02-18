import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingStepper } from '@cleanup/ui-booking-stepper';
import { BookingsRepository } from '@cleanup/data-access-booking';

@Component({
  selector: 'booking-booking',
  imports: [CommonModule, FormsModule, RouterLink, BookingStepper],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingBooking {
  readonly repository = inject(BookingsRepository);
  private readonly router = inject(Router);

  readonly step$ = this.repository.step;
  readonly draft$ = this.repository.draft;
  readonly status$ = this.repository.status;
  readonly error$ = this.repository.error;
  readonly confirmation$ = this.repository.confirmation;
  readonly canSubmit$ = this.repository.canSubmit;

  // Preferred dates signal (local, synced with draft)
  readonly preferredDates$ = computed(
    () => this.draft$().preferredDates ?? [''],
  );

  onName(value: string): void {
    this.repository.updateDraft({ name: value });
  }

  onEmail(value: string): void {
    this.repository.updateDraft({ email: value });
  }

  onCompany(value: string): void {
    this.repository.updateDraft({ company: value });
  }

  onTeamSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const teamSize = parseInt(value, 10);
    this.repository.updateDraft({
      teamSize: isNaN(teamSize) ? undefined : teamSize,
    });
  }

  onNotes(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.repository.updateDraft({ notes: value });
  }

  onPreferredDate(index: number, value: string): void {
    const current = this.preferredDates$().slice();
    current[index] = value;
    this.repository.updateDraft({ preferredDates: current });
  }

  addPreferredDate(): void {
    const current = this.preferredDates$().slice();
    if (current.length < 3) {
      current.push('');
      this.repository.updateDraft({ preferredDates: current });
    }
  }

  removePreferredDate(index: number): void {
    const current = this.preferredDates$().slice();
    if (current.length > 1) {
      current.splice(index, 1);
      this.repository.updateDraft({ preferredDates: current });
    } else {
      // Always keep at least one empty string
      this.repository.updateDraft({ preferredDates: [''] });
    }
  }

  // For template compatibility
  canSubmitSchedule$ = computed(
    () =>
      this.preferredDates$().length > 0 &&
      !!this.preferredDates$()[0] &&
      this.preferredDates$().every((date) => !!date),
  );

  next(): void {
    this.repository.nextStep();
  }

  previous(): void {
    this.repository.previousStep();
  }

  submit(): void {
    this.repository.submit();
  }

  back(): void {
    this.repository.reset();
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.repository.reset();
    this.router.navigate(['/products']);
  }
}
