import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type DesignButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger';
export type DesignButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'shared-design-button',
  template: `
    <button
      [class]="buttonClasses()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <span class="ds-button__spinner" aria-hidden="true"></span>
      }
      @if (label()) {
        <span class="ds-button__label">{{ label() }}</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDesignButton {
  readonly label = input('');
  readonly tone = input<DesignButtonTone>('primary');
  readonly size = input<DesignButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);

  readonly pressed = output<MouseEvent>();

  readonly buttonClasses = computed(() => {
    const classNames = [
      'ds-button',
      `ds-button--tone-${this.tone()}`,
      `ds-button--size-${this.size()}`,
    ];

    if (this.fullWidth()) {
      classNames.push('ds-button--full-width');
    }

    return classNames.join(' ');
  });

  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      return;
    }

    this.pressed.emit(event);
  }
}
