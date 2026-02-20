import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type DesignSurfaceTone = 'default' | 'subtle' | 'raised' | 'inverse';
export type DesignSurfacePadding = 'none' | 'sm' | 'md' | 'lg';
export type DesignSurfaceRadius = 'none' | 'md' | 'lg';

@Component({
  selector: 'shared-design-surface',
  template: `
    <section [class]="surfaceClasses()">
      <ng-content></ng-content>
    </section>
  `,
  styleUrl: './surface.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDesignSurface {
  readonly tone = input<DesignSurfaceTone>('default');
  readonly padding = input<DesignSurfacePadding>('md');
  readonly radius = input<DesignSurfaceRadius>('lg');
  readonly bordered = input(true);

  readonly surfaceClasses = computed(() => {
    const classNames = [
      'ds-surface',
      `ds-surface--tone-${this.tone()}`,
      `ds-surface--padding-${this.padding()}`,
      `ds-surface--radius-${this.radius()}`,
    ];

    if (this.bordered()) {
      classNames.push('ds-surface--bordered');
    }

    return classNames.join(' ');
  });
}
