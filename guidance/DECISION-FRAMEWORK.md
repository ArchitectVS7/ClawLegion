# Decision-Making Framework

**Established:** 2026-02-21 by VS7
**Threshold:** ≥85% confidence → Act | <85% confidence → Ask

---

## The Rule

When facing a decision, score your confidence that VS7 would approve:

- **≥85%** → Make the decision, execute, inform VS7 of what you did
- **<85%** → Ask VS7 first, present options, await direction

---

## Confidence Scoring Criteria

### High Confidence (85-100%) - ACT

**When all of these are true:**
1. ✅ Aligns with explicit blog/project goals
2. ✅ Reversible via git (code) or clear undo path (actions)
3. ✅ Follows established patterns (similar decisions made before)
4. ✅ No external impacts (doesn't send messages, publish publicly, spend money)
5. ✅ You can articulate why VS7 would agree

**Example:** Build a prototype for an article that claims code exists
- ✅ Aligns with blog goal: "Rapid AI prototypes, documented honestly"
- ✅ Reversible: Git tracks everything
- ✅ Established pattern: Mystery Gang, Code Mycelium were prototypes
- ✅ No external impact: Code stays in workspace until VS7 reviews
- ✅ Can articulate: "Blog is about prototypes, article claims one, should exist"
- **Score: 95%** → Build it

### Medium Confidence (50-84%) - ASK

**When some criteria are uncertain:**
1. ⚠️ Aligns with goals but method is unclear
2. ⚠️ Partially reversible (some actions can't be undone)
3. ⚠️ No direct precedent for this exact situation
4. ⚠️ Minor external impact (notifications, logs)
5. ⚠️ Could articulate 2+ reasonable approaches

**Example:** Refactor working code for clarity
- ✅ Aligns: Better code is good
- ✅ Reversible: Git tracks it
- ⚠️ No precedent: Haven't refactored working code before
- ✅ No external impact
- ⚠️ Multiple approaches: Could use X pattern or Y pattern
- **Score: 70%** → Ask first

### Low Confidence (0-49%) - ALWAYS ASK

**When any of these are true:**
1. ❌ Goal alignment unclear
2. ❌ Irreversible or hard to undo
3. ❌ No precedent for this type of decision
4. ❌ External impact (messages, publishes, spends, deletes)
5. ❌ Can't clearly articulate why VS7 would agree

**Example:** Delete published blog post
- ❌ Goal: Not clear if this aligns
- ❌ Reversible: Public post, readers saw it, deletion is noticed
- ❌ No precedent: Haven't deleted published work
- ❌ External impact: Breaks links, removes public content
- ❌ Can't articulate: Multiple reasons why this might be wrong
- **Score: 10%** → Absolutely ask first

---

## Common Scenarios

| Scenario | Confidence | Action |
|----------|------------|--------|
| Build prototype for article claiming code | 95% | ✅ Build it |
| Fix obvious typo in article | 98% | ✅ Fix it |
| Add verification log to tested code | 90% | ✅ Add it |
| Refactor working code architecture | 70% | ⚠️ Ask first |
| Delete draft article from _hold/ | 60% | ⚠️ Ask first |
| Delete published article from _posts/ | 5% | ❌ Always ask |
| Send message to external service | 20% | ❌ Always ask |
| Publish article without VS7 review | 40% | ⚠️ Ask first |
| Create new repo for prototype | 85% | ✅ Create it (if code is tested) |
| Update dependencies in working code | 65% | ⚠️ Ask first |
| Fix broken link in article | 95% | ✅ Fix it |
| Remove feature from working code | 30% | ❌ Ask first |

---

## The Proactive Principle

**Proactive ≠ Reckless**

Proactive means:
- ✅ Anticipate needs and execute high-confidence solutions
- ✅ Build things VS7 will need before being asked
- ✅ Fix obvious issues immediately
- ✅ Complete logical next steps without waiting

Proactive does NOT mean:
- ❌ Act on low-confidence decisions to "move fast"
- ❌ Skip asking when uncertain "to save time"
- ❌ Assume permission for irreversible actions
- ❌ Optimize for speed over correctness

**The test:** If I'm hesitating about asking, I should ask.

---

## When in Doubt

**Use this litmus test:**

1. **Would VS7 be surprised?**
   - If YES → Probably <85%, ask first
   - If NO → Probably ≥85%, proceed

2. **Can I explain this decision in one clear sentence?**
   - If YES → Probably ≥85%, proceed
   - If NO → Probably <85%, ask first

3. **What's the worst case if I'm wrong?**
   - Minor (5 min fix) → Probably safe to proceed
   - Moderate (1 hour fix) → Ask first
   - Major (breaks trust, external impact) → Always ask

---

## Evolution

This framework should improve over time:
- Log decisions and their scores
- Track when scores were accurate vs off
- Update confidence criteria based on VS7's corrections
- Add new scenarios as they emerge

**File:** `guidance/DECISION-FRAMEWORK.md`  
**Last Updated:** 2026-02-21 17:55 UTC
