import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSharedFooterConfig } from '@cleanup/shared-ui-footer';
import { provideSharedHeaderConfig } from '@cleanup/shared-ui-header';
import { App } from './app';
import {
  createStorefrontFooterConfig,
  createStorefrontHeaderConfig,
} from './storefront-shell-content';
import { environment } from '../environments/environment';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideSharedHeaderConfig(
          createStorefrontHeaderConfig(environment.MAIN_DOMAIN_URL),
        ),
        provideSharedFooterConfig(
          createStorefrontFooterConfig(environment.MAIN_DOMAIN_URL),
        ),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render shell with header, footer and router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('shared-header')).not.toBeNull();
    expect(element.querySelector('shared-footer')).not.toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });

  it('should render storefront governance CTAs with MAIN_DOMAIN_URL in new tabs', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const headerCta = element.querySelector(
      `shared-header .header__actions a[href="${environment.MAIN_DOMAIN_URL}"]`,
    );
    const footerCta = element.querySelector(
      `shared-footer .footer__link[href="${environment.MAIN_DOMAIN_URL}"]`,
    );

    expect(headerCta?.textContent).toContain('Explore the Governance Program');
    expect(headerCta?.getAttribute('target')).toBe('_blank');
    expect(headerCta?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(footerCta?.textContent).toContain('Explore the Governance Program');
    expect(footerCta?.getAttribute('target')).toBe('_blank');
    expect(footerCta?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
