import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'shared-footer',
  imports: [RouterLink, SharedDesignText],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFooter {}
