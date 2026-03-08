import { TestBed } from '@angular/core/testing';
import { MAIN_DOMAIN_URL } from './main-domain-url.token';

describe('MAIN_DOMAIN_URL token', () => {
  it('uses the default factory value when no provider is configured', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(MAIN_DOMAIN_URL)).toBe('https://angularcleanup.shop');
  });

  it('can be overridden by a provider', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAIN_DOMAIN_URL, useValue: 'https://example.org' },
      ],
    });

    expect(TestBed.inject(MAIN_DOMAIN_URL)).toBe('https://example.org');
  });
});
