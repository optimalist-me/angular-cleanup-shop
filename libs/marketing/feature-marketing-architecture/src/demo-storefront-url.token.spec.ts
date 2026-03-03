import { TestBed } from '@angular/core/testing';
import {
  DEMO_STOREFRONT_URL,
  provideDemoStorefrontUrl,
} from './demo-storefront-url.token';

describe('DEMO_STOREFRONT_URL', () => {
  it('should expose default storefront url', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(DEMO_STOREFRONT_URL)).toBe(
      'https://demo.angularcleanup.shop',
    );
  });

  it('should allow overriding storefront url via provider', () => {
    TestBed.configureTestingModule({
      providers: [provideDemoStorefrontUrl('https://demo.example.com')],
    });

    expect(TestBed.inject(DEMO_STOREFRONT_URL)).toBe('https://demo.example.com');
  });
});
