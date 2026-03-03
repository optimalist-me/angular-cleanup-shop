import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { SHARED_FOOTER_CONFIG, type SharedFooterLink } from './footer.config';

@Component({
  selector: 'shared-footer',
  imports: [RouterLink, SharedDesignText],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFooter {
  readonly config = inject(SHARED_FOOTER_CONFIG);

  trackByColumn(index: number): number {
    return index;
  }

  trackByLink(_index: number, link: SharedFooterLink): string {
    return link.kind === 'internal'
      ? `internal:${link.route}`
      : `external:${link.href}`;
  }
}
