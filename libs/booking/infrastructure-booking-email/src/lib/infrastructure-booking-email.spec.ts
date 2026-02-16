import {
  sendBookingConfirmationEmail,
  verifyEmailTransport,
} from './infrastructure-booking-email';
import {
  generateBookingConfirmationHtml,
  generateBookingConfirmationText,
} from './email-templates';
import { BookingEmailData } from './email-templates';
import * as Transporter from './email-transporter';

jest.mock('./email-transporter', () => ({
  getTransporter: jest.fn(),
  initializeTransporter: jest.fn(),
  resetTransporter: jest.fn(),
}));

const baseBooking: BookingEmailData = {
  bookingId: 'booking-100',
  name: 'Riley Lane',
  email: 'riley@example.com',
  company: 'Cleanup Shop',
  teamSize: 4,
  notes: 'Send details',
};

describe('infrastructure booking email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.SMTP_FROM_MAIL;
    delete process.env.SMTP_FROM_EMAIL;
  });

  it('sends a booking confirmation email', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'msg-123' });
    (Transporter.getTransporter as jest.Mock).mockReturnValue({ sendMail });
    process.env.SMTP_FROM_MAIL = 'shop@cleanupshop.local';
    process.env.SMTP_FROM_EMAIL = 'noreply@cleanupshop.local';

    const result = await sendBookingConfirmationEmail(baseBooking);

    expect(result.success).toBe(true);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: baseBooking.email,
        subject: `Booking Confirmation #${baseBooking.bookingId}`,
      }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'shop@cleanupshop.local',
        subject: `New booking submitted #${baseBooking.bookingId}`,
      }),
    );
  });

  it('returns failure when sendMail throws', async () => {
    (Transporter.getTransporter as jest.Mock).mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(new Error('SMTP down')),
    });

    const result = await sendBookingConfirmationEmail(baseBooking);

    expect(result.success).toBe(false);
    expect(result.error).toBe('SMTP down');
  });

  it('verifies transporter connectivity', async () => {
    const verify = jest.fn().mockResolvedValue(true);
    (Transporter.getTransporter as jest.Mock).mockReturnValue({ verify });

    const result = await verifyEmailTransport();

    expect(result).toBe(true);
  });

  it('renders confirmation templates with booking data', () => {
    const html = generateBookingConfirmationHtml(baseBooking);
    const text = generateBookingConfirmationText(baseBooking);

    expect(html).toContain(baseBooking.bookingId);
    expect(html).toContain(baseBooking.name);
    expect(text).toContain(baseBooking.email);
    expect(text).toContain(baseBooking.company);
  });
});
