# Debt Item 0004: SQLite operations runbook

## Status
Open

## Priority
P2

## Owner
Unassigned

## Target Window
TBD

## Context
SQLite persistence strategy is documented as an architectural decision, but
there is no dedicated operational runbook for backup, restore, retention-safe
maintenance, and incident recovery in production environments.

### Evidence in repo
- `apps/api/src/db/sqlite.ts` (database path and initialization ownership)
- `docs/adr/0003-booking-data-persistence-strategy-sqlite.md` (architecture decision without full operations playbook)

## Impact
- operational uncertainty during incidents or data recovery events
- inconsistent backup/restore practices across environments
- increased mean time to recovery during data-related failures

## Proposed Resolution
Create an SQLite operations runbook covering:
- backup frequency and storage policy
- restore verification process and rollback steps
- retention-aware cleanup and maintenance procedures
- permissions, path, and file-locking considerations

## Acceptance Criteria
- runbook exists with backup/restore procedures and validation steps
- responsibilities and execution cadence are defined
- incident recovery sequence is documented and testable

## Dependencies / Risks
- depends on deployment environment details and storage policy decisions
- incomplete recovery drills may leave hidden gaps in runbook quality

## Notes
This debt item addresses operational documentation and readiness, not a
persistence engine change.
