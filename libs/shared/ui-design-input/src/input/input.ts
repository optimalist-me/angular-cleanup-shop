import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type DesignInputType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';

let designInputId = 0;

@Component({
  selector: 'shared-design-input',
  template: `
    <div class="ds-input">
      @if (label()) {
        <label class="ds-input__label" [attr.for]="id()">{{ label() }}</label>
      }

      <input
        class="ds-input__control"
        [class.ds-input__control--invalid]="hasError()"
        [id]="id()"
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [autocomplete]="autocomplete()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-invalid]="hasError() ? 'true' : 'false'"
        (input)="onInput($event)"
        (blur)="blurred.emit()"
      />

      @if (hint() && !hasError()) {
        <p class="ds-input__hint">{{ hint() }}</p>
      }

      @if (hasError()) {
        <p class="ds-input__error">{{ error() }}</p>
      }
    </div>
  `,
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDesignInput {
  private readonly fallbackInputId = `shared-design-input-${++designInputId}`;

  readonly id = input(this.fallbackInputId);
  readonly label = input('');
  readonly type = input<DesignInputType>('text');
  readonly value = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false);
  readonly required = input(false);

  readonly valueChange = output<string>();
  readonly blurred = output<void>();

  readonly hasError = computed(() => this.error().trim().length > 0);

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.valueChange.emit(inputElement?.value ?? '');
  }
}
