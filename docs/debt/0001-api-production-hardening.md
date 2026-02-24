# Debt Item 0001: API production hardening

## Status
Open

## Priority
P1

## Owner
Unassigned

## Target Window
TBD

## Context
The API entrypoint still presents itself as a minimal/non-production server and
uses broad fallback behavior for frontend routing and SSR bundle loading. This
creates ambiguity for production readiness expectations.

### Evidence in repo
- `apps/api/src/main.ts` (header comments indicating non-production/minimal backend)
- `apps/api/src/main.ts` (SSR bundle fallback and SPA fallback routing behavior)

## Impact
- unclear production-readiness boundary for maintainers
- increased risk of accidental deployment with undesired fallback behavior
- weak operational confidence during incidents

## Proposed Resolution
Define and document a production-hardening checklist for API startup and runtime
behavior, including:
- explicit SSR fallback policy
- startup validation and failure behavior expectations
- logging and error-handling baseline for production operations

## Acceptance Criteria
- production readiness checklist is documented and linked from relevant docs
- SSR fallback behavior is explicitly classified (allowed/blocked conditions)
- expected production logging/error behavior is documented

## Dependencies / Risks
- depends on agreement about deployment model (SSR required vs optional)
- if mis-scoped, this may lead to broad runtime behavior changes outside docs

## Notes
This debt item is documentation/planning-focused in current scope and does not
imply immediate runtime changes.
