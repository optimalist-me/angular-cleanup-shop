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
      angular_version TEXT NOT NULL DEFAULT '',
      uses_nx INTEGER NOT NULL DEFAULT 0,
      pain_area TEXT NOT NULL DEFAULT 'boundaries',
      notes TEXT,
      preferred_dates TEXT,
      privacy_policy_version TEXT,
      privacy_policy_accepted_at TEXT,
      cart_items TEXT NOT NULL DEFAULT '[]',
      cart_subtotal REAL NOT NULL DEFAULT 0,
      cart_item_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );
  `);

  await ensureColumn(
    db,
    'angular_version',
    "ALTER TABLE bookings ADD COLUMN angular_version TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'uses_nx',
    'ALTER TABLE bookings ADD COLUMN uses_nx INTEGER NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'pain_area',
    "ALTER TABLE bookings ADD COLUMN pain_area TEXT NOT NULL DEFAULT 'boundaries'",
  );
  await ensureColumn(
    db,
    'cart_items',
    "ALTER TABLE bookings ADD COLUMN cart_items TEXT NOT NULL DEFAULT '[]'",
  );
  await ensureColumn(
    db,
    'cart_subtotal',
    'ALTER TABLE bookings ADD COLUMN cart_subtotal REAL NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'cart_item_count',
    'ALTER TABLE bookings ADD COLUMN cart_item_count INTEGER NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'privacy_policy_version',
    'ALTER TABLE bookings ADD COLUMN privacy_policy_version TEXT',
  );
  await ensureColumn(
    db,
    'privacy_policy_accepted_at',
    'ALTER TABLE bookings ADD COLUMN privacy_policy_accepted_at TEXT',
  );
}

async function ensureColumn(
  db: Database,
  name: string,
  alterStatement: string,
): Promise<void> {
  const columns = await db.all<{ name: string }[]>(
    'PRAGMA table_info(bookings)',
  );
  const hasColumn = columns.some((column) => column.name === name);
  if (!hasColumn) {
    await db.exec(alterStatement);
  }
}
