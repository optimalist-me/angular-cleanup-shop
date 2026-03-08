import { InjectionToken, Provider } from '@angular/core';

export type SharedFooterLink =
  | {
      kind: 'internal';
      label: string;
      route: string;
    }
  | {
      kind: 'external';
      label: string;
      href: string;
      openInNewTab?: boolean;
    };

export type SharedFooterColumn = {
  heading: string;
  links?: SharedFooterLink[];
  texts?: string[];
};

export type SharedFooterConfig = {
  brandTitle: string;
  brandSubtitle: string;
  columns: SharedFooterColumn[];
  metaText: string;
};

const DEFAULT_SHARED_FOOTER_CONFIG: SharedFooterConfig = {
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

export const SHARED_FOOTER_CONFIG = new InjectionToken<SharedFooterConfig>(
  'SHARED_FOOTER_CONFIG',
  { factory: () => DEFAULT_SHARED_FOOTER_CONFIG },
);

export function provideSharedFooterConfig(
  config: SharedFooterConfig,
): Provider {
  return {
    provide: SHARED_FOOTER_CONFIG,
    useValue: config,
  };
}
