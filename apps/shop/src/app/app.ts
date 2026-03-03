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

const SITE_NAME = 'Angular Governance Program';
const SITE_BASE_URL = 'https://angularcleanup.shop';
const BOOKING_URL = `${SITE_BASE_URL}/book`;
const SITE_DEFAULT_DESCRIPTION =
  'Governance-first stabilization for mature Angular and Nx codebases. Reduce cost of change through structural discipline, measurable cadence, and safer upgrades.';
const SITE_DEFAULT_KEYWORDS =
  'Angular governance, Nx governance, cost of change, architectural discipline, frontend stabilization';
const DEFAULT_SOCIAL_IMAGE_PATH = '/images/cleanup-banner.png';
const STRUCTURED_DATA_SCRIPT_ID = 'structured-data-graph';
const INDEX_ROBOTS_POLICY =
  'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
const NOINDEX_ROBOTS_POLICY = 'noindex,nofollow,noarchive,nosnippet';

const DEFAULT_PAGE_SEO: SeoPage = {
  title:
    'Angular Governance Program | Governance-First Stabilization for Angular & Nx',
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: SITE_DEFAULT_KEYWORDS,
};

const PAGE_SEO_BY_PATH: Record<string, SeoPage> = {
  '/': DEFAULT_PAGE_SEO,
  '/for-managers': {
    title: 'For Managers | Angular Governance Program',
    description:
      'Manager-focused governance outcomes for Angular and Nx codebases: lower cost of change, safer upgrades, and measurable progress.',
    keywords:
      'Angular governance for managers, cost of change, upgrade risk reduction, governance metrics',
  },
  '/for-technical-leads': {
    title: 'For Technical Leads | Angular Governance Mechanics',
    description:
      'Concrete governance mechanics for technical leads: boundary enforcement, CI checks, decision logs, and architectural health metrics.',
    keywords:
      'Angular technical governance, Nx boundaries, CI checks, decision logs, architectural health',
  },
  '/how-it-works': {
    title: 'Engagement Model | Angular Governance Program',
    description:
      'A structured governance program designed to reduce cost of change in Angular and Nx codebases without rewriting your application.',
    keywords:
      'angular engagement model, governance cadence, cost of change reduction, nx governance',
  },
  '/ai-governance': {
    title: 'AI Governance | AI-Supported Angular Architecture Work',
    description:
      'Practical AI-supported governance for Angular and Nx: drift detection, boundary triage, PR scope analysis, and decision-log summaries.',
    keywords:
      'AI governance, Angular AI workflows, boundary triage, PR scope analysis',
  },
  '/privacy': {
    title: 'Privacy Policy | Angular Governance Program',
    description:
      'Read how Angular Governance Program processes and protects executive introduction call request data in line with EU GDPR principles.',
    keywords:
      'privacy policy, GDPR, data protection, introduction call data',
  },
  '/book': {
    title: 'Executive Introduction Call | Angular Governance Program',
    description:
      'Request an executive introduction call to align governance goals, risk profile, and scope for your Angular and Nx codebase.',
    keywords:
      'executive introduction call, angular governance consultation, nx governance alignment',
  },
};

const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: 'What are we buying?',
    answer:
      'A governance cadence focused on reducing cost of change, improving ownership clarity, and lowering architectural drift risk.',
  },
  {
    question: 'How is progress measured?',
    answer:
      'Progress is tracked through governance reporting, including PR scope trends, cross-domain change patterns, and boundary-violation movement.',
  },
  {
    question: 'Is this a rewrite or capacity model?',
    answer:
      'No. This is not a rewrite and not staff augmentation. It is governance-first stabilization around your existing delivery flow.',
  },
  {
    question: 'Does AI replace technical leadership?',
    answer:
      'No. AI supports governance workflows, while architecture ownership and sequencing decisions stay human-led.',
  },
  {
    question: 'When is this not a fit?',
    answer:
      'It is not a fit for urgent feature throughput expectations, rewrite mandates, or temporary capacity fill.',
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
      .subscribe((event) => this.applySeo(event.urlAfterRedirects));
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
    this.meta.updateTag({ property: 'og:description', content: page.description });
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
    this.upsertStructuredData(this.buildStructuredDataGraph(path, canonicalUrl));
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
    return PAGE_SEO_BY_PATH[path] ?? DEFAULT_PAGE_SEO;
  }

  private resolveRobotsPolicy(path: string): string {
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

    let linkElement = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

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
        serviceType: 'Angular and Nx governance stabilization',
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

    if (path === '/for-managers') {
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

    if (
      path === '/' ||
      path === '/for-managers' ||
      path === '/for-technical-leads' ||
      path === '/how-it-works' ||
      path === '/ai-governance'
    ) {
      graph.push({
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: 'Angular Governance Stabilization Program',
        serviceType: 'Governance-first Angular and Nx stabilization',
        provider: { '@id': organizationId },
        areaServed: 'Worldwide',
        audience: {
          '@type': 'Audience',
          audienceType: 'Engineering leaders and technical leads using Angular and Nx',
        },
      });
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }
}
