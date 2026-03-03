import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingPlaybook } from './playbook';

describe('MarketingPlaybook', () => {
  let component: MarketingPlaybook;
  let fixture: ComponentFixture<MarketingPlaybook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingPlaybook],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingPlaybook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the engagement model headline', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Engagement Model');
  });
});
