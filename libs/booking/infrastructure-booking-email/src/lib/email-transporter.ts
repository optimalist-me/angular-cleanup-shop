/**
 * Email transporter configuration using nodemailer
 * Centralizes SMTP configuration and transporter setup
 */

import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailTransporterConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user?: string;
    pass?: string;
  };
}

let transporter: Transporter | null = null;

/**
 * Initialize the email transporter with configuration
 * Uses environment variables by default, falls back to test transporter
 */
export function initializeTransporter(
  config?: EmailTransporterConfig,
): Transporter {
  if (transporter) {
    return transporter;
  }

  const transportConfig = config || getConfigFromEnv();

  transporter = nodemailer.createTransport(transportConfig);
  return transporter;
}

/**
 * Get email configuration from environment variables
 */
function getConfigFromEnv(): EmailTransporterConfig {
  // Production: Use real SMTP service
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  }

  // Development: Use test transporter (logs to console)
  console.warn('[EMAIL] No SMTP credentials found. Using test account.');
  return {
    host: 'localhost',
    port: 1025, // MailHog defaults to 1025 for SMTP
    secure: false,
  };
}

/**
 * Get the transporter instance, initializing if needed
 */
export function getTransporter(): Transporter {
  if (!transporter) {
    initializeTransporter();
  }
  return transporter!;
}

/**
 * Reset transporter (useful for testing)
 */
export function resetTransporter(): void {
  transporter = null;
}
