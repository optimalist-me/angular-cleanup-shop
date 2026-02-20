import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { BookingsRepository } from '@cleanup/data-access-booking';
import { BookingBooking } from './booking';

describe('BookingBooking', () => {
  let fixture: ComponentFixture<BookingBooking>;
  let component: BookingBooking;
  let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let bookingsRepositoryStub: {
    getBookingById: ReturnType<typeof vi.fn>;
    createBooking: ReturnType<typeof vi.fn>;
  };

  const successResponse = {
    success: true,
    booking: {
      id: 'booking-1',
      name: 'Maya Stone',
      email: 'maya@cleanup.shop',
      company: 'Cleanup Labs',
      teamSize: 8,
      angularVersion: '21',
      usesNx: true,
      painArea: 'boundaries' as const,
      notes: 'Need guidance',
      preferredDates: ['2026-03-11'],
      createdAt: '2026-03-01T00:00:00.000Z',
    },
  };

  async function setup(options?: {
    bookingId?: string | null;
    getResponse$?: Observable<unknown>;
    createResponse$?: Observable<unknown>;
  }): Promise<void> {
    const bookingId = options?.bookingId;
    paramMap$ = new BehaviorSubject(
      convertToParamMap(bookingId ? { bookingId } : {}),
    );

    bookingsRepositoryStub = {
      getBookingById: vi.fn(() => options?.getResponse$ ?? of(successResponse)),
      createBooking: vi.fn(
        () =>
          options?.createResponse$ ??
          of({
            success: true,
            bookingId: 'booking-123',
            message: 'Created',
          }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [BookingBooking],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMap$.asObservable() },
        },
        {
          provide: BookingsRepository,
          useValue: bookingsRepositoryStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('shows booking form when bookingId route param is absent', async () => {
    await setup();
    fixture.detectChanges();

    expect(component.isConfirmation()).toBe(false);
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.booking__title')?.textContent).toContain(
      'Request a 20-min fit check',
    );
  });

  it('does not fetch booking details when bookingId route param is absent', async () => {
    await setup();

    expect(bookingsRepositoryStub.getBookingById).not.toHaveBeenCalled();
  });

  it('stays on details when details form is invalid and marks controls touched', async () => {
    await setup();

    component.toScheduleStep();

    expect(component.step()).toBe('details');
    expect(component.detailsForm.controls.name.touched).toBe(true);
    expect(component.detailsForm.controls.email.touched).toBe(true);
  });

  it('moves to schedule when details form is valid', async () => {
    await setup();
    fillValidDetails(component);
    component.submissionError.set('previous');

    component.toScheduleStep();

    expect(component.step()).toBe('schedule');
    expect(component.submissionError()).toBeNull();
  });

  it('supports back navigation helper', async () => {
    await setup();
    component.step.set('schedule');
    component.backToDetails();
    expect(component.step()).toBe('details');
  });

  it('adds preferred dates up to 3 and stops after that', async () => {
    await setup();

    component.addPreferredDate();
    component.addPreferredDate();
    component.addPreferredDate();

    expect(component.preferredDateControls).toHaveLength(3);
  });

  it('handles removing preferred dates for both single and multi-date states', async () => {
    await setup();

    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    component.removePreferredDate(0);
    expect(component.preferredDateControls).toHaveLength(1);
    expect(component.preferredDateControls[0].value).toBe('');

    component.addPreferredDate();
    component.preferredDateControls[0].setValue('2026-03-20');
    component.preferredDateControls[1].setValue('2026-03-21');

    component.removePreferredDate(1);

    expect(component.preferredDateControls).toHaveLength(1);
    expect(component.scheduleForm.controls.preferredDates.dirty).toBe(true);
  });

  it('reports helper-based control errors', async () => {
    await setup();

    component.detailsForm.controls.name.markAsTouched();
    component.detailsForm.controls.name.setValue('');
    component.scheduleForm.controls.preferredDates.at(0).markAsTouched();
    component.scheduleForm.controls.preferredDates.at(0).setValue('');

    expect(component.hasDetailsControlError('name', 'required')).toBe(true);
    expect(component.hasDetailsControlError('company', 'required')).toBe(false);
    expect(component.hasPreferredDateError(0)).toBe(true);
  });

  it('marks forms touched and skips submit when submit is not allowed', async () => {
    await setup();

    component.submitBooking();

    expect(component.detailsForm.controls.name.touched).toBe(true);
    expect(component.scheduleForm.controls.preferredDates.at(0).touched).toBe(
      true,
    );
    expect(bookingsRepositoryStub.createBooking).not.toHaveBeenCalled();
  });

  it('handles null payload returned by buildRequest', async () => {
    await setup();
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    vi.spyOn(
      component as object as { buildRequest: () => unknown },
      'buildRequest',
    ).mockReturnValue(null);

    component.submitBooking();

    expect(component.submissionError()).toBe(
      'Missing required booking details.',
    );
    expect(bookingsRepositoryStub.createBooking).not.toHaveBeenCalled();
  });

  it('surfaces API errors from submit', async () => {
    await setup({
      createResponse$: throwError(() => new Error('network down')),
    });
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');

    component.submitBooking();

    expect(component.submitting()).toBe(false);
    expect(component.submissionError()).toBe(
      'We could not submit your request. Please try again.',
    );
  });

  it('surfaces unsuccessful API responses', async () => {
    await setup({
      createResponse$: of({
        success: false,
        message: 'Server rejected booking',
      }),
    });
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');

    component.submitBooking();

    expect(component.submitting()).toBe(false);
    expect(component.submissionError()).toBe('Server rejected booking');
  });

  it('submits booking and navigates to confirmation on success', async () => {
    await setup();
    fillValidDetails(component, { usesNx: 'no' });
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.submitBooking();

    expect(bookingsRepositoryStub.createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        usesNx: false,
      }),
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/book/confirmed',
      'booking-123',
    ]);
  });

  it('returns null from buildRequest for invalid edge cases', async () => {
    await setup();
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');

    component.detailsForm.controls.teamSize.setValue(null);
    expect(
      (component as object as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();

    component.detailsForm.controls.teamSize.setValue(8);
    component.detailsForm.controls.usesNx.setValue('');
    expect(
      (component as object as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();

    component.detailsForm.controls.usesNx.setValue('yes');
    component.scheduleForm.controls.preferredDates.push(
      new FormControl('2026-03-21', { nonNullable: true }),
    );
    component.scheduleForm.controls.preferredDates.push(
      new FormControl('2026-03-22', { nonNullable: true }),
    );
    component.scheduleForm.controls.preferredDates.push(
      new FormControl('2026-03-23', { nonNullable: true }),
    );
    component.preferredDateControls.forEach((control, index) => {
      control.setValue(`2026-03-${String(index + 20).padStart(2, '0')}`);
    });
    expect(
      (component as object as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();
  });

  it('fetches booking details from bookingId route param', async () => {
    await setup({ bookingId: 'booking-1' });

    expect(component.isConfirmation()).toBe(true);
    expect(bookingsRepositoryStub.getBookingById).toHaveBeenCalledWith(
      'booking-1',
    );
  });

  it('renders confirmation content when booking exists', async () => {
    await setup({ bookingId: 'booking-1' });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.confirmation__title')?.textContent,
    ).toContain('Appointment request received');
    expect(
      element.querySelector('.confirmation__summary')?.textContent,
    ).toContain('booking-1');
  });

  it('surfaces API not-found message from response', async () => {
    await setup({
      bookingId: 'missing-booking',
      getResponse$: of({
        success: false,
        message: 'Booking not found',
      }),
    });

    expect(component.error()).toBe('Booking not found');
  });

  it('uses default not-found message when API omits one', async () => {
    await setup({
      bookingId: 'missing-booking',
      getResponse$: of({
        success: false,
      }),
    });

    expect(component.error()).toBe('Booking could not be found.');
  });

  it('surfaces transport failures from confirmation API call', async () => {
    await setup({
      bookingId: 'booking-1',
      getResponse$: throwError(() => new Error('network down')),
    });

    expect(component.error()).toBe('Could not load booking details.');
    expect(component.loading()).toBe(false);
  });
});

function fillValidDetails(
  component: BookingBooking,
  options?: { usesNx?: 'yes' | 'no' },
): void {
  component.detailsForm.setValue({
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    angularVersion: '21',
    usesNx: options?.usesNx ?? 'yes',
    notes: 'Need guidance',
  });
}
