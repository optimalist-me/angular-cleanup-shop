import { Provider } from '@angular/core';
import { CartRepository } from '@cleanup/data-access-cart';
import {
  PRODUCTS_CART_PORT,
  ProductsCartRepository,
  type ProductsCartPort,
} from '@cleanup/data-access-products';
import { type Product } from '@cleanup/models-products';

function createProductsCartPort(cartRepository: CartRepository): ProductsCartPort {
  return {
    addProductToCart: (product: Product) => {
      cartRepository.addItem({
        id: product.slug,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
        quantity: 1,
      });
    },
  };
}

export function provideProductsRouteAdapters(): Provider[] {
  return [
    ProductsCartRepository,
    {
      provide: PRODUCTS_CART_PORT,
      useFactory: createProductsCartPort,
      deps: [CartRepository],
    },
  ];
}
