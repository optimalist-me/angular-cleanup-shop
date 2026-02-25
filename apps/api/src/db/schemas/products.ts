import { Product } from '@cleanup/models-products';
import { Database } from 'sqlite';

const PRODUCT_SEED_CATALOG: Product[] = [
  {
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    outcome: 'Clear domain ownership and fewer cross-feature surprises.',
    pattern: 'Explicit feature/data-access/ui boundaries with enforced deps.',
    domainTag: 'boundaries',
    shortDescription: 'Removes hidden coupling and restores ownership clarity.',
    description:
      'Clarify domain ownership by tightening boundaries, documenting contracts, and removing the quiet cross-feature drift that causes surprise dependencies.',
    bestFor: [
      'Teams with blurred ownership',
      'Large feature surfaces',
      'Growing monorepos',
    ],
    timeline: '2-3 sessions',
    price: 2400,
    imageSrc: '/images/products/boundary-polish.png',
    imageAlt: 'Illustration of the Boundary Polish cleaning product.',
  },
  {
    slug: 'state-simplifier',
    name: 'State Simplifier',
    outcome: 'Local state that is easy to reason about and easy to test.',
    pattern: 'Signals-first state with computed derivations.',
    domainTag: 'state',
    shortDescription: 'Turns complex flows into calm, local state.',
    description:
      'Reduce state sprawl by consolidating updates into consistent signals, replacing ad-hoc flows with predictable computed state and clearer ownership.',
    bestFor: [
      'Complex local state',
      'Mixed observable/signal usage',
      'Hard-to-test views',
    ],
    timeline: '2 sessions',
    price: 1800,
    imageSrc: '/images/products/state-simplifier.png',
    imageAlt: 'Illustration of the State Simplifier cleaning product.',
  },
  {
    slug: 'template-detangler',
    name: 'Template Detangler',
    outcome: 'Readable templates with minimal logic and fewer regressions.',
    pattern: 'Declarative templates with built-in control flow.',
    domainTag: 'components',
    shortDescription: 'Removes template noise and restores clarity.',
    description:
      'Rebuild templates into clean, declarative views with minimal control flow complexity, so intent is obvious and regression risk drops.',
    bestFor: ['Large templates', 'Logic-heavy markup', 'Frequent regressions'],
    timeline: '1-2 sessions',
    price: 2000,
    imageSrc: '/images/products/template-detangler.png',
    imageAlt: 'Illustration of the Template Detangler cleaning product.',
  },
  {
    slug: 'rxjs-untangler',
    name: 'RxJS Untangler',
    outcome: 'Predictable streams and fewer side-effect surprises.',
    pattern: 'Flattened operators and explicit side effects.',
    domainTag: 'rxjs',
    shortDescription: 'Unknots tangled observables into clean flows.',
    description:
      'Flatten observable pipelines into readable steps, make side effects explicit, and restore confidence in stream lifecycles and error handling.',
    bestFor: [
      'Nested operators',
      'Hard-to-debug streams',
      'Inconsistent error handling',
    ],
    timeline: '2 sessions',
    price: 2200,
    imageSrc: '/images/products/rxjs-untangler.png',
    imageAlt: 'Illustration of the RxJS Untangler cleaning product.',
  },
  {
    slug: 'onpush-primer',
    name: 'OnPush Primer',
    outcome: 'Stable change detection and fewer re-render surprises.',
    pattern: 'OnPush components and signal-driven inputs.',
    domainTag: 'performance',
    shortDescription: 'Keeps rendering predictable and intentional.',
    description:
      'Adopt OnPush and signal-driven inputs to make rendering predictable, reduce unnecessary checks, and keep performance steady under change.',
    bestFor: [
      'Performance regressions',
      'Frequent change detection',
      'Large component trees',
    ],
    timeline: '1-2 sessions',
    price: 2100,
    imageSrc: '/images/products/onpush-primer.png',
    imageAlt: 'Illustration of the OnPush Primer cleaning product.',
  },
  {
    slug: 'test-stabilizer',
    name: 'Test Stabilizer',
    outcome: 'Fewer flaky tests and more confident releases.',
    pattern: 'Pragmatic testing boundaries and deterministic setup.',
    domainTag: 'testing',
    shortDescription: 'Turns flaky suites into reliable signals.',
    description:
      'Make tests deterministic by stabilizing setup, trimming flaky or redundant suites, and aligning coverage with real product risk.',
    bestFor: ['Flaky CI', 'Slow test runs', 'Unclear test ownership'],
    timeline: '2-3 sessions',
    price: 2300,
    imageSrc: '/images/products/test-stabilizer.png',
    imageAlt: 'Illustration of the Test Stabilizer cleaning product.',
  },
  {
    slug: 'upgrade-lubricant',
    name: 'Upgrade Lubricant',
    outcome: 'Lower-risk Angular upgrades with clear sequencing.',
    pattern: 'Staged cleanup before version changes.',
    domainTag: 'upgrades',
    shortDescription: 'Makes upgrades calmer and more predictable.',
    description:
      'Prepare the codebase for safe Angular upgrades with staged cleanup, clear sequencing, and fewer upgrade-day surprises.',
    bestFor: ['Upcoming major upgrade', 'Deprecated APIs', 'Tooling drift'],
    timeline: '2-4 sessions',
    price: 2500,
    imageSrc: '/images/products/upgrade-lubricant.png',
    imageAlt: 'Illustration of the Upgrade Lubricant cleaning product.',
  },
  {
    slug: 'component-degreaser',
    name: 'Component Degreaser',
    outcome: 'Smaller components with single responsibilities.',
    pattern: 'Decomposition and focused component scope.',
    domainTag: 'components',
    shortDescription: 'Breaks down oversized components safely.',
    description:
      'Split oversized components into focused, reusable parts with clearer responsibilities and a calmer surface for future change.',
    bestFor: ['God components', 'Mixed responsibilities', 'Slow reviews'],
    timeline: '2 sessions',
    price: 2000,
    imageSrc: '/images/products/component-degreaser.png',
    imageAlt: 'Illustration of the Component Degreaser cleaning product.',
  },
  {
    slug: 'ownership-clarifier',
    name: 'Ownership Clarifier',
    outcome: 'Faster reviews because ownership is obvious.',
    pattern: 'Domain-based library structure and public APIs.',
    domainTag: 'boundaries',
    shortDescription: 'Makes responsibility lines explicit and stable.',
    description:
      'Define domains, public APIs, and ownership boundaries so teams know where changes belong and reviews move faster.',
    bestFor: [
      'Monorepo growth',
      'Cross-team conflicts',
      'Inconsistent imports',
    ],
    timeline: '2-3 sessions',
    price: 2400,
    imageSrc: '/images/products/ownership-clarifier.png',
    imageAlt: 'Illustration of the Ownership Clarifier cleaning product.',
  },
  {
    slug: 'signal-starter',
    name: 'Signal Starter',
    outcome: 'Signals used consistently without mixing paradigms.',
    pattern: 'Signal-first state, minimal observable bridges.',
    domainTag: 'state',
    shortDescription: 'Establishes a calm, signal-first baseline.',
    description:
      'Establish a signal-first baseline, remove mixed paradigms, and align the team on one calm, consistent state model.',
    bestFor: [
      'First signals adoption',
      'State inconsistency',
      'Legacy state patterns',
    ],
    timeline: '1-2 sessions',
    price: 1700,
    imageSrc: '/images/products/signal-starter.png',
    imageAlt: 'Illustration of the Signal Starter cleaning product.',
  },
  {
    slug: 'data-contract-sealer',
    name: 'Data Contract Sealer',
    outcome: 'Stable API contracts and less backend churn in UI.',
    pattern: 'Data-access APIs and DTO boundaries.',
    domainTag: 'boundaries',
    shortDescription: 'Keeps UI stable as backend evolves.',
    description:
      'Stabilize front-end data contracts with explicit DTO boundaries so backend churn no longer ripples through UI layers.',
    bestFor: [
      'Frequent API changes',
      'Leaky backend shapes',
      'Unclear data ownership',
    ],
    timeline: '2-3 sessions',
    price: 2600,
    imageSrc: '/images/products/data-contract-sealer.png',
    imageAlt: 'Illustration of the Data Contract Sealer cleaning product.',
  },
  {
    slug: 'review-speed-boost',
    name: 'Review Speed Boost',
    outcome: 'Shorter PR cycles and less cognitive load.',
    pattern: 'Small, predictable refactors and clear ownership.',
    domainTag: 'testing',
    shortDescription: 'Optimizes for safe, fast reviews.',
    description:
      'Increase review throughput by shaping smaller, safer change sets and clarifying ownership so reviewers spend less time untangling intent.',
    bestFor: ['Long review cycles', 'High regression risk', 'Large PRs'],
    timeline: '1-2 sessions',
    price: 1900,
    imageSrc: '/images/products/review-speed-boost.png',
    imageAlt: 'Illustration of the Review Speed Boost cleaning product.',
  },
];

export async function initializeProductsSchema(db: Database): Promise<void> {
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

  await ensureColumn(
    db,
    'name',
    "ALTER TABLE products ADD COLUMN name TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'outcome',
    "ALTER TABLE products ADD COLUMN outcome TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'pattern',
    "ALTER TABLE products ADD COLUMN pattern TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'domain_tag',
    "ALTER TABLE products ADD COLUMN domain_tag TEXT NOT NULL DEFAULT 'boundaries'",
  );
  await ensureColumn(
    db,
    'short_description',
    "ALTER TABLE products ADD COLUMN short_description TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'description',
    "ALTER TABLE products ADD COLUMN description TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'best_for_json',
    "ALTER TABLE products ADD COLUMN best_for_json TEXT NOT NULL DEFAULT '[]'",
  );
  await ensureColumn(
    db,
    'timeline',
    "ALTER TABLE products ADD COLUMN timeline TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'price',
    'ALTER TABLE products ADD COLUMN price REAL NOT NULL DEFAULT 0',
  );
  await ensureColumn(
    db,
    'image_src',
    "ALTER TABLE products ADD COLUMN image_src TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'image_alt',
    "ALTER TABLE products ADD COLUMN image_alt TEXT NOT NULL DEFAULT ''",
  );
  await ensureColumn(
    db,
    'display_order',
    'ALTER TABLE products ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0',
  );

  await seedProductsIfEmpty(db);
}

async function ensureColumn(
  db: Database,
  name: string,
  alterStatement: string,
): Promise<void> {
  const columns = await db.all<{ name: string }[]>(
    'PRAGMA table_info(products)',
  );
  const hasColumn = columns.some((column) => column.name === name);
  if (!hasColumn) {
    await db.exec(alterStatement);
  }
}

async function seedProductsIfEmpty(db: Database): Promise<void> {
  const countRow = await db.get<{ total: number }>(
    'SELECT COUNT(*) as total FROM products',
  );

  if ((countRow?.total ?? 0) > 0) {
    return;
  }

  await db.exec('BEGIN');

  try {
    for (const [index, product] of PRODUCT_SEED_CATALOG.entries()) {
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
        product.slug,
        product.name,
        product.outcome,
        product.pattern,
        product.domainTag,
        product.shortDescription,
        product.description,
        JSON.stringify(product.bestFor),
        product.timeline,
        product.price,
        product.imageSrc,
        product.imageAlt,
        index + 1,
      );
    }

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}
