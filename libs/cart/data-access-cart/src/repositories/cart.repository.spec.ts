import { TestBed } from '@angular/core/testing';
import { CartRepository } from './cart.repository';

describe('CartRepository', () => {
  const storageKey = 'cleanup-shop-cart';
  const baseItem = {
    id: 'boundary-polish',
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    price: 2400,
    imageSrc: '/images/products/boundary-polish.png',
    imageAlt: 'Illustration of the Boundary Polish cleaning product.',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  const setupRepository = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(CartRepository);
  };

  it('should be created', () => {
    const service = TestBed.inject(CartRepository);
    expect(service).toBeTruthy();
  });

  it('should add items and compute totals', () => {
    const service = TestBed.inject(CartRepository);

    service.addItem({ ...baseItem, quantity: 2 });
    service.addItem({
      id: 'state-simplifier',
      slug: 'state-simplifier',
      name: 'State Simplifier',
      price: 1800,
      imageSrc: '/images/products/state-simplifier.png',
      imageAlt: 'Illustration of the State Simplifier cleaning product.',
    });

    expect(service.items().length).toBe(2);
    expect(service.itemCount()).toBe(3);
    expect(service.subtotal()).toBe(6600);
  });

  it('should merge quantities for matching items', () => {
    const service = TestBed.inject(CartRepository);

    service.addItem({ ...baseItem, quantity: 1 });
    service.addItem({ ...baseItem, quantity: 2 });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
  });

  it('should update quantities and remove when zero', () => {
    const service = TestBed.inject(CartRepository);

    service.addItem({ ...baseItem, quantity: 1 });
    service.updateQuantity(baseItem.id, 3);

    expect(service.items()[0].quantity).toBe(3);

    service.updateQuantity(baseItem.id, 0);
    expect(service.items().length).toBe(0);
  });

  it('should normalize non-finite quantities', () => {
    const service = TestBed.inject(CartRepository);

    service.addItem({ ...baseItem, quantity: Number.NaN });
    expect(service.items()[0].quantity).toBe(1);

    service.updateQuantity(baseItem.id, Number.NaN);
    expect(service.items()[0].quantity).toBe(1);
  });

  it('should persist items to localStorage', () => {
    const service = TestBed.inject(CartRepository);

    service.addItem({ ...baseItem, quantity: 2 });

    const stored = localStorage.getItem(storageKey);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored ?? '[]')).toEqual([{ ...baseItem, quantity: 2 }]);
  });

  it('should hydrate items from localStorage', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([{ ...baseItem, quantity: 2 }]),
    );

    const service = setupRepository();

    expect(service.items()).toEqual([{ ...baseItem, quantity: 2 }]);
    expect(service.itemCount()).toBe(2);
  });

  it('should ignore invalid localStorage payloads', () => {
    localStorage.setItem(storageKey, 'not-json');
    expect(setupRepository().items()).toEqual([]);

    localStorage.setItem(storageKey, JSON.stringify({ id: 'oops' }));
    expect(setupRepository().items()).toEqual([]);

    localStorage.setItem(storageKey, JSON.stringify([{ id: 1 }]));
    expect(setupRepository().items()).toEqual([]);
  });
});
