## Cleanup Snippet: Observable to Signal

### Intent
Simplify component state by converting observables to signals at the feature boundary.

### When to use
- A component needs observable data in synchronous state
- You want derived values via `computed`
- You want to remove manual subscriptions

### Before

```ts
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		<ul>
			<li *ngFor="let job of jobs">{{ job.title }}</li>
		</ul>
	`,
})
export class CleaningJobsComponent implements OnDestroy {
	jobs: { id: string; title: string }[] = [];
	private readonly sub = new Subscription();

	constructor(private readonly api: CleaningJobsApi) {
		this.sub.add(this.api.getJobs().subscribe((jobs) => (this.jobs = jobs)));
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
```

### After

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
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
}
```

### Notes
- Keep observables in data-access; convert in features.
- Use `initialValue` for stable template rendering.
