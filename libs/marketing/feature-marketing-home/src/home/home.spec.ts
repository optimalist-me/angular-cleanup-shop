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

  it('should render the featured products section', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Featured products');
  });
});
