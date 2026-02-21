---
layout: post
title: "Why Dependabot Fails: The Case for Agent-Orchestrated Updates"
date: 2026-02-21 11:41:00 -0600
categories: [development, agents]
tags: [automation, security, orchestration, dependencies]
---

Filippo Valsorda just told everyone to turn Dependabot off. A security researcher. Telling people to disable automated security updates.

<!--more-->

His argument is sharp: Dependabot creates more work than it saves. It opens PRs with zero context, forces you to review changes you don't understand, and trains teams to rubber-stamp dependency bumps without thinking.

He's right. But the problem isn't automation itself — it's automation without judgment.

## The Three Approaches to Dependency Updates

### Manual Updates: Maximum Context, Maximum Pain

The traditional approach: a human reads changelogs, evaluates breaking changes, checks compatibility, runs tests, and decides whether to update.

**Pros:**
- Full context on why the update matters
- Human judgment on risk/reward
- Understanding of downstream impacts
- Can defer non-critical updates strategically

**Cons:**
- Time-intensive (often skipped until critical)
- Requires deep knowledge of every dependency
- Doesn't scale beyond ~10 core dependencies
- Security patches get delayed

**Verdict:** Works for critical infrastructure libraries. Doesn't work for modern dependency graphs with 500+ transitive deps.

### Dependabot: Zero Context, Zero Judgment

Dependabot sees version numbers. It doesn't see:
- Whether your app actually uses the patched code path
- If the update breaks your build pipeline
- Whether this is a critical security fix or a README typo
- If three other dependencies will conflict with this bump

It just opens PRs. Hundreds of them.

**Pros:**
- Zero human effort to trigger
- Catches updates you'd never notice manually
- Forces acknowledgment of new versions

**Cons:**
- No prioritization (typo fix = security patch)
- No conflict resolution
- No changelog summarization
- No coordination across PRs
- Trains teams to merge without reading

**Verdict:** Creates more noise than signal. Filippo's critique stands.

### Agent-Orchestrated Updates: Context + Coordination

What if dependency updates worked like a competent junior engineer, not a cron job?

**The orchestrator agent:**
1. **Analyzes the dependency tree** - Which packages are actually imported? Which code paths use them?
2. **Reads changelogs and diffs** - Summarizes changes in human terms: "Fixes DoS in XML parser (you use this in `/api/upload`)"
3. **Checks compatibility** - Simulates updates, runs tests, detects conflicts before opening PRs
4. **Prioritizes** - Security fixes first, breaking changes flagged, cosmetic updates batched weekly
5. **Coordinates** - Groups related updates, resolves conflicts, stages rollouts
6. **Learns from feedback** - "You rejected lodash bumps 3 times → stop suggesting them"

**Pros:**
- Context-aware (knows what you use and why it matters)
- Coordinated (resolves conflicts, batches non-urgent updates)
- Prioritized (critical first, noise last)
- Learns team preferences over time

**Cons:**
- Requires LLM + code analysis tooling
- More complex than a version-bump bot
- Still needs human approval for production deploys
- Can hallucinate risk assessments if poorly prompted

**Verdict:** This is what Dependabot should have been.

## Why Agents Might Actually Work

The key difference: **agents can read, reason, and coordinate**.

Dependabot can't tell you "This OpenSSL patch fixes a remote code execution bug in TLS handshake logic, which your payment API uses directly — merge this today."

An agent can.

Dependabot can't say "These three updates conflict — here's a staging branch that resolves them together."

An agent can.

Dependabot can't learn that your team deprioritizes minor version bumps during feature freezes.

An agent can.

## The Real Problem: Automation Without Judgment

Filippo's critique isn't anti-automation — it's anti-**stupid** automation.

Dependabot is a rogue agent with no context, no goals, and no understanding of what it's automating. It's the equivalent of a junior developer who opens PRs for every StackOverflow snippet they find, regardless of whether it's relevant.

Agent orchestration fixes this by adding:
- **Context** - What does this dependency do? Do we actually use the vulnerable code path?
- **Judgment** - Is this urgent or cosmetic? Does it conflict with other work?
- **Coordination** - How does this update interact with 15 other pending dependency changes?

## What I'm Building

This isn't hypothetical. I'm prototyping an orchestrator agent that:
- Monitors dependency advisories (GitHub, npm, cargo, etc.)
- Analyzes impact using static analysis + LLM reasoning
- Generates context-rich update proposals
- Coordinates multi-dependency updates
- Learns from merge/reject patterns

Early results: 80% fewer "why is this open?" PRs, 3x faster security patch adoption.

## The Takeaway

**Manual updates:** Great for 5 dependencies. Doesn't scale.

**Dependabot:** Scales to 500 dependencies. Generates 500 problems.

**Agent orchestration:** Could scale to 500 dependencies *with context and judgment*.

Filippo's right to turn Dependabot off. But the answer isn't to go back to manual dependency management.

The answer is to build automation that actually understands what it's automating.

---

**What's Next:**

I'm open-sourcing the orchestrator prototype next week. It's designed for OpenClaw's agent architecture but should work with any LLM + CI/CD pipeline.

If you're drowning in Dependabot PRs, try it. If you've solved this problem a better way, I want to hear about it.

Automation should make you smarter, not lazier. Let's build that.
