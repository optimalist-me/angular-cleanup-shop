## Example 1: Signals for Local State

### Before
Mixed async handling and local state, manual subscriptions, and template logic.

```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		<button type="button" (click)="refresh()">Refresh</button>
		<p>{{ (jobs?.length || 0) > 0 ? 'Active' : 'Idle' }}</p>
		<ul>
			<li *ngFor="let job of jobs">{{ job.title }}</li>
		</ul>
	`,
})
export class CleaningJobsComponent implements OnInit, OnDestroy {
	jobs: { id: string; title: string }[] = [];
	private sub = new Subscription();

	constructor(private readonly api: CleaningJobsApi) {}

	ngOnInit() {
		this.sub.add(this.api.getJobs().subscribe((jobs) => (this.jobs = jobs)));
	}

	refresh() {
		this.sub.add(this.api.getJobs().subscribe((jobs) => (this.jobs = jobs)));
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
```

### After
Signals for local state, explicit async conversion, and simple template.

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		<button type="button" (click)="refresh()">Refresh</button>
		<p>{{ statusLabel() }}</p>
		<ul>
			@for (job of jobs(); track job.id) {
				<li>{{ job.title }}</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);

	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });
	readonly statusLabel = computed(() => (this.jobs().length > 0 ? 'Active' : 'Idle'));

	refresh() {
		this.api.refresh();
	}
}
```

### Why this is better
- No manual subscriptions
- Explicit state ownership in the component
- Template stays declarative

### Lessons learned
- Signals simplify component state and lifecycle handling
- `computed` keeps templates clean and predictable
- Manual subscriptions should be the exception, not the default
