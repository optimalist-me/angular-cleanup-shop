import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingHome } from './home';

describe('MarketingHome', () => {
  let component: MarketingHome;
  let fixture: ComponentFixture<MarketingHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingHome],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render manager and technical lead audience paths', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('For managers');
    expect(compiled.textContent).toContain('For technical leads');
  });

  it('should render manager outcomes with non-replacement governance messaging', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const pageText = compiled.textContent ?? '';
    const governanceImage = compiled.querySelector<HTMLImageElement>(
      'img.home__manager-image',
    );

    expect(pageText).toContain(
      'Angular Cleanup does not replace Angular, Nx, CI/CD, or testing.',
    );
    expect(pageText).toContain(
      'Modern Angular teams already have strong tooling: Angular, Nx',
    );
    expect(pageText).toContain('Clear architectural boundaries');
    expect(pageText).toContain('Safer upgrades');
    expect(governanceImage).not.toBeNull();
    expect(governanceImage?.getAttribute('src')).toContain(
      '/images/tools-governance.png',
    );
    expect(governanceImage?.getAttribute('alt')).toContain(
      'Angular Cleanup structural governance',
    );
  });

  it('should not render the removed layered graph markup', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home__fit-layers')).toBeNull();
  });

  it('should render the Nx Certified Expert badge in the trust section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector<HTMLImageElement>(
      'img.home__trust-badge',
    );

    expect(badge).not.toBeNull();
    expect(badge?.getAttribute('src')).toContain(
      '/images/expert-badge-light.png',
    );
    expect(badge?.getAttribute('alt')).toContain('Nx Certified Expert badge');
  });
});
