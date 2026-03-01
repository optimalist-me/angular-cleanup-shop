import { Request, Response } from 'express';
import { type ILayer } from 'express-serve-static-core';
import { createBookingRouter } from './booking-controller';
import * as BookingService from '@angular-cleanup-shop/application-booking-service';

jest.mock('@angular-cleanup-shop/application-booking-service', () => ({
  processBooking: jest.fn(),
  getBookingDetails: jest.fn(),
  getUserBookings: jest.fn(),
}));

type Handler = (
  req: Partial<Request>,
  res: Partial<Response>,
) => Promise<void> | void;

function createResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function findHandler(method: 'get' | 'post', path: string): Handler {
  const router = createBookingRouter();
  const layer = router.stack.find(
    (entry) =>
      entry.route?.path === path &&
      entry.route?.stack?.some((h: ILayer) => h.method === method),
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  return layer.route.stack[0].handle as Handler;
}

describe('booking controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 on successful booking submission', async () => {
    (BookingService.processBooking as jest.Mock).mockResolvedValue({
      success: true,
      bookingId: 'booking-1',
      message: 'Booking submitted successfully',
    });

    const handler = findHandler('post', '/');
    const res = createResponse();

    await handler({ body: { email: 'lena@example.com' } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      bookingId: 'booking-1',
      message: 'Booking submitted successfully',
    });
  });

  it('returns 400 when booking submission fails', async () => {
    (BookingService.processBooking as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Invalid email format',
      error: 'Please provide a valid email address',
    });

    const handler = findHandler('post', '/');
    const res = createResponse();

    await handler({ body: { email: 'bad' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns booking details when found', async () => {
    (BookingService.getBookingDetails as jest.Mock).mockResolvedValue({
      id: 'booking-2',
    });

    const handler = findHandler('get', '/:id');
    const res = createResponse();

    await handler({ params: { id: 'booking-2' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      booking: { id: 'booking-2' },
    });
  });

  it('returns 404 when booking not found', async () => {
    (BookingService.getBookingDetails as jest.Mock).mockResolvedValue(null);

    const handler = findHandler('get', '/:id');
    const res = createResponse();

    await handler({ params: { id: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 400 when email query is missing', async () => {
    const handler = findHandler('get', '/');
    const res = createResponse();

    await handler({ query: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns bookings for a valid email query', async () => {
    (BookingService.getUserBookings as jest.Mock).mockResolvedValue([
      { id: 'booking-3' },
    ]);

    const handler = findHandler('get', '/');
    const res = createResponse();

    await handler({ query: { email: 'lena@example.com' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      bookings: [{ id: 'booking-3' }],
    });
  });
});
