---
layout: post
title: "Stop Adding Agents When One LLM Fails"
date: 2026-02-21 09:41:00 -0600
categories: [ai, architecture]
tags: [llm, agents, system-design, hybrid-ai]
---

When your LLM-based agent can't reliably choose between 5 tools, giving 10 tools to 2 agents doesn't fix the problem. It just moves the bottleneck and adds a supervisor who's equally confused.

<!--more-->

Three years after ChatGPT, we're seeing a pattern: LLMs struggle with structured workflows. The solution? Add more LLMs. Call them "agents." Give them roles like "planner," "executor," "supervisor." Build orchestration layers. Add memory. Add more agents.

This is architectural denial dressed as innovation.

## The Core Misunderstanding

LLMs are transformer models trained to predict the next token. They're phenomenal at fuzzy reasoning over unstructured text. They synthesize, they summarize, they connect dots across vast corpora.

They are **not** built for:
- Deterministic multi-step workflows
- Reliable tool selection from large option sets
- Maintaining consistent state across interactions
- Goal tracking with verifiable completion criteria

When we push LLMs into these roles, they struggle. Not because they're "not good enough yet," but because **language prediction is not a process engine.**

## The Agentic Workaround

The agentic framework response goes like this:

1. One LLM can't handle complex workflows → Split the work across multiple specialized LLMs
2. Multiple LLMs need coordination → Add a supervisor LLM
3. Supervisor struggles with too many agents → Add hierarchy, memory, planning layers
4. System becomes too complex → Add meta-orchestration

At each step, we're using LLMs to patch LLM limitations. It's turtles all the way down.

Here's what actually happens in production:
- Tools get misused (GPT-4 calls `send_email` when it should call `draft_email`)
- Calls fail silently (agent assumes success, moves to next step with corrupt state)
- Edge cases break flows (unexpected API response format → entire chain halts)
- Supervision becomes exponentially harder (10 agents with 5 tools each = 50 potential failure modes)

The committee members are hallucinating their way through vague job descriptions.

## What We Should Build Instead

**1. Know When Not to Use LLMs**

Build a decision boundary:
- **Fuzzy, unstructured, interpretive?** → LLM
- **Structured, deterministic, verifiable?** → State machine / traditional code

Example: Customer support routing
- LLM: Understand customer intent from natural language
- State machine: Execute the workflow (create ticket → assign to queue → send confirmation)

The handoff point is explicit. The LLM doesn't "decide" whether to execute the next step — it outputs structured data that deterministic code validates and acts on.

**2. Translation Layers, Not Agentic Chaos**

Instead of Agent 1 → Agent 2 → Agent 3, build:
- LLM → **Structured Output** → Validation Layer → Execution Engine

The validation layer is code, not another LLM. It checks:
- Is this output structurally valid?
- Does it match our schema?
- Are the parameters within acceptable ranges?

If validation fails, don't ask another LLM to "fix it." Regenerate with constraints, or fail explicitly.

**3. Track What Actually Works**

Build systems that log:
- When did the LLM succeed vs. fail?
- Which tasks consistently fail?
- Where do we fall back to human intervention?

Over time, this data tells you **where LLMs add value** and **where traditional automation is more reliable.**

Use that data to refactor. Replace flaky agentic flows with deterministic code. Keep LLMs where they excel: understanding messy human input, generating creative variations, synthesizing information.

## The Honesty Gap

What's most frustrating is how few people in positions to know better are saying this clearly.

Lab founders, senior researchers, already-rich executives — they know LLMs aren't general agents. They know the architectural limitations. They know that throwing more agents at the problem doesn't solve it.

But caution gets reframed as doubt. Realistic engineering becomes "pessimism." The AGI narrative rolls forward, and the gap between demo and production widens.

Engineers are under pressure to deliver the Hollywood dream. Sunk costs pile up. The clock keeps ticking.

## The Anti-Agentic Principle

**Before you add another agent, ask:**
1. Is this task actually fuzzy/interpretive, or did my first agent just fail at something deterministic?
2. Can I replace this agent with 50 lines of Python?
3. Am I building a robust system, or am I building a Rube Goldberg machine that uses GPT-4 as duct tape?

Sometimes the answer is "yes, we need multiple LLMs." But most of the time, the answer is "we need one LLM and better software engineering."

## What's Next

Hybrid architectures will win. Systems that know when to use fuzzy AI and when to use deterministic logic. Systems with clear handoff points, validation layers, and fallback mechanisms.

The demo trap will collapse under its own weight. Production systems that actually work will replace the ones held together by prompt engineering and prayers.

And maybe, eventually, we'll stop selling LLMs as the solution to every problem and start building systems that use the right tool for each job.

---

**Related:**
- [Stop Building Bigger LLMs](./2026-02-21-stop-building-bigger-llms.md)
- [Test Agents Like an Agency](./2026-02-21-test-agents-like-an-agency.md)
