## Monthly Maintenance

### Intent
Keep the codebase stable and predictable by removing drift and small risks before they grow.

### Code health
- Scan for new large components and god services
- Review recent refactors for regressions
- Remove dead code and unused exports

### Dependency hygiene
- Review Angular and Nx versions
- Check for outdated dependencies and security advisories
- Remove unused packages

### Testing and CI
- Review flaky test history
- Add or update tests for critical paths
- Validate CI stability and build times

### Architecture alignment
- Revisit boundaries and dependency rules
- Confirm new features follow folder structure conventions
- Update patterns/anti-patterns docs if needed

### Outputs
- Short monthly summary (wins, risks, next actions)
- 1-2 targeted cleanups completed
- Updated checklist or guardrail if a new issue appeared
