## NgRx: When and When Not

### Intent
Use NgRx only when the coordination cost justifies it. Prefer local state and simple facades first.

### SignalStore focus
If you need a shared store, prefer `signalStore` for:
- Localized shared state with a small surface area
- Simple async flows
- Clear, testable selectors via computed signals

### Use NgRx when
- Large team with many feature contributors
- Complex async flows with orchestration and cancellation
- Long-lived global state shared across routes
- You need standardized patterns for effects, caching, or undo/redo

### Avoid NgRx when
- CRUD-heavy apps where state mirrors API responses
- Simple UI state or single-feature state
- The store adds more code than it removes

### Example (signalStore)

```ts
import { computed } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';

type CleaningJob = { id: string; title: string };

type JobsState = {
	jobs: CleaningJob[];
	loading: boolean;
};

export const CleaningJobsStore = signalStore(
	withState<JobsState>({ jobs: [], loading: false }),
	withMethods((store) => ({
		setJobs(jobs: CleaningJob[]) {
			store.jobs.set(jobs);
		},
		setLoading(loading: boolean) {
			store.loading.set(loading);
		},
	})),
	withMethods((store) => ({
		count: computed(() => store.jobs().length),
	}))
);
```

### Comparison box

| Option | Best for | Trade-offs |
| --- | --- | --- |
| Local signals | Single component or feature | No shared cache or cross-route state |
| `signalStore` | Shared state in a bounded feature | Adds structure, small learning curve |
| NgRx + effects | Cross-cutting global state and complex flows | More boilerplate and coordination overhead |

### Decision checklist
If most answers are **yes**, consider NgRx:
- Do multiple teams touch the same state?
- Is there a need for centralized side effects or caching?
- Do multiple routes depend on shared state across navigation?

If most answers are **yes**, stay local or use a small facade:
- Is the state only used in one feature?
- Is it derived directly from API calls?
- Is the state short-lived and view-specific?

### Anti-patterns to avoid
- Introducing NgRx for every feature by default
- Global stores for form or filter state
- Effects that just proxy HTTP without added value
