# ADR 0006: SEO Indexability Policy

## Date
February 24, 2026

## Status
Accepted

## Context
The site contains both marketing pages and transactional flows. Search indexing
must reflect this separation to avoid indexing low-value or sensitive routes.

### Evidence in repo
- `apps/shop/src/app/app.ts`

## Decision
Indexability policy is route-driven:
- marketing/informational pages are indexable
- transactional routes are noindex:
  - `/cart`
  - `/checkout`
  - `/book/confirmed/*`
- canonical URL and metadata are resolved from the central app SEO map

## Alternatives Considered
1. Index all pages by default
- rejected: risks indexing transactional/sensitive route states

2. Blanket noindex for dynamic or non-home routes
- rejected: suppresses legitimate discovery of valuable content pages

## Consequences
Positive:
- cleaner search footprint
- reduced exposure of transactional route URLs in search results
- centralized SEO behavior from one route-aware implementation

Negative:
- route changes require SEO map updates to stay correct
- missing metadata updates can cause SEO drift if not reviewed

## Follow-up Actions
- include SEO metadata review when adding new routes
- keep sitemap and route inventory aligned with indexability decisions
