## Pull Request Checklist

### Intent
Keep PRs small, safe, and aligned with the cleanup philosophy.

### Architecture & boundaries
- Changes respect feature -> data-access -> util direction
- UI components do not import data-access
- Shared libs remain generic and small

### Components & state
- Components are small and focused
- Smart vs dumb split is clear
- Signals used for local state; `computed` for derived values

### RxJS & effects
- No nested subscriptions
- Side effects are explicit
- Error handling is visible and testable

### Testing
- Critical paths covered or unchanged
- Flaky test risks addressed
- No new brittle snapshots

### Documentation
- Patterns/anti-patterns updated if a new rule emerged
- Checklist updates noted if process changed

### Scope & risk
- PR stays within a single purpose
- No accidental dependency changes
- Refactors are incremental and reversible
