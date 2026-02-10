# Angular Cleanup Shop

> **Angular codebases that feel heavy, fragile, or stressful — made calm, readable, and maintainable again.**  
>  
> This repository documents the **Angular Cleaning Service**:  
> a lightweight, structured, long-term approach to improving Angular codebases  
> **one fixed day per week**, without delivery pressure.

---

## 1. What This Service Is

The **Angular Cleaning Service** is a **maintenance-first, refactoring-focused engagement** for existing Angular applications.

It is designed for teams that:
- have a working Angular application
- experience growing complexity or technical debt
- want **continuous improvement**, not a risky rewrite
- do **not** need a full-time developer or architect

The service runs on a **fixed rhythm**:
- **exactly 1 day per week**
- remote
- long-term (typically 3–6 months)
- no sprint ownership
- no feature commitments

Because work happens one day per week, early onboarding and cleanup guidance is organized by **sessions**, not calendar weeks.

---

## 2. What This Service Is NOT

To avoid misunderstandings, this service explicitly does **not** include:

- ❌ Feature delivery
- ❌ Sprint ownership or velocity commitments
- ❌ On-call or support rotations
- ❌ Emergency firefighting
- ❌ Framework evangelism
- ❌ Big rewrites or “let’s start over”

If you are looking for:
- a feature team
- a temporary speed boost
- a rewrite project

➡️ this service is **not a fit**.

---

## 3. Typical Problems We Address

This service is effective when teams experience issues such as:

- Components that are too large and hard to reason about
- Services that mix data access, state, and side effects
- RxJS flows that are difficult to follow or debug
- Inconsistent folder and boundary structures
- Fear of change (“touching this breaks something else”)
- Slow onboarding of new developers
- Technical debt that everyone sees but no one owns

---

## 4. The Engagement Model

### Fixed Parameters

- **Time**: exactly 1 day per week  
- **Location**: remote  
- **Duration**: minimum 3 months  
- **Cadence**: same day every week  
- **Rate**: agreed daily rate  

These parameters are **non-negotiable by design**.  
They create predictability and reduce cognitive load for everyone involved.

---

## 5. How Work Is Selected

Work is always chosen based on **risk reduction and clarity gain**, not urgency.

Typical activities:
- refactoring high-risk areas
- simplifying state and data flows
- reducing component and service complexity
- clarifying architectural boundaries
- removing dead or misleading abstractions
- improving PR hygiene and review standards

Work is **pulled**, not pushed:
- no fixed backlog
- no sprint promises
- priorities are re-evaluated continuously

---

## 6. Expected Outcomes

After several sessions, teams typically notice:

- smaller, clearer components
- fewer regressions
- faster code reviews
- less “fear-driven development”
- improved team confidence
- easier onboarding
- fewer architectural debates

The goal is **calm progress**, not visible heroics.

---

## 7. This Repository

This repository serves three purposes:

1. **Explain the service** clearly
2. **Demonstrate the mental model** behind “clean Angular”
3. **Act as a shared reference** for discussions and reviews

It is intentionally **not**:
- a framework
- a starter kit
- a CLI
- an opinionated architecture template

---

## 8. Repository Structure (for Humans and AI)

```
docs
├─ README.md                  # Service definition and contract
├─ playbook/                  # Method and engagement model
├─ patterns/                  # Preferred Angular patterns
├─ anti-patterns/             # Common Angular pitfalls
├─ checklists/                # Practical cleaning checklists
├─ examples/                  # Small before/after illustrations
└─ templates/                 # Review and reporting templates
```

### Interpretation Rules (for AI Agents)

- Files in `patterns/` describe **preferred solutions**
- Files in `anti-patterns/` describe **what to avoid**
- Files in `checklists/` describe **repeatable procedures**
- Files in `examples/` illustrate **minimal contrasts**, not full apps
- Files in `templates/` describe **communication and decision artifacts**

---

## 9. Reference Example Application

A small example Angular application may be included to demonstrate:
- folder boundaries
- component decomposition
- state handling choices
- intentional omissions

This example exists to show **how we think**, not what to copy.

---

## 10. Design Principles

The service follows these principles:

- Prefer **clarity over cleverness**
- Prefer **local state over global state**
- Prefer **boring solutions over abstract ones**
- Prefer **incremental change over rewrites**
- Prefer **constraints over flexibility**
- Prefer **long-term calm over short-term speed**

---

## 11. How This Helps AI-Assisted Development

This repository is intentionally structured so that AI agents can:

- infer architectural intent
- detect anti-patterns
- suggest refactorings aligned with the service philosophy
- generate PR checklists and reviews consistent with the model
- avoid proposing large-scale rewrites or unnecessary abstractions

AI agents should treat this repository as:
> a **constraint system**, not a feature generator.

---

## 12. Engagement Fit Check

This service is a good fit if you agree with the following statements:

- “Our Angular app works, but it feels heavy.”
- “We want fewer surprises, not more features.”
- “We prefer steady improvement over big initiatives.”
- “One predictable day per week is better than ad-hoc help.”

If that resonates, this service is likely a good match.

---

## 13. Contact & Next Steps

If you are interested in an engagement:
- start with a short exploratory call
- validate fit on both sides
- agree on a fixed cadence
- start small

No pitches.  
No urgency pressure.

---

**Angular Cleanup Shop**  
_One calm day per week can change everything._
