## View Logic in Services

### What it looks like
- Services format UI strings or HTML
- Business services decide how data is displayed
- Templates call service methods for presentation

### Why it hurts
- UI changes require service changes
- Tests mix UI and business concerns
- Services become hard to reuse

### Fixes that work
- Keep services focused on data and orchestration
- Move presentation logic to components or pipes
- Keep formatting functions in ui or util libs

### Example refactor

Before (service formats UI):

```ts
formatTitle(job: CleaningJob) {
  return `${job.title} (${job.rooms} rooms)`;
}
```

After (move to UI/pipe):

```ts
export function formatJobTitle(job: CleaningJob) {
  return `${job.title} (${job.rooms} rooms)`;
}
```

### Detection checklist
If most answers are **yes**, view logic is in services:
- Do services return already formatted strings?
- Is the same data used differently across screens?
- Do UI changes require service updates?
