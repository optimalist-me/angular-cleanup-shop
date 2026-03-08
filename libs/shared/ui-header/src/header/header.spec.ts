import { Component } from '@angular/core';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SharedHeader } from './header';
import { provideSharedHeaderConfig } from './header.config';

@Component({
  selector: 'shared-header-dummy',
  template: '',
})
class DummyRouteComponent {}

describe('SharedHeader', () => {
  let component: SharedHeader;
  let fixture: ComponentFixture<SharedHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedHeader],
      providers: [
        provideRouter([
          { path: 'for-managers', component: DummyRouteComponent },
          { path: 'for-technical-leads', component: DummyRouteComponent },
          { path: 'how-it-works', component: DummyRouteComponent },
          { path: 'ai-governance', component: DummyRouteComponent },
          { path: 'book/confirmed', component: DummyRouteComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should toggle the mobile menu', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;

    expect(header?.classList.contains('header--open')).toBe(false);
    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);
  });

  it('should close the menu when overlay is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;
    const overlay = compiled.querySelector(
      '.header__overlay',
    ) as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    overlay.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should render governance navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('For Managers');
    expect(compiled.textContent).toContain('For Technical Leads');
    expect(compiled.textContent).toContain('Engagement Model');
    expect(compiled.textContent).toContain('AI Governance');
  });

  it('should render external links from provided config', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SharedHeader],
      providers: [
        provideRouter([{ path: 'products', component: DummyRouteComponent }]),
        provideSharedHeaderConfig({
          brand: {
            route: '/products',
            logoSrc: '/images/cleanup-logo.png',
            logoAlt: 'Storefront logo',
            title: 'Storefront',
            subtitle: 'Technical demo.',
          },
          menuLabel: 'Menu',
          closeNavigationLabel: 'Close navigation',
          navigationLinks: [
            { kind: 'internal', label: 'Products', route: '/products' },
            {
              kind: 'external',
              label: 'Explore Governance',
              href: 'https://angularcleanup.shop',
            },
          ],
          primaryAction: {
            kind: 'external',
            label: 'Explore the Governance Program',
            href: 'https://angularcleanup.shop',
            openInNewTab: true,
          },
        }),
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(SharedHeader);
    await localFixture.whenStable();
    localFixture.detectChanges();
    const compiled = localFixture.nativeElement as HTMLElement;
    const navExternal = compiled.querySelector(
      '.header__nav a[href="https://angularcleanup.shop"]',
    );
    const ctaExternal = compiled.querySelector(
      '.header__actions a[href="https://angularcleanup.shop"]',
    );

    expect(navExternal?.textContent).toContain('Explore Governance');
    expect(ctaExternal?.textContent).toContain('Explore the Governance Program');
    expect(navExternal?.getAttribute('target')).toBeNull();
    expect(navExternal?.getAttribute('rel')).toBeNull();
    expect(ctaExternal?.getAttribute('target')).toBe('_blank');
    expect(ctaExternal?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should close the menu when a link is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;
    const managersLink = Array.from(
      compiled.querySelectorAll('.header__nav .header__link'),
    ).find((element) =>
      (element.textContent ?? '').includes('For Managers'),
    ) as HTMLAnchorElement;

    expect(managersLink).toBeTruthy();

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    managersLink.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should close the menu on navigation end', () => {
    const events$ = new Subject<NavigationEnd>();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events: events$ } }],
    });

    const navigationHeader = TestBed.runInInjectionContext(
      () => new SharedHeader(),
    );
    navigationHeader.toggleMenu();
    expect(navigationHeader.menuOpen()).toBe(true);

    events$.next(new NavigationEnd(1, '/', '/'));
    expect(navigationHeader.menuOpen()).toBe(false);
  });
});
