# ADR 0004: Monorepo Boundary Enforcement

## Date
February 24, 2026

## Status
Accepted

## Context
The workspace is organized by domains and layers. Architectural drift must be
prevented with enforceable constraints, not convention-only guidance.

### Evidence in repo
- `eslint.config.mjs`
- `nx.json`
- `AGENTS.md`

## Decision
Dependency boundaries are mandatory and enforced:
- tag-based dependency rules are enforced by `@nx/enforce-module-boundaries`
- frontend and backend layer constraints are explicitly defined
- domain constraints limit cross-domain leakage
- Nx generator defaults enforce domain/type naming conventions for new libs

## Alternatives Considered
1. Convention-only boundary guidance
- rejected: no hard guardrail against gradual architecture erosion

2. Coarse app-only boundaries without layer/domain rules
- rejected: insufficient for long-term maintainability in a growing monorepo

## Consequences
Positive:
- clear and enforceable architectural contracts
- reduced accidental coupling and dependency sprawl
- better long-term maintainability and review clarity

Negative:
- additional discipline needed for project tagging and imports
- occasional friction when introducing new cross-cutting concerns

## Follow-up Actions
- keep dependency constraints updated when introducing new domain tags
- include boundary violations as blocking CI findings
