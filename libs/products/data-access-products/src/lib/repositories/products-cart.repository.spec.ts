import { TestBed } from '@angular/core/testing';
import { type Product } from '@cleanup/models-products';
import { PRODUCTS_CART_PORT, type ProductsCartPort } from '../ports/products-cart.port';
import { ProductsCartRepository } from './products-cart.repository';

describe('ProductsCartRepository', () => {
  it('proxies addProductToCart to configured products cart port', () => {
    const product: Product = {
      slug: 'boundary-polish',
      name: 'Boundary Polish',
      outcome: 'Clear ownership.',
      pattern: 'Explicit boundaries.',
      domainTag: 'boundaries',
      shortDescription: 'Keeps domains clean.',
      description: 'Clarify domain ownership with firm boundaries.',
      bestFor: ['Blurred ownership'],
      timeline: '2-3 sessions',
      price: 2400,
      imageSrc: '/images/products/boundary-polish.png',
      imageAlt: 'Illustration of the Boundary Polish cleaning product.',
    };

    const port: ProductsCartPort = {
      addProductToCart: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsCartRepository,
        { provide: PRODUCTS_CART_PORT, useValue: port },
      ],
    });

    const repository = TestBed.inject(ProductsCartRepository);
    repository.addProductToCart(product);

    expect(port.addProductToCart).toHaveBeenCalledWith(product);
  });
});
