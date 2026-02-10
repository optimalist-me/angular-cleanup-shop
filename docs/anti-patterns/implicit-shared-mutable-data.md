## Implicit Shared Mutable Data

### What it looks like
- Multiple components mutate the same object reference
- Shared arrays or objects are reused across boundaries
- State updates appear to "randomly" propagate

### Why it hurts
- Changes are hard to trace
- UI updates become inconsistent
- Bugs surface only under certain sequences

### Fixes that work
- Treat state as immutable
- Replace arrays/objects instead of mutating in place
- Expose readonly views to consumers

### Example refactor

Before (shared mutable reference):

```ts
readonly jobs = signal<CleaningJob[]>([]);

addJob(job: CleaningJob) {
  this.jobs().push(job);
}
```

After (immutable update):

```ts
addJob(job: CleaningJob) {
  this.jobs.update((jobs) => [...jobs, job]);
}
```

### Detection checklist
If most answers are **yes**, data is implicitly shared:
- Do multiple consumers hold the same object reference?
- Do updates happen through mutation rather than replacement?
- Are bugs sensitive to update order?
