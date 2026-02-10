## Service Chains

### What it looks like
- Services call other services in long chains
- Business logic is spread across multiple layers
- It is unclear where a decision is made

### Why it hurts
- Hard to trace behavior and side effects
- Tests require many mocks
- Small changes have wide impact

### Fixes that work
- Keep one responsibility per service
- Use facades to orchestrate multiple services
- Make data-access services return data only

### Example refactor

Before (chain of services):

```ts
this.pricingService.calculate(this.jobsService.getJobs());
```

After (facade orchestration):

```ts
const jobs = this.jobsService.getJobs();
return this.pricingFacade.calculate(jobs);
```

### Detection checklist
If most answers are **yes**, you have service chains:
- Do services depend on many other services?
- Does a single request trigger a long chain of calls?
- Is logic split in small pieces without clear ownership?
