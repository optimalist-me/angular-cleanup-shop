import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('should expose manager and technical lead primary paths', () => {
    const paths = appRoutes.map((route) => route.path);

    expect(paths).toContain('for-managers');
    expect(paths).toContain('for-technical-leads');
    expect(paths).toContain('how-it-works');
    expect(paths).toContain('ai-governance');
  });

  it('should redirect legacy storefront routes to home', () => {
    const productsRoute = appRoutes.find((route) => route.path === 'products');
    const productDetailRoute = appRoutes.find(
      (route) => route.path === 'products/:slug',
    );
    const cartRoute = appRoutes.find((route) => route.path === 'cart');
    const checkoutRoute = appRoutes.find((route) => route.path === 'checkout');

    expect(productsRoute?.redirectTo).toBe('/');
    expect(productDetailRoute?.redirectTo).toBe('/');
    expect(cartRoute?.redirectTo).toBe('/');
    expect(checkoutRoute?.redirectTo).toBe('/');
  });

  it('should redirect legacy marketing aliases to new IA paths', () => {
    const playbookRoute = appRoutes.find((route) => route.path === 'playbook');
    const architectureRoute = appRoutes.find(
      (route) => route.path === 'architecture',
    );
    const faqRoute = appRoutes.find((route) => route.path === 'faq');

    expect(playbookRoute?.redirectTo).toBe('/how-it-works');
    expect(architectureRoute?.redirectTo).toBe('/for-technical-leads');
    expect(faqRoute?.redirectTo).toBe('/for-managers');
  });
});
