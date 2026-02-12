import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTag } from './tag';

describe('ProductTag', () => {
  let component: ProductTag;
  let fixture: ComponentFixture<ProductTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTag],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTag);
    component = fixture.componentInstance;
  });

  it('should render label with tone', () => {
    fixture.componentRef.setInput('label', 'Boundaries');
    fixture.componentRef.setInput('tone', 'accent');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tag = element.querySelector('.tag');
    expect(tag?.textContent).toContain('Boundaries');
    expect(tag?.classList.contains('tag--accent')).toBe(true);
  });

  it('should prefer aria label when provided', () => {
    fixture.componentRef.setInput('label', 'State');
    fixture.componentRef.setInput('ariaLabel', 'State focus');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tag = element.querySelector('.tag');
    expect(tag?.getAttribute('aria-label')).toBe('State focus');
  });
});
