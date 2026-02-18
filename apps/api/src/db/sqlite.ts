/**
 * SQLite database initialization for the cleanup-shop API.
 *
 * This module owns the single shared database connection for the API app.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { initializeBookingSchema } from './schemas/booking';

let database: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  if (database) {
    return database;
  }

  const dbPath =
    process.env.CLEANUP_DB_PATH ||
    path.join(process.cwd(), 'tmp', 'cleanup-shop.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  database = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await initializeBookingSchema(database);

  return database;
}

export function getDatabase(): Database {
  if (!database) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.',
    );
  }

  return database;
}
