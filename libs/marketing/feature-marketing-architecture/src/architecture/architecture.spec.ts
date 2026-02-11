import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingArchitecture } from './architecture';

describe('MarketingArchitecture', () => {
  let component: MarketingArchitecture;
  let fixture: ComponentFixture<MarketingArchitecture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingArchitecture],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingArchitecture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the architecture headline', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Architecture');
  });
});
