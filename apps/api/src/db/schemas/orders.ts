import { Database } from 'sqlite';

export async function initializeOrdersSchema(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      name TEXT,
      email TEXT,
      company TEXT,
      context TEXT NOT NULL DEFAULT 'storefront',
      created_at TEXT NOT NULL
    );
  `);

  await ensureColumn(
    db,
    'items_json',
    "ALTER TABLE orders ADD COLUMN items_json TEXT NOT NULL DEFAULT '[]'",
  );
  await ensureColumn(
    db,
    'subtotal',
    'ALTER TABLE orders ADD COLUMN subtotal REAL NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'tax',
    'ALTER TABLE orders ADD COLUMN tax REAL NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'total',
    'ALTER TABLE orders ADD COLUMN total REAL NOT NULL DEFAULT 0',
  );
  await ensureColumn(db, 'name', 'ALTER TABLE orders ADD COLUMN name TEXT');
  await ensureColumn(db, 'email', 'ALTER TABLE orders ADD COLUMN email TEXT');
  await ensureColumn(
    db,
    'company',
    'ALTER TABLE orders ADD COLUMN company TEXT',
  );
  await ensureColumn(
    db,
    'context',
    "ALTER TABLE orders ADD COLUMN context TEXT NOT NULL DEFAULT 'storefront'",
  );
  await ensureColumn(
    db,
    'created_at',
    "ALTER TABLE orders ADD COLUMN created_at TEXT NOT NULL DEFAULT ''",
  );
}

async function ensureColumn(
  db: Database,
  name: string,
  alterStatement: string,
): Promise<void> {
  const columns = await db.all<{ name: string }[]>('PRAGMA table_info(orders)');
  const hasColumn = columns.some((column) => column.name === name);

  if (!hasColumn) {
    await db.exec(alterStatement);
  }
}
