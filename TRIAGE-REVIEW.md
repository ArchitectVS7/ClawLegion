# TRIAGE-REVIEW.md - Bottleneck-Driven Article Pipeline

## The Problem
Fixed workflows at fixed times create uneven flow. Articles pile up at expensive stages.

## The Solution
Every 15 minutes: identify biggest bottleneck, work on it.

## Three Workflows

### WORKFLOW 1→2: Idea Expansion (Qwen)
**From:** `01-bare-ideas/*.md` → **To:** `02-rough-draft/`

**Model:** Qwen (cheapest, creative)

**Process:**
1. Pick oldest idea from 01-bare-ideas/
2. Apply chaos tables for structure/format
3. Expand to 400-1200 word draft
4. Move source to `05-archived-ideas/expanded-YYYY-MM-DD-{title}.md`
5. Commit + push

### WORKFLOW 2→3: Structural Review + Expansion (Sonnet)
**From:** `02-rough-draft/*.md` → **To:** `03-review-draft/`

**Model:** Sonnet (mid-tier, structural intelligence)

**Process:**
1. Pick oldest draft from 02-rough-draft/
2. Check hook, narrative style, completeness
3. **FIX issues directly** - expand thin sections, strengthen hook
4. Add/update `review_iterations.structural` counter in frontmatter
5. If passes: move to 03-review-draft/
6. If fails after 3 iterations: move to 03-development-hold/
7. Commit + push

**This is NOT just a gate check - it's a "make it publishable" editing pass.**

### WORKFLOW 3→4: Adversarial Review (Opus)
**From:** `03-review-draft/*.md` → **To:** `04-release-candidate/`

**Model:** Opus (expensive, critical judgment)

**Process:**
1. Pick oldest article from 03-review-draft/
2. Roll d6 for adversarial focus:
   - 1-2: Skeptical Practitioner (does this actually work?)
   - 3-4: Academic Rigor (where's the evidence?)
   - 5-6: Hostile Reader (who cares?)
3. Probe 3 specific weaknesses from that lens
4. Score 4 gates (Substance, Insight, Honesty, Differentiation)
5. Provide scoring evidence for each gate
6. Add/update `review_iterations.adversarial` counter in frontmatter
7. If passes: move to 04-release-candidate/
8. If fails after 2 iterations: move to 03-development-hold/
9. Commit + push

## Triage Logic (Every 15 Minutes)

```bash
# 1. Count articles
IDEAS=$(ls -1 01-bare-ideas/*.md 2>/dev/null | wc -l)
ROUGH=$(ls -1 02-rough-draft/*.md 2>/dev/null | wc -l)
REVIEW=$(ls -1 03-review-draft/*.md 2>/dev/null | wc -l)

# 2. Find biggest bottleneck
if [ $REVIEW -gt $ROUGH ] && [ $REVIEW -gt $IDEAS ]; then
  # Run WORKFLOW 3→4 (Opus)
elif [ $ROUGH -gt $IDEAS ]; then
  # Run WORKFLOW 2→3 (Sonnet)
else
  # Run WORKFLOW 1→2 (Qwen)
fi
```

## Auto-Balancing
- 65 articles in review? → Opus runs repeatedly until cleared
- Once review clears, rough becomes bottleneck → Sonnet runs
- Once both low, ideas become bottleneck → Qwen runs
- System finds equilibrium automatically

## Token Efficiency
- Only use Opus when review-draft is the actual bottleneck
- Rest of time: Sonnet or Qwen
- 3 runs/hour = 72 articles/day processed

## Human Handoff
`04-release-candidate/` is DONE. No automated workflows touch it.
Human editor reviews from there.

## Cron Schedule
- :15 - Triage review
- :30 - Triage review
- :45 - Triage review

## Frontmatter Tracking

```yaml
---
review_iterations:
  structural: 1    # WORKFLOW 2→3 attempts
  adversarial: 0   # WORKFLOW 3→4 attempts
---
```

After iteration limits (structural: 3, adversarial: 2), article moves to `03-development-hold/`.
