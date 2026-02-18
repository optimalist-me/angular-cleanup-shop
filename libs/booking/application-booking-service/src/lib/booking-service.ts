/**
 * Application layer for booking service
 *
 * This layer implements the business logic for processing bookings.
 * It orchestrates between the presentation layer (controllers) and
 * infrastructure layer (data persistence and email service).
 */

import * as BookingDatastore from '@angular-cleanup-shop/infrastructure-booking-datastore';
import { sendBookingConfirmationEmail } from '@angular-cleanup-shop/infrastructure-booking-email';
import { BookingRequest } from '@cleanup/models-booking';

export interface ProcessBookingResult {
  success: boolean;
  bookingId?: string;
  message: string;
  error?: string;
}

/**
 * Processes a booking submission:
 * 1. Validates the booking data
 * 2. Saves to the data store
 * 3. Sends a confirmation email
 * 4. Returns the booking ID
 */
export async function processBooking(
  bookingRequest: BookingRequest,
): Promise<ProcessBookingResult> {
  try {
    // Validate required fields
    if (!bookingRequest.email || !bookingRequest.name || bookingRequest.teamSize === undefined || bookingRequest.teamSize === null) {
      return {
        success: false,
        message: 'Missing required fields',
        error: 'Email, name, and team size are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingRequest.email)) {
      return {
        success: false,
        message: 'Invalid email format',
        error: 'Please provide a valid email address',
      };
    }

    // Validate team size
    if (typeof bookingRequest.teamSize !== 'number' || bookingRequest.teamSize < 1 || bookingRequest.teamSize > 100) {
      return {
        success: false,
        message: 'Invalid team size',
        error: 'Team size must be between 1 and 100',
      };
    }

    // Save the booking
    const savedBooking = await BookingDatastore.saveBooking({
      email: bookingRequest.email,
      name: bookingRequest.name,
      company: bookingRequest.company || 'Not provided',
      teamSize: bookingRequest.teamSize,
      notes: bookingRequest.notes,
      preferredDates: bookingRequest.preferredDates,
    });

    // Send confirmation email
    const emailResult = await sendBookingConfirmationEmail({
      bookingId: savedBooking.id,
      email: bookingRequest.email,
      name: bookingRequest.name,
      company: bookingRequest.company || 'Not provided',
      teamSize: bookingRequest.teamSize,
      notes: bookingRequest.notes,
      preferredDates: bookingRequest.preferredDates,
    });

    if (!emailResult.success) {
      console.warn(
        `[BOOKING] Email failed for booking ${savedBooking.id}:`,
        emailResult.error,
      );
    } else {
      // Mark booking as completed (email sent successfully)
      await BookingDatastore.markBookingCompleted(savedBooking.id);
    }

    return {
      success: true,
      bookingId: savedBooking.id,
      message: 'Booking submitted successfully',
    };
  } catch (error) {
    console.error('[BOOKING] Error processing booking:', error);
    return {
      success: false,
      message: 'Error processing booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Retrieves booking details
 */
export async function getBookingDetails(bookingId: string) {
  return BookingDatastore.getBooking(bookingId);
}

/**
 * Retrieves user's bookings by email
 */
export async function getUserBookings(email: string) {
  return BookingDatastore.getBookingsByEmail(email);
}
