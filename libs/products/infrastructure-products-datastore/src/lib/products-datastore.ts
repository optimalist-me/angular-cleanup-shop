import { Product, ProductDomainTag } from '@cleanup/models-products';

type ProductRow = {
  slug: string;
  name: string;
  outcome: string;
  pattern: string;
  domain_tag: string;
  short_description: string;
  description: string;
  best_for_json: string;
  timeline: string;
  price: number;
  image_src: string;
  image_alt: string;
};

type DatabaseLike = {
  get: <Row = unknown>(
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<Row | undefined>;
  all: <Row = unknown>(
    sql: string,
    ...params: Array<string | number | null>
  ) => Promise<Row[]>;
};

const TABLE_NAME = 'products';
const VALID_DOMAIN_TAGS = new Set<ProductDomainTag>([
  'components',
  'state',
  'rxjs',
  'boundaries',
  'testing',
  'upgrades',
  'performance',
]);

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
      'Products datastore has no database connection. Call setDatabase() first.',
    );
  }

  return database;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = getDatabase();
  const rows = await db.all<ProductRow>(
    `
      SELECT
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
        image_alt
      FROM ${TABLE_NAME}
      ORDER BY display_order ASC
    `,
  );

  return rows.map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDatabase();
  const row = await db.get<ProductRow>(
    `
      SELECT
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
        image_alt
      FROM ${TABLE_NAME}
      WHERE slug = ?
    `,
    slug,
  );

  return row ? mapRow(row) : null;
}

function mapRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    outcome: row.outcome,
    pattern: row.pattern,
    domainTag: normalizeDomainTag(row.domain_tag),
    shortDescription: row.short_description,
    description: row.description,
    bestFor: parseBestFor(row.best_for_json),
    timeline: row.timeline,
    price: row.price,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
  };
}

function normalizeDomainTag(value: string): ProductDomainTag {
  if (VALID_DOMAIN_TAGS.has(value as ProductDomainTag)) {
    return value as ProductDomainTag;
  }

  return 'boundaries';
}

function parseBestFor(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}
