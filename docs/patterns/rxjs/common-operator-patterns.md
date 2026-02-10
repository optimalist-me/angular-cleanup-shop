## Common Operator Patterns

### Intent
Use a small set of predictable operators so streams stay readable and behavior is obvious.

### Prefer
- `switchMap` for HTTP requests that should cancel previous work
- `exhaustMap` for actions that must not overlap
- `concatMap` for ordered, sequential work
- `shareReplay` for caching (with clear ownership and teardown)

### Quick guidance
**switchMap**
- Best for search, typeahead, or route-driven requests
- Cancels in-flight requests when new values arrive

**exhaustMap**
- Best for submit/save buttons
- Ignores new events while one is in progress

**concatMap**
- Best for queues or ordered side effects
- Ensures one completes before the next starts

**shareReplay**
- Best for expensive, shared, read-only streams
- Prefer `refCount: true` to avoid memory leaks

### Examples (Angular)

Search requests (cancel previous):

```ts
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

readonly results$ = this.query$.pipe(
	debounceTime(200),
	distinctUntilChanged(),
	switchMap((query) => this.api.search(query))
);
```

Submit action (ignore double clicks):

```ts
import { exhaustMap } from 'rxjs';

readonly save$ = this.saveClicks$.pipe(
	exhaustMap(() => this.api.save(this.form.value))
);
```

Ordered processing (queue):

```ts
import { concatMap } from 'rxjs';

readonly uploads$ = this.files$.pipe(
	concatMap((file) => this.api.upload(file))
);
```

Cached read (shared):

```ts
import { shareReplay } from 'rxjs';

readonly jobs$ = this.api.getJobs().pipe(
	shareReplay({ bufferSize: 1, refCount: true })
);
```

### Decision table

| Scenario | Operator | Why |
| --- | --- | --- |
| Search or typeahead | `switchMap` | Cancel stale requests |
| Save/submit button | `exhaustMap` | Ignore rapid repeats |
| Batch or queue | `concatMap` | Preserve order |
| Parallel fan-out | `mergeMap` | Run concurrently |
| Shared, read-only stream | `shareReplay` | Cache last value |

### Anti-patterns to avoid
- `mergeMap` everywhere by habit
- `shareReplay(1)` without teardown strategy
- Nested subscriptions instead of composition
