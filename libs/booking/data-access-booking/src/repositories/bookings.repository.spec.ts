import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BookingRequest, BookingResponse } from '@cleanup/models-booking';
import { BookingsApi } from '../api/bookings.api';
import { BookingsRepository } from './bookings.repository';

describe('BookingsRepository', () => {
  let service: BookingsRepository;
  let api: BookingsApi;

  const request: BookingRequest = {
    name: 'Maya Stone',
    email: 'maya@cleanup.shop',
    company: 'Cleanup Labs',
    teamSize: 8,
    notes: 'Interested in a fit check.',
  };
  const response: BookingResponse = {
    id: 'booking_123',
    createdAt: '2026-02-12T12:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingsRepository,
        {
          provide: BookingsApi,
          useValue: {
            createBooking: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(BookingsRepository);
    api = TestBed.inject(BookingsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the booking draft', () => {
    service.updateDraft({ name: 'Maya' });
    service.updateDraft({ email: 'maya@cleanup.shop' });

    expect(service.draft()).toEqual({
      name: 'Maya',
      email: 'maya@cleanup.shop',
    });
    expect(service.canSubmit()).toBe(false);
  });

  it('should move between steps', () => {
    expect(service.step()).toBe('info');
    service.nextStep();
    expect(service.step()).toBe('schedule');
    service.nextStep();
    expect(service.step()).toBe('confirm');
    service.previousStep();
    expect(service.step()).toBe('schedule');
    service.previousStep();
    expect(service.step()).toBe('info');
    service.previousStep();
    expect(service.step()).toBe('info');
  });

  it('should reset wizard state', () => {
    service.updateDraft(request);
    service.nextStep();
    service.status.set('error');
    service.error.set('Oops');
    service.confirmation.set(response);

    service.reset();

    expect(service.step()).toBe('info');
    expect(service.draft()).toEqual({});
    expect(service.status()).toBe('idle');
    expect(service.error()).toBeNull();
    expect(service.confirmation()).toBeNull();
  });

  it('should submit a booking', () => {
    vi.mocked(api.createBooking).mockReturnValue(of(response));

    service.updateDraft(request);
    service.submit();

    expect(api.createBooking).toHaveBeenCalledWith(request);
    expect(service.status()).toBe('success');
    expect(service.confirmation()).toEqual(response);
    expect(service.step()).toBe('confirm');
    expect(service.error()).toBeNull();
    expect(service.canSubmit()).toBe(true);
  });

  it('should surface submission errors', () => {
    vi.mocked(api.createBooking).mockReturnValue(
      throwError(() => new Error('fail')),
    );

    service.updateDraft(request);
    service.submit();

    expect(service.status()).toBe('error');
    expect(service.error()).toBe('Booking failed. Try again.');
  });

  it('should reject incomplete submissions', () => {
    service.updateDraft({ name: 'Maya' });
    service.submit();

    expect(service.status()).toBe('error');
    expect(service.error()).toBe('Missing required booking details.');
  });

  it('should default notes when missing', () => {
    vi.mocked(api.createBooking).mockReturnValue(of(response));

    service.updateDraft({
      name: 'Maya Stone',
      email: 'maya@cleanup.shop',
      company: 'Cleanup Labs',
      teamSize: 8,
    });
    service.submit();

    expect(api.createBooking).toHaveBeenCalledWith({
      name: 'Maya Stone',
      email: 'maya@cleanup.shop',
      company: 'Cleanup Labs',
      teamSize: 8,
      notes: '',
    });
  });
});
