import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDesignSurface } from './surface';

describe('SharedDesignSurface', () => {
  let fixture: ComponentFixture<SharedDesignSurface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDesignSurface],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDesignSurface);
  });

  it('should apply configured tone, padding, and radius classes', () => {
    fixture.componentRef.setInput('tone', 'raised');
    fixture.componentRef.setInput('padding', 'lg');
    fixture.componentRef.setInput('radius', 'md');
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector(
      'section',
    ) as HTMLElement;
    expect(section.classList.contains('ds-surface--tone-raised')).toBe(true);
    expect(section.classList.contains('ds-surface--padding-lg')).toBe(true);
    expect(section.classList.contains('ds-surface--radius-md')).toBe(true);
    expect(section.classList.contains('ds-surface--bordered')).toBe(true);
  });

  it('should remove bordered class when disabled', () => {
    fixture.componentRef.setInput('bordered', false);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector(
      'section',
    ) as HTMLElement;
    expect(section.classList.contains('ds-surface--bordered')).toBe(false);
  });
});
