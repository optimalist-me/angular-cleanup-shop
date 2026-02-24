import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CartRepository } from '@cleanup/data-access-cart';
import { SharedFooter } from '@cleanup/shared-ui-footer';
import { SharedHeader } from '@cleanup/shared-ui-header';

type SeoPage = {
  title: string;
  description: string;
  keywords: string;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type ProductOffer = {
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
};

const SITE_NAME = 'Angular Cleanup Shop';
const SITE_BASE_URL = 'https://angularcleanup.shop';
const BOOKING_URL = `${SITE_BASE_URL}/book`;
const SITE_DEFAULT_DESCRIPTION =
  'Angular cleanup and architecture governance for mature Angular and Nx codebases. Reduce structural friction with safe, incremental changes.';
const SITE_DEFAULT_KEYWORDS =
  'Angular cleanup, Nx monorepo, Angular architecture, frontend governance, technical debt reduction';
const DEFAULT_SOCIAL_IMAGE_PATH = '/images/cleanup-banner.png';
const STRUCTURED_DATA_SCRIPT_ID = 'structured-data-graph';
const INDEX_ROBOTS_POLICY =
  'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
const NOINDEX_ROBOTS_POLICY = 'noindex,nofollow,noarchive,nosnippet';

const DEFAULT_PAGE_SEO: SeoPage = {
  title: 'Angular Cleanup Shop | Structural Governance for Angular & Nx',
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: SITE_DEFAULT_KEYWORDS,
};

const PAGE_SEO_BY_PATH: Record<string, SeoPage> = {
  '/': DEFAULT_PAGE_SEO,
  '/playbook': {
    title: 'Angular Cleanup Playbook | Incremental Refactoring Strategy',
    description:
      'A maintenance-first Angular cleanup playbook focused on safe refactors, boundary clarity, and lower long-term change cost.',
    keywords:
      'Angular playbook, incremental refactoring, Angular maintenance, Nx cleanup strategy',
  },
  '/architecture': {
    title: 'Angular Architecture Model | Domain Boundaries with Nx',
    description:
      'See a practical Angular architecture model with feature, data-access, ui, and util boundaries for predictable scaling.',
    keywords:
      'Angular architecture, Nx boundaries, domain-driven frontend, dependency boundaries',
  },
  '/faq': {
    title: 'Angular Cleanup FAQ | Scope, Pricing, and Fit',
    description:
      'Answers about Angular cleanup scope, cadence, pricing, and when a governance-first model is the right fit.',
    keywords:
      'Angular cleanup FAQ, Angular consulting pricing, Nx consulting, frontend governance',
  },
  '/privacy': {
    title: 'Privacy Policy | Angular Cleanup Shop',
    description:
      'Read how Angular Cleanup Shop processes and protects booking and checkout data in line with EU GDPR principles.',
    keywords:
      'privacy policy, GDPR, data protection, booking data, Angular Cleanup Shop',
  },
  '/products': {
    title: 'Angular Cleanup Products | Outcomes by Domain',
    description:
      'Browse focused Angular cleanup outcomes including boundaries, signals state, RxJS hygiene, and testing stability.',
    keywords:
      'Angular cleanup services, RxJS cleanup, OnPush optimization, signals migration',
  },
  '/book': {
    title: 'Book an Angular Cleanup Fit Check',
    description:
      'Request a 20-minute fit check to evaluate Angular cleanup opportunities, delivery risks, and next safe steps.',
    keywords:
      'Angular audit call, Angular fit check, frontend architecture consultation',
  },
};

const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: 'Is this just refactoring?',
    answer:
      'No. The service reduces structural friction so teams ship faster with less risk. Cleanup is the means; efficiency is the outcome.',
  },
  {
    question: 'Why only one day per week?',
    answer:
      'A weekly cadence keeps changes small, reviewable, and low risk while protecting normal product delivery.',
  },
  {
    question: 'Can you also build features?',
    answer:
      'No. The model is maintenance-first, so feature delivery remains with your team while structural improvements stay focused.',
  },
  {
    question: 'Do you work with Nx monorepos?',
    answer:
      'Yes. Nx is a first-class environment because boundaries, ownership, and dependency rules are enforceable.',
  },
  {
    question: 'What is the day rate?',
    answer:
      'The day rate is EUR 800 fixed, with value measured in reduced entropy and lower cost of change.',
  },
  {
    question: 'What does success look like after 4-8 weeks?',
    answer:
      'Success means smaller components, clearer ownership, safer pull requests, and higher delivery confidence.',
  },
  {
    question: 'When is this not a fit?',
    answer:
      'It is not a fit for urgent feature throughput, rewrites, or temporary delivery capacity.',
  },
];

const PRODUCT_OFFERS: ProductOffer[] = [
  {
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    shortDescription: 'Removes hidden coupling and restores ownership clarity.',
    price: 2400,
  },
  {
    slug: 'state-simplifier',
    name: 'State Simplifier',
    shortDescription: 'Turns complex flows into calm, local state.',
    price: 1800,
  },
  {
    slug: 'template-detangler',
    name: 'Template Detangler',
    shortDescription: 'Removes template noise and restores clarity.',
    price: 2000,
  },
  {
    slug: 'rxjs-untangler',
    name: 'RxJS Untangler',
    shortDescription: 'Unknots tangled observables into clean flows.',
    price: 2200,
  },
  {
    slug: 'onpush-primer',
    name: 'OnPush Primer',
    shortDescription: 'Keeps rendering predictable and intentional.',
    price: 2100,
  },
  {
    slug: 'test-stabilizer',
    name: 'Test Stabilizer',
    shortDescription: 'Turns flaky suites into reliable signals.',
    price: 2300,
  },
  {
    slug: 'upgrade-lubricant',
    name: 'Upgrade Lubricant',
    shortDescription: 'Makes upgrades calmer and more predictable.',
    price: 2500,
  },
  {
    slug: 'component-degreaser',
    name: 'Component Degreaser',
    shortDescription: 'Breaks down oversized components safely.',
    price: 2000,
  },
  {
    slug: 'ownership-clarifier',
    name: 'Ownership Clarifier',
    shortDescription: 'Makes responsibility lines explicit and stable.',
    price: 2400,
  },
  {
    slug: 'signal-starter',
    name: 'Signal Starter',
    shortDescription: 'Establishes a calm, signal-first baseline.',
    price: 1700,
  },
  {
    slug: 'data-contract-sealer',
    name: 'Data Contract Sealer',
    shortDescription: 'Keeps UI stable as backend evolves.',
    price: 2600,
  },
  {
    slug: 'review-speed-boost',
    name: 'Review Speed Boost',
    shortDescription: 'Optimizes for safe, fast reviews.',
    price: 1900,
  },
];

@Component({
  imports: [RouterOutlet, SharedHeader, SharedFooter],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly cartRepository = inject(CartRepository);

  readonly cartCount = this.cartRepository.itemCount;
  readonly title = SITE_NAME;

  constructor() {
    this.applySeo(this.router.url);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.applySeo(event.urlAfterRedirects);
        this.scrollToTop();
      });
  }

  private applySeo(url: string): void {
    const path = this.normalizePath(url);
    const page = this.resolvePageSeo(path);
    const canonicalUrl = `${SITE_BASE_URL}${path}`;
    const socialImage = `${SITE_BASE_URL}${DEFAULT_SOCIAL_IMAGE_PATH}`;
    const robotsPolicy = this.resolveRobotsPolicy(path);

    this.titleService.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'keywords', content: page.keywords });
    this.meta.updateTag({ name: 'robots', content: robotsPolicy });

    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({
      property: 'og:description',
      content: page.description,
    });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: socialImage });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: page.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: socialImage });

    this.updateCanonicalLink(canonicalUrl);
    this.upsertStructuredData(
      this.buildStructuredDataGraph(path, canonicalUrl),
    );
  }

  private scrollToTop(): void {
    const windowRef = this.document.defaultView;
    if (!windowRef) {
      return;
    }

    const prefersReducedMotion =
      windowRef.matchMedia?.('(prefers-reduced-motion: reduce)').matches ===
      true;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    windowRef.scrollTo({ top: 0, left: 0, behavior });
  }

  private normalizePath(url: string): string {
    const [pathWithoutQuery] = url.split(/[?#]/);

    if (!pathWithoutQuery || pathWithoutQuery === '/') {
      return '/';
    }

    return pathWithoutQuery.endsWith('/')
      ? pathWithoutQuery.slice(0, -1)
      : pathWithoutQuery;
  }

  private resolvePageSeo(path: string): SeoPage {
    if (path.startsWith('/products/')) {
      const pathParts = path.split('/');
      const slug = pathParts[pathParts.length - 1];
      const product = this.getProductOfferBySlug(slug);
      const productName = product?.name ?? this.humanizeSlug(slug);

      return {
        title: `${productName} | Angular Cleanup Product`,
        description: product
          ? `${product.shortDescription} Outcome-focused Angular cleanup engagement.`
          : 'Detailed scope, outcomes, and pricing context for this Angular cleanup product.',
        keywords:
          'Angular product detail, cleanup scope, frontend architecture outcome',
      };
    }

    return PAGE_SEO_BY_PATH[path] ?? DEFAULT_PAGE_SEO;
  }

  private humanizeSlug(slug: string): string {
    return slug
      .split('-')
      .filter((token) => token.length > 0)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(' ');
  }

  private getProductOfferBySlug(slug: string): ProductOffer | null {
    return PRODUCT_OFFERS.find((product) => product.slug === slug) ?? null;
  }

  private getProductOfferByPath(path: string): ProductOffer | null {
    if (!path.startsWith('/products/')) {
      return null;
    }

    const pathParts = path.split('/');
    const slug = pathParts[pathParts.length - 1];
    return this.getProductOfferBySlug(slug);
  }

  private buildProductUrl(slug: string): string {
    return `${SITE_BASE_URL}/products/${slug}`;
  }

  private buildOfferNode(
    product: ProductOffer,
    offerId: string,
  ): Record<string, unknown> {
    return {
      '@type': 'Offer',
      '@id': offerId,
      url: this.buildProductUrl(product.slug),
      priceCurrency: 'EUR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Service',
        name: product.name,
        description: product.shortDescription,
        serviceType: 'Angular cleanup engagement outcome',
      },
    };
  }

  private resolveRobotsPolicy(path: string): string {
    if (path === '/cart' || path === '/checkout') {
      return NOINDEX_ROBOTS_POLICY;
    }

    if (path.startsWith('/book/confirmed')) {
      return NOINDEX_ROBOTS_POLICY;
    }

    return INDEX_ROBOTS_POLICY;
  }

  private updateCanonicalLink(canonicalUrl: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    let linkElement = head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!linkElement) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', canonicalUrl);
  }

  private upsertStructuredData(schemaGraph: Record<string, unknown>): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    let scriptElement = head.querySelector<HTMLScriptElement>(
      `#${STRUCTURED_DATA_SCRIPT_ID}`,
    );

    if (!scriptElement) {
      scriptElement = this.document.createElement('script');
      scriptElement.id = STRUCTURED_DATA_SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(schemaGraph);
  }

  private buildStructuredDataGraph(
    path: string,
    canonicalUrl: string,
  ): Record<string, unknown> {
    const siteUrl = `${SITE_BASE_URL}/`;
    const organizationId = `${siteUrl}#organization`;
    const professionalServiceId = `${siteUrl}#professional-service`;
    const websiteId = `${siteUrl}#website`;
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: SITE_NAME,
        url: siteUrl,
        logo: `${SITE_BASE_URL}/images/cleanup-logo.png`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            url: BOOKING_URL,
            availableLanguage: ['en'],
          },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': professionalServiceId,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DEFAULT_DESCRIPTION,
        areaServed: 'Worldwide',
        serviceType: 'Angular Cleanup and Architecture Governance',
        provider: { '@id': organizationId },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DEFAULT_DESCRIPTION,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: this.titleService.getTitle(),
        description:
          this.meta.getTag('name="description"')?.content ??
          SITE_DEFAULT_DESCRIPTION,
        isPartOf: { '@id': websiteId },
        about: { '@id': professionalServiceId },
      },
    ];

    if (path === '/faq') {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        url: canonicalUrl,
        mainEntity: FAQ_ENTRIES.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: entry.answer,
          },
        })),
      });
    }

    if (path === '/' || path === '/playbook' || path === '/architecture') {
      graph.push({
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: 'Angular Cleanup Governance Service',
        serviceType: 'Frontend architecture cleanup and governance',
        provider: { '@id': organizationId },
        areaServed: 'Worldwide',
        offers: { '@id': `${SITE_BASE_URL}/products#catalog` },
        audience: {
          '@type': 'Audience',
          audienceType: 'Engineering teams using Angular and Nx',
        },
      });
    }

    if (path === '/products') {
      graph.push({
        '@type': 'OfferCatalog',
        '@id': `${canonicalUrl}#catalog`,
        name: 'Angular Cleanup Outcomes',
        url: canonicalUrl,
        itemListElement: PRODUCT_OFFERS.map((product) =>
          this.buildOfferNode(
            product,
            `${this.buildProductUrl(product.slug)}#offer`,
          ),
        ),
      });

      graph.push({
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#itemlist`,
        name: 'Angular Cleanup Products',
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: PRODUCT_OFFERS.length,
        itemListElement: PRODUCT_OFFERS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: this.buildProductUrl(product.slug),
          name: product.name,
        })),
      });
    }

    const product = this.getProductOfferByPath(path);
    if (product) {
      const productUrl = this.buildProductUrl(product.slug);

      graph.push(this.buildOfferNode(product, `${productUrl}#offer`));
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: `${SITE_BASE_URL}/products`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      });
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }
}
