# Brainstorm: Agent Development via Agency Testing Ground Pattern

**Session:** 2026-02-21 03:41 AM UTC
**Source:** IndieHackers (d100=47), 7-day window
**Lens:** First Principles (d10=7)
**Modifier:** Cross-Pollination (d6=4) — VS7's orchestrator project
**Format:** Tutorial (d6=2)

## Source Finding
IndieHackers post: "Hitting $10k+/mo by using an agency as both testing ground and distribution"

Builder runs an agency. Client work reveals pain points. Pain points become SaaS products. Agency provides both revenue and validation.

## First Principles Analysis

**What is an "agency" before convention shaped it?**

- Collection of specialists
- Collaborate on real-world problems  
- Client work = constraints that test capabilities
- Feedback is immediate: does it work or not?

**The isomorphism:** AI orchestrator spawning specialists = agency. Task prompts = client work. Workflow execution = testing ground.

## Divergent Approaches

### 1. Obvious: Generic Agency SaaS Tutorial
Standard "use consulting to validate products" advice. Not technical, doesn't leverage AI context.

**Score:** 10/25 (low novelty, high viability, low everything else)

### 2. Interesting: Agent Testing via Workflows
Apply agency pattern to AI agent development. Build agents as products, test via orchestrated workflows.

**Score:** 22/25 (strong across all dimensions)

### 3. Wild: Agents as Micro-SaaS Marketplace
Agents are standalone products. Orchestrator is marketplace. Workflows are customers. Includes contracts, metrics, A/B testing.

**Score:** 20/25 (very novel, low viability without infrastructure)

### 4. Synthesis: First Principles Agent Development ✅
**Selected approach.**

Use orchestrated workflows as testing ground. First principles: what does a specialist agent actually need? Build minimal agent, stress-test with real workflows, iterate based on failures.

**Tutorial structure:**
1. First Principles: Core capabilities over imagined features
2. Build minimal specialist (code reviewer)
3. Create test workflows (orchestrator prompts for edge cases)
4. Log + analyze failures
5. Iterate based on real feedback
6. Extract battle-tested component

**Cross-pollination:** Use VS7's UAT orchestrator experience as concrete example.

**Score:** 24/25 (highest impact + viability)

### 5. Meta: The Testing Ground Pattern
Teach the pattern itself. Show 3 examples: agent, prompt template, workflow logic. Meta-framework for designing "client work" that reveals flaws.

**Score:** 20/25 (high teaching value, might be too abstract)

## Why Synthesis Wins

1. **First Principles executed:** Asks "what actually works" before "what's usually done"
2. **Cross-Pollination delivered:** VS7's orchestrator is the proof
3. **Tutorial format honored:** Working code, runnable steps
4. **Immediate impact:** Useful for VS7's agent development NOW
5. **Novel framing:** "Orchestrated workflows as agent QA" is underserved

## Tutorial Plan

**Title:** "Test Your AI Agents Like an Agency Tests Its Staff"

**Hook:** "Most AI agents are built for imagined use cases. Then they break on the first real workflow."

**Body:**
- First principles: strip away assumptions about agent design
- Code: minimal code-reviewer agent (input: code, output: structured feedback)
- Orchestrator workflows: 3-5 prompts that stress-test the agent
- Logging: what breaks, what's missing
- Iteration: rebuild based on failures
- Result: battle-tested component

**Format:** 800-900 words, code blocks mandatory, <!--more--> after hook

**Outcome:** Readers can apply this to their own agent development. VS7 can use this pattern to harden Mystery Gang agents.

---

**Status:** Brainstorm complete. Proceeding to article writing.
