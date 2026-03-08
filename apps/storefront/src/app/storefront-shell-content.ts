import { type SharedHeaderConfig } from '@cleanup/shared-ui-header';
import { type SharedFooterConfig } from '@cleanup/shared-ui-footer';

export function createStorefrontHeaderConfig(
  mainDomainUrl: string,
): SharedHeaderConfig {
  return {
    brand: {
      route: '/products',
      logoSrc: '/images/cleanup-logo.png',
      logoAlt: 'Angular Cleanup Storefront logo',
      title: 'Angular Cleanup Storefront',
      subtitle: 'Technical demo for products, cart, checkout, and orders.',
    },
    menuLabel: 'Menu',
    closeNavigationLabel: 'Close navigation',
    navigationLinks: [
      { kind: 'internal', label: 'Products', route: '/products' },
      { kind: 'internal', label: 'Cart', route: '/cart' },
      { kind: 'internal', label: 'Checkout', route: '/checkout' },
    ],
    primaryAction: {
      kind: 'external',
      label: 'Explore the Governance Program',
      href: mainDomainUrl,
      openInNewTab: true,
    },
  };
}

export function createStorefrontFooterConfig(
  mainDomainUrl: string,
): SharedFooterConfig {
  return {
    brandTitle: 'Angular Cleanup Storefront',
    brandSubtitle: 'Technical demo with standalone orders (no bookings).',
    columns: [
      {
        heading: 'Storefront',
        links: [
          { kind: 'internal', label: 'Products', route: '/products' },
          { kind: 'internal', label: 'Cart', route: '/cart' },
          { kind: 'internal', label: 'Checkout', route: '/checkout' },
        ],
      },
      {
        heading: 'Governance',
        links: [
          {
            kind: 'external',
            label: 'Explore the Governance Program',
            href: mainDomainUrl,
            openInNewTab: true,
          },
        ],
      },
      {
        heading: 'Notice',
        texts: ['This storefront is part of a technical demo.'],
      },
    ],
    metaText: 'Storefront domain flow: products, cart, checkout, orders.',
  };
}
