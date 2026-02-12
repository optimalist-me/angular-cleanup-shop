import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProductsRepository } from '@cleanup/data-access-products';
import { ProductsList } from './list';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;

  const products = [
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsList],
      providers: [
        {
          provide: ProductsRepository,
          useValue: {
            all: signal(products),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
  });

  it('should render product cards from repository data', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('products-card').length).toBe(2);
    expect(element.querySelector('.products__title')?.textContent).toContain(
      'Pick the outcome',
    );
  });

  it('should filter products by tag', () => {
    fixture.detectChanges();

    component.selectTag('state');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('products-card').length).toBe(1);
    expect(element.textContent).toContain('State Simplifier');
  });
});
