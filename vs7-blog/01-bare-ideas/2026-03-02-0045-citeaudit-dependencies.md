# Brainstorm: CiteAudit → Hallucinated Dependencies

**Source:** HuggingFace Papers (rolled 15, AI/ML cluster)
**Time Range:** 7 days (rolled 4)
**Lens:** Cross-Domain Steal (rolled 10)
**Modifier:** Perspective Shift (rolled 5)
**Format:** Counter-Argument (rolled 4)

## Paper Summary

CiteAudit: Verifying scientific references in the LLM era (University of Notre Dame)

Key concept: LLMs hallucinate citations—papers that don't exist, or misrepresent papers that do. Build verification layer for academic references.

## Divergent Approaches (5 generated)

### 1. Citation Auditing → Code Review
Cross-domain steal from academic verification to software. Counter-argument: We audit code for bugs but not for "did you actually read the dependency?" Perspective: The dependency's POV.

**Score:** 35 (novelty: 7, viability: 8, impact: 7, fun: 6, diversity: 7)

### 2. The LLM Citation Problem is Worse for Agents
Perspective shift: Human academics cite without reading. LLM agents cite AND execute without reading. Counter-argument: Academic misconduct = career damage. Agent misconduct = production outages.

**Score:** 40 (novelty: 8, viability: 9, impact: 9, fun: 7, diversity: 7)

### 3. Trust Layers in Research → Trust Layers in Agents
Cross-domain steal: Academic research has peer review, replication, citation auditing. Agent systems have... what? Counter-argument: We built verification for human knowledge work, none for agent knowledge work.

**Score:** 41 (novelty: 9, viability: 7, impact: 9, fun: 8, diversity: 8)

### 4. Hallucinated Citations → Hallucinated Dependencies ✅
Cross-domain steal + perspective shift: LLMs hallucinate papers. Package managers pull dependencies that claim functionality they don't have. From dependency's POV: "They think I do X but I only do Y."

**Score:** 45 (novelty: 10, viability: 8, impact: 9, fun: 9, diversity: 9) **SELECTED**

### 5. Build CiteAudit for Agent Tool Calls
Cross-domain steal (benchmark): CiteAudit verifies citations. Build ToolAudit that verifies agents actually tested tools before using them. Counter-argument: Documentation ≠ reality.

**Score:** 38 (novelty: 9, viability: 6, impact: 8, fun: 8, diversity: 7)

## Why "Hallucinated Dependencies" Won

- Highest novelty score (10) - direct cross-domain parallel nobody talks about
- Strong perspective shift - gives voice to the dependency
- High fun factor (9) - uncomfortable truth people will recognize immediately
- Excellent diversity (9) - connects AI research, software engineering, trust systems
- Viable counter-argument structure (8) - academic integrity vs software reliability

## Article Execution

Format: Counter-Argument (500-700 words)
Hook: "LLMs hallucinate citations. Package managers pull hallucinated dependencies. Same problem, different domain."
Core thesis: We're building verification for LLM citations (CiteAudit) but ignoring identical problem in software dependencies
Evidence: README != reality, documentation drift, assumption-based integration
Conclusion: Treat dependency claims like we're starting to treat LLM citations—verify before trust

**Filename:** `2026-03-02-hallucinated-dependencies.md`
**Path:** `02-rough-draft/`

## Cross-Domain Pattern

Academic misconduct (cite without reading) → Software practice (import without testing)
Academic solution (CiteAudit) → Missing software solution (ToolAudit)
Academic stakes (reputation) < Software stakes (production outages)

The pattern: verification crisis in one domain predicts identical crisis in parallel domain.
