import {
  type Order,
  type OrderContext,
  type OrderItem,
} from '@cleanup/models-orders';

type OrderRow = {
  id: string;
  items_json: string;
  subtotal: number;
  tax: number;
  total: number;
  name: string | null;
  email: string | null;
  company: string | null;
  context: string;
  created_at: string;
};

type SavedOrderInput = Omit<Order, 'id' | 'createdAt'>;

type DatabaseLike = {
  run: (
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<unknown>;
  get: <Row = unknown>(
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<Row | undefined>;
};

const TABLE_NAME = 'orders';
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
      'Orders datastore has no database connection. Call setDatabase() first.',
    );
  }

  return database;
}

export async function saveOrder(order: SavedOrderInput): Promise<Order> {
  const db = getDatabase();
  const id = `order-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const createdAt = new Date().toISOString();

  await db.run(
    `
      INSERT INTO ${TABLE_NAME} (
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
    id,
    JSON.stringify(order.items),
    order.subtotal,
    order.tax,
    order.total,
    order.name ?? null,
    order.email ?? null,
    order.company ?? null,
    order.context,
    createdAt,
  );

  return {
    ...order,
    id,
    createdAt,
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = getDatabase();
  const row = await db.get<OrderRow>(
    `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
    id,
  );
  return row ? mapRow(row) : null;
}

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    items: parseItems(row.items_json),
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    name: normalizeOptionalString(row.name),
    email: normalizeOptionalString(row.email),
    company: normalizeOptionalString(row.company),
    context: normalizeContext(row.context),
    createdAt: row.created_at,
  };
}

function normalizeOptionalString(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return value;
}

function normalizeContext(value: string): OrderContext {
  return value === 'storefront' ? 'storefront' : 'storefront';
}

function parseItems(raw: string): OrderItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isOrderItem);
  } catch {
    return [];
  }
}

function isOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as OrderItem;
  return (
    typeof item.id === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.imageSrc === 'string' &&
    typeof item.imageAlt === 'string'
  );
}
