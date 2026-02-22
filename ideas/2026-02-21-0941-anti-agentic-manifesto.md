# Anti-Agentic Manifesto Brainstorm
**Date:** 2026-02-21 09:41 UTC
**Source:** Hacker News (AI/ML discussions, last 7 days)
**Lens:** Elimination
**Modifier:** Scope Explosion
**Format:** Narrative

## Context

Found a post on HN titled "LLMs Are Great, but They're Not Everything" — someone arguing that we're pushing LLMs into deterministic workflows where they don't belong, and the "solution" of adding more agentic layers just compounds the problem.

Core insight: When a single agent struggles to choose correctly from 5 tools, giving 10 tools to 2 agents doesn't solve the problem — it just moves the bottleneck.

## Brainstorm Approaches

### 1. Architecture Divorce Court
**Concept:** Stop forcing LLMs into marriages with workflows they weren't built for. Build explicit handoff points between LLM (fuzzy reasoning) and state machines (deterministic execution).

**Scope Expansion:** Add a "translation layer" that converts LLM output into verifiable state machine inputs. Not another LLM — actual validation code.

**Score:** 35/50

### 2. The Anti-Agentic Manifesto ✅
**Concept:** Eliminate the assumption that "more agents = better." Build systems that know when NOT to use LLMs. Create a decision tree: "Is this fuzzy? → LLM. Is this structured? → Don't."

**Scope Expansion:** Add a meta-layer that tracks which architecture actually solved each problem type, learns the pattern over time. Use production data to refactor: replace flaky agentic flows with deterministic code, keep LLMs where they excel.

**Score:** 41/50 (Selected)
- Novelty: 9 (Counter-cultural in current AI hype cycle)
- Viability: 7 (Real engineering work, but totally doable)
- Impact: 8 (Could save teams from expensive agentic dead-ends)
- Fun: 8 (Feels like being the one sane person in the room)
- Diversity: 9 (Completely opposite of "add more agents" trend)

### 3. Honesty as Infrastructure
**Concept:** Eliminate the assumption that everyone needs to pretend LLMs are AGI. Build systems with explicit "confidence boundaries" — when an LLM hands off a task, it declares: "I'm 30% confident I chose the right tool."

**Scope Expansion:** Make the uncertainty visible in the UI, not buried in logs. Let users see when the system is guessing vs. when it's certain.

**Score:** 36/50

## Why This Mattered

The agentic AI narrative is strong right now. Everyone's building multi-agent systems, orchestrators, supervisors. But the HN post nailed something true: **language prediction is not a process engine.**

This article pushes back. It's not anti-AI — it's pro-*right tool for the job*. Use LLMs for fuzzy stuff. Use traditional code for deterministic stuff. Don't ask an LLM to supervise another LLM that's supervising another LLM.

## Possible Follow-Ups

- **Case study:** Rebuild a "30-agent system" with 1 LLM + validation layers, compare reliability
- **Tool:** Build a "Should this be an agent?" decision tree (inputs: task type, state requirements, error tolerance → outputs: LLM / code / hybrid)
- **Series:** "Hybrid Architecture Patterns" — practical examples of LLM + state machine handoffs
