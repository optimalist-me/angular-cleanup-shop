export {
  sendBookingConfirmationEmail,
  verifyEmailTransport,
} from './lib/infrastructure-booking-email';
export {
  initializeTransporter,
  getTransporter,
  resetTransporter,
} from './lib/email-transporter';
export {
  generateBookingConfirmationHtml,
  generateBookingConfirmationText,
} from './lib/email-templates';
export type { EmailSendResult } from './lib/infrastructure-booking-email';
export type { BookingEmailData } from './lib/email-templates';
