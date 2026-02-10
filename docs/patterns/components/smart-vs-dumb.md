## Smart vs Dumb Components

### Intent
Separate orchestration from rendering so UI stays reusable and easy to test.

### Smart components (containers)
Own feature concerns:
- routing
- orchestration
- state wiring
- data-access calls

### Dumb components (presentational)
Render only:
- inputs for data
- outputs for events
- no services injected

### Example (Angular)

Smart (container):

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CleaningJobsApi } from '@cleaning/data-access-cleaning';
import { CleaningListComponent } from '@cleaning/ui-cleaning-list';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		<app-cleaning-list
			[jobs]="jobs()"
			(selectJob)="onSelectJob($event)"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningListComponent],
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = this.api.getJobsSignal();

	onSelectJob(id: string) {
		this.api.selectJob(id);
	}
}
```

Dumb (presentational):

```ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-cleaning-list',
	template: `
		<ul>
			@for (job of jobs(); track job.id) {
				<li>
					<button type="button" (click)="selectJob.emit(job.id)">
						{{ job.title }}
					</button>
				</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningListComponent {
	readonly jobs = input<{ id: string; title: string }[]>([]);
	readonly selectJob = output<string>();
}
```

### Anti-patterns to avoid
- UI components that inject services
- Containers that render complex markup
- Components that mix routing with low-level UI

### Decision checklist
If most answers are **yes**, it is a smart component:
- Does it fetch or transform data from a service?
- Does it coordinate multiple child components?
- Does it own routing, guards, or navigation?
- Does it manage local feature state?

If most answers are **yes**, it is a dumb component:
- Can it be reused across features without changes?
- Does it render only from inputs?
- Does it emit events instead of handling side effects?
- Can you unit test it without any service mocks?
