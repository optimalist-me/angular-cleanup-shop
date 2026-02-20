import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDesignButton } from './button';

describe('SharedDesignButton', () => {
  let fixture: ComponentFixture<SharedDesignButton>;
  let component: SharedDesignButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDesignButton],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDesignButton);
    component = fixture.componentInstance;
  });

  it('should render tone and size classes', () => {
    fixture.componentRef.setInput('tone', 'secondary');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList.contains('ds-button--tone-secondary')).toBe(true);
    expect(button.classList.contains('ds-button--size-lg')).toBe(true);
  });

  it('should render label, spinner, and full width class', () => {
    fixture.componentRef.setInput('label', 'Save');
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('ds-button--full-width')).toBe(true);
    expect(button.querySelector('.ds-button__spinner')).toBeTruthy();
    expect(button.querySelector('.ds-button__label')?.textContent).toContain('Save');
  });

  it('should emit pressed when clicked', () => {
    let pressedCount = 0;
    component.pressed.subscribe(() => {
      pressedCount += 1;
    });

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(pressedCount).toBe(1);
  });

  it('should not emit pressed when disabled', () => {
    let pressedCount = 0;
    component.pressed.subscribe(() => {
      pressedCount += 1;
    });

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(pressedCount).toBe(0);
  });

  it('should prevent default in click handler when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const preventDefault = vi.fn();
    component.onClick({ preventDefault } as unknown as MouseEvent);

    expect(preventDefault).toHaveBeenCalled();
  });
});
