# Brainstorm: Code Neighborhoods via CellTransformer Logic

**Source:** Quanta Magazine - "Fed on Reams of Cell Data, AI Maps New Neighborhoods in the Brain"  
**Date:** 2026-02-22 23:42  
**Lens:** Elimination  
**Modifier:** Scope Explosion  
**Format:** Narrative

## Core Research Finding

Neuroscientists built **CellTransformer**, an AI that maps brain neighborhoods by predicting cell identity from neighbors (not from intrinsic genetic profiles). Found 1,300+ subregions in mouse brain vs. 1,000+ hand-drawn regions. Key insight: Context predicts identity better than intrinsic properties.

## Elimination Brainstorm (5 Approaches)

1. **Eliminate "Neuroscience"** → Apply pattern to cities, orgs, codebases. Build prototype for GitHub repos (predict file purpose from imports/neighbors).
   - Score: 9, 8, 9, 8, 9 = **43** ⭐

2. **Eliminate Visual Maps** → Query model directly instead of rendering images. "What neighbors would X have in Y?"
   - Score: 7, 9, 7, 6, 7 = **36**

3. **Eliminate Static Measurement** → Map dynamic interactions (what cells *do together*) not static profiles (what they *are*).
   - Score: 8, 6, 8, 7, 8 = **37**

4. **Eliminate "Discovery" Frame** → Reframe as "context prediction from density" (like autocomplete). Not finding hidden structure; learning clustering rules.
   - Score: 8, 8, 7, 7, 7 = **37**

5. **Eliminate Scale Distinction** → 25-region vs. 1,300-region maps aren't granularity levels; they're resolution requirements for different problems.
   - Score: 6, 7, 6, 5, 6 = **30**

## Selected Approach

**Cross-Domain Pattern + Working Prototype**

Apply CellTransformer logic to codebases:
- Input: Files + imports + exports + directory structure
- Training: Mask file, predict from neighbors, check actual, update model
- Output: Code neighborhood map (not folder-based, context-based)

Discoveries:
- Hidden architectural boundaries (scattered implementations)
- Misplaced modules (wrong directory)
- Emergent subsystems (uncategorized clusters)
- Ambiguous zones (high coupling risk)

## Scope Explosion: Build the Prototype

**CodeNeighborhoodMapper** for Python repos:
- Parse import graphs
- Train transformer on file-neighbor relationships
- Cluster files by learned embeddings
- Surface hidden service boundaries in FastAPI monorepos

Target use case: AI agents need better maps than `tree src/` for architectural reasoning.

## The Larger Pattern

Universal: **Intrinsic labels lie; spatial relationships tell truth**

Applies to:
- Cities (building type from surroundings)
- Organizations (role from collaboration patterns)
- Social networks (account purpose from follows)
- Codebases (file purpose from import graph)

Algorithm: Cover node → Predict from neighbors → Learn clustering rules

## Article Execution

- Format: Narrative (600-900 words)
- Hook: "Neuroscientists found 1,300 neighborhoods. Your codebase has them too."
- Structure: Research → Pattern → Prototype → Universal principle
- Ending: Building proof-of-concept, seeking hairy codebases to test

Published to: `_drafts/2026-02-22-your-codebase-has-neighborhoods.md`
