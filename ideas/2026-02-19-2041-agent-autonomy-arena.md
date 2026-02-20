# Agent Combat Arena - Gamified Autonomy Research

**Date:** 2026-02-19 20:41 UTC
**Inspiration:** HN - "Measuring AI Agent Autonomy" (Anthropic research)
**Dice:** d20=7 (HN), d6=3 (7d), d6=4 (Analogy), d4=2 (Tool Restriction)
**Brainstorming Lens:** Analogy (What's this like in games?)

## Core Concept

Multi-agent testing environment where different agents (or same agent with different configs) compete on identical tasks to measure which autonomy settings produce best outcomes.

Like a MOBA bot tournament: same arena, different strategies, measurable results.

## Implementation Ideas

### Approach 1: Autonomy Scorecard Skill (Nature analogy)
- Build OpenClaw skill that measures agent autonomy metrics
- Track: decision-making independence, tool usage patterns, error recovery
- Generate weekly "autonomy reports" showing growth over time
- **Score:** 28/40

### Approach 2: Jazz Improv Mode (Music analogy)
- Agent mode that deliberately restricts guardrails for creative tasks
- Like a jazz solo: structured freedom within boundaries
- User sets "key" (constraints), agent improvises "melody" (solution)
- **Score:** 29/40

### Approach 3: Agent Combat Arena ⭐ (Games analogy)
- Multi-agent environment where agents compete on autonomy metrics
- Each agent tackles same task with different autonomy levels
- Track which autonomy settings produce best outcomes
- **Score:** 32/40 - **SELECTED**

## Why Arena Won

- **Gamification** makes autonomy research engaging
- **Comparative data** reveals which configs actually work
- **Replayability** - can re-run same tasks with different agents
- **Clear success metrics** - winner = most autonomous + best results

## Technical Approach

1. **Arena Framework:**
   - Define standard test tasks (code generation, research, debugging)
   - Create isolated sessions for each competing agent
   - Automated scoring: time to completion, solution quality, human intervention needed

2. **Autonomy Knobs:**
   - Tool access levels (read-only → full exec)
   - Thinking budget (low → high)
   - Collaboration mode (solo → multi-agent)
   - Error recovery autonomy (ask → retry)

3. **Scoring Metrics:**
   - Task completion rate
   - Time to solution
   - Human interventions needed
   - Solution quality (automated tests)
   - Creativity/novelty of approach

4. **Tool Restriction Challenge (Chaos Modifier):**
   - Implement using OpenClaw's sessions_spawn API (haven't used in 7 days)
   - Each arena match = isolated sub-agent session
   - Forces learning of spawn/monitor/score workflow

## Next Steps (If Approved)

1. Create `skills/agent-arena/` skill structure
2. Define 5 standard benchmark tasks
3. Build arena orchestration script
4. Implement automated scoring
5. Run initial tournament: LG2 vs. orchestrator vs. backend-architect

## Connection to Larger Vision

- **Cyberscape:** Arena could be visualized as hex-based battleground
- **OVI:** Voice narration of arena matches ("LG2 takes the lead...")
- **Orchestration:** Tests multi-agent coordination at scale

---

**Status:** Awaiting VS7 approval
