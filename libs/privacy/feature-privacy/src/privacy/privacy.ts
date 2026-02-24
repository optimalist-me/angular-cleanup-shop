import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'privacy-privacy',
  imports: [SharedDesignSurface, SharedDesignText],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPrivacy {
  goBack(): void {
    if (typeof history !== 'undefined') {
      history.back();
    }
  }
}
