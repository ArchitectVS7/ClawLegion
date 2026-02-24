# Tool Interface Design Brainstorm
**Session**: 2026-02-24 11:50 UTC  
**Source**: Hacker News (AI/ML)  
**Rolls**: d100=19 (HN), d6=4 (7d), d10=7 (First Principles), d6=2 (Tool Restriction), d6=5 (Comparison)

## Research Summary

Found article: "The Agent Harness Is the Architecture" by Evangelos Pappas
- Vercel case study: 15 tools → 2 tools, 80% → 100% success
- Manus: 4 rebuilds, progressive simplification, $2B Meta acquisition
- APEX-Agents: Models at 90%+ on benchmarks achieved ~24% on real work
- Convergence: OpenAI Codex, Claude Code, Manus all independently simplified

Key insight: Specialized tools become bottlenecks when models are capable of using primitives.

## Brainstormed Approaches

### 1. Direct Harness vs Model Comparison
**Concept**: Compare two teams:
- Team A: GPT-4o + minimal harness
- Team B: GPT-4 + sophisticated harness
Show which wins in production tasks.

**Lens Application (First Principles)**: Strip to fundamentals—is it the model or the infrastructure?

**Modifier (Tool Restriction)**: Restrict Team A to only basic tools.

**Score**: 
- Novelty: 6 (direct but not surprising)
- Viability: 8 (testable)
- Impact: 7 (useful but expected)
- Fun: 5 (straightforward)
- Diversity: 5 (stays in expected territory)
- **Total: 31/50**

### 2. What Is a Tool? (First Principles Decomposition) ✓
**Concept**: Strip back to interface fundamentals. Compare:
- Abstract tools (custom schemas, domain-specific)
- Primitive tools (bash, SQL, standard interfaces)

Show why primitives win: training data distribution, decision space, composability.

**Lens Application (First Principles)**: What IS a tool at the fundamental level? Interface contract.

**Modifier (Tool Restriction)**: Examine tools by restricting to their core properties.

**Score**:
- Novelty: 8 (fresh framing)
- Viability: 7 (concrete examples exist)
- Impact: 8 (changes how people design tools)
- Fun: 7 (interesting angle)
- Diversity: 7 (cross-domain insight)
- **Total: 37/50** ← SELECTED

**Why This Won**: Highest combined score. Applies First Principles perfectly by asking "what is a tool?" Respects Tool Restriction by examining interface properties. Fits Comparison format naturally.

### 3. One-Tool Agent Limit Test
**Concept**: Test the extreme: if you could only give your agent ONE tool, which wins?
- bash only
- filesystem only
- SQL only

Show task-by-task breakdown.

**Lens Application (First Principles)**: What's the minimal viable tool?

**Modifier (Tool Restriction)**: Literal tool restriction—only one.

**Score**:
- Novelty: 7 (interesting experiment)
- Viability: 6 (hard to test comprehensively)
- Impact: 6 (niche insight)
- Fun: 6 (clever constraint)
- Diversity: 6 (narrow focus)
- **Total: 31/50**

### 4. Zero-Tool Agent
**Concept**: Ultimate first principles—what if NO tools, just reasoning + output?
Compare:
- Zero-tool (pure generation)
- One-tool (bash)

Where does each fail? What does "tool" actually mean?

**Lens Application (First Principles)**: Strip everything—what's left?

**Modifier (Tool Restriction)**: Restrict to zero.

**Score**:
- Novelty: 9 (very surprising angle)
- Viability: 4 (impractical)
- Impact: 5 (philosophical more than practical)
- Fun: 7 (thought experiment)
- Diversity: 8 (way outside the box)
- **Total: 33/50**

### 5. Execution vs Reasoning Dichotomy
**Concept**: Compare two failure modes:
- Can't figure out what to do (reasoning failure)
- Knows what to do but can't orchestrate (execution failure)

Show modern agents fail on execution, not reasoning. This is the harness thesis in pure form.

**Lens Application (First Principles)**: Decompose failure into fundamental categories.

**Modifier (Tool Restriction)**: Restrict tools and see which failure emerges.

**Score**:
- Novelty: 7 (clear framing)
- Viability: 8 (observable in practice)
- Impact: 9 (core thesis)
- Fun: 6 (serious)
- Diversity: 6 (stays in AI domain)
- **Total: 36/50**

## Selected Approach Execution

**Article**: "What Is a Tool? Abstract vs Primitive Interfaces"
- Format: Comparison (abstract tools vs primitive tools)
- Hook: Vercel's counterintuitive result (fewer tools, better performance)
- Core insight: Primitives match training data, minimize decision space, compose naturally
- Practical test: "If you could only give your agent one tool, which would you choose?"
- Winner declared: Primitive tools (bash, SQL) beat abstract tools (custom APIs)

**Why This Works**:
1. Addresses a real production result (Vercel 80% → 100%)
2. Provides a first-principles framework (what IS a tool?)
3. Gives actionable advice (use tools humans already know)
4. Fits the comparison format naturally
5. Explains WHY the Vercel result happened (training distribution)

## Next Steps
- Written to `_drafts/2026-02-24-what-is-a-tool.md`
- Awaits review gate evaluation
- Update chaos-stats.json with this session