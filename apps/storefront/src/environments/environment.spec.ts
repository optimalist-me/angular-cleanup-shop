import { environment } from './environment';
import { environment as productionEnvironment } from './environment.prod';

describe('storefront environments', () => {
  it('defines MAIN_DOMAIN_URL for development', () => {
    expect(environment.MAIN_DOMAIN_URL).toBe('https://angularcleanup.shop');
  });

  it('defines MAIN_DOMAIN_URL for production', () => {
    expect(productionEnvironment.MAIN_DOMAIN_URL).toBe(
      'https://angularcleanup.shop',
    );
  });
});
