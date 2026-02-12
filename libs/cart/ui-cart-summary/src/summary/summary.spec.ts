import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummary } from './summary';

describe('CartSummary', () => {
  let component: CartSummary;
  let fixture: ComponentFixture<CartSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummary);
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

  it('should emit checkout event', () => {
    const checkoutSpy = vi.fn();
    component.checkout.subscribe(checkoutSpy);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.summary__cta')?.click();

    expect(checkoutSpy).toHaveBeenCalled();
  });
});
