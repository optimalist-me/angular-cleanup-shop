## Weak Types and any

### What it looks like
- `any` used in DTOs, API clients, or component inputs
- Unvalidated data flows through the app
- Optional chaining everywhere to mask type issues

### Why it hurts
- Runtime errors slip through
- Refactors are risky and slow
- Tests miss structural regressions

### Fixes that work
- Define DTO types at boundaries
- Use `unknown` and narrow intentionally
- Keep type shapes small and explicit

### Example refactor

Before (any):

```ts
getJobs() {
  return this.http.get<any[]>('/api/cleaning-jobs');
}
```

After (typed DTO):

```ts
export type CleaningJobDto = { id: string; title: string };

getJobs() {
  return this.http.get<CleaningJobDto[]>('/api/cleaning-jobs');
}
```

### Detection checklist
If most answers are **yes**, types are too weak:
- Do you see `any` in API or state boundaries?
- Are errors handled with broad optional chaining?
- Do tests fail to catch shape changes?
