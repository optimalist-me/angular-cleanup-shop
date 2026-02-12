import { computed, Injectable, signal } from '@angular/core';
import { CartItem, CartItemInput } from '../models/cart-item.model';

const STORAGE_KEY = 'cleanup-shop-cart';

@Injectable({
  providedIn: 'root',
})
export class CartRepository {
  private readonly itemsState = signal<CartItem[]>(loadStoredItems());

  readonly items = computed(() => this.itemsState());
  readonly itemCount = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.itemsState().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  );

  addItem(input: CartItemInput): void {
    const quantity = normalizeQuantity(input.quantity ?? 1);

    this.itemsState.update((items) => {
      const existing = items.find((item) => item.id === input.id);

      if (!existing) {
        return [...items, { ...input, quantity }];
      }

      return items.map((item) =>
        item.id === input.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });

    storeItems(this.itemsState());
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    const nextQuantity = normalizeQuantity(quantity);

    this.itemsState.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    );

    storeItems(this.itemsState());
  }

  removeItem(id: string): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
    storeItems(this.itemsState());
  }

  clear(): void {
    this.itemsState.set([]);
    storeItems(this.itemsState());
  }
}

const normalizeQuantity = (quantity: number): number => {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
};

const loadStoredItems = (): CartItem[] => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
};

const storeItems = (items: CartItem[]): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as CartItem;
  return (
    typeof item.id === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.imageSrc === 'string' &&
    typeof item.imageAlt === 'string' &&
    typeof item.quantity === 'number'
  );
};
