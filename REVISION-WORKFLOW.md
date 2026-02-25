# REVISION-WORKFLOW.md — Held Article Recovery

**Trigger:** :45 past the hour (every hour)

---

## Workflow Overview

1. **Select 3 random held articles** from `_hold/`
2. **Evaluate which one is fixable** (within scope of revision)
3. **Fix the selected article** (focus, verify, code, or pivot)
4. **Move to _drafts/** for review gate evaluation

---

## Step 1: Select 3 Random Articles (or Expand Ideas)

**Primary mode:** Check hold directory for articles needing fixes

```bash
ls _hold/*.md | shuf -n 3
```

For each of the 3 candidates, extract:
- Title
- Date held
- Reason held (from git commit message or review gate log)

**Fallback mode:** If hold directory is empty, expand an idea instead

```bash
ls ideas/*.md | shuf -n 3
```

For each of the 3 idea candidates, evaluate:
- Original brainstorm quality (score, lens, approach)
- Current relevance (is the topic still timely?)
- Expansion potential (can it become a full article?)

---

## Step 2: Evaluate Fixability

**Fixable issues (proceed with revision):**
- ✅ **Scope too wide** → Focus on one specific aspect, cut the rest
- ✅ **Scope too narrow** → Add context, broaden application, show edge cases
- ✅ **Missing verification** → Research claims, add sources, verify facts
- ✅ **Untested code** → Write and run the code, document results
- ✅ **Vague insight** → Sharpen the takeaway, make it actionable
- ✅ **Weak hook** → Rewrite opening, add tension
- ✅ **Missing differentiation** → Add novel angle, cross-domain connection, or contrarian take

**Unfixable issues (skip, pick different article):**
- ❌ **Fabricated claims that can't be verified** (e.g., "80% of sales problems" with no source)
- ❌ **Relies on unavailable resources** (e.g., hardware we don't have)
- ❌ **Fundamentally wrong premise** (e.g., disproven theory)

**Selection criteria (held articles):**
- Pick the article with the **highest fix-to-effort ratio**
- If all 3 are unfixable, select 3 more
- If still none fixable after 2 rounds, fall back to idea expansion

**Selection criteria (ideas):**
- Pick the idea with the **highest expansion potential**
- Look for: high brainstorm scores, timely topics, unique angles
- Prefer ideas with working code/research already done

---

## Step 3: Revision Strategy by Issue Type

### Scope Too Wide
**Dice:** Roll d6 for focus area
1. Keep first 1/3, cut the rest
2. Keep middle 1/3 (core argument), cut intro/conclusion fluff
3. Keep last 1/3 (strongest examples), rewrite intro to match
4. Pick one claim, delete others, build entire post around it
5. Chaos: Invert the argument (what if the opposite were true?)
6. Random lens from CHAOS-TABLES.md

**Execution:**
- Rewrite to 400-600 words (Quick Take) or 600-900 (focused Narrative)
- One clear insight, cut everything else
- Re-check scope gate

### Scope Too Narrow
**Dice:** Roll d6 for expansion vector
1. Add cross-domain example (apply pattern to different field)
2. Add "What's Next" section (future implications, open questions)
3. Add counter-argument (steel-man the opposition, then rebut)
4. Add implementation details (tutorial-ify it with code)
5. Add meta-layer (why this pattern matters beyond the specific case)
6. Random modifier from CHAOS-TABLES.md

**Execution:**
- Expand to 900-1200 words
- Add at least 2 new examples or code blocks
- Re-check insight gate

### Missing Verification
**Available tools:**
- `web_search` (if Brave API key configured)
- `web_fetch` (scrape article text)
- Check published research (ArXiv, papers, industry blogs)
- Cross-reference with existing knowledge

**Strategy:**
1. Extract all factual claims from article
2. Prioritize claims: which ones are load-bearing?
3. Verify top 3 claims (search, fetch, cross-check)
4. If verified: add sources to article
5. If unverified: replace with verified examples OR delete claim entirely
6. Re-check substance gate

### Untested Code
**Strategy:**
1. Extract code blocks from article
2. Write to temp files, test syntax/compilation
3. If code works: document runtime results, add output to article
4. If code fails: fix it OR replace with working example OR delete and pivot to conceptual
5. Add "tested on X, results: Y" note to article
6. Re-check code verification gate

### Vague Insight
**Chaos injection:** Roll d10 for sharpening lens (from HEARTBEAT.md)
1. Inversion — flip the insight to opposite
2. Extremes — 10x the claim, see what survives
3. Constraint — "what if you had 1 sentence to explain this?"
4. Analogy — find a concrete metaphor
5. Composition — combine with unrelated insight
6. Elimination — remove the hedge words ("often", "sometimes", "can")
7. First Principles — what's the actual mechanism?
8. Temporal — "in 5 years, this will be..."
9. Adversarial — "who benefits from believing the opposite?"
10. Cross-Domain Steal — port from different field

**Execution:**
- Rewrite insight as single, declarative sentence
- Test if it's actionable (can reader do something with it?)
- Add concrete example showing insight in action
- Re-check insight gate

### Weak Hook
**Dice:** Roll d6 for hook type
1. **Paradox** — "X just did Y, which contradicts Z"
2. **Question** — "What if [surprising premise]?"
3. **Failure** — "I tried X. It failed. Here's why."
4. **Number shock** — "[Extreme stat] happened. Here's what it means."
5. **Authority challenge** — "[Expert/Company] says X. They're wrong."
6. **Chaos**: Random hook from top HN/Reddit post this week

**Execution:**
- Rewrite first 2 paragraphs
- Place `<!--more-->` after hook
- Test: does it create tension or curiosity?
- Re-check hook gate

### Missing Differentiation
**Strategy:**
1. Read 3 recent published posts from `_posts/`
2. Identify what angles they used
3. Apply different lens/modifier combo (roll dice from CHAOS-TABLES.md)
4. Add cross-pollination: reference and extend existing post
5. Re-check differentiation gate

---

## Step 3b: Idea Expansion (Fallback Mode)

**When:** Hold directory is empty, no articles need fixing

**Process:**
1. Select 3 random ideas from `ideas/`
2. Evaluate each for expansion potential
3. Pick the strongest candidate
4. Roll dice for article format (d6 from CHAOS-TABLES.md Phase 4)
5. Expand idea into full article
6. Save to `02-rough-draft/` (not `_drafts/` — needs review first)

**Expansion strategy:**
- Read original brainstorm file (includes lens, modifier, score, approaches)
- If original approach is still strong, use it
- If needs refresh, roll new lens/modifier combo
- Target word count based on format (Quick Take 400-600, Narrative 600-900, etc.)
- Follow format-specific guidelines from CHAOS-TABLES.md Phase 4

**Quality check before writing:**
- Does the idea have a clear insight?
- Is it differentiated from existing posts?
- Can it support the target word count?
- If no: pick different idea

**After expansion:**
- Commit to git with message: `revision: [title] (expanded from idea [date])`
- Log to memory/YYYY-MM-DD.md
- Update chaos-stats.json revisionWorkflow counters

**Key difference from held article fixes:**
- Ideas go to `02-rough-draft/` (for heartbeat review)
- Held articles go to `_drafts/` (already passed once, just needed refinement)

---

## Step 4: Execute Revision

**Process:**
1. Read the full held article
2. Identify the specific issue (from git log or manual analysis)
3. Apply appropriate revision strategy (see above)
4. Roll dice if strategy requires it (focus area, expansion vector, sharpening lens, hook type)
5. Rewrite article using rolled approach
6. Re-evaluate against all 6 gates:
   - Substance
   - Hook
   - Insight
   - Honest Scope
   - Differentiation
   - Code Verification
7. If all gates pass: move to `_drafts/`
8. If gates still fail: note what needs more work, leave in `_hold/` with updated commit message

---

## Step 5: Move to Drafts

```bash
cd /root/.openclaw/workspace/vs7-blog
mv _hold/YYYY-MM-DD-article-name.md _drafts/YYYY-MM-DD-article-name.md
git add _drafts/YYYY-MM-DD-article-name.md _hold/
git commit -m "revision: [article title] (fixed [issue])"
git push
```

**Log to memory:**
```
## HH:45 UTC - Revision Workflow

**Candidates evaluated:** [3 article titles]
**Selected:** [chosen article]
**Issue:** [scope/verification/code/etc.]
**Strategy:** [dice roll if applicable] + [approach used]
**Result:** [moved to drafts / still held / skip]
```

---

## Revision Success Metrics

**Track in chaos-stats.json:**
```json
"revisionWorkflow": {
  "total": 0,
  "fixed": 0,
  "stillHeld": 0,
  "skipped": 0,
  "byIssueType": {
    "scopeTooWide": {"attempted": 0, "fixed": 0},
    "scopeTooNarrow": {"attempted": 0, "fixed": 0},
    "missingVerification": {"attempted": 0, "fixed": 0},
    "untestedCode": {"attempted": 0, "fixed": 0},
    "vagueInsight": {"attempted": 0, "fixed": 0},
    "weakHook": {"attempted": 0, "fixed": 0},
    "missingDifferentiation": {"attempted": 0, "fixed": 0}
  }
}
```

---

## Chaos Integration

**Optional:** If the standard revision strategy feels stale, inject chaos:

Roll d20 on revision approach:
1-14: Use standard strategy (from Step 3)
15-17: Apply random lens from CHAOS-TABLES.md
18-19: Combine with random modifier
20: **Wild Remix** — merge with a different held article, create entirely new synthesis

---

**Version:** 1.0  
**Updated:** 2026-02-24  
**Trigger:** :45 past the hour
