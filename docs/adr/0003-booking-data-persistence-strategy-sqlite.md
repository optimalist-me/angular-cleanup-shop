# ADR 0003: Booking Data Persistence Strategy (SQLite)

## Date
February 24, 2026

## Status
Accepted

## Context
Booking data needs a simple, predictable storage strategy suitable for current
operational scale and low deployment overhead.

### Evidence in repo
- `apps/api/src/db/sqlite.ts`
- `apps/api/src/db/schemas/booking.ts`
- `libs/booking/infrastructure-booking-datastore/src/lib/booking-datastore.ts`

## Decision
Use a single SQLite datastore for booking records:
- default database path is local (`tmp/cleanup-shop.db`)
- deployment path is configurable with `CLEANUP_DB_PATH`
- schema evolution uses additive `ensureColumn` checks for compatibility
- datastore access is centralized through the booking infrastructure layer

## Alternatives Considered
1. External managed database at this stage
- rejected: unnecessary operational complexity for current requirements

2. Destructive or reset-based migrations
- rejected: unsafe for production-like incremental evolution

## Consequences
Positive:
- low operational overhead
- straightforward backup and restore process
- safe additive schema evolution for existing data

Negative:
- limited horizontal write scalability
- requires careful path and file-permission handling in deployment

## Follow-up Actions
- document backup/restore procedure for production operations
- re-evaluate storage strategy if throughput or multi-node requirements grow
