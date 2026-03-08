import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  CheckoutCartRepository,
  CheckoutOrderRepository,
} from '@cleanup/data-access-checkout';
import { type CheckoutCartItem } from '@cleanup/models-checkout';
import { CheckoutCheckout } from './checkout';

describe('CheckoutCheckout', () => {
  let component: CheckoutCheckout;
  let fixture: ComponentFixture<CheckoutCheckout>;
  let cartItems: ReturnType<typeof signal<CheckoutCartItem[]>>;
  let cartRepositoryStub: {
    items: typeof cartItems;
    itemCount: ReturnType<typeof computed<number>>;
    subtotal: ReturnType<typeof computed<number>>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  let orderRepositoryStub: {
    submit: ReturnType<typeof vi.fn>;
  };

  const boundaryPolish: CheckoutCartItem = {
    id: 'boundary-polish',
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    price: 2400,
    imageSrc: '/images/products/boundary-polish.png',
    imageAlt: 'Boundary Polish image',
    quantity: 1,
  };

  beforeEach(async () => {
    cartItems = signal<CheckoutCartItem[]>([]);
    cartRepositoryStub = {
      items: cartItems,
      itemCount: computed(() =>
        cartItems().reduce((total, item) => total + item.quantity, 0),
      ),
      subtotal: computed(() =>
        cartItems().reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        ),
      ),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    orderRepositoryStub = {
      submit: vi.fn(() =>
        of({
          success: true,
          orderId: 'order-123',
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutCheckout],
      providers: [
        provideRouter([]),
        { provide: CheckoutCartRepository, useValue: cartRepositoryStub },
        {
          provide: CheckoutOrderRepository,
          useValue: orderRepositoryStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('moves between review and details steps', () => {
    component.toDetailsStep();
    expect(component.step()).toBe('details');

    component.backToReview();
    expect(component.step()).toBe('review');
  });

  it('proxies item updates to cart repository', () => {
    component.updateQuantity('boundary-polish', 2);
    component.removeItem('boundary-polish');

    expect(cartRepositoryStub.updateQuantity).toHaveBeenCalledWith(
      'boundary-polish',
      2,
    );
    expect(cartRepositoryStub.removeItem).toHaveBeenCalledWith(
      'boundary-polish',
    );
  });

  it('computes canSubmit from form status and submitting state', () => {
    expect(component.canSubmit()).toBe(true);

    component.submitting.set(true);
    expect(component.canSubmit()).toBe(false);
  });

  it('shows an error when placing order with empty cart', () => {
    component.toDetailsStep();

    component.submit();

    expect(component.submissionError()).toBe(
      'Your cart is empty. Add an item to place an order.',
    );
    expect(orderRepositoryStub.submit).not.toHaveBeenCalled();
  });

  it('marks invalid form controls as touched and skips submit', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();
    component.detailsForm.controls.email.setValue('invalid-email');

    component.submit();

    expect(component.detailsForm.controls.email.touched).toBe(true);
    expect(orderRepositoryStub.submit).not.toHaveBeenCalled();
  });

  it('submits order and navigates to success route on success', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();
    component.detailsForm.controls.name.setValue('  Taylor Reed  ');
    component.detailsForm.controls.email.setValue('taylor@example.com');
    component.detailsForm.controls.company.setValue('  Cleanup Shop  ');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.submit();

    expect(orderRepositoryStub.submit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Taylor Reed',
        email: 'taylor@example.com',
        company: 'Cleanup Shop',
        subtotal: 2400,
        tax: 0,
        total: 2400,
      }),
    );
    expect(cartRepositoryStub.clear).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/checkout/success',
      'order-123',
    ]);
  });

  it('handles unsuccessful responses from submit', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();
    orderRepositoryStub.submit.mockReturnValue(
      of({ success: false, message: 'Order rejected' }),
    );

    component.submit();

    expect(component.submissionError()).toBe('Order rejected');
    expect(cartRepositoryStub.clear).not.toHaveBeenCalled();
  });

  it('surfaces API errors from submit', () => {
    cartItems.set([boundaryPolish]);
    component.toDetailsStep();
    orderRepositoryStub.submit.mockReturnValue(
      throwError(() => new Error('network')),
    );

    component.submit();

    expect(component.submitting()).toBe(false);
    expect(component.submissionError()).toBe(
      'We could not place your order. Please try again.',
    );
  });
});
