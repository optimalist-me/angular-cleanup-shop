# Debt Item 0002: Email transporter safety rails

## Status
Open

## Priority
P1

## Owner
Unassigned

## Target Window
TBD

## Context
When SMTP credentials are absent, the email layer falls back to a local test
transporter. This is convenient for development but risky if not explicitly
guarded by environment-sensitive behavior.

### Evidence in repo
- `libs/booking/infrastructure-booking-email/src/lib/email-transporter.ts` (fallback to local SMTP on missing credentials)

## Impact
- risk of silently non-delivered production emails if credentials are misconfigured
- reduced operational signal when messaging infrastructure is not properly configured
- potential booking communication failures

## Proposed Resolution
Add explicit safety rails for transporter initialization:
- allow fallback behavior only in local/dev contexts
- enforce fail-fast behavior in production when required SMTP config is missing
- define clear warning/error messaging policy by environment

## Acceptance Criteria
- environment behavior matrix is documented (dev/test/staging/prod)
- production mode behavior requires explicit SMTP configuration
- fallback behavior remains available for local development

## Dependencies / Risks
- depends on a clear environment classification strategy
- fail-fast behavior may impact existing deployment workflows if credentials are incomplete

## Notes
Any runtime behavior change should be validated with booking flow and e2e tests.
