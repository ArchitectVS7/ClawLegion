# Polyrhythmic Multi-Agent System
**Generated:** 2026-02-20 16:41 UTC
**Source:** HN - "The path to ubiquitous AI (17k tokens/sec)"
**Rolls:** d100=23(Reddit→HN fallback), d6=3(7days), d6=4(Analogy), d4=2(ToolRestriction)

## Core Analogy
Musical polyrhythms - different instruments playing at different tempos simultaneously, creating emergent complexity.

## The Idea
What if different AI agents operated at fundamentally different "clock speeds" based on their role?

- **Fast agents** (17k tok/s): Real-time interaction, quick decisions, rapid iteration
- **Medium agents** (1-5k tok/s): Standard reasoning, code review, planning
- **Slow agents** (100-500 tok/s): Deep analysis, architecture decisions, learning

Like a jazz trio: drums (fast pulse), bass (medium groove), piano (slow melodic development).

## Divergent Approaches (Brainstorm)

### 1. Tempo-Adaptive UI
Interface speeds/slows based on AI processing "rhythm". When fast agent is cooking, UI is snappy. When slow agent is thinking, UI shows contemplative state.

### 2. **Polyrhythmic Multi-Agent** ⭐ WINNER
Different agents operate at different speeds simultaneously:
- **Scout agents** (fast): Scan repos, find patterns, quick checks
- **Worker agents** (medium): Implementation, testing, standard tasks
- **Architect agents** (slow): Deep reasoning, system design, strategic planning

**Why it works:**
- Matches natural task complexity
- Optimizes compute spend (don't use slow/expensive for fast tasks)
- Creates emergent coordination (fast agents feed slow agents, slow agents guide fast agents)
- Satisfies chaos modifier (requires orchestrating different model configs/providers)

### 3. Resonance Cache
Precompute "harmonic frequencies" (common token sequences) for instant retrieval. Like musical overtones - fundamental frequency + harmonics = rich sound.

### 4. Dynamic Time Stretching
Variable-speed inference: simple queries get fast models, complex reasoning gets slow/deep models. Auto-detect required "tempo" from query structure.

### 5. Overtone Generation
Parallel speculative decoding as "harmonic series" - generate multiple candidate continuations simultaneously, select best resonance.

## Implementation Path (Polyrhythmic Multi-Agent)

### Phase 1: Proof of Concept
- Configure 3 agents with different model tiers:
  - Fast: qwen-portal/coder-model (default, fast responses)
  - Medium: claude-sonnet-4-5 (balanced)
  - Slow: claude-opus-4-6 (deep reasoning)
- Create orchestrator that routes based on task complexity
- Test with simple workflow: Fast scouts → Medium implements → Slow reviews

### Phase 2: Tempo Detection
- Analyze task prompts to estimate required "tempo"
- Keywords, complexity heuristics, estimated token counts
- Auto-assign to appropriate speed tier

### Phase 3: Emergent Coordination
- Fast agents report findings to slow agents asynchronously
- Slow agents update strategic direction for fast agents
- Medium agents bridge the gap (translate strategy → tactics)

### Phase 4: Chaos Integration
- Apply chaos modifiers at different tempos:
  - Fast agents: d4 chaos (small tweaks)
  - Medium agents: d6 chaos (moderate shifts)
  - Slow agents: d20 chaos (strategic pivots)

## Score Breakdown
- **Novelty:** 9/10 (haven't seen multi-tempo orchestration)
- **Viability:** 6/10 (requires model config + routing logic)
- **Impact:** 7/10 (optimizes compute, matches task complexity)
- **Fun:** 9/10 (musical metaphor, emergent behavior)
- **Chaos:** 8/10 (satisfies tool restriction, unusual coordination)
- **TOTAL:** 39/50

## Next Steps
1. Design agent configs (3 tiers: fast/medium/slow)
2. Build tempo detection heuristics
3. Create orchestrator routing logic
4. Test with real tasks (scan repo → implement → review)
5. Measure performance delta vs single-tempo approach

## Connections
- Relates to **Project Cyberscape** (agents as workers in landscape)
- Complements **OVI** (narrator can explain what's happening at different tempos)
- Uses chaos system (different dice at different speeds)

---

*Awaiting VS7 approval to proceed.*
