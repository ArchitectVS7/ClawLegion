# Agent README Security Gap - Brainstorm

**Source:** Papers with Code / Hugging Face Papers (AI/ML cluster, 30 days)
**Finding:** "Agent READMEs: An Empirical Study of Context Files for Agentic Coding"

## Core Finding
- 2,303 agent context files from 1,925 repositories analyzed
- Developers prioritize functional context:
  - Build/run commands: 62.3%
  - Implementation details: 69.9%
  - Architecture: 67.7%
- **Major gap:**
  - Security: 14.5%
  - Performance: 14.5%
- Quote: "Developers use context files to make agents functional, but provide few guardrails to ensure agent-written code is secure or performant"

## Dice Context
- **Lens:** Constraint (d10=3) — Only 1 hour, 1 file, no dependencies - what survives?
- **Modifier:** Scope Explosion (d6=3) — Add 1 unexpected bonus feature
- **Format:** Narrative (d6=1) — Story-driven, 600-900 words

## Brainstormed Approaches

### 1. The Minimum Viable Security README
**Core idea:** One file, 10 lines max, must prevent the most common agent security mistakes.

**Constraint applied:** If you only had 10 lines in `.agent-security.md`, what would you include?

**Scope explosion:** The file also serves as executable validation (can be run as a pre-commit hook)

**Narrative angle:** Story from perspective of an agent that wrote vulnerable code because its README said nothing about security.

**Score:**
- Novelty: 7/10 (practical constraint)
- Viability: 9/10 (highly actionable)
- Impact: 7/10 (prevents real vulnerabilities)
- Fun: 6/10 (useful but not thrilling)
- Diversity: 7/10 (different from recent posts)
**Total: 36/50**

---

### 2. Security as First-Class README Section
**Core idea:** Agent READMEs should have security requirements BEFORE functional requirements.

**Constraint applied:** What if agents refused to execute until security constraints were defined?

**Scope explosion:** Auto-generate security constraints from codebase analysis (dependency vulnerabilities, API key patterns, SQL injection risk)

**Narrative angle:** Story of two agents: one reads functional requirements first (builds fast, ships vulnerable code), one reads security requirements first (builds slower, ships safe code).

**Score:**
- Novelty: 6/10 (priority inversion is common pattern)
- Viability: 7/10 (requires tool changes)
- Impact: 8/10 (directly addresses the 14.5% gap)
- Fun: 7/10 (compelling narrative)
- Diversity: 8/10 (different framing)
**Total: 36/50**

---

### 3. The README Linter That Blocks Agent Execution
**Core idea:** Pre-flight check that scans agent README for security/performance requirements. If missing, agent can't execute.

**Constraint applied:** No dependencies - pure regex/pattern matching, runs in <1 second.

**Scope explosion:** The linter also suggests missing requirements based on codebase analysis (e.g., "You have SQL queries but no SQL injection guidance").

**Narrative angle:** Story of an agent stuck at the gate, unable to execute, learning why security requirements matter.

**Score:**
- Novelty: 8/10 (enforcement angle novel)
- Viability: 9/10 (highly actionable, simple implementation)
- Impact: 9/10 (forces developers to think about security)
- Fun: 7/10 (satisfying enforcement mechanism)
- Diversity: 9/10 (tool-building angle different from recent posts)
**Total: 42/50** ✓

---

### 4. Security-by-Example READMEs
**Core idea:** Instead of abstract security requirements, show 3-5 concrete examples of vulnerable code vs secure code.

**Constraint applied:** Each example must fit in 10 lines, runnable, demonstrable.

**Scope explosion:** Examples are extracted from real CVEs in the project's dependency tree.

**Narrative angle:** Story of an agent learning security not from rules but from seeing what "bad" and "good" look like.

**Score:**
- Novelty: 7/10 (example-driven learning common)
- Viability: 8/10 (requires CVE database integration)
- Impact: 8/10 (concrete examples more actionable than abstract rules)
- Fun: 8/10 (real CVEs add weight)
- Diversity: 7/10 (tutorial-adjacent)
**Total: 38/50**

---

### 5. The Agent That Audits Its Own README
**Core idea:** Agent reads its README, then audits the code it writes against the requirements. If it violates its own security constraints, it rolls back and tries again.

**Constraint applied:** Self-audit loop runs in <5 seconds (no external API calls).

**Scope explosion:** The agent learns from its mistakes - updates its README with new constraints when it catches itself violating them.

**Narrative angle:** Meta-story: An agent becomes its own security reviewer, learning to write better READMEs by catching its own violations.

**Score:**
- Novelty: 9/10 (self-auditing loop novel)
- Viability: 6/10 (requires sophisticated agent architecture)
- Impact: 9/10 (self-improving security)
- Fun: 9/10 (meta-narrative compelling)
- Diversity: 9/10 (completely different angle)
**Total: 42/50** ✓

---

## Selection

**Tie between Approach 3 (README Linter) and Approach 5 (Self-Auditing Agent).**

**Tiebreaker:** Viability. Approach 3 is immediately implementable (regex linter, <100 LOC). Approach 5 requires sophisticated agent architecture that doesn't exist yet.

**Winner: Approach 3 - The README Linter That Blocks Agent Execution**

## Why This Won
- **Constraint lens perfectly applied:** No dependencies, <1 second execution, pure pattern matching
- **Scope explosion delivered:** Linter suggests missing requirements based on codebase patterns
- **Narrative format fits:** Story of agent stuck at gate, unable to execute without security requirements
- **Immediate impact:** Developers can build this today, deploy as pre-commit hook
- **Addresses core gap:** Forces the 85.5% who skip security requirements to define them

## Article Structure (Narrative)
1. **Opening:** Agent wakes up, reads README, ready to write code... blocked at the gate.
2. **The Gate:** README linter scans context file, finds no security requirements.
3. **The Suggestion:** Linter analyzes codebase, suggests: "You have 47 SQL queries but no SQL injection guidance."
4. **The Choice:** Developer can bypass (risky) or define requirements (safe).
5. **The Learning:** Agent gets through gate, writes secure code, nobody gets hacked.
6. **The Code:** Show the linter implementation (~80 LOC Python).
7. **The Impact:** This is the missing layer between "functional" (69.9%) and "secure" (14.5%).

**Hook:** "Your agent is stuck at the gate. It knows how to build. It doesn't know if it's allowed to ship."

**Key insight:** "Security requirements are gatekeeping, not guidance. Make the gate real."

---

**Total brainstorm time:** ~8 minutes
**Selected approach viability:** Immediately implementable
**Narrative strength:** Compelling, visual (agent at gate), actionable ending
