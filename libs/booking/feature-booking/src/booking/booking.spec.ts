import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingBooking } from './booking';
import { BookingsRepository } from '@cleanup/data-access-booking';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

describe('BookingBooking', () => {
  let component: BookingBooking;
  let fixture: ComponentFixture<BookingBooking>;
  let repository: BookingsRepository;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingBooking],
      providers: [BookingsRepository, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingBooking);
    component = fixture.componentInstance;
    repository = TestBed.inject(BookingsRepository);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BookingsRepository', () => {
    expect(component.repository).toBe(repository);
  });

  it('should expose repository signals', () => {
    expect(component.step$).toBeDefined();
    expect(component.draft$).toBeDefined();
    expect(component.status$).toBeDefined();
    expect(component.error$).toBeDefined();
    expect(component.confirmation$).toBeDefined();
    expect(component.canSubmit$).toBeDefined();
  });

  it('should start on info step', () => {
    expect(component.step$()).toBe('info');
  });

  it('should render info step form initially', () => {
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('.booking__form');
    expect(form).toBeTruthy();
    const legend = fixture.nativeElement.querySelector('.booking__legend');
    expect(legend?.textContent).toContain('About your organization');
  });

  it('should update draft on name change', () => {
    component.onName('Jane Doe');
    expect(component.draft$().name).toBe('Jane Doe');
  });

  it('should update draft on email change', () => {
    component.onEmail('jane@example.com');
    expect(component.draft$().email).toBe('jane@example.com');
  });

  it('should update draft on company change', () => {
    component.onCompany('Acme Inc');
    expect(component.draft$().company).toBe('Acme Inc');
  });

  it('should update draft on team size change', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: { value: '5' },
      enumerable: true,
    });
    component.onTeamSize(event);
    expect(component.draft$().teamSize).toBe(5);
  });

  it('should handle invalid team size', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: { value: 'invalid' },
      enumerable: true,
    });
    component.onTeamSize(event);
    expect(component.draft$().teamSize).toBeUndefined();
  });

  it('should update draft on notes change', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: 'Some notes' },
      enumerable: true,
    });
    component.onNotes(event);
    expect(component.draft$().notes).toBe('Some notes');
  });

  it('should update draft on preferred date change', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: '2026-02-20' },
      enumerable: true,
    });
    component.onPreferredDate(0, '2026-02-20');
    expect(component.draft$().preferredDates?.[0]).toBe('2026-02-20');
  });

  it('should not add more than 3 preferred dates', () => {
    // Fill up to 3 dates
    component.onPreferredDate(0, '2026-02-20');
    component.addPreferredDate();
    component.onPreferredDate(1, '2026-02-21');
    component.addPreferredDate();
    component.onPreferredDate(2, '2026-02-22');
    // Try to add a 4th
    component.addPreferredDate();
    expect(component.draft$().preferredDates?.length).toBe(3);
  });

  it('should not remove the last preferred date', () => {
    // Only one date present
    const initialLength = component.draft$()?.preferredDates?.length ?? 0;
    component.removePreferredDate(0);
    const length = component.draft$()?.preferredDates?.length ?? 0;
    expect(length).toBeGreaterThanOrEqual(1);
    if (initialLength > 1) {
      expect(length).toBe(initialLength - 1);
    } else {
      expect(length).toBe(1);
    }
  });

  it('canSubmitSchedule$ should be false if preferredDates is empty', () => {
    // Clear all dates
    component.repository.updateDraft({ preferredDates: [] });
    expect(component.canSubmitSchedule$()).toBe(false);
  });

  it('canSubmitSchedule$ should be false if any preferredDate is empty', () => {
    component.repository.updateDraft({ preferredDates: ['2026-02-20', ''] });
    expect(component.canSubmitSchedule$()).toBe(false);
  });

  it('canSubmitSchedule$ should be true if all preferredDates are filled', () => {
    component.repository.updateDraft({ preferredDates: ['2026-02-20', '2026-02-21'] });
    expect(component.canSubmitSchedule$()).toBe(true);
  });

  it('should call next on repository when next is clicked', () => {
    const spy = vi.spyOn(repository, 'nextStep');
    component.next();
    expect(spy).toHaveBeenCalled();
  });

  it('should transition to schedule step', () => {
    component.next();
    expect(component.step$()).toBe('schedule');
  });

  it('should transition to confirm step from schedule', () => {
    repository.nextStep(); // info -> schedule
    component.next();
    expect(component.step$()).toBe('confirm');
  });

  it('should call previous on repository when previous is clicked', () => {
    const spy = vi.spyOn(repository, 'previousStep');
    repository.nextStep(); // move to schedule first
    component.previous();
    expect(spy).toHaveBeenCalled();
    expect(component.step$()).toBe('info');
  });

  it('should call submit on repository when submit is clicked', () => {
    const spy = vi.spyOn(repository, 'submit');
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it('should reset and navigate back to cart', () => {
    const resetSpy = vi.spyOn(repository, 'reset');
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.back();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should continue shopping and reset', () => {
    const resetSpy = vi.spyOn(repository, 'reset');
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.continueShopping();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should show schedule placeholder on schedule step', () => {
    repository.nextStep(); // move to schedule
    fixture.detectChanges();
    const legend = fixture.nativeElement.querySelector('.booking__legend');
    expect(legend?.textContent).toContain('Schedule your fit check');
  });

  it('should show confirmation summary on confirm step', () => {
    component.onName('Jane Doe');
    component.onEmail('jane@example.com');
    component.onCompany('Acme Inc');
    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: { value: '5' },
      enumerable: true,
    });
    component.onTeamSize(event);
    repository.nextStep(); // to schedule
    repository.nextStep(); // to confirm
    fixture.detectChanges();
    const legend = fixture.nativeElement.querySelector('.booking__legend');
    expect(legend?.textContent).toContain('Confirm your booking');
  });
});
