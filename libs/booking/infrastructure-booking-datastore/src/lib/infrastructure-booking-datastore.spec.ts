import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type DatastoreModule = typeof import('./booking-datastore');
type DbLike = {
  run: (
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<unknown>;
};

async function withDatastore<T>(
  runner: (datastore: DatastoreModule, db: DbLike) => Promise<T>,
): Promise<T> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'booking-db-'));
  const dbPath = path.join(tempDir, 'booking.db');

  jest.resetModules();
  const datastore = await import('./booking-datastore');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      team_size INTEGER NOT NULL,
      angular_version TEXT NOT NULL,
      uses_nx INTEGER NOT NULL,
      pain_area TEXT NOT NULL,
      notes TEXT,
      preferred_dates TEXT,
      privacy_policy_version TEXT,
      privacy_policy_accepted_at TEXT,
      cart_items TEXT NOT NULL,
      cart_subtotal REAL NOT NULL,
      cart_item_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );
  `);

  datastore.setDatabase(db);

  try {
    return await runner(datastore, db);
  } finally {
    datastore.clearDatabase();
    await db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('booking datastore', () => {
  it('saves and retrieves a booking', async () => {
    await withDatastore(async (datastore) => {
      const saved = await datastore.saveBooking({
        email: 'lena@example.com',
        name: 'Lena',
        company: 'Cleanup Shop',
        teamSize: 4,
        angularVersion: '21',
        usesNx: true,
        painArea: 'boundaries',
        notes: 'Prefers mornings',
        preferredDates: ['2026-03-01'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });

      const fetched = await datastore.getBooking(saved.id);

      expect(fetched).toEqual(saved);
      expect(saved.id).toMatch(/^booking-\d+-\d+$/u);
      expect(saved.createdAt).toBeTruthy();
    });
  });

  it('lists and filters bookings', async () => {
    await withDatastore(async (datastore) => {
      const tori = await datastore.saveBooking({
        email: 'tori@example.com',
        name: 'Tori',
        company: 'Cleanup Shop',
        teamSize: 2,
        angularVersion: '20',
        usesNx: true,
        painArea: 'state',
        preferredDates: ['2026-03-01'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });
      const alex = await datastore.saveBooking({
        email: 'alex@example.com',
        name: 'Alex',
        company: 'Cleanup Shop',
        teamSize: 6,
        angularVersion: '21',
        usesNx: false,
        painArea: 'testing',
        preferredDates: ['2026-03-10'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });

      const all = await datastore.getAllBookings();
      const filtered = await datastore.getBookingsByEmail('tori@example.com');

      expect(all.some((b) => b.id === tori.id)).toBe(true);
      expect(all.some((b) => b.id === alex.id)).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.email).toBe('tori@example.com');
    });
  });

  it('marks a booking as completed', async () => {
    await withDatastore(async (datastore) => {
      const saved = await datastore.saveBooking({
        email: 'sam@example.com',
        name: 'Sam',
        company: 'Cleanup Shop',
        teamSize: 3,
        angularVersion: '21',
        usesNx: true,
        painArea: 'boundaries',
        preferredDates: ['2026-03-08'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });

      const completed = await datastore.markBookingCompleted(saved.id);

      expect(completed?.completedAt).toBeTruthy();
      expect(completed?.id).toBe(saved.id);
    });
  });

  it('maps legacy rows with missing consent values to undefined', async () => {
    await withDatastore(async (datastore, db) => {
      await db.run(
        `
          INSERT INTO bookings (
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
            privacy_policy_version,
            privacy_policy_accepted_at,
            cart_items,
            cart_subtotal,
            cart_item_count,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        'booking-legacy',
        'legacy@example.com',
        'Legacy',
        'Cleanup Shop',
        5,
        '21',
        1,
        'boundaries',
        null,
        null,
        null,
        null,
        '[]',
        0,
        0,
        '2026-01-01T00:00:00.000Z',
      );

      const booking = await datastore.getBooking('booking-legacy');
      expect(booking?.privacyPolicyVersion).toBeUndefined();
      expect(booking?.privacyPolicyAcceptedAt).toBeUndefined();
    });
  });

  it('deletes bookings older than a cutoff', async () => {
    await withDatastore(async (datastore, db) => {
      const oldBooking = await datastore.saveBooking({
        email: 'old@example.com',
        name: 'Old',
        company: 'Cleanup Shop',
        teamSize: 3,
        angularVersion: '21',
        usesNx: true,
        painArea: 'boundaries',
        preferredDates: ['2026-03-08'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });
      const freshBooking = await datastore.saveBooking({
        email: 'fresh@example.com',
        name: 'Fresh',
        company: 'Cleanup Shop',
        teamSize: 3,
        angularVersion: '21',
        usesNx: true,
        painArea: 'boundaries',
        preferredDates: ['2026-03-08'],
        privacyPolicyVersion: '2026-02-23',
        privacyPolicyAcceptedAt: '2026-03-01T00:00:00.000Z',
      });

      await db.run(
        `UPDATE bookings SET created_at = ? WHERE id = ?`,
        '2024-01-01T00:00:00.000Z',
        oldBooking.id,
      );
      await db.run(
        `UPDATE bookings SET created_at = ? WHERE id = ?`,
        '2026-01-01T00:00:00.000Z',
        freshBooking.id,
      );

      const deleted = await datastore.deleteBookingsOlderThan(
        '2025-02-23T00:00:00.000Z',
      );
      expect(deleted).toBe(1);

      const remaining = await datastore.getAllBookings();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]?.id).toBe(freshBooking.id);
    });
  });
});
