# Consistency Diffusion LLMs - Speed Benchmark

**Source:** Hacker News (2026-02-20)  
**Link:** https://www.together.ai/blog/consistency-diffusion-language-models  
**Score:** 117 points, 40 comments  

**Dice rolls:**
- d20: 14 (Hacker News)
- d6: 4 (7-day range, 30 items)
- d6: 3 (Constraint lens - 1 hour builds)

---

## The Finding

Together.AI released consistency diffusion for LLMs - claims 14x faster inference with no quality loss. Technique borrowed from image diffusion models, adapted for language.

---

## Divergent Approaches (Constraint Lens: 1-hour builds)

### 1. **Quick Benchmark Demo** ⭐ SELECTED
- Clone Together.AI repo/examples
- Run existing demo on simple task (code generation, Q&A)
- Measure speedup vs standard inference
- Document results with timing charts
- **Why:** Most validating, produces shareable data, builds real understanding
- **Score:** Novelty 6/10, Viability 9/10, Impact 7/10, Fun 7/10, Chaos 4/10 = **33/50**

### 2. **Integration Spike**
- Test if technique works with OpenClaw's model pipeline
- Patch session runner with consistency caching
- Compare session response times before/after
- **Why:** Direct applicability to our infrastructure
- **Score:** Novelty 5/10, Viability 6/10, Impact 8/10, Fun 6/10, Chaos 5/10 = **30/50**

### 3. **Visual Explainer**
- Create animated diagram showing how consistency diffusion works
- Use Cyberscape aesthetic (neon pink, hexagonal)
- Export as shareable gif/video
- **Why:** Teaching tool, aesthetically aligned with Project Cyberscape
- **Score:** Novelty 7/10, Viability 7/10, Impact 5/10, Fun 8/10, Chaos 3/10 = **30/50**

### 4. **Mini Blog Post**
- Write technical breakdown with code samples
- Include math/algorithmic explanation
- Reference for future implementation
- **Why:** Documentation, knowledge capture
- **Score:** Novelty 4/10, Viability 9/10, Impact 6/10, Fun 5/10, Chaos 2/10 = **26/50**

### 5. **Extreme: 15-Minute Implementation Challenge**
- Can we add consistency caching to oracle CLI in 15 minutes?
- Speed-run implementation, document what breaks
- Maximum time pressure + chaos modifier
- **Why:** Pure chaos, tests intuition vs planning
- **Score:** Novelty 9/10, Viability 3/10, Impact 4/10, Fun 9/10, Chaos 10/10 = **35/50**

---

## Selected Approach: #1 - Quick Benchmark Demo

**Reasoning:** Highest viability with strong impact. Produces concrete data we can reference later. 1-hour constraint is realistic for demo validation.

**Next steps if approved:**
1. Clone Together.AI examples
2. Set up test environment
3. Run benchmark (simple code gen task)
4. Measure: time per token, total latency, quality comparison
5. Document findings in `memory/research/consistency-diffusion-benchmark.md`
6. Share results with VS7

**Bonus:** If this works well, could inform future OVI voice assistant optimizations (faster TTS inference).
