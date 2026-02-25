import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CartRepository } from '@cleanup/data-access-cart';
import { ProductsRepository } from '@cleanup/data-access-products';
import { ProductDetail } from './detail';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let addItemSpy: ReturnType<typeof vi.fn>;

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
      price: number;
      imageSrc: string;
      imageAlt: string;
    }>,
  ) => {
    addItemSpy = vi.fn();
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
        {
          provide: CartRepository,
          useValue: { addItem: addItemSpy },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    vi.useRealTimers();
  });

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
        price: 2400,
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

    component.addToCart();
    expect(addItemSpy).toHaveBeenCalledWith({
      id: 'boundary-polish',
      slug: 'boundary-polish',
      name: 'Boundary Polish',
      price: 2400,
      imageSrc: '/images/products/boundary-polish.png',
      imageAlt: 'Illustration of the Boundary Polish cleaning product.',
      quantity: 1,
    });

    fixture.detectChanges();
    expect(element.querySelector('.detail__toast')?.textContent).toContain(
      'Boundary Polish added to cart.',
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
        price: 2400,
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Illustration of the Boundary Polish cleaning product.',
      },
    ]);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__state')?.textContent).toContain(
      'Product not found',
    );
  });

  it('should not add to cart when product is unavailable', async () => {
    await setup('missing', []);

    component.addToCart();
    fixture.detectChanges();

    expect(addItemSpy).not.toHaveBeenCalled();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__toast')).toBeNull();
  });

  it('should hide add-to-cart toast after timeout', async () => {
    vi.useFakeTimers();
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
        price: 2400,
        imageSrc: '/images/products/boundary-polish.png',
        imageAlt: 'Illustration of the Boundary Polish cleaning product.',
      },
    ]);

    component.addToCart();
    fixture.detectChanges();

    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__toast')?.textContent).toContain(
      'Boundary Polish added to cart.',
    );

    vi.advanceTimersByTime(2200);
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__toast')).toBeNull();
  });

  it('should resolve to null product when route slug is missing', async () => {
    await setup('', [
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
    ]);

    expect(component.product()).toBeNull();
  });
});
