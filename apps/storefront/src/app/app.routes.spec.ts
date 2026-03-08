import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('redirects root to products', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    expect(rootRoute?.redirectTo).toBe('/products');
  });

  it('exposes storefront product/cart/checkout paths', () => {
    const paths = appRoutes.map((route) => route.path);

    expect(paths).toContain('products');
    expect(paths).toContain('products/:slug');
    expect(paths).toContain('cart');
    expect(paths).toContain('checkout');
  });
});
