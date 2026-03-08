import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type DatastoreModule = typeof import('./orders-datastore');
type DbLike = {
  exec: (sql: string) => Promise<unknown>;
  run: (
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<unknown>;
};

async function withDatastore<T>(
  runner: (datastore: DatastoreModule, db: DbLike) => Promise<T>,
): Promise<T> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orders-db-'));
  const dbPath = path.join(tempDir, 'orders.db');

  jest.resetModules();
  const datastore = await import('./orders-datastore');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      name TEXT,
      email TEXT,
      company TEXT,
      context TEXT NOT NULL,
      created_at TEXT NOT NULL
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

describe('orders datastore', () => {
  it('saves and retrieves an order', async () => {
    await withDatastore(async (datastore) => {
      const saved = await datastore.saveOrder({
        items: [
          {
            id: 'boundary-polish',
            slug: 'boundary-polish',
            name: 'Boundary Polish',
            price: 2400,
            quantity: 1,
            imageSrc: '/images/products/boundary-polish.png',
            imageAlt: 'Boundary Polish image',
          },
        ],
        subtotal: 2400,
        tax: 0,
        total: 2400,
        name: 'Taylor Reed',
        email: 'taylor@example.com',
        company: 'Cleanup Shop',
        context: 'storefront',
      });

      const fetched = await datastore.getOrderById(saved.id);

      expect(fetched).toEqual(saved);
      expect(saved.id).toMatch(/^order-\d+-\d+$/u);
    });
  });

  it('returns null when order does not exist', async () => {
    await withDatastore(async (datastore) => {
      const order = await datastore.getOrderById('missing-order');
      expect(order).toBeNull();
    });
  });

  it('falls back to empty items for invalid JSON payloads', async () => {
    await withDatastore(async (datastore, db) => {
      await db.run(
        `
          INSERT INTO orders (
            id,
            items_json,
            subtotal,
            tax,
            total,
            name,
            email,
            company,
            context,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        'order-invalid',
        '{"broken":true}',
        10,
        0,
        10,
        null,
        null,
        null,
        'storefront',
        '2026-03-03T10:00:00.000Z',
      );

      const fetched = await datastore.getOrderById('order-invalid');
      expect(fetched?.items).toEqual([]);
    });
  });
});
