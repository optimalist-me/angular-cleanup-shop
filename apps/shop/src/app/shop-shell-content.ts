import { type SharedHeaderConfig } from '@cleanup/shared-ui-header';
import { type SharedFooterConfig } from '@cleanup/shared-ui-footer';

export function createShopHeaderConfig(
  demoStorefrontUrl: string,
): SharedHeaderConfig {
  return {
    brand: {
      route: '/',
      logoSrc: '/images/cleanup-logo.png',
      logoAlt: 'Angular Governance Program logo',
      title: 'Angular Governance Program',
      subtitle: 'Governance-first stabilization for Angular and Nx.',
    },
    menuLabel: 'Menu',
    closeNavigationLabel: 'Close navigation',
    navigationLinks: [
      { kind: 'internal', label: 'For Managers', route: '/for-managers' },
      {
        kind: 'internal',
        label: 'For Technical Leads',
        route: '/for-technical-leads',
      },
      { kind: 'internal', label: 'Engagement Model', route: '/how-it-works' },
      { kind: 'internal', label: 'AI Governance', route: '/ai-governance' },
      {
        kind: 'external',
        label: 'Storefront Demo',
        href: demoStorefrontUrl,
        openInNewTab: true,
      },
    ],
    primaryAction: {
      kind: 'internal',
      label: 'Request executive introduction call',
      route: '/book',
    },
  };
}

export function createShopFooterConfig(
  demoStorefrontUrl: string,
): SharedFooterConfig {
  return {
    brandTitle: 'Angular Governance Program',
    brandSubtitle: 'Governance-first stabilization for Angular and Nx codebases.',
    columns: [
      {
        heading: 'Paths',
        links: [
          { kind: 'internal', label: 'For Managers', route: '/for-managers' },
          {
            kind: 'internal',
            label: 'For Technical Leads',
            route: '/for-technical-leads',
          },
          { kind: 'internal', label: 'Engagement Model', route: '/how-it-works' },
          { kind: 'internal', label: 'AI Governance', route: '/ai-governance' },
          {
            kind: 'external',
            label: 'Storefront Demo',
            href: demoStorefrontUrl,
            openInNewTab: true,
          },
        ],
      },
      {
        heading: 'Engage',
        links: [
          {
            kind: 'internal',
            label: 'Executive introduction call',
            route: '/book',
          },
          { kind: 'internal', label: 'Privacy', route: '/privacy' },
        ],
      },
      {
        heading: 'Trust',
        texts: [
          'Nx Partner',
          'Nx Certified Expert',
          'Production-safe, incremental governance',
        ],
      },
    ],
    metaText: 'Governance-first stabilization for predictable change.',
  };
}
