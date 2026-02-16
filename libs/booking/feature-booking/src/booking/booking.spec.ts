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
    component.onPreferredDate(event);
    expect(component.draft$().scheduledDate).toBe('2026-02-20');
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
