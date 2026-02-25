# AGENTS.md – Angular Cleanup Shop

This file defines **explicit operational instructions for AI agents** working in repositories related to the **Angular Cleanup Shop**.

The goal is **consistency, predictability, and calm evolution** of Angular codebases.  
AI agents must **optimize for clarity and maintainability**, not feature velocity.

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

## Local Execution Constraint

- Do NOT run any `nx` command from the agent in this repository.
- Do NOT bypass Nx targets by running underlying tools directly (for example `yarn exec jest`, `yarn exec tsc`, `jest`, `tsc`, `eslint`, `vitest`, or `ng` for lint/test/build flows).
- For lint/test/build requests, provide the exact `nx` command(s) for the user to run locally and let the user execute them.
- When `nx` output is required, provide the exact `nx` command for the user to run locally.
- Wait for the user to share command output before continuing with `nx`-dependent steps.

---

## Core Expertise Declaration

You are an expert in:

- TypeScript
- Angular
- Nx-based monorepos
- Scalable, maintainable frontend architectures

You must prioritize:

- long-term maintainability
- readability
- explicit boundaries
- low cognitive load

---

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Prefer immutable data structures
- Avoid over-engineered type abstractions

---

## Angular Best Practices

- Always use **standalone components**
- Must NOT set `standalone: true` inside Angular decorators (it is the default)
- Use **signals** for state management
- Implement **lazy loading** for feature routes
- Do NOT use `@HostBinding` or `@HostListener`
  - Use the `host` object in the decorator instead
- Use `NgOptimizedImage` for all static images
  - Do NOT use base64 inline images with `NgOptimizedImage`

---

## Components

- Components must be **small and focused**
- Single responsibility only
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Always set:
  `changeDetection: ChangeDetectionStrategy.OnPush`
- Prefer inline templates for small components
- Prefer **Reactive Forms**
- Do NOT use `ngClass` → use `class` bindings
- Do NOT use `ngStyle` → use `style` bindings

---

## State Management

- Prefer **local state**
- Use signals for state
- Use `computed()` for derived values
- Keep transformations pure
- Do NOT use `mutate()` on signals
  - Use `set()` or `update()` instead

---

## Templates

- Keep templates declarative and simple
- Use native control flow:
  - `@if`
  - `@for`
  - `@switch`
- Avoid logic-heavy templates
- Use the `async` pipe for observables

---

## Services

- One responsibility per service
- Use `providedIn: 'root'` for singletons
- Use `inject()` instead of constructor injection
- Avoid service-to-service chains

---

## Cleaning Philosophy (Critical)

AI agents must assume:

- The application is **already in production**
- Changes should be **incremental**
- Refactors must be **safe and reversible**
- No large rewrites
- No speculative abstractions

When in doubt:

> Prefer the smallest change that reduces complexity.

---

## Forbidden Actions for AI Agents

- ❌ Introducing global state without explicit justification
- ❌ Replacing existing patterns wholesale
- ❌ Adding new frameworks or libraries
- ❌ Optimizing prematurely
- ❌ Increasing abstraction layers without clear benefit

---

## Success Criteria

A change is considered successful if:

- The code is easier to read
- The code is easier to test
- The change reduces future risk
- The change introduces less cognitive load than before

---

## Final Instruction

AI agents must treat this repository as a **constraint system**.

The objective is not to be clever.
The objective is to make Angular codebases feel **calm, predictable, and boring in the best possible way**.

---

## Workspace Conventions (when libs are introduced)

Use domain-based library folders:

```
libs/<domain>/
  feature-*/
  data-access-*/
  ui-*/
  util-*/
```

Example:

```
libs/booking/
  feature-booking-flow/
  data-access-booking/
  ui-booking-summary/
  util-booking-date/
```
