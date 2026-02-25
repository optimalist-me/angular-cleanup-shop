import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Product } from '@cleanup/models-products';
import { ProductsApi } from '../api/products.api';
import { ProductsRepository } from './products.repository';

describe('ProductsRepository', () => {
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
      providers: [
        ProductsRepository,
        {
          provide: ProductsApi,
          useValue: { getAll: () => of(products) },
        },
      ],
    });
  });

  it('should expose all products', () => {
    const repository = TestBed.inject(ProductsRepository);
    expect(repository.all()).toEqual(products);
  });

  it('should resolve a product by slug', () => {
    const repository = TestBed.inject(ProductsRepository);
    const product = repository.getBySlug('boundary-polish');
    expect(product()).toEqual(products[0]);
  });

  it('should return null for missing products', () => {
    const repository = TestBed.inject(ProductsRepository);
    const product = repository.getBySlug('missing');
    expect(product()).toBeNull();
  });

  it('should start with an empty list before data arrives', () => {
    const products$ = new Subject<Product[]>();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: ProductsApi,
          useValue: { getAll: () => products$.asObservable() },
        },
      ],
    });

    const repository = TestBed.inject(ProductsRepository);
    expect(repository.all()).toEqual([]);

    products$.next(products);
    expect(repository.all()).toEqual(products);
  });
});
