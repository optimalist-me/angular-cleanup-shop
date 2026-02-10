## Subscription Hygiene

### Intent
Prevent memory leaks and hidden side effects by keeping subscriptions declarative and lifecycle-aware.

### Rules
- No manual `subscribe` in components (prefer `async` pipe or signals)
- Always tie lifecycle explicitly
- Avoid nested subscriptions

### Preferred patterns
**Async pipe** for template rendering:

```ts
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CleaningJobsApi } from './cleaning-jobs.api';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		@if (jobs$ | async; as jobs) {
			<ul>
				@for (job of jobs; track job.id) {
					<li>{{ job.title }}</li>
				}
			</ul>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe],
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs$ = this.api.getJobs();
}
```

**Signals** for component state:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CleaningJobsApi } from './cleaning-jobs.api';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		@if (jobs(); as jobs) {
			<ul>
				@for (job of jobs; track job.id) {
					<li>{{ job.title }}</li>
				}
			</ul>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });
}
```

**Lifecycle-safe manual subscriptions** (only when needed):

```ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CleaningAlertsApi } from './cleaning-alerts.api';

@Component({
	selector: 'app-cleaning-alerts',
	template: `{{ latestMessage() }}`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningAlertsComponent {
	private readonly destroyRef = inject(DestroyRef);
	private readonly api = inject(CleaningAlertsApi);
	readonly latestMessage = signal('');

	constructor() {
		this.api.alerts()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => this.latestMessage.set(message));
	}
}
```

### Anti-patterns to avoid
- Subscribing in templates via side-effect methods
- Subscribing in `ngOnInit` without teardown
- Nested subscriptions instead of `switchMap`/`concatMap`

### Decision checklist
If most answers are **yes**, use `async` pipe:
- Is the value only used in the template?
- Does the stream emit multiple values over time?
- Can the template handle loading and empty states?

If most answers are **yes**, use signals (`toSignal`):
- Do you need the value in both template and class logic?
- Do you want derived values via `computed`?
- Do you want a stable initial value?

If most answers are **yes**, use manual `subscribe`:
- Do you need a one-time side effect (toast, navigation)?
- Is the stream not tied to view rendering?
- Can you guarantee teardown with `takeUntilDestroyed`?
