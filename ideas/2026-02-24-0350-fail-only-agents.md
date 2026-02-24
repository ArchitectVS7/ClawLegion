# Fail-Only Agents — Brainstorm Session

**Session:** 2026-02-24 03:50 UTC  
**Source:** GitHub Trending AI (all-time)  
**Lens:** Inversion  
**Modifier:** Cross-Pollination  
**Format:** Narrative  

## The Finding

**LangChain:** "The platform for reliable agents" — 127K stars, massive ecosystem built around making agents work reliably.

## The Inversion Question

What if we built the opposite? What if we built agents **designed to fail**?

## Approaches Explored

### 1. Design for Unreliability (Score: 38)
**Thesis:** Build platforms that EXPECT failure and make recovery beautiful.

**Cross-pollination:** "Code doesn't want to be refactored" (surgical timeout concept)

**How it works:**
- Every agent has a pre-declared failure mode
- Recovery is choreographed, not reactive
- Like surgical checklists: plan the failure before it happens

**Strengths:** Makes failure explicit, reduces surprise  
**Weaknesses:** Still focused on recovery, not discovery  
**Novelty:** 8 | **Viability:** 7 | **Impact:** 8 | **Fun:** 8 | **Diversity:** 7

---

### 2. Reliability through Elimination (Score: 41)
**Thesis:** "Reliable" should mean "does less, perfectly" not "does more, correctly"

**Cross-pollination:** "Your agent shouldn't compute" (offload computation)

**How it works:**
- Strip agents down to single responsibilities
- Reliability comes from simplicity, not robustness
- Delegate everything complex to external systems

**Strengths:** Clean separation, testable  
**Weaknesses:** Doesn't explore the failure space  
**Novelty:** 9 | **Viability:** 8 | **Impact:** 8 | **Fun:** 8 | **Diversity:** 8

---

### 3. Distributed Unreliability (Score: 36)
**Thesis:** Each agent is unreliable, but the network is reliable (immune system model)

**How it works:**
- Individual agents fail frequently
- Network-level redundancy ensures outcome reliability
- Like white blood cells: most die, but the system works

**Strengths:** Biologically inspired, resilient  
**Weaknesses:** Resource-intensive, coordination overhead  
**Novelty:** 7 | **Viability:** 6 | **Impact:** 8 | **Fun:** 7 | **Diversity:** 8

---

### 4. Fail-Only Agents (Score: 42) ✅ **SELECTED**
**Thesis:** Agents whose only job is to fail interestingly, surfacing edge cases

**Cross-pollination:** "Printf is Turing-complete" (computation as side effect)

**How it works:**
- Run in parallel with reliable agents
- Explore failure space deliberately
- Report interesting failures as discoveries
- Like canaries in coal mines: their job is to detect danger

**Examples:**
- **Boundary Agent:** Finds SQL queries that parse correctly but return surprising results
- **Chaos NPC:** Tries to break game world immersion (asks about non-existent objects, references future events)
- **Sidechain Failure Monitor:** Tests downstream agents with edge cases from upstream outputs

**Key insight:** Success is local, failure is global. You can't enumerate all failures, but you can explore them.

**Implementation pattern:**
```python
class CanaryOrchestrator:
    def process(self, input_data):
        result = self.reliable.run(input_data)  # Production path
        self.canary.run_async(input_data, on_interesting_failure=self.monitor.log)  # Discovery path
        return result
```

**Strengths:** Discovers unknowns, doesn't block production, treats failure as search  
**Weaknesses:** Requires defining "interesting failure"  
**Novelty:** 10 | **Viability:** 7 | **Impact:** 8 | **Fun:** 9 | **Diversity:** 8

---

### 5. Reliability as Performance (Score: 40)
**Thesis:** "Reliable agents" is peacock feathers — aesthetic theater, not substance

**Cross-pollination:** "Best practices are peacock feathers"

**How it works:**
- Audit what actually makes agents reliable
- Strip away the performative signals
- Measure reliability by failure recovery time, not uptime

**Strengths:** Exposes cargo-culting in agent design  
**Weaknesses:** Critique without construction  
**Novelty:** 8 | **Viability:** 8 | **Impact:** 8 | **Fun:** 8 | **Diversity:** 8

---

## Why Fail-Only Won

**Highest novelty (10/10):** No one builds agents to fail on purpose.  
**High fun (9/10):** Inverting success metrics is delightful.  
**Practical (7/10):** Can be implemented as a monitoring layer without disrupting production.  
**Cross-domain insight:** Printf-as-computation shows that side effects can be primary value.

The other approaches were solid, but Fail-Only had the sharpest edge and the clearest implementation path.

## Article Structure

**Format:** Narrative (600-900 words)  
**Hook:** "What if the best way to make agents reliable is to add agents that fail?"  
**Arc:** Problem (reliability paradox) → Solution (fail-only agents) → Examples (boundary, chaos NPC, sidechain) → Theory (success local, failure global) → Implementation (canary orchestrator) → Cross-pollination (printf) → CTA (clone + invert your best agent)

**Outcome:** Published to `_drafts/2026-02-24-your-agent-should-fail.md`

---

## Next Steps

If this passes review:
- Build a proof-of-concept canary orchestrator
- Apply to OpenClaw's session orchestration
- Measure: what do fail-only agents discover that testing doesn't?
