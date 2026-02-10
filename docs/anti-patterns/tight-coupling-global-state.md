## Tight Coupling to Global State

### What it looks like
- Feature components import shared stores directly
- Multiple features write to the same global signals
- No facade or boundary around shared state

### Why it hurts
- Hidden coupling across features
- Regressions appear in unrelated screens
- Refactors become high risk

### Fixes that work
- Introduce a feature facade with a small API
- Keep global state minimal and explicit
- Split shared state by domain

### Example refactor

Before (feature pulls global store directly):

```ts
import { AppStore } from '@shared/state';

export class CleaningJobsComponent {
  readonly jobs = this.store.jobs;

  constructor(private readonly store: AppStore) {}
}
```

After (feature uses a facade):

```ts
import { CleaningJobsFacade } from '@cleaning/feature-cleaning-jobs';

export class CleaningJobsComponent {
  readonly jobs = this.facade.jobs;

  constructor(private readonly facade: CleaningJobsFacade) {}
}
```

### Detection checklist
If most answers are **yes**, you are tightly coupled:
- Does the component import a shared store directly?
- Is the store updated by multiple unrelated features?
- Would a change to state shape impact many screens?
