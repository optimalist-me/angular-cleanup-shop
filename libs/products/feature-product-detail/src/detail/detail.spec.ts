import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ProductsRepository } from '@cleanup/data-access-products';
import { ProductDetail } from './detail';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  const setup = async (
    slug: string,
    products: Array<{
      slug: string;
      name: string;
      outcome: string;
      pattern: string;
      domainTag: 'boundaries';
      shortDescription: string;
      description: string;
      bestFor: string[];
      timeline: string;
      imageSrc: string;
      imageAlt: string;
    }>,
  ) => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ slug })) },
        },
        {
          provide: ProductsRepository,
          useValue: { all: signal(products) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should render product details when found', async () => {
    await setup('boundary-polish', [
      {
        slug: 'boundary-polish',
        name: 'Boundary Polish',
        outcome: 'Clear ownership.',
        pattern: 'Explicit boundaries.',
        domainTag: 'boundaries',
        shortDescription: 'Keeps domains clean.',
        description: 'Clarify domain ownership with firm boundaries.',
        bestFor: ['Blurred ownership', 'Large surfaces'],
        timeline: '2-3 sessions',
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Illustration of the Boundary Polish cleaning product.',
      },
    ]);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__title')?.textContent).toContain(
      'Boundary Polish',
    );
    expect(element.querySelector('.detail__panel')?.textContent).toContain(
      'Clear ownership.',
    );
    expect(
      element.querySelector('.detail__description')?.textContent,
    ).toContain('Clarify domain ownership');
    expect(element.querySelector('.detail__meta')?.textContent).toContain(
      '2-3 sessions',
    );
  });

  it('should show not found state when missing', async () => {
    await setup('missing', [
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
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Illustration of the Boundary Polish cleaning product.',
      },
    ]);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__state')?.textContent).toContain(
      'Product not found',
    );
  });
});
