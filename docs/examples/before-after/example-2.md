## Example 2: Split a Big Component

### Before
One component owns orchestration, presentation, and formatting.

```ts
import { Component } from '@angular/core';

@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<h2>{{ title }}</h2>
		<button type="button" (click)="refresh()">Refresh</button>
		<p>{{ jobs.length }} jobs</p>
		<ul>
			<li *ngFor="let job of jobs">
				{{ formatTitle(job.title) }}
			</li>
		</ul>
	`,
})
export class CleaningDashboardComponent {
	title = 'Cleaning jobs';
	jobs: { id: string; title: string }[] = [];

	constructor(private readonly api: CleaningJobsApi) {
		this.api.getJobs().subscribe((jobs) => (this.jobs = jobs));
	}

	refresh() {
		this.api.getJobs().subscribe((jobs) => (this.jobs = jobs));
	}

	formatTitle(title: string) {
		return title.trim();
	}
}
```

### After
Container handles orchestration; UI components render only.

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<app-cleaning-header [title]="title" (refresh)="refresh()" />
		<app-cleaning-summary [count]="jobs().length" />
		<app-cleaning-list [jobs]="jobs()" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningHeaderComponent, CleaningSummaryComponent, CleaningListComponent],
})
export class CleaningDashboardComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly title = 'Cleaning jobs';
	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });

	refresh() {
		this.api.refresh();
	}
}
```

```ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-cleaning-header',
	template: `
		<h2>{{ title() }}</h2>
		<button type="button" (click)="refresh.emit()">Refresh</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningHeaderComponent {
	readonly title = input('');
	readonly refresh = output<void>();
}
```

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-cleaning-summary',
	template: `<p>{{ count() }} jobs</p>`,
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

### Why this is better
- Clear container vs UI separation
- Easier reuse and testing
- Smaller, focused components

### Lessons learned
- Split orchestration from rendering early
- UI components scale when they only render inputs
- Small components reduce the cost of change
