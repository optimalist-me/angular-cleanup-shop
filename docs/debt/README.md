# Debt Register

This register tracks concrete technical debt items in a predictable, reviewable
format. Each debt item has its own file and a single index entry here.

## Lifecycle Semantics
- `Open`: identified and prioritized, not started
- `In progress`: actively being addressed
- `Closed`: resolved and verified

## Priority Semantics
- `P1`: high risk or high operational impact
- `P2`: meaningful debt with moderate impact
- `P3`: lower urgency cleanup or optimization

## Debt Index

| ID | Title | Status | Priority | Owner | Target Window | Link |
| --- | --- | --- | --- | --- | --- | --- |
| 0001 | API production hardening | Open | P1 | Unassigned | TBD | [0001-api-production-hardening.md](0001-api-production-hardening.md) |
| 0002 | Email transporter safety rails | Open | P1 | Unassigned | TBD | [0002-email-transporter-safety-rails.md](0002-email-transporter-safety-rails.md) |
| 0003 | Tracker compliance scan coverage | Open | P2 | Unassigned | TBD | [0003-tracker-compliance-scan-coverage.md](0003-tracker-compliance-scan-coverage.md) |
| 0004 | SQLite operations runbook | Open | P2 | Unassigned | TBD | [0004-sqlite-operations-runbook.md](0004-sqlite-operations-runbook.md) |
| 0005 | Domain boundary enforcement follow-ups | Open | P1 | Unassigned | Sprints 2-4 | [0005-domain-boundary-enforcement-followups.md](0005-domain-boundary-enforcement-followups.md) |

## Open
- `0001` API production hardening
- `0002` Email transporter safety rails
- `0003` Tracker compliance scan coverage
- `0004` SQLite operations runbook
- `0005` Domain boundary enforcement follow-ups

## In progress
_None_

## Closed
_None_

## Update Rule
When a debt item status changes, update both:
1. The debt item file (`docs/debt/000N-*.md`)
2. The corresponding row and grouped view in this index

Both updates must be in the same pull request.
