import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutSummary } from './summary';

describe('CheckoutSummary', () => {
  let component: CheckoutSummary;
  let fixture: ComponentFixture<CheckoutSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemCount', 3);
    fixture.componentRef.setInput('subtotal', 6600);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render summary details', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.summary__count')?.textContent).toContain(
      '3 items',
    );
    expect(element.querySelector('.summary__row')?.textContent).toContain(
      '€6,600',
    );
  });
});
