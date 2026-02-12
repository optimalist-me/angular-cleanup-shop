import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { ProductsApi } from './products.api';

describe('ProductsApi', () => {
  let api: ProductsApi;
  let httpMock: HttpTestingController;

  const products: Product[] = [
    {
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
    },
    {
      slug: 'state-simplifier',
      name: 'State Simplifier',
      outcome: 'Calm state.',
      pattern: 'Signals-first state.',
      domainTag: 'state',
      shortDescription: 'Less state noise.',
      description: 'Reduce state sprawl with a signal-first approach.',
      bestFor: ['Complex local state'],
      timeline: '2 sessions',
      price: 1800,
      imageSrc: '/images/products/state-simplifier.png',
      imageAlt: 'Illustration of the State Simplifier cleaning product.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    api = TestBed.inject(ProductsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load the catalog', () => {
    api.getAll().subscribe((result) => {
      expect(result).toEqual(products);
    });

    const request = httpMock.expectOne('/data/products.json');
    expect(request.request.method).toBe('GET');
    request.flush(products);
  });

  it('should find a product by slug', () => {
    api.getBySlug('state-simplifier').subscribe((result) => {
      expect(result).toEqual(products[1]);
    });

    const request = httpMock.expectOne('/data/products.json');
    request.flush(products);
  });

  it('should return null for an unknown slug', () => {
    api.getBySlug('missing').subscribe((result) => {
      expect(result).toBeNull();
    });

    const request = httpMock.expectOne('/data/products.json');
    request.flush(products);
  });
});
