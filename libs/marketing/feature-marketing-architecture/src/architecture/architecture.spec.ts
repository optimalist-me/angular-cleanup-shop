import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingArchitecture } from './architecture';
import { provideDemoStorefrontUrl } from '../demo-storefront-url.token';

const DEMO_STOREFRONT_URL = 'https://demo.angularcleanup.shop';

describe('MarketingArchitecture', () => {
  let component: MarketingArchitecture;
  let fixture: ComponentFixture<MarketingArchitecture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingArchitecture],
      providers: [
        provideRouter([]),
        provideDemoStorefrontUrl(DEMO_STOREFRONT_URL),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingArchitecture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the technical lead headline', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('For technical leads');
  });

  it('should render a storefront demo link that opens in a new tab', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const demoLink = compiled.querySelector(
      `a[href="${DEMO_STOREFRONT_URL}"]`,
    );

    expect(demoLink?.textContent).toContain('View storefront demo');
    expect(demoLink?.getAttribute('target')).toBe('_blank');
    expect(demoLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
