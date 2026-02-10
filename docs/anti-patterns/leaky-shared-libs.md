## Leaky Shared Libraries

### What it looks like
- A "shared" lib exposes domain-specific logic
- Features depend on shared utilities that are not generic
- Shared grows without clear ownership

### Why it hurts
- Features become coupled through shared code
- Changes ripple across unrelated areas
- The shared lib becomes a dumping ground

### Fixes that work
- Split shared by domain (feature, data-access, util)
- Keep shared utilities truly generic
- Enforce boundaries with lint rules

### Example refactor

Before (domain logic in shared):

```ts
export function calculateCleaningPrice(job: CleaningJob) {
  return job.rooms * 25;
}
```

After (move to domain-specific util lib):

```ts
// libs/cleaning/util-cleaning-pricing
export function calculateCleaningPrice(job: CleaningJob) {
  return job.rooms * 25;
}
```

### Detection checklist
If most answers are **yes**, shared is leaking:
- Do unrelated features import the same shared helpers?
- Does shared contain domain types or business rules?
- Does removing shared break multiple domains?
