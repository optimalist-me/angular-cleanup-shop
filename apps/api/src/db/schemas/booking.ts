/**
 * Booking schema initialization.
 */

import { Database } from 'sqlite';

export async function initializeBookingSchema(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      team_size INTEGER NOT NULL,
      notes TEXT,
      preferred_dates TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );
  `);
}
