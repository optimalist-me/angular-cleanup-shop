/**
 * Email template generation for booking confirmations
 */

export interface BookingEmailData {
  bookingId: string;
  name: string;
  email: string;
  company: string;
  teamSize: number;
  angularVersion: string;
  usesNx: boolean;
  notes?: string;
  preferredDates?: string[];
}

/**
 * Generate HTML email template
 */
export function generateBookingConfirmationHtml(
  data: BookingEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request Confirmation</title>
      <style>
        body {
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          background: #f7f8f9;
          color: #1f2933;
          margin: 0;
          padding: 0;
        }
        .container {
          background: #fff;
          border: 1px solid #d6dde3;
          border-radius: 16px;
          max-width: 520px;
          margin: 40px auto;
          padding: 40px 32px 32px 32px;
          box-shadow: 0 2px 8px rgba(31,41,51,0.04);
        }
        .header {
          text-align: left;
          margin-bottom: 32px;
        }
        .header-title {
          color: #1a7f68;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: 0.01em;
        }
        .header-sub {
          color: #5b6770;
          font-size: 16px;
          margin: 0;
        }
        .section {
          margin-bottom: 28px;
        }
        .section-title {
          color: #1a7f68;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .details-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .details-label {
          color: #5b6770;
          font-size: 14px;
          font-weight: 500;
          padding-right: 12px;
          text-align: left;
          width: 120px;
        }
        .details-value {
          color: #1f2933;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
        }
        .confirmation {
          background: #f4f7f6;
          border-left: 4px solid #1a7f68;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 24px 0 0 0;
          font-size: 14px;
          color: #1a7f68;
          font-family: 'JetBrains Mono', 'IBM Plex Mono', 'SFMono-Regular', monospace;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #5b6770;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
          padding-top: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-title">Request Confirmed</div>
          <div class="header-sub">Thank you for your submission. We appreciate your interest.</div>
        </div>
        <div class="section">
          <div class="section-title">Summary</div>
          <table class="details-table">
            <tr>
              <td class="details-label">Request ID:</td>
              <td class="details-value">${escapeHtml(data.bookingId)}</td>
            </tr>
            <tr>
              <td class="details-label">Name:</td>
              <td class="details-value">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td class="details-label">Email:</td>
              <td class="details-value">${escapeHtml(data.email)}</td>
            </tr>
            <tr>
              <td class="details-label">Company:</td>
              <td class="details-value">${escapeHtml(data.company)}</td>
            </tr>
            <tr>
              <td class="details-label">Team Size:</td>
              <td class="details-value">${data.teamSize} team members</td>
            </tr>
            <tr>
              <td class="details-label">Angular Version:</td>
              <td class="details-value">${escapeHtml(data.angularVersion)}</td>
            </tr>
            <tr>
              <td class="details-label">Using Nx:</td>
              <td class="details-value">${data.usesNx ? 'Yes' : 'No'}</td>
            </tr>
            ${data.preferredDates && data.preferredDates.length > 0 ? `<tr><td class="details-label">Preferred Dates:</td><td class="details-value">${data.preferredDates.map((date) => escapeHtml(date)).join(', ')}</td></tr>` : ''}
            ${data.notes ? `<tr><td class="details-label">Notes:</td><td class="details-value">${escapeHtml(data.notes)}</td></tr>` : ''}
          </table>
        </div>
        <div class="confirmation">
          Confirmation ID: ${escapeHtml(data.bookingId)}
        </div>
        <div class="section" style="margin-top: 32px;">
          <div style="color: #1f2933; font-size: 15px; line-height: 1.7;">
            We've received your request and will review it shortly. You can expect to hear from us within 24 hours.<br><br>
            If you have any questions, please reply to this email or contact our team.<br><br>
            Best regards,<br>
            The Angular Cleanup Shop Team
          </div>
        </div>
        <div class="footer">
          This is an automated email. Please do not reply directly to this message.<br>
          &copy; ${new Date().getFullYear()} Cleanup Shop. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email template
 */
export function generateBookingConfirmationText(
  data: BookingEmailData,
): string {
  return `
Request Confirmation
====================

Hello ${data.name},

Your request has been successfully submitted. Here are the details:

Request ID: ${data.bookingId}
Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Team Size: ${data.teamSize} team members
Angular Version: ${data.angularVersion}
Using Nx: ${data.usesNx ? 'Yes' : 'No'}
${data.preferredDates && data.preferredDates.length > 0 ? `Preferred Dates: ${data.preferredDates.join(', ')}` : ''}
${data.notes ? `Notes: ${data.notes}` : ''}

We've received your request and will review it shortly. You can expect to hear from us within 24 hours.

If you have any questions, please reply to this email or contact our team.

Best regards,
The Angular Cleanup Shop Team

---
This is an automated email. Please do not reply directly to this message.
© ${new Date().getFullYear()} Cleanup Shop. All rights reserved.
  `.trim();
}

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
