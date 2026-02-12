import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
  });

  it('should render product content', () => {
    fixture.componentRef.setInput('name', 'Boundary Polish');
    fixture.componentRef.setInput(
      'imageSrc',
      '/images/products/boundary-polish.png',
    );
    fixture.componentRef.setInput(
      'imageAlt',
      'Illustration of the Boundary Polish cleaning product.',
    );
    fixture.componentRef.setInput('shortDescription', 'Keeps domains clean.');
    fixture.componentRef.setInput('outcome', 'Clear ownership.');
    fixture.componentRef.setInput('pattern', 'Explicit boundaries.');
    fixture.componentRef.setInput('tag', 'Boundaries');
    fixture.componentRef.setInput('ctaHref', '/products/boundary-polish');
    fixture.componentRef.setInput('ctaLabel', 'View product');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.card__title')?.textContent).toContain(
      'Boundary Polish',
    );
    expect(element.querySelector('.card__summary')?.textContent).toContain(
      'Keeps domains clean.',
    );
    expect(element.querySelector('.card__details')?.textContent).toContain(
      'Clear ownership.',
    );
    expect(element.querySelector('.card__details')?.textContent).toContain(
      'Explicit boundaries.',
    );
    expect(element.querySelector('products-tag')?.textContent).toContain(
      'Boundaries',
    );
    const cta = element.querySelector('.card__cta');
    expect(cta?.getAttribute('href')).toBe('/products/boundary-polish');
  });

  it('should hide optional sections when empty', () => {
    fixture.componentRef.setInput('name', 'State Simplifier');
    fixture.componentRef.setInput(
      'imageSrc',
      '/images/products/state-simplifier.png',
    );
    fixture.componentRef.setInput(
      'imageAlt',
      'Illustration of the State Simplifier cleaning product.',
    );
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.card__summary')).toBeNull();
    expect(element.querySelector('.card__details')).toBeNull();
    expect(element.querySelector('products-tag')).toBeNull();
    expect(element.querySelector('.card__cta')).toBeNull();
  });
});
