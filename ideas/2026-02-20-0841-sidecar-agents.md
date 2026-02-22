# Sidecar Agents Pattern

**Source:** HN research (2026-02-20) - Inspired by "Pi for Excel" AI sidebar add-in
**Analogy Lens:** Cleaner fish, session musicians, companion NPCs
**Chaos Modifier:** None (base concept)

## Core Concept

Lightweight helper agents that attach to existing workflows/tools contextually. Not full orchestrators - just specialized assistants that spawn when needed, then disappear.

## The Analogy

**Cleaner fish on sharks:** Small symbiotic helpers that attach temporarily, provide specific service, then detach. They don't replace the shark - they enhance it.

**Session musician:** Sits in for one song, adds expertise, then leaves. Core band remains.

**Companion NPC:** Follows player through dungeon, assists contextually, can be dismissed.

## Divergent Approaches Brainstormed

### 1. **Browser Tab Sidecars**
Spawn micro-agent per browser tab:
- Research tab → Summarization agent attached
- Shopping tab → Price comparison agent attached
- Code repo tab → Documentation agent attached

Agents see only their tab context, report findings to main session.

### 2. **Workflow Attachment Points**
Define "sidecar slots" in workflows:
- Email workflow → Grammar/tone sidecar
- Code review → Security audit sidecar
- Meeting notes → Action item extraction sidecar

### 3. **Skill-Specific Helpers**
Each skill can spawn lightweight helper:
- `1password` skill → Credential rotation sidecar
- `github` skill → PR review sidecar
- `himalaya` skill → Email triage sidecar

### 4. **Swarm Mode (HIGH CHAOS)**
Allow sidecars to spawn their own sidecars:
- Main agent → Research sidecar → Fact-checking sub-sidecar → Source validation micro-sidecar

Risk: Agent explosion. Mitigation: Hard depth limit (max 2 levels).

### 5. **Time-Boxed Specialists**
Sidecars with built-in expiration:
- "Give me a Python expert for the next 20 minutes"
- Sidecar spawns, assists, auto-terminates after timer
- Prevents orphaned agent accumulation

## Selected Approach: #1 - Browser Tab Sidecars

**Why:**
- Concrete use case (VS7 uses browser heavily)
- Clear boundaries (tab = context)
- Can prototype with OpenClaw + browser tool
- Scales gracefully (1 tab = 1 sidecar, not exponential)

**Implementation Plan:**
1. Detect browser tab creation/focus change
2. Analyze tab content (snapshot)
3. Determine if sidecar needed (rules-based or LLM classification)
4. Spawn appropriate specialist agent (isolated session, label=tab-url)
5. Agent monitors tab, reports insights to main session
6. Agent terminates when tab closes

**Tech Stack:**
- OpenClaw browser tool (snapshot + navigation tracking)
- sessions_spawn for sidecar creation
- Heartbeat mechanism for sidecar monitoring
- Tab close detection → session cleanup

**First Prototype:**
GitHub repo tab → Documentation sidecar that:
- Reads README
- Suggests related projects
- Flags outdated dependencies
- Reports to main session every 5 minutes

## Other Ideas (Archive for Later)

- **Game about managing autonomous agents** (from HN #5 - journalism scandal)
- **"Exoskeleton UI" framework** (from HN #4 - amplification metaphor)
- **Perceptual quality threshold tester** (from HN #2 - diffusion LLMs)
- **Cleanup patterns skill** (from HN #1 - defer in C)

## Next Steps

1. Create proof-of-concept: Single GitHub tab sidecar
2. Test lifecycle (spawn → monitor → report → cleanup)
3. Evaluate resource usage (can we handle 10+ sidecars?)
4. Define sidecar "personality" (how chatty should they be?)
5. Build library of sidecar templates (research, code, shopping, etc.)

---

**Dice rolls:**
- d20 = 12 (Hacker News)
- d6 = 3 (7 days)
- d6 = 4 (Analogy Lens)

**Selection score: 38/50**
- Novelty: 8/10
- Viability: 9/10
- Impact: 7/10
- Fun: 8/10
- Chaos: 6/10
