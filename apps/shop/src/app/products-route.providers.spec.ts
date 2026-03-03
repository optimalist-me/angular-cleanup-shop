import { Provider } from '@angular/core';
import { CartRepository } from '@cleanup/data-access-cart';
import {
  PRODUCTS_CART_PORT,
  ProductsCartRepository,
  type ProductsCartPort,
} from '@cleanup/data-access-products';
import { Product } from '@cleanup/models-products';
import { provideProductsRouteAdapters } from './products-route.providers';

describe('provideProductsRouteAdapters', () => {
  it('should expose products cart repository and port provider', () => {
    const providers = provideProductsRouteAdapters();

    expect(providers[0]).toBe(ProductsCartRepository);

    const portProvider = findProviderWithFactory<ProductsCartPort>(
      providers,
      PRODUCTS_CART_PORT,
    );

    expect(portProvider.deps).toEqual([CartRepository]);
  });

  it('should map product payload into cart item input', () => {
    const providers = provideProductsRouteAdapters();
    const portProvider = findProviderWithFactory<ProductsCartPort>(
      providers,
      PRODUCTS_CART_PORT,
    );

    const cartRepository = {
      addItem: vi.fn(),
    } as unknown as CartRepository;

    const port = portProvider.useFactory(cartRepository);

    const product: Product = {
      slug: 'boundary-polish',
      name: 'Boundary Polish',
      outcome: 'Restore boundaries',
      pattern: 'Public API enforcement',
      domainTag: 'boundaries',
      shortDescription: 'Restores ownership clarity',
      description: 'Long description',
      bestFor: ['legacy coupling'],
      timeline: '1-2 weeks',
      price: 0,
      imageSrc: '/images/products/boundary-polish.png',
      imageAlt: 'Boundary Polish image',
    };

    port.addProductToCart(product);

    expect(cartRepository.addItem).toHaveBeenCalledWith({
      id: 'boundary-polish',
      slug: 'boundary-polish',
      name: 'Boundary Polish',
      price: 0,
      imageSrc: '/images/products/boundary-polish.png',
      imageAlt: 'Boundary Polish image',
      quantity: 1,
    });
  });
});

type FactoryProvider<TPort> = {
  provide: unknown;
  useFactory: (dependency: unknown) => TPort;
  deps: unknown[];
};

function findProviderWithFactory<TPort>(
  providers: Provider[],
  token: unknown,
): FactoryProvider<TPort> {
  const provider = providers.find(
    (entry): entry is FactoryProvider<TPort> =>
      typeof entry === 'object' &&
      entry !== null &&
      'provide' in entry &&
      entry.provide === token &&
      'useFactory' in entry,
  );

  if (!provider) {
    throw new Error('Expected provider with useFactory to be registered.');
  }

  return provider;
}
