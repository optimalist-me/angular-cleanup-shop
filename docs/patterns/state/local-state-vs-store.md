## Local State vs Store

### Intent
Prefer the smallest state scope that solves the problem. Local state keeps features simple; shared stores are for cross-feature coordination.

### Use local component state when
- Scope is a single feature or screen
- No cross-route sharing
- State resets safely on navigation
- You can derive everything from API calls or inputs

### Use a shared store/facade when
- State spans routes
- Reused by multiple features
- You need caching across navigations
- Multiple components must coordinate updates

### Example (local state)

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-cleaning-filter',
	template: `
		<label>
			Show only today
			<input type="checkbox" [checked]="onlyToday()" (change)="toggle()" />
		</label>
		<p>Active: {{ summary() }}</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningFilterComponent {
	readonly onlyToday = signal(false);
	readonly summary = computed(() => (this.onlyToday() ? 'today' : 'all'));

	toggle() {
		this.onlyToday.update((value) => !value);
	}
}
```

### Example (shared store/facade)

```ts
import { Injectable, computed, signal } from '@angular/core';

export type CleaningJob = { id: string; title: string };

@Injectable({ providedIn: 'root' })
export class CleaningJobsStore {
	private readonly jobs = signal<CleaningJob[]>([]);
	readonly count = computed(() => this.jobs().length);

	setJobs(jobs: CleaningJob[]) {
		this.jobs.set(jobs);
	}

	getJobs() {
		return this.jobs.asReadonly();
	}
}
```

### Decision checklist
If most answers are **yes**, stay local:
- Is the state only used in one screen?
- Is it safe to reset on navigation?
- Can it be derived from inputs or a single API call?

If most answers are **yes**, use a shared store:
- Do multiple routes depend on the same data?
- Do multiple components need to update the same state?
- Do you need cache/persistence across navigation?

### Anti-patterns to avoid
- Creating a store for every component
- Shared state that only one screen uses
- Global state as a default before local state is tried
