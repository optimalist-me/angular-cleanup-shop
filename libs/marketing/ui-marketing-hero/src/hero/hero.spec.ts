import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingHero } from './hero';

describe('MarketingHero', () => {
  let component: MarketingHero;
  let fixture: ComponentFixture<MarketingHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingHero],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the hero title', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Reduce Structural Friction. Protect Long-Term Velocity.',
    );
  });
});
