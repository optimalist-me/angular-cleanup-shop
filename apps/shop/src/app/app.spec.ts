import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

@Component({
  template: '',
})
class TestRouteComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, TestRouteComponent],
      providers: [
        provideRouter([
          {
            path: '**',
            component: TestRouteComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    document.head
      .querySelector<HTMLScriptElement>('#structured-data-graph')
      ?.remove();
    document.head
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.remove();
  });

  it('should render header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('shared-header')).toBeTruthy();
    expect(compiled.querySelector('shared-footer')).toBeTruthy();
  });

  it('should allow toggling the header menu', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('shared-header header');
    const toggle = compiled.querySelector(
      'shared-header .header__toggle',
    ) as HTMLButtonElement;
    const overlay = compiled.querySelector(
      'shared-header .header__overlay',
    ) as HTMLDivElement;

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    overlay.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should expose the app title', () => {
    const fixture = TestBed.createComponent(App);
    const instance = fixture.componentInstance as unknown as {
      title: string;
    };
    expect(instance.title).toBe('Angular Cleanup Shop');
  });

  it('should apply indexable SEO metadata for marketing pages', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/playbook');
    fixture.detectChanges();
    await fixture.whenStable();

    const robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    expect(document.title).toContain('Playbook');
    expect(robots?.content).toBe(
      'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    );
    expect(canonical?.href).toBe('https://angularcleanup.shop/playbook');
  });

  it('should apply indexable SEO metadata for privacy page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/privacy');
    fixture.detectChanges();
    await fixture.whenStable();

    const robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const description = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    expect(document.title).toContain('Privacy Policy');
    expect(robots?.content).toBe(
      'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    );
    expect(canonical?.href).toBe('https://angularcleanup.shop/privacy');
    expect(description?.content).toContain('GDPR');
  });

  it('should apply noindex metadata on conversion routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/checkout');
    fixture.detectChanges();
    await fixture.whenStable();
    const checkoutRobots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    expect(checkoutRobots?.content).toBe(
      'noindex,nofollow,noarchive,nosnippet',
    );

    await router.navigateByUrl('/book/confirmed/booking-123');
    fixture.detectChanges();
    await fixture.whenStable();
    const confirmedRobots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    expect(confirmedRobots?.content).toBe(
      'noindex,nofollow,noarchive,nosnippet',
    );
  });

  it('should scroll to top on navigation', async () => {
    const scrollSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();
    scrollSpy.mockClear();

    await router.navigateByUrl('/faq');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy).toHaveBeenLastCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    scrollSpy.mockRestore();
  });

  it('should apply product-specific metadata for known and unknown slugs', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/products/boundary-polish');
    fixture.detectChanges();
    await fixture.whenStable();
    const knownDescription = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    expect(document.title).toContain('Boundary Polish');
    expect(knownDescription?.content).toContain(
      'Removes hidden coupling and restores ownership clarity.',
    );

    await router.navigateByUrl('/products/custom-cleanup-path');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.title).toContain('Custom Cleanup Path');
  });

  it('should emit FAQPage structured data on faq route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/faq');
    fixture.detectChanges();
    await fixture.whenStable();

    const structuredData = readStructuredDataGraph();
    expect(
      structuredData.some((node) => node['@type'] === 'FAQPage'),
    ).toBeTruthy();
  });

  it('should emit OfferCatalog and ItemList structured data on products route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/products');
    fixture.detectChanges();
    await fixture.whenStable();

    const structuredData = readStructuredDataGraph();
    expect(
      structuredData.some((node) => node['@type'] === 'OfferCatalog'),
    ).toBeTruthy();
    expect(
      structuredData.some((node) => node['@type'] === 'ItemList'),
    ).toBeTruthy();
  });

  it('should emit product offer and breadcrumbs structured data on product detail route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/products/state-simplifier');
    fixture.detectChanges();
    await fixture.whenStable();

    const structuredData = readStructuredDataGraph();
    expect(
      structuredData.some((node) => node['@type'] === 'Offer'),
    ).toBeTruthy();
    expect(
      structuredData.some((node) => node['@type'] === 'BreadcrumbList'),
    ).toBeTruthy();
  });
});

function readStructuredDataGraph(): Array<Record<string, unknown>> {
  const script = document.head.querySelector<HTMLScriptElement>(
    '#structured-data-graph',
  );
  expect(script).toBeTruthy();

  const content = script?.textContent ?? '{}';
  const parsed = JSON.parse(content) as {
    '@graph'?: Array<Record<string, unknown>>;
  };
  return parsed['@graph'] ?? [];
}
