# CONTRIBUTING.md – Angular Governance Program

Thank you for contributing to the **Angular Governance Program** repositories.

This document defines **how humans and AI agents collaborate** safely and predictably
when working on Angular codebases under the *cleaning* model.

This is **not** an open-source “feature contribution” guide.  
It is a **guardrail document**.

---

## 1. Purpose of This Repository

This repository exists to support the **Angular Governance Program**.

Its goals are:
- reduce technical debt
- improve readability and maintainability
- lower cognitive load
- make Angular codebases feel calm and predictable
- preserve explicit domain ownership
- prevent shared libraries from becoming coupling hubs
- reduce cross-domain change surface

All contributions must **serve these goals**.

---

## 2. Who This Guide Is For

This guide applies to:
- human contributors
- reviewers
- maintainers
- **AI agents** (Copilot, ChatGPT, Cursor, etc.)

All contributors are expected to:
- follow the constraints defined here
- respect the service philosophy
- prefer incremental improvement over ambition

---

## 3. Golden Rule

> **This is a cleaning service, not a delivery engine.**

If a change primarily:
- adds features
- increases scope
- introduces new abstractions
- accelerates delivery

➡️ it does **not** belong here.

---

## 3.1 Architectural Stance (DDD-Inspired Modulith)

This repository follows a **pragmatic, DDD-inspired frontend modulith approach**.

This does **not** mean full Domain-Driven Design adoption by default.

It means:
- each domain is treated as a bounded context
- dependencies are one-directional
- public APIs between domains are explicit and minimal
- shared code is intentional and ownership-defined

Micro frontends are **not** the default solution.
Strong internal boundaries inside a modulith come first.

---

## 4. Contribution Scope

### ✅ Allowed Contributions

- Refactoring for clarity
- Reducing component or service size
- Simplifying state and data flows
- Removing dead code
- Improving naming and structure
- Clarifying domain boundaries and public APIs
- Reducing shared surface area where ownership is unclear
- Adding or refining documentation
- Improving tests *when directly related to cleaned code*
- Small, reversible improvements

---

### ❌ Disallowed Contributions

- Feature development
- Architectural rewrites
- Introducing micro frontends without explicit architectural decision
- Moving code to shared without clear domain ownership
- Introducing new frameworks or libraries
- Global state introduction without explicit approval
- Premature optimization
- “Future-proofing” abstractions
- Large multi-file changes without justification

---

## 5. Incremental Change Policy

All changes must be:
- **small**
- **reviewable**
- **reversible**

Preferred approach:
1. Identify one source of complexity
2. Reduce it
3. Stop

Never expand scope to “improve the architecture globally.”
Architecture evolves through contained, local improvements.

Multiple small PRs are preferred over one large change.

---

## 6. Angular-Specific Rules

Contributions must comply with:

- Standalone components only
- No `standalone: true` flags (default behavior)
- Signals for state where appropriate
- No `@HostBinding` / `@HostListener`
- Use `host` object instead
- Use `NgOptimizedImage` for static images
- No `ngClass` or `ngStyle`
- Prefer native control flow (`@if`, `@for`, `@switch`)
- Prefer reactive forms

(See `AGENTS.md` for the full, authoritative list.)

---

## 7. TypeScript Rules

- Strict typing is mandatory
- Avoid `any`
- Prefer `unknown` when necessary
- Prefer immutability
- Avoid clever or opaque type tricks

Clarity always wins over expressiveness.

---

## 8. Nx Workspace Rules (If Applicable)

When working in an Nx workspace:

- Use `nx` commands, never underlying tooling directly
- Never guess CLI flags
- Use `nx-workspace` skill for exploration
- Use generators via `nx-generate` first

(See Nx configuration block in `AGENTS.md`.)

---

## 9. Pull Request Guidelines

Each PR must include:

### Required in PR description
- What complexity is reduced?
- Why is this change safe?
- Why is this change incremental?

### Strongly encouraged
- Before/after explanation
- Screenshots for template changes
- Clear commit messages

---

## 10. Review Philosophy

Reviewers should ask:
- Is the code easier to read?
- Is the mental model simpler?
- Is this change reversible?
- Does this reduce future risk?

Reviewers should **not** ask:
- “Can we extend this?”
- “What if we later need…”
- “Can we generalize this?”

---

## 11. AI Agent Contribution Rules

AI-generated changes must:
- follow `AGENTS.md` strictly
- avoid speculative refactors
- explain reasoning in PR descriptions
- prefer smallest possible diff
- respect bounded contexts and domain ownership
- avoid cross-domain imports except via explicit public APIs
- use Nx MCP for workspace introspection when applicable
- use Angular CLI-driven MCP flows when generating Angular artifacts

AI agents must **never**:
- refactor large areas at once
- introduce new architectural patterns
- override existing conventions
- propose premature micro frontend splits
- introduce new shared abstractions without ownership analysis

---

## 12. Structural Drift Warning

If a contribution:
- increases cross-domain imports
- expands shared libraries without ownership clarity
- increases PR surface area

It likely increases structural friction.

Stop and reassess.

---

## 13. Final Note

This repository values:
- boring solutions
- predictable outcomes
- calm progress

If a contribution makes the system feel **more complex**, even if “technically better”,
it is probably the wrong change.

---

**Angular Governance Program**  
_Progress through restraint._
