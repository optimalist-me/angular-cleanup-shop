# Debt Item 0003: Tracker compliance scan coverage

## Status
Open

## Priority
P2

## Owner
Unassigned

## Target Window
TBD

## Context
The non-essential analytics compliance scanner currently scans only `apps` and
`libs`. Other potential surfaces (for example selected tooling and static/public
artifacts) are not currently part of scan scope.

### Evidence in repo
- `tools/compliance/check-no-trackers.mjs` (`ROOTS_TO_SCAN = ['apps', 'libs']`)

## Impact
- possible blind spots for tracker signatures introduced outside scanned roots
- weaker confidence in full-repo compliance posture
- higher review burden on manual checks

## Proposed Resolution
Expand scanner coverage in a controlled way:
- define additional scan roots (`tools` and selected public/static paths)
- keep explicit exclusions/allowlists to avoid noisy false positives
- document scan scope and limitations in compliance docs

## Acceptance Criteria
- scanner scope is documented and includes agreed additional paths
- false-positive rate remains manageable under CI usage
- compliance check still runs within acceptable CI time budget

## Dependencies / Risks
- expanding scope may increase noise and CI runtime
- requires careful allowlist strategy for legitimate external URLs

## Notes
Scope expansion should preserve deterministic results and clear failure output.
