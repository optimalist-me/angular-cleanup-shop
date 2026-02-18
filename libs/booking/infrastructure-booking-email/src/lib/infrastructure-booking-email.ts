/**
 * Booking email service
 * Handles sending booking confirmation emails via nodemailer
 */

import { getTransporter } from './email-transporter';
import {
  generateBookingConfirmationHtml,
  generateBookingConfirmationText,
  BookingEmailData,
} from './email-templates';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  bookingData: BookingEmailData,
): Promise<EmailSendResult> {
  try {
    const transporter = getTransporter();

    // Get sender email from environment or use default
    const fromEmail =
      process.env.SMTP_FROM_EMAIL || 'noreply@cleanupshop.local';
    const fromName = process.env.SMTP_FROM_NAME || 'Cleanup Shop';
    // Use a dedicated notification email if set, otherwise fallback to sender
    const notificationEmail =
      process.env.SMTP_NOTIFICATION_EMAIL || process.env.SMTP_FROM_EMAIL;

    // Generate email content
    const htmlContent = generateBookingConfirmationHtml(bookingData);
    const textContent = generateBookingConfirmationText(bookingData);

    // Send customer email
    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: bookingData.email,
      subject: `Booking Confirmation #${bookingData.bookingId}`,
      text: textContent,
      html: htmlContent,
      replyTo: process.env.SMTP_REPLY_TO || 'support@cleanupshop.local',
    });

    if (
      notificationEmail &&
      notificationEmail !== bookingData.email // Avoid sending twice to the same address
    ) {
      await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: notificationEmail,
        subject: `New request submitted #${bookingData.bookingId}`,
        text: textContent,
        html: htmlContent,
        replyTo: process.env.SMTP_REPLY_TO || 'support@cleanupshop.local',
      });
    }

    console.log('[EMAIL] Request confirmation sent:', {
      to: bookingData.email,
      messageId: info.messageId,
      bookingId: bookingData.bookingId,
    });

    return {
      success: true,
      messageId: info.messageId || info.response,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL] Failed to send request confirmation:', {
      email: bookingData.email,
      bookingId: bookingData.bookingId,
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify email transporter connectivity
 * Useful for startup checks
 */
export async function verifyEmailTransport(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified');
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.warn('[EMAIL] SMTP verification failed:', errorMessage);
    return false;
  }
}
