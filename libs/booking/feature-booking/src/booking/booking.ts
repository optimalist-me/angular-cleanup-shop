import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingsRepository } from '@cleanup/data-access-booking';
import {
  BookingDetails,
  BookingRequest,
  PRIVACY_POLICY_VERSION,
} from '@cleanup/models-booking';
import {
  BookingStepper,
  type BookingStepperItem,
} from '@cleanup/ui-booking-stepper';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { catchError, map, of, startWith, switchMap, take } from 'rxjs';

type ConfirmationState = {
  loading: boolean;
  bookingId: string | null;
  booking: BookingDetails | null;
  error: string | null;
};

type BookingStep = 'details' | 'schedule';

@Component({
  selector: 'booking-booking',
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    BookingStepper,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingBooking {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingsRepository = inject(BookingsRepository);
  private readonly router = inject(Router);

  readonly step = signal<BookingStep>('details');
  readonly bookingSteps: BookingStepperItem[] = [
    { id: 'details', label: 'Details', number: 1 },
    { id: 'schedule', label: 'Schedule & confirm', number: 2 },
  ];
  readonly submitting = signal(false);
  readonly submissionError = signal<string | null>(null);

  readonly detailsForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    teamSize: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1), Validators.max(100)],
    }),
    angularVersion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(40)],
    }),
    usesNx: new FormControl<'yes' | 'no' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    privacyPolicyAccepted: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  readonly scheduleForm = new FormGroup({
    preferredDates: new FormArray<FormControl<string>>(
      [
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      ],
      { validators: [preferredDatesValidator] },
    ),
  });

  private readonly detailsStatus = toSignal(
    this.detailsForm.statusChanges.pipe(startWith(this.detailsForm.status)),
    { initialValue: this.detailsForm.status },
  );
  private readonly scheduleStatus = toSignal(
    this.scheduleForm.statusChanges.pipe(startWith(this.scheduleForm.status)),
    { initialValue: this.scheduleForm.status },
  );

  readonly confirmationState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('bookingId')),
      switchMap((bookingId) => {
        if (!bookingId) {
          return of<ConfirmationState>({
            loading: false,
            bookingId: null,
            booking: null,
            error: null,
          });
        }

        return this.bookingsRepository.getBookingById(bookingId).pipe(
          map((response) => {
            if (response.success && response.booking) {
              return {
                loading: false,
                bookingId,
                booking: response.booking,
                error: null,
              } satisfies ConfirmationState;
            }

            return {
              loading: false,
              bookingId,
              booking: null,
              error: response.message ?? 'Booking could not be found.',
            } satisfies ConfirmationState;
          }),
          startWith({
            loading: true,
            bookingId,
            booking: null,
            error: null,
          } satisfies ConfirmationState),
          catchError(() =>
            of<ConfirmationState>({
              loading: false,
              bookingId,
              booking: null,
              error: 'Could not load booking details.',
            }),
          ),
        );
      }),
    ),
    {
      initialValue: {
        loading: true,
        bookingId: null,
        booking: null,
        error: null,
      } satisfies ConfirmationState,
    },
  );

  readonly isConfirmation = computed(
    () => this.confirmationState().bookingId !== null,
  );
  readonly booking = computed(() => this.confirmationState().booking);
  readonly error = computed(() => this.confirmationState().error);
  readonly loading = computed(() => this.confirmationState().loading);
  readonly canContinueFromDetails = computed(
    () => this.detailsStatus() === 'VALID',
  );
  readonly canSubmit = computed(
    () =>
      this.detailsStatus() === 'VALID' &&
      this.scheduleStatus() === 'VALID' &&
      !this.submitting(),
  );

  get preferredDateControls(): FormControl<string>[] {
    return this.scheduleForm.controls.preferredDates.controls;
  }

  toScheduleStep(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    this.submissionError.set(null);
    this.step.set('schedule');
  }

  backToDetails(): void {
    this.step.set('details');
  }

  addPreferredDate(): void {
    const dates = this.scheduleForm.controls.preferredDates;
    if (dates.length >= 3) {
      return;
    }

    dates.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
    dates.markAsDirty();
    dates.updateValueAndValidity();
  }

  removePreferredDate(index: number): void {
    const dates = this.scheduleForm.controls.preferredDates;
    if (dates.length === 1) {
      dates.at(0).setValue('');
      dates.at(0).markAsTouched();
      dates.updateValueAndValidity();
      return;
    }

    dates.removeAt(index);
    dates.markAsDirty();
    dates.updateValueAndValidity();
  }

  submitBooking(): void {
    if (!this.canSubmit()) {
      this.detailsForm.markAllAsTouched();
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const payload = this.buildRequest();
    if (!payload) {
      this.submissionError.set('Missing required booking details.');
      return;
    }

    this.submitting.set(true);
    this.submissionError.set(null);

    this.bookingsRepository
      .createBooking(payload)
      .pipe(
        take(1),
        catchError(() => {
          this.submitting.set(false);
          this.submissionError.set(
            'We could not submit your request. Please try again.',
          );
          return of(null);
        }),
      )
      .subscribe((response) => {
        this.submitting.set(false);
        if (!response) {
          return;
        }

        if (!response.success || !response.bookingId) {
          this.submissionError.set(
            response.message ?? 'We could not submit your request.',
          );
          return;
        }

        void this.router.navigate(['/book/confirmed', response.bookingId]);
      });
  }

  hasDetailsControlError(
    controlName: keyof typeof this.detailsForm.controls,
    errorKey: string,
  ): boolean {
    const control = this.detailsForm.controls[controlName];
    return Boolean(control.touched && control.hasError(errorKey));
  }

  hasPreferredDateError(index: number): boolean {
    const control = this.scheduleForm.controls.preferredDates.at(index);
    return Boolean(control.touched && control.invalid);
  }

  private buildRequest(): BookingRequest | null {
    const teamSize = this.detailsForm.controls.teamSize.value;
    if (teamSize === null) {
      return null;
    }

    const usesNxValue = this.detailsForm.controls.usesNx.value;
    if (!usesNxValue) {
      return null;
    }
    const privacyPolicyAccepted =
      this.detailsForm.controls.privacyPolicyAccepted.value;
    if (!privacyPolicyAccepted) {
      return null;
    }

    const preferredDates = this.scheduleForm.controls.preferredDates.controls
      .map((control) => control.value.trim())
      .filter((value) => value.length > 0);

    if (preferredDates.length === 0 || preferredDates.length > 3) {
      return null;
    }

    return {
      name: this.detailsForm.controls.name.value.trim(),
      email: this.detailsForm.controls.email.value.trim(),
      company: this.detailsForm.controls.company.value.trim(),
      teamSize,
      angularVersion: this.detailsForm.controls.angularVersion.value.trim(),
      usesNx: usesNxValue === 'yes',
      notes: this.detailsForm.controls.notes.value.trim(),
      preferredDates,
      privacyPolicyAccepted,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    };
  }
}

const preferredDatesValidator: ValidatorFn = (control) => {
  if (!(control instanceof FormArray)) {
    return null;
  }

  if (control.length === 0 || control.length > 3) {
    return { preferredDatesCount: true };
  }

  const hasEmptyDate = control.controls.some(
    (dateControl) => dateControl.value.trim().length === 0,
  );
  return hasEmptyDate ? { preferredDatesRequired: true } : null;
};
