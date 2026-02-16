import * as BookingDatastore from '@angular-cleanup-shop/infrastructure-booking-datastore';
import * as EmailService from '@angular-cleanup-shop/infrastructure-booking-email';
import { BookingRequest } from '@cleanup/models-booking';
import {
  processBooking,
  getBookingDetails,
  getUserBookings,
} from './booking-service';

jest.mock('@angular-cleanup-shop/infrastructure-booking-datastore', () => ({
  saveBooking: jest.fn(),
  markBookingCompleted: jest.fn(),
  getBooking: jest.fn(),
  getBookingsByEmail: jest.fn(),
}));

jest.mock('@angular-cleanup-shop/infrastructure-booking-email', () => ({
  sendBookingConfirmationEmail: jest.fn(),
}));

const baseRequest: BookingRequest = {
  name: 'Avery West',
  email: 'avery@example.com',
  company: 'Cleanup Shop',
  teamSize: 5,
  notes: 'Please send details',
};

describe('booking service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects missing required fields', async () => {
    const result = await processBooking({ ...baseRequest, email: '' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Missing required fields');
    expect(BookingDatastore.saveBooking).not.toHaveBeenCalled();
  });

  it('rejects invalid email format', async () => {
    const result = await processBooking({ ...baseRequest, email: 'invalid' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email format');
  });

  it('rejects invalid team size', async () => {
    const result = await processBooking({ ...baseRequest, teamSize: 0 });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid team size');
  });

  it('processes booking and sends confirmation email', async () => {
    (BookingDatastore.saveBooking as jest.Mock).mockResolvedValue({
      id: 'booking-123',
      createdAt: '2025-01-01T00:00:00.000Z',
      ...baseRequest,
    });
    (EmailService.sendBookingConfirmationEmail as jest.Mock).mockResolvedValue({
      success: true,
      messageId: 'msg-123',
    });

    const result = await processBooking(baseRequest);

    expect(result.success).toBe(true);
    expect(result.bookingId).toBe('booking-123');
    expect(BookingDatastore.markBookingCompleted).toHaveBeenCalledWith(
      'booking-123',
    );
  });

  it('does not mark booking completed when email fails', async () => {
    (BookingDatastore.saveBooking as jest.Mock).mockResolvedValue({
      id: 'booking-456',
      createdAt: '2025-01-01T00:00:00.000Z',
      ...baseRequest,
    });
    (EmailService.sendBookingConfirmationEmail as jest.Mock).mockResolvedValue({
      success: false,
      error: 'SMTP failed',
    });

    const result = await processBooking(baseRequest);

    expect(result.success).toBe(true);
    expect(BookingDatastore.markBookingCompleted).not.toHaveBeenCalled();
  });

  it('returns booking details and user bookings', async () => {
    (BookingDatastore.getBooking as jest.Mock).mockResolvedValue({
      id: 'booking-1',
    });
    (BookingDatastore.getBookingsByEmail as jest.Mock).mockResolvedValue([
      { id: 'booking-2' },
    ]);

    await getBookingDetails('booking-1');
    await getUserBookings('avery@example.com');

    expect(BookingDatastore.getBooking).toHaveBeenCalledWith('booking-1');
    expect(BookingDatastore.getBookingsByEmail).toHaveBeenCalledWith(
      'avery@example.com',
    );
  });
});
