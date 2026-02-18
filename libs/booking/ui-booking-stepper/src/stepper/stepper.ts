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
    { id: 'info', label: 'Your Info', number: 1 },
    { id: 'schedule', label: 'Schedule', number: 2 },
    { id: 'confirm', label: 'Confirm', number: 3 },
  ];

  isCompleted(stepId: BookingStep): boolean {
    const stepOrder: Record<BookingStep, number> = {
      info: 0,
      schedule: 1,
      confirm: 2,
    };
    const currentOrder = stepOrder[this.step()];
    const targetOrder = stepOrder[stepId];
    return targetOrder < currentOrder;
  }

  isActive(stepId: BookingStep): boolean {
    return stepId === this.step();
  }
}
