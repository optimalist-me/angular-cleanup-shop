import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type DatastoreModule = typeof import('./booking-datastore');

async function withDatastore<T>(
  runner: (datastore: DatastoreModule) => Promise<T>,
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
      cart_items TEXT NOT NULL,
      cart_subtotal REAL NOT NULL,
      cart_item_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );
  `);

  datastore.setDatabase(db);

  try {
    return await runner(datastore);
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
      });

      const fetched = await datastore.getBooking(saved.id);

      expect(fetched).toEqual(saved);
      expect(saved.id).toMatch(/^booking-\d+$/u);
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
      });

      const completed = await datastore.markBookingCompleted(saved.id);

      expect(completed?.completedAt).toBeTruthy();
      expect(completed?.id).toBe(saved.id);
    });
  });
});
