import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedFooter } from './footer';
import { provideSharedFooterConfig } from './footer.config';

describe('SharedFooter', () => {
  let component: SharedFooter;
  let fixture: ComponentFixture<SharedFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFooter],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render governance positioning text', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Governance-first stabilization');
  });

  it('should render provided internal and external links', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SharedFooter],
      providers: [
        provideRouter([]),
        provideSharedFooterConfig({
          brandTitle: 'Storefront',
          brandSubtitle: 'Technical demo.',
          columns: [
            {
              heading: 'Storefront',
              links: [
                { kind: 'internal', label: 'Products', route: '/products' },
              ],
            },
            {
              heading: 'Governance',
              links: [
                {
                  kind: 'external',
                  label: 'Explore Governance',
                  href: 'https://angularcleanup.shop',
                  openInNewTab: true,
                },
              ],
            },
          ],
          metaText: 'Storefront domain flow.',
        }),
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(SharedFooter);
    await localFixture.whenStable();
    localFixture.detectChanges();
    const compiled = localFixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Storefront');
    expect(compiled.textContent).toContain('Products');
    const external = compiled.querySelector(
      'a[href="https://angularcleanup.shop"]',
    );
    expect(external).toBeTruthy();
    expect(external?.getAttribute('target')).toBe('_blank');
    expect(external?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
