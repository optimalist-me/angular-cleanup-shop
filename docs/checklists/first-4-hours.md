## First 4 Hours

### Intent
Stabilize the project quickly, reduce risk, and create a clear plan for the next sessions.

### 0:00 - 0:30 | Orient
- Read the README and docs overview
- Identify the main app(s) and how they are run
- Check current branch status and uncommitted changes

### 0:30 - 1:30 | Quick scan
- Scan for obvious red flags (huge components, god services, implicit side effects)
- Review lint/test status if available
- Note any build or test failures

### 1:30 - 2:30 | Targeted deep dive
- Pick one critical feature flow
- Trace UI -> data-access -> API boundaries
- Identify one high-risk coupling or duplication

### 2:30 - 3:30 | Low-risk wins
- Fix one small, safe issue (naming, tiny refactor, missing type)
- Add or improve one test for a critical path

### 3:30 - 4:00 | Plan and communicate
- Write a short summary of findings
- List top 3 risks and recommended next steps
- Propose a small, safe cleanup plan for session 1

### Outputs
- Quick scan notes (3-5 bullets)
- One small improvement shipped
- A session-1 cleanup plan (2-4 steps)
