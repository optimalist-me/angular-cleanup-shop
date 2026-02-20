import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type DesignTextTone =
  | 'default'
  | 'muted'
  | 'accent'
  | 'inverse'
  | 'success'
  | 'danger';
export type DesignTextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DesignTextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

@Component({
  selector: 'shared-design-text',
  template: `
    <span [class]="textClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDesignText {
  readonly tone = input<DesignTextTone>('default');
  readonly size = input<DesignTextSize>('md');
  readonly weight = input<DesignTextWeight>('regular');
  readonly uppercase = input(false);
  readonly truncate = input(false);

  readonly textClasses = computed(() => {
    const classNames = [
      'ds-text',
      `ds-text--tone-${this.tone()}`,
      `ds-text--size-${this.size()}`,
      `ds-text--weight-${this.weight()}`,
    ];

    if (this.uppercase()) {
      classNames.push('ds-text--uppercase');
    }

    if (this.truncate()) {
      classNames.push('ds-text--truncate');
    }

    return classNames.join(' ');
  });
}
