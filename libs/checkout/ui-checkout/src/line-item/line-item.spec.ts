import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CheckoutLineItem } from './line-item';

describe('CheckoutLineItem', () => {
  let component: CheckoutLineItem;
  let fixture: ComponentFixture<CheckoutLineItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutLineItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutLineItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'boundary-polish');
    fixture.componentRef.setInput('name', 'Boundary Polish');
    fixture.componentRef.setInput('imageSrc', '/images/products/boundary-polish.png');
    fixture.componentRef.setInput('imageAlt', 'Boundary Polish image');
    fixture.componentRef.setInput('price', 2400);
    fixture.componentRef.setInput('quantity', 2);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits quantityChange when increasing and decreasing', () => {
    const quantityChange = vi.fn();
    component.quantityChange.subscribe(quantityChange);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.line-item__step'));
    buttons[1].triggerEventHandler('click', new MouseEvent('click'));
    buttons[0].triggerEventHandler('click', new MouseEvent('click'));

    expect(quantityChange).toHaveBeenCalledWith(3);
    expect(quantityChange).toHaveBeenCalledWith(1);
  });

  it('emits remove when remove button is clicked', () => {
    const remove = vi.fn();
    component.remove.subscribe(remove);
    fixture.detectChanges();

    const removeButton = fixture.debugElement.query(By.css('.line-item__remove'));
    removeButton.triggerEventHandler('click', new MouseEvent('click'));

    expect(remove).toHaveBeenCalled();
  });
});
