import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { BookingStep } from '@cleanup/models-booking';

@Component({
  selector: 'booking-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingStepper {
  readonly step = input.required<BookingStep>();

  readonly steps: { id: BookingStep; label: string; number: number }[] = [
    { id: 'review', label: 'Review', number: 1 },
    { id: 'details', label: 'Details', number: 2 },
    { id: 'schedule', label: 'Schedule', number: 3 },
  ];

  isCompleted(stepId: BookingStep): boolean {
    const stepOrder: Record<BookingStep, number> = {
      review: 0,
      details: 1,
      schedule: 2,
    };
    const currentOrder = stepOrder[this.step()];
    const targetOrder = stepOrder[stepId];
    return targetOrder < currentOrder;
  }

  isActive(stepId: BookingStep): boolean {
    return stepId === this.step();
  }
}
