/**
 * Application layer for booking service.
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
    const validationError = validateBookingRequest(bookingRequest);
    if (validationError) {
      return {
        success: false,
        message: validationError.message,
        error: validationError.error,
      };
    }

    const savedBooking = await BookingDatastore.saveBooking({
      email: bookingRequest.email,
      name: bookingRequest.name,
      company: bookingRequest.company,
      teamSize: bookingRequest.teamSize,
      angularVersion: bookingRequest.angularVersion,
      usesNx: bookingRequest.usesNx,
      painArea: bookingRequest.painArea ?? 'boundaries',
      notes: bookingRequest.notes,
      preferredDates: bookingRequest.preferredDates,
    });

    const emailResult = await sendBookingConfirmationEmail({
      bookingId: savedBooking.id,
      email: bookingRequest.email,
      name: bookingRequest.name,
      company: bookingRequest.company,
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
 * Retrieves booking details.
 */
export async function getBookingDetails(bookingId: string) {
  return BookingDatastore.getBooking(bookingId);
}

/**
 * Retrieves user's bookings by email.
 */
export async function getUserBookings(email: string) {
  return BookingDatastore.getBookingsByEmail(email);
}

function validateBookingRequest(bookingRequest: BookingRequest): {
  message: string;
  error: string;
} | null {
  if (
    !bookingRequest.email ||
    !bookingRequest.name ||
    !bookingRequest.company ||
    !bookingRequest.angularVersion ||
    bookingRequest.teamSize === undefined ||
    bookingRequest.teamSize === null
  ) {
    return {
      message: 'Missing required fields',
      error: 'Email, name, company, angularVersion, and teamSize are required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(bookingRequest.email)) {
    return {
      message: 'Invalid email format',
      error: 'Please provide a valid email address',
    };
  }

  if (
    typeof bookingRequest.teamSize !== 'number' ||
    bookingRequest.teamSize < 1 ||
    bookingRequest.teamSize > 100
  ) {
    return {
      message: 'Invalid team size',
      error: 'Team size must be between 1 and 100',
    };
  }

  if (!Array.isArray(bookingRequest.preferredDates)) {
    return {
      message: 'Invalid preferred dates',
      error: 'Preferred dates must be an array',
    };
  }

  if (
    bookingRequest.preferredDates.length < 1 ||
    bookingRequest.preferredDates.length > 3
  ) {
    return {
      message: 'Invalid preferred dates',
      error: 'Provide between 1 and 3 preferred dates',
    };
  }

  const hasEmptyDate = bookingRequest.preferredDates.some(
    (value) => typeof value !== 'string' || value.trim().length === 0,
  );
  if (hasEmptyDate) {
    return {
      message: 'Invalid preferred dates',
      error: 'Preferred dates must be non-empty values',
    };
  }

  return null;
}
