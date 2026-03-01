import { InjectionToken } from '@angular/core';
import { type Product } from '@cleanup/models-products';

export interface ProductsCartPort {
  addProductToCart(product: Product): void;
}

export const PRODUCTS_CART_PORT = new InjectionToken<ProductsCartPort>(
  'PRODUCTS_CART_PORT',
  {
    factory: () => {
      throw new Error(
        'PRODUCTS_CART_PORT is not configured. Provide products adapters at the product detail route.',
      );
    },
  },
);
