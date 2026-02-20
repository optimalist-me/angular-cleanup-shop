import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDesignText } from './text';

describe('SharedDesignText', () => {
  let fixture: ComponentFixture<SharedDesignText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDesignText],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDesignText);
  });

  it('should apply tone, size, and weight classes', () => {
    fixture.componentRef.setInput('tone', 'accent');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('weight', 'semibold');
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(text.classList.contains('ds-text--tone-accent')).toBe(true);
    expect(text.classList.contains('ds-text--size-lg')).toBe(true);
    expect(text.classList.contains('ds-text--weight-semibold')).toBe(true);
  });

  it('should support uppercase and truncate flags', () => {
    fixture.componentRef.setInput('uppercase', true);
    fixture.componentRef.setInput('truncate', true);
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(text.classList.contains('ds-text--uppercase')).toBe(true);
    expect(text.classList.contains('ds-text--truncate')).toBe(true);
  });
});
