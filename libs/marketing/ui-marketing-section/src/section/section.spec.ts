import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingSection } from './section';

describe('MarketingSection', () => {
  let component: MarketingSection;
  let fixture: ComponentFixture<MarketingSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingSection],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render provided inputs', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('eyebrow', 'Section');
    fixture.componentRef.setInput('title', 'Section title');
    fixture.componentRef.setInput('subtitle', 'Section subtitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.section__eyebrow')?.textContent).toContain(
      'Section',
    );
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Section title',
    );
    expect(compiled.querySelector('.section__subtitle')?.textContent).toContain(
      'Section subtitle',
    );
  });
});
