import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type DatastoreModule = typeof import('./products-datastore');
type DbLike = {
  run: (
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<unknown>;
};

async function withDatastore<T>(
  runner: (datastore: DatastoreModule, db: DbLike) => Promise<T>,
): Promise<T> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'products-db-'));
  const dbPath = path.join(tempDir, 'products.db');

  jest.resetModules();
  const datastore = await import('./products-datastore');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      outcome TEXT NOT NULL,
      pattern TEXT NOT NULL,
      domain_tag TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      best_for_json TEXT NOT NULL,
      timeline TEXT NOT NULL,
      price REAL NOT NULL,
      image_src TEXT NOT NULL,
      image_alt TEXT NOT NULL,
      display_order INTEGER NOT NULL
    );
  `);

  await db.run(
    `
      INSERT INTO products (
        slug,
        name,
        outcome,
        pattern,
        domain_tag,
        short_description,
        description,
        best_for_json,
        timeline,
        price,
        image_src,
        image_alt,
        display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    'state-simplifier',
    'State Simplifier',
    'Calm state.',
    'Signals-first state.',
    'state',
    'Less state noise.',
    'Reduce state sprawl with a signal-first approach.',
    JSON.stringify(['Complex local state']),
    '2 sessions',
    1800,
    '/images/products/state-simplifier.png',
    'Illustration of the State Simplifier cleaning product.',
    2,
  );

  await db.run(
    `
      INSERT INTO products (
        slug,
        name,
        outcome,
        pattern,
        domain_tag,
        short_description,
        description,
        best_for_json,
        timeline,
        price,
        image_src,
        image_alt,
        display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    'boundary-polish',
    'Boundary Polish',
    'Clear ownership.',
    'Explicit boundaries.',
    'boundaries',
    'Keeps domains clean.',
    'Clarify domain ownership with firm boundaries.',
    JSON.stringify(['Blurred ownership', 'Large feature surfaces']),
    '2-3 sessions',
    2400,
    '/images/products/boundary-polish.png',
    'Illustration of the Boundary Polish cleaning product.',
    1,
  );

  datastore.setDatabase(db);

  try {
    return await runner(datastore, db);
  } finally {
    datastore.clearDatabase();
    await db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('products datastore', () => {
  it('returns products ordered by display_order', async () => {
    await withDatastore(async (datastore) => {
      const products = await datastore.getAllProducts();

      expect(products).toHaveLength(2);
      expect(products[0]?.slug).toBe('boundary-polish');
      expect(products[1]?.slug).toBe('state-simplifier');
    });
  });

  it('returns a product by slug and parses bestFor', async () => {
    await withDatastore(async (datastore) => {
      const product = await datastore.getProductBySlug('boundary-polish');

      expect(product).not.toBeNull();
      expect(product?.bestFor).toEqual([
        'Blurred ownership',
        'Large feature surfaces',
      ]);
    });
  });

  it('returns null for unknown slug', async () => {
    await withDatastore(async (datastore) => {
      const product = await datastore.getProductBySlug('missing');
      expect(product).toBeNull();
    });
  });

  it('falls back to an empty bestFor array for invalid JSON payloads', async () => {
    await withDatastore(async (datastore, db) => {
      await db.run(
        `
          INSERT INTO products (
            slug,
            name,
            outcome,
            pattern,
            domain_tag,
            short_description,
            description,
            best_for_json,
            timeline,
            price,
            image_src,
            image_alt,
            display_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        'invalid-best-for',
        'Invalid Best For',
        'Outcome',
        'Pattern',
        'state',
        'Short',
        'Description',
        '{"broken":true}',
        '1 session',
        100,
        '/images/products/invalid.png',
        'Invalid',
        3,
      );

      const product = await datastore.getProductBySlug('invalid-best-for');

      expect(product?.bestFor).toEqual([]);
    });
  });
});
