import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookingsRepository } from '@cleanup/data-access-booking';
import { CartItem, CartRepository } from '@cleanup/data-access-cart';
import { PRIVACY_POLICY_VERSION } from '@cleanup/models-booking';
import { CheckoutCheckout } from './checkout';

describe('CheckoutCheckout', () => {
  let component: CheckoutCheckout;
  let fixture: ComponentFixture<CheckoutCheckout>;
  let cartItems: ReturnType<typeof signal<CartItem[]>>;
  let cartRepositoryStub: {
    items: typeof cartItems;
    itemCount: ReturnType<typeof computed<number>>;
    subtotal: ReturnType<typeof computed<number>>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  let bookingsRepositoryStub: {
    createBooking: ReturnType<typeof vi.fn>;
  };

  const boundaryPolish: CartItem = {
    id: 'boundary-polish',
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    price: 2400,
    imageSrc: '/images/products/boundary-polish.png',
    imageAlt: 'Boundary Polish image',
    quantity: 1,
  };

  beforeEach(async () => {
    cartItems = signal<CartItem[]>([]);
    cartRepositoryStub = {
      items: cartItems,
      itemCount: computed(() =>
        cartItems().reduce((total, item) => total + item.quantity, 0),
      ),
      subtotal: computed(() =>
        cartItems().reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        ),
      ),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    bookingsRepositoryStub = {
      createBooking: vi.fn(() =>
        of({ success: true, bookingId: 'booking-123', message: 'Created' }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutCheckout],
      providers: [
        provideRouter([]),
        { provide: CartRepository, useValue: cartRepositoryStub },
        { provide: BookingsRepository, useValue: bookingsRepositoryStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows no-items review message when cart has no items', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.checkout__empty')?.textContent).toContain(
      'No demo packages selected',
    );
  });

  it('forwards item updates to cart repository', () => {
    component.updateQuantity('boundary-polish', 4);
    component.removeItem('boundary-polish');

    expect(cartRepositoryStub.updateQuantity).toHaveBeenCalledWith(
      'boundary-polish',
      4,
    );
    expect(cartRepositoryStub.removeItem).toHaveBeenCalledWith(
      'boundary-polish',
    );
  });

  it('moves to details step even when there are no cart items', () => {
    component.submissionError.set('previous');

    component.toDetailsStep();

    expect(component.step()).toBe('details');
    expect(component.submissionError()).toBeNull();
  });

  it('moves to details step and clears submission error when items exist', () => {
    cartItems.set([boundaryPolish]);
    component.submissionError.set('previous');

    component.toDetailsStep();

    expect(component.step()).toBe('details');
    expect(component.submissionError()).toBeNull();
  });

  it('renders privacy link in details form', () => {
    component.toDetailsStep();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const link = element.querySelector('a[href="/privacy"]');
    expect(link?.textContent).toContain('privacy policy');
  });

  it('stays on details when details form is invalid and marks controls touched', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();

    component.toScheduleStep();

    expect(component.step()).toBe('details');
    expect(component.detailsForm.controls.name.touched).toBe(true);
    expect(component.detailsForm.controls.email.touched).toBe(true);
  });

  it('moves to schedule when details form is valid', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();
    fillValidDetails(component);
    component.submissionError.set('old');

    component.toScheduleStep();

    expect(component.step()).toBe('schedule');
    expect(component.submissionError()).toBeNull();
  });

  it('supports back navigation helpers', () => {
    component.step.set('schedule');
    component.backToDetails();
    expect(component.step()).toBe('details');

    component.backToReview();
    expect(component.step()).toBe('review');
  });

  it('adds preferred dates up to 3 and stops after that', () => {
    component.addPreferredDate();
    component.addPreferredDate();
    component.addPreferredDate();

    expect(component.preferredDateControls).toHaveLength(3);
  });

  it('handles removing preferred dates for both single and multi-date states', () => {
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

  it('reports control errors using helper methods', () => {
    component.detailsForm.controls.name.markAsTouched();
    component.detailsForm.controls.name.setValue('');
    component.scheduleForm.controls.preferredDates.at(0).markAsTouched();
    component.scheduleForm.controls.preferredDates.at(0).setValue('');

    expect(component.hasDetailsControlError('name', 'required')).toBe(true);
    expect(component.hasDetailsControlError('company', 'required')).toBe(false);
    expect(component.hasPreferredDateError(0)).toBe(true);
  });

  it('marks forms as touched and skips API call when submit is not allowed', () => {
    component.submit();

    expect(component.detailsForm.controls.name.touched).toBe(true);
    expect(component.scheduleForm.controls.preferredDates.at(0).touched).toBe(
      true,
    );
    expect(bookingsRepositoryStub.createBooking).not.toHaveBeenCalled();
  });

  it('handles null payload returned by buildRequest', () => {
    cartItems.set([boundaryPolish]);
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    vi.spyOn(
      component as unknown as { buildRequest: () => unknown },
      'buildRequest',
    ).mockReturnValue(null);

    component.submit();

    expect(component.submissionError()).toBe(
      'Missing required checkout details.',
    );
    expect(bookingsRepositoryStub.createBooking).not.toHaveBeenCalled();
  });

  it('surfaces API errors from submit', () => {
    cartItems.set([boundaryPolish]);
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    bookingsRepositoryStub.createBooking.mockReturnValue(
      throwError(() => new Error('network')),
    );

    component.submit();

    expect(component.submitting()).toBe(false);
    expect(component.submissionError()).toBe(
      'We could not submit your request. Please try again.',
    );
    expect(cartRepositoryStub.clear).not.toHaveBeenCalled();
  });

  it('surfaces unsuccessful API responses', () => {
    cartItems.set([boundaryPolish]);
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    bookingsRepositoryStub.createBooking.mockReturnValue(
      of({ success: false, message: 'Server rejected booking' }),
    );

    component.submit();

    expect(component.submitting()).toBe(false);
    expect(component.submissionError()).toBe('Server rejected booking');
    expect(cartRepositoryStub.clear).not.toHaveBeenCalled();
  });

  it('submits checkout and navigates to confirmation on success', () => {
    cartItems.set([{ ...boundaryPolish, quantity: 2 }]);
    fillValidDetails(component, { usesNx: 'no' });
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.submit();

    expect(bookingsRepositoryStub.createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        usesNx: false,
        privacyPolicyAccepted: true,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      }),
    );
    expect(cartRepositoryStub.clear).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/book/confirmed',
      'booking-123',
    ]);
  });

  it('returns null from buildRequest for invalid edge cases', () => {
    cartItems.set([boundaryPolish]);
    fillValidDetails(component);
    component.scheduleForm.controls.preferredDates.at(0).setValue('2026-03-20');

    component.detailsForm.controls.teamSize.setValue(null);
    expect(
      (component as unknown as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();

    component.detailsForm.controls.teamSize.setValue(8);
    component.detailsForm.controls.usesNx.setValue('');
    expect(
      (component as unknown as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();

    component.detailsForm.controls.usesNx.setValue('yes');
    component.detailsForm.controls.privacyPolicyAccepted.setValue(false);
    expect(
      (component as unknown as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();

    component.detailsForm.controls.privacyPolicyAccepted.setValue(true);
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
      (component as unknown as { buildRequest: () => unknown }).buildRequest(),
    ).toBeNull();
  });
});

function fillValidDetails(
  component: CheckoutCheckout,
  options?: { usesNx?: 'yes' | 'no' },
): void {
  component.detailsForm.setValue({
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    angularVersion: '21',
    usesNx: options?.usesNx ?? 'yes',
    notes: 'Need a calmer review flow.',
    privacyPolicyAccepted: true,
  });
}
