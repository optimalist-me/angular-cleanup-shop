import { InjectionToken, Provider } from '@angular/core';

export type SharedHeaderLink =
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

export type SharedHeaderConfig = {
  brand: {
    route: string;
    logoSrc: string;
    logoAlt: string;
    title: string;
    subtitle: string;
  };
  menuLabel: string;
  closeNavigationLabel: string;
  navigationLinks: SharedHeaderLink[];
  primaryAction: SharedHeaderLink;
};

const DEFAULT_SHARED_HEADER_CONFIG: SharedHeaderConfig = {
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
  ],
  primaryAction: {
    kind: 'internal',
    label: 'Request executive introduction call',
    route: '/book',
  },
};

export const SHARED_HEADER_CONFIG = new InjectionToken<SharedHeaderConfig>(
  'SHARED_HEADER_CONFIG',
  { factory: () => DEFAULT_SHARED_HEADER_CONFIG },
);

export function provideSharedHeaderConfig(
  config: SharedHeaderConfig,
): Provider {
  return {
    provide: SHARED_HEADER_CONFIG,
    useValue: config,
  };
}
