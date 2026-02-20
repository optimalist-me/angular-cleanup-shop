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
    fixture.componentRef.setInput('step', 'review');
    fixture.detectChanges();

    expect(component.isActive('review')).toBe(true);
    expect(component.isActive('details')).toBe(false);
    expect(component.isActive('schedule')).toBe(false);
  });

  it('should mark previous steps as completed', () => {
    fixture.componentRef.setInput('step', 'schedule');
    fixture.detectChanges();

    expect(component.isCompleted('review')).toBe(true);
    expect(component.isCompleted('details')).toBe(true);
    expect(component.isCompleted('schedule')).toBe(false);
  });

  it('should render all three steps in template', () => {
    fixture.componentRef.setInput('step', 'review');
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.stepper__item');
    expect(items.length).toBe(3);
  });
});
