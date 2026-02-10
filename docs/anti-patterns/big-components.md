## Big Components

### What it looks like
- One component owns UI, data fetching, state, and business logic
- Templates grow beyond easy scanning and contain logic branches
- Components inject multiple services and perform orchestration

### Why it hurts
- Hard to test in isolation
- Changes ripple across unrelated concerns
- UI reuse becomes impossible
- Performance tuning is harder

### Typical symptoms
- 300+ lines per component or template
- Multiple subscriptions and manual lifecycle management
- Template does more than render data

### Fixes that work
- Split into container + presentational components
- Move orchestration to a feature facade or data-access service
- Extract pure helpers to `util-*`

### Example refactor

Before (mixed concerns):

```ts
@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<button type="button" (click)="refresh()">Refresh</button>
		<ul>
			@for (job of jobs(); track job.id) {
				<li>{{ formatTitle(job.title) }}</li>
			}
		</ul>
	`,
})
export class CleaningDashboardComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });

	refresh() {
		this.api.refresh();
	}

	formatTitle(title: string) {
		return title.trim();
	}
}
```

After (split responsibilities):

```ts
@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<app-cleaning-toolbar (refresh)="refresh()" />
		<app-cleaning-list [jobs]="jobs()" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningToolbarComponent, CleaningListComponent],
})
export class CleaningDashboardComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });

	refresh() {
		this.api.refresh();
	}
}
```

Presentational components:

```ts
import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
	selector: 'app-cleaning-toolbar',
	template: `
		<button type="button" (click)="refresh.emit()">Refresh</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningToolbarComponent {
	readonly refresh = output<void>();
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

### Detection checklist
If most answers are **yes**, the component is too big:
- Does it inject more than two services?
- Is the template hard to scan in under a minute?
- Does it own both data fetching and rendering?
- Would you need integration tests just to verify UI output?
