/**
 * Presentation layer for booking REST endpoints
 *
 * This layer defines the HTTP controllers and routes for the booking API.
 * It receives HTTP requests, validates them, calls the application layer,
 * and returns HTTP responses.
 */

import { Router, Request, Response } from 'express';
import {
  processBooking,
  getBookingDetails,
  getUserBookings,
} from '@angular-cleanup-shop/application-booking-service';
import { BookingRequest } from '@cleanup/models-booking';

export function createBookingRouter(): Router {
  const router = Router();

  /**
   * POST /api/bookings
   * Submit a new booking
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      const bookingRequest: BookingRequest = req.body;

      const result = await processBooking(bookingRequest);

      if (result.success) {
        res.status(201).json({
          success: true,
          bookingId: result.bookingId,
          message: result.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('[CONTROLLER] Error in POST /bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * GET /api/bookings/:id
   * Get booking details
   */
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await getBookingDetails(id);

      if (!booking) {
        res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error('[CONTROLLER] Error in GET /bookings/:id:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * GET /api/bookings?email=user@example.com
   * Get user's bookings by email
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Email query parameter is required',
        });
        return;
      }

      const bookings = await getUserBookings(email);

      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (error) {
      console.error('[CONTROLLER] Error in GET /bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
