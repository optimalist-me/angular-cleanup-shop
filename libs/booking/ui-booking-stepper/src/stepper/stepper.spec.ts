import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingStepper } from './stepper';

describe('BookingStepper', () => {
  let component: BookingStepper;
  let fixture: ComponentFixture<BookingStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingStepper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark step as active when it matches input', () => {
    fixture.componentRef.setInput('step', 'info');
    fixture.detectChanges();

    expect(component.isActive('info')).toBe(true);
    expect(component.isActive('schedule')).toBe(false);
    expect(component.isActive('confirm')).toBe(false);
  });

  it('should mark previous steps as completed', () => {
    fixture.componentRef.setInput('step', 'confirm');
    fixture.detectChanges();

    expect(component.isCompleted('info')).toBe(true);
    expect(component.isCompleted('schedule')).toBe(true);
    expect(component.isCompleted('confirm')).toBe(false);
  });

  it('should render all three steps in template', () => {
    fixture.componentRef.setInput('step', 'info');
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.stepper__item');
    expect(items.length).toBe(3);
  });
});
