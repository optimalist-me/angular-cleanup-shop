import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingFaq } from './faq';

describe('MarketingFaq', () => {
  let component: MarketingFaq;
  let fixture: ComponentFixture<MarketingFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingFaq],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingFaq);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render manager-focused framing', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('What you are buying');
  });
});
