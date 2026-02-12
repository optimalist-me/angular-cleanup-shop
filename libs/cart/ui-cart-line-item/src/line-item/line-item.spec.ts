import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartLineItem } from './line-item';

describe('CartLineItem', () => {
  let component: CartLineItem;
  let fixture: ComponentFixture<CartLineItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartLineItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CartLineItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'boundary-polish');
    fixture.componentRef.setInput('name', 'Boundary Polish');
    fixture.componentRef.setInput(
      'imageSrc',
      '/images/products/boundary-polish.png',
    );
    fixture.componentRef.setInput('imageAlt', 'Boundary Polish image');
    fixture.componentRef.setInput('price', 2400);
    fixture.componentRef.setInput('quantity', 2);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render name and total', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.line-item__title')?.textContent).toContain(
      'Boundary Polish',
    );
    expect(element.querySelector('.line-item__total')?.textContent).toContain(
      '€4,800',
    );
  });

  it('should emit quantity changes and remove', () => {
    const quantitySpy = vi.fn();
    const removeSpy = vi.fn();

    component.quantityChange.subscribe(quantitySpy);
    component.remove.subscribe(removeSpy);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelectorAll<HTMLButtonElement>('.line-item__step')[1].click();
    element.querySelectorAll<HTMLButtonElement>('.line-item__step')[0].click();
    element.querySelector<HTMLButtonElement>('.line-item__remove')?.click();

    expect(quantitySpy).toHaveBeenCalledWith(3);
    expect(quantitySpy).toHaveBeenCalledWith(1);
    expect(removeSpy).toHaveBeenCalled();
  });
});
