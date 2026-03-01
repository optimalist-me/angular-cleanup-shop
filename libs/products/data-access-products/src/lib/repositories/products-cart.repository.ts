import { inject, Injectable } from '@angular/core';
import { type Product } from '@cleanup/models-products';
import { PRODUCTS_CART_PORT, type ProductsCartPort } from '../ports/products-cart.port';

@Injectable()
export class ProductsCartRepository {
  private readonly port = inject<ProductsCartPort>(PRODUCTS_CART_PORT);

  addProductToCart(product: Product): void {
    this.port.addProductToCart(product);
  }
}
