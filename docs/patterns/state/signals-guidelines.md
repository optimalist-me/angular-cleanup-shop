## Signals Guidelines

### Intent
Use signals as the primary state primitive in Angular to keep state local, explicit, and testable.

### Core rules
- Signals are the default for local state
- Use `computed` for derived state
- Use `effect` only for side effects
- Never hide effects in services
- Avoid `mutate`; prefer `set` or `update`

### State management guidance
**Local state**
- Keep state close to the component that owns it
- Expose readonly signals to templates and children

**Shared state**
- Use a facade or `signalStore` for bounded, shared state
- Keep the public API small and explicit

### Example (local state)

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-cleaning-filter',
	template: `
		<button type="button" (click)="toggle()">{{ label() }}</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningFilterComponent {
	private readonly onlyToday = signal(false);
	readonly label = computed(() => (this.onlyToday() ? 'Today' : 'All'));

	toggle() {
		this.onlyToday.update((value) => !value);
	}
}
```

### Example (shared state with facade)

```ts
import { Injectable, computed, signal } from '@angular/core';

type CleaningJob = { id: string; title: string };

@Injectable({ providedIn: 'root' })
export class CleaningJobsFacade {
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
If most answers are **yes**, use a signal:
- Is the state owned by a single component or feature?
- Do you need derived values via `computed`?
- Do you want synchronous, explicit state updates?

If most answers are **yes**, use `effect`:
- Do you need to bridge signal changes to an external side effect?
- Is the side effect idempotent and scoped?
- Can you isolate it to one component or service?

### Signals + RxJS interop
- Use `toSignal` when a component needs observable data in synchronous state
- Keep observables at the data-access boundary; convert at the feature
- Avoid converting back and forth between signals and observables

### Anti-patterns to avoid
- Effects that update the same state they read
- Hidden side effects inside getters or computed signals
- Sharing signals globally without a clear owner
