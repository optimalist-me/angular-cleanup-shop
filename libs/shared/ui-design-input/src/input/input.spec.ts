import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDesignInput } from './input';

describe('SharedDesignInput', () => {
  let fixture: ComponentFixture<SharedDesignInput>;
  let component: SharedDesignInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDesignInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDesignInput);
    component = fixture.componentInstance;
  });

  it('should render label and hint when provided', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('hint', 'Use your work email');
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(
      nativeElement.querySelector('.ds-input__label')?.textContent,
    ).toContain('Email');
    expect(
      nativeElement.querySelector('.ds-input__hint')?.textContent,
    ).toContain('Use your work email');
  });

  it('should emit valueChange when typing', () => {
    let latestValue = '';
    component.valueChange.subscribe((value) => {
      latestValue = value;
    });

    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.value = 'new-value';
    input.dispatchEvent(new Event('input'));

    expect(latestValue).toBe('new-value');
  });

  it('should show error state when error text exists', () => {
    fixture.componentRef.setInput('error', 'This field is required');
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const input = nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.classList.contains('ds-input__control--invalid')).toBe(true);
    expect(
      nativeElement.querySelector('.ds-input__error')?.textContent,
    ).toContain('This field is required');
  });
});
