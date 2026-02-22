# Adversarial Review Workflow for OpenClaw

**Generated:** 2026-02-20 07:41 UTC  
**Source:** Hacker News (AI Agent Hit Piece story)  
**Dice Rolls:** d20=14 (HN), d6=4 (7d), d6=3 (Constraint Lens)  
**Selected Approach:** 2-B - Adversarial Review Workflow

---

## The Inspiration

HN Story: "An AI Agent Published a Hit Piece on Me" - highlights need for quality control and bias detection before public-facing AI outputs.

This directly relates to MEMORY.md lesson: "Adversarial Review Needs Real Isolation" - agents can't effectively catch their own bad habits.

---

## Brainstorm (Constraint Lens: 1-hour prototype)

### Option A: AI Ethics Check Skill
Pre-send review for public messages. Simple scoring system: tone, bias, factual claims.

### Option B: Adversarial Review Workflow ⭐ SELECTED
One agent writes → another agent critiques for bias/harm/quality → original agent revises.

**Why this wins:**
- Addresses real problem from our history (Claude writes code → Gemini reviews)
- Uses existing OpenClaw multi-agent capabilities
- 1-hour constraint means: simple 2-agent workflow, not complex orchestration
- High impact: prevents embarrassing/harmful outputs

### Option C: Meta-Reflection Blog Post
"What LG2 learned from the hit piece incident" - quick writeup.

### Option D: Tone Analyzer Pre-Flight Check
Scan outbound messages for emotional language, aggressive phrasing, unsubstantiated claims.

### Option E: Ethical Decision Tree Template
Prompt template with yes/no gates: "Is this factual? Is this fair? Is this necessary?"

---

## 1-Hour Implementation Plan

**Step 1:** Create `adversarial-review` skill folder
**Step 2:** Write SKILL.md with simple 2-agent pattern:
- Agent 1 (Writer): Generates content
- Agent 2 (Critic): Reviews for bias, tone, accuracy
- Iteration: Writer revises based on feedback
**Step 3:** Create example workflow script
**Step 4:** Test with mock scenario (e.g., writing a critical technical review)

**Time budget:**
- 15 min: Skill structure + SKILL.md
- 20 min: Example workflow script
- 15 min: Test run with real content
- 10 min: Documentation + commit

---

## Next Steps

1. Get VS7 approval
2. Build the skill
3. Test on real OpenClaw use cases (external messaging, blog posts, etc.)
4. Integrate into standard workflow for public-facing content

---

**Score:** Novelty ★★★★☆ | Viability ★★★★★ | Impact ★★★★★ | Fun ★★★☆☆ | Chaos ★★★☆☆ | **Total: 19/25**
