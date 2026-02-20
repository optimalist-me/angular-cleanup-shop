/**
 * Infrastructure layer for booking data persistence.
 *
 * The SQLite connection is managed by the API app. Call `setDatabase`
 * before using any datastore functions.
 */

import { type BookingPainArea } from '@cleanup/models-booking';

export interface StoredBooking {
  id: string;
  email: string;
  name: string;
  company: string;
  teamSize: number;
  angularVersion: string;
  usesNx: boolean;
  painArea: BookingPainArea;
  notes?: string;
  preferredDates?: string[];
  createdAt: string;
  completedAt?: string;
}

type BookingRow = {
  id: string;
  email: string;
  name: string;
  company: string;
  team_size: number;
  angular_version: string;
  uses_nx: number;
  pain_area: string;
  notes: string | null;
  preferred_dates: string | null;
  cart_items: string;
  cart_subtotal: number;
  cart_item_count: number;
  created_at: string;
  completed_at: string | null;
};

type DatabaseLike = {
  run: (
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<unknown>;
  get: <Row = unknown>(
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<Row | undefined>;
  all: <Row = unknown>(
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<Row[]>;
};

const TABLE_NAME = 'bookings';
let database: DatabaseLike | null = null;

export function setDatabase(db: DatabaseLike): void {
  database = db;
}

export function clearDatabase(): void {
  database = null;
}

function getDatabase(): DatabaseLike {
  if (!database) {
    throw new Error(
      'Booking datastore has no database connection. Call setDatabase() first.',
    );
  }

  return database;
}

function mapRow(row: BookingRow): StoredBooking {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    teamSize: row.team_size,
    angularVersion: row.angular_version,
    usesNx: row.uses_nx === 1,
    painArea: normalizePainArea(row.pain_area),
    notes: row.notes ?? undefined,
    preferredDates: parsePreferredDates(row.preferred_dates),
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

/**
 * Saves a booking to the data store.
 */
export async function saveBooking(
  booking: Omit<StoredBooking, 'id' | 'createdAt' | 'completedAt'>,
): Promise<StoredBooking> {
  const db = getDatabase();
  const id = `booking-${Date.now()}`;
  const createdAt = new Date().toISOString();

  await db.run(
    `
    INSERT INTO ${TABLE_NAME} (
      id,
      email,
      name,
      company,
      team_size,
      angular_version,
      uses_nx,
      pain_area,
      notes,
      preferred_dates,
      cart_items,
      cart_subtotal,
      cart_item_count,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    id,
    booking.email,
    booking.name,
    booking.company,
    booking.teamSize,
    booking.angularVersion,
    booking.usesNx ? 1 : 0,
    booking.painArea,
    booking.notes ?? null,
    booking.preferredDates ? JSON.stringify(booking.preferredDates) : null,
    '[]',
    0,
    0,
    createdAt,
  );

  return {
    ...booking,
    id,
    createdAt,
  };
}

/**
 * Retrieves a booking by ID.
 */
export async function getBooking(id: string): Promise<StoredBooking | null> {
  const db = getDatabase();
  const row = await db.get<BookingRow>(
    `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
    id,
  );
  return row ? mapRow(row) : null;
}

/**
 * Retrieves all bookings (for admin purposes).
 */
export async function getAllBookings(): Promise<StoredBooking[]> {
  const db = getDatabase();
  const rows = await db.all<BookingRow>(
    `SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC`,
  );
  return rows.map(mapRow);
}

/**
 * Gets bookings by email.
 */
export async function getBookingsByEmail(
  email: string,
): Promise<StoredBooking[]> {
  const db = getDatabase();
  const rows = await db.all<BookingRow>(
    `SELECT * FROM ${TABLE_NAME} WHERE email = ? ORDER BY created_at DESC`,
    email,
  );
  return rows.map(mapRow);
}

/**
 * Marks a booking as completed (confirmation email sent).
 */
export async function markBookingCompleted(
  id: string,
): Promise<StoredBooking | null> {
  const db = getDatabase();
  const completedAt = new Date().toISOString();

  await db.run(
    `UPDATE ${TABLE_NAME} SET completed_at = ? WHERE id = ?`,
    completedAt,
    id,
  );

  return getBooking(id);
}

function parsePreferredDates(raw: string | null): string[] | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const dates = parsed.filter(
      (value): value is string => typeof value === 'string',
    );
    return dates.length > 0 ? dates : undefined;
  } catch {
    return undefined;
  }
}

function normalizePainArea(value: string): BookingPainArea {
  const allowed: BookingPainArea[] = [
    'boundaries',
    'state',
    'templates',
    'testing',
    'upgrades',
    'performance',
  ];
  return allowed.includes(value as BookingPainArea)
    ? (value as BookingPainArea)
    : 'boundaries';
}
