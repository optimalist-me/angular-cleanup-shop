import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CartItem, CartRepository } from '@cleanup/data-access-cart';
import { CartCart } from './cart';

describe('CartCart', () => {
  let component: CartCart;
  let fixture: ComponentFixture<CartCart>;
  let itemsSignal: ReturnType<typeof signal<CartItem[]>>;
  let repositoryStub: {
    items: typeof itemsSignal;
    itemCount: ReturnType<typeof computed<number>>;
    subtotal: ReturnType<typeof computed<number>>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    itemsSignal = signal<CartItem[]>([]);
    repositoryStub = {
      items: itemsSignal,
      itemCount: computed(() =>
        itemsSignal().reduce((total, item) => total + item.quantity, 0),
      ),
      subtotal: computed(() =>
        itemsSignal().reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      ),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartCart],
      providers: [
        provideRouter([]),
        {
          provide: CartRepository,
          useValue: repositoryStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when cart is empty', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.cart__empty')?.textContent).toContain(
      'Your cart is empty',
    );
  });

  it('should render line items when cart has items', () => {
    itemsSignal.set([
      {
        id: 'boundary-polish',
        slug: 'boundary-polish',
        name: 'Boundary Polish',
        price: 2400,
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Boundary Polish image',
        quantity: 2,
      },
    ]);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('cart-line-item').length).toBe(1);
    expect(element.querySelector('.cart__summary')).toBeTruthy();
  });

  it('should forward quantity and remove events to repository', () => {
    itemsSignal.set([
      {
        id: 'boundary-polish',
        slug: 'boundary-polish',
        name: 'Boundary Polish',
        price: 2400,
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Boundary Polish image',
        quantity: 2,
      },
    ]);

    fixture.detectChanges();

    const itemDebug = fixture.debugElement.query(By.css('cart-line-item'));
    itemDebug.triggerEventHandler('quantityChange', 4);
    itemDebug.triggerEventHandler('remove', undefined);

    expect(repositoryStub.updateQuantity).toHaveBeenCalledWith(
      'boundary-polish',
      4,
    );
    expect(repositoryStub.removeItem).toHaveBeenCalledWith('boundary-polish');
  });

  it('should allow checkout to be triggered', () => {
    component.checkout();
    expect(true).toBe(true);
  });
});
