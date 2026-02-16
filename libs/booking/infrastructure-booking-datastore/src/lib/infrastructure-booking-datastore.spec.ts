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
      notes TEXT,
      scheduled_date TEXT,
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
        notes: 'Prefers mornings',
      });

      const fetched = await datastore.getBooking(saved.id);

      expect(fetched).toEqual(saved);
      expect(saved.id).toMatch(/^booking-\d+$/u);
      expect(saved.createdAt).toBeTruthy();
    });
  });

  it('lists and filters bookings', async () => {
    await withDatastore(async (datastore) => {
      await datastore.saveBooking({
        email: 'tori@example.com',
        name: 'Tori',
        company: 'Cleanup Shop',
        teamSize: 2,
      });
      await datastore.saveBooking({
        email: 'alex@example.com',
        name: 'Alex',
        company: 'Cleanup Shop',
        teamSize: 6,
      });

      const all = await datastore.getAllBookings();
      const filtered = await datastore.getBookingsByEmail('tori@example.com');

      expect(all).toHaveLength(2);
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
      });

      const completed = await datastore.markBookingCompleted(saved.id);

      expect(completed?.completedAt).toBeTruthy();
      expect(completed?.id).toBe(saved.id);
    });
  });
});
