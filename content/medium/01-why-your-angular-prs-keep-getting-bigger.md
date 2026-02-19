# Why Your Angular PRs Keep Getting Bigger (And Why It’s Not a Skill Problem)

Pull requests rarely start large.

In the early days of a codebase, changes are small. Focused. Contained.

But over time, something subtle happens.

A simple feature starts touching multiple domains.
A small change requires updates in five different libraries.
A UI tweak unexpectedly impacts state logic elsewhere.

PRs grow.
Review time increases.
Risk perception rises.

And eventually, the team starts saying things like:

> “This repo just feels fragile.”

The common explanation?

“Engineers aren’t disciplined enough.”

In most cases, that’s wrong.

This is not a skill problem.

It’s a structural one.

---

## The Hidden Mechanism Behind Growing PRs

Angular and Nx make it easy to scale codebases structurally.

But they don’t enforce discipline by default.

Over time, three patterns tend to emerge:

### 1. Shared Libraries Start Absorbing Ownership

What begins as a small `shared` utility folder becomes a central dependency hub.

Features import from shared.
Shared imports from features (sometimes indirectly).
Domain logic leaks into generic libraries.

Now a change in one feature subtly depends on behavior defined elsewhere.

A small modification ripples outward.

PR size increases.

---

### 2. State Ownership Becomes Ambiguous

Global stores expand “just in case.”

UI state gets promoted upward for convenience.
Observables are subscribed to in multiple places.
Side effects become scattered.

Now when you change one async flow, it’s unclear what else depends on it.

PRs grow not because the feature is big —

—but because ownership is unclear.

---

### 3. Boundaries Become Suggestions

Nx may define tags.
Module boundaries may exist.

But over time, exceptions accumulate.

Warnings remain warnings.
Feature-to-feature imports slip in.
Shortcuts are justified under deadline pressure.

No single decision breaks the architecture.

But the aggregate effect increases coupling.

And coupling expands the surface area of every change.

---

## The Real Cost of Bigger PRs

Larger PRs don’t just slow reviews.

They introduce structural risk:

- Higher regression probability
- Longer review cycles
- Reduced confidence in refactors
- Upgrade hesitation
- Slower onboarding

Eventually, teams start avoiding certain domains entirely.

Not because they’re incompetent.

But because the cost-of-change feels unpredictable.

That unpredictability is structural friction.

---

## Why Adding Developers Doesn’t Fix It

When PRs grow and velocity slows, the reflex is often to add capacity.

More developers.
More parallel work.
More feature throughput.

But structural friction compounds with scale.

If boundaries are weak, every additional contributor increases the probability of coupling drift.

You don’t solve structural entropy by increasing throughput.

You solve it by reducing coupling.

---

## The Structural Alternative

Instead of asking:

“How do we ship faster?”

Ask:

“Why does change feel expensive?”

Look at:

- Cross-domain PR frequency
- Growth of shared libraries
- Scattered subscriptions
- Global state surface
- Boundary violations in Nx

The solution is rarely a rewrite.

It’s usually incremental containment:

- Reinforce domain boundaries
- Clarify state ownership
- Reduce shared dumping grounds
- Gradually tighten constraints
- Split large PRs structurally

Small, consistent structural interventions compound.

Over time, PRs shrink again.

Not because engineers improved.

But because the system stopped resisting change.

---

## A Structural Health Signal

If you notice PRs getting bigger month after month, treat it as a leading indicator.

It’s not a failure.

It’s a signal.

Your architecture is drifting.

And drift is natural in growing systems.

The difference between fragile and resilient codebases isn’t whether drift happens.

It’s whether governance exists to contain it.

---

Structural clarity compounds.

So does entropy.

The question isn’t whether your Angular codebase will evolve.

It’s whether it evolves deliberately — or by accident.

---

*If structural friction is becoming the real constraint in your Angular/Nx system, a short structural audit can clarify whether incremental governance would reduce cost-of-change.*
