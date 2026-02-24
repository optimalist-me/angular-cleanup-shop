# ADR 0005: Quality Gate Baseline

## Date
February 24, 2026

## Status
Accepted

## Context
The repository needs a stable baseline for quality, regression control, and
compliance enforcement across pull requests.

### Evidence in repo
- `.github/workflows/ci.yml`
- `nx.json`
- `apps/shop/project.json`
- `package.json`

## Decision
Adopt the following baseline gates:
- CI runs lint, test, build, and e2e as required gates
- default unit-test coverage thresholds are 90% for lines and statements
- compliance check for non-essential trackers runs in CI
- all checks run via Nx project/target orchestration

## Alternatives Considered
1. Lower coverage thresholds
- rejected: weakens regression detection and quality consistency

2. Optional e2e or compliance checks
- rejected: allows avoidable regressions and policy drift

## Consequences
Positive:
- higher confidence in change safety
- policy guardrails are enforced, not advisory
- consistent quality expectations across contributions

Negative:
- longer CI cycle times
- stricter contribution bar for teams and automation

## Follow-up Actions
- monitor CI duration and optimize target parallelization if needed
- periodically re-validate coverage thresholds against project maturity
