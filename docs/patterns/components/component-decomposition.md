## Component Decomposition

### Intent
Keep components small and easy to reason about by splitting orchestration from rendering.

### Rule of thumb
- Containers compose
- UI components render
- No HTTP or domain logic in templates

### Prefer
- Multiple small components
- Explicit inputs/outputs
- Signals and computed values in class code

### Example (Angular)

Container (feature) owns orchestration:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CleaningJobsApi } from '@cleaning/data-access-cleaning';
import { CleaningListComponent } from '@cleaning/ui-cleaning-list';
import { CleaningSummaryComponent } from '@cleaning/ui-cleaning-summary';

@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<app-cleaning-summary [count]="count()" />
		<app-cleaning-list [jobs]="jobs()" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningListComponent, CleaningSummaryComponent],
})
export class CleaningDashboardComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = this.api.getJobsSignal();
	readonly count = computed(() => this.jobs().length);
}
```

UI components render only:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-cleaning-summary',
	template: `{{ count() }} scheduled jobs`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningSummaryComponent {
	readonly count = input(0);
}
```

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-cleaning-list',
	template: `
		<ul>
			@for (job of jobs(); track job.id) {
				<li>{{ job.title }}</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningListComponent {
	readonly jobs = input<{ id: string; title: string }[]>([]);
}
```

### Anti-patterns to avoid
- Templates that fetch data
- Single components with unrelated responsibilities
- UI components that import data-access or services
