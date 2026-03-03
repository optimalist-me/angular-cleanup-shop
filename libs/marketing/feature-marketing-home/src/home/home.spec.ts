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
