# UAT-2 Failure Analysis

**Test:** Medium Task (Squad Deployment)  
**Status:** ❌ FAILED (Multiple Attempts)  
**Date:** 2026-02-02

---

## Test Objective

Validate multi-agent coordination for medium-complexity tasks requiring developer + QA collaboration.

---

## Attempts Made

### Attempt 1: Direct Backend Spawn
- Spawned `backend-architect` directly
- Prompt included multi-agent coordination instructions
- Result: Agent performed self-review instead of spawning QA agent
- **Failure:** No multi-agent coordination occurred

### Attempt 2: Orchestrator Spawn (with updated QA rules)
- Updated orchestrator SOUL.md with automatic QA coordination rules
- Spawned `orchestrator` with backend task
- Result: Orchestrator implemented the API itself (16 file writes, 0 agent spawns)
- **Failure:** Orchestrator acted as solo developer, not coordinator

---

## Root Causes Identified

### 1. Orchestrator Not Configured for Delegation
**Issue:** The orchestrator agent is configured to *implement* work, not *delegate* work.

**Evidence:**
- Orchestrator has extensive backend/frontend implementation knowledge in SOUL.md
- No clear "delegate first, never implement" rule
- Specialist selection guide missing
- No delegation workflow examples

**Fix Applied:**
- Added "YOU ARE AN ORCHESTRATOR, NOT AN IMPLEMENTER" rule
- Added specialist selection guide (backend tasks → backend-architect, etc.)
- Added requirement: Always use sessions_spawn, never implement directly
- Added example workflow showing proper delegation + QA coordination

### 2. Test Prompts Too Vague
**Issue:** Test prompts don't explicitly enforce multi-agent requirement.

**Original prompt:** "Build a REST API... include proper error handling and validation"
- No mention of required agents
- No workflow specification
- Allows for solo implementation

**Better prompt:** "Analyze this backend task. Spawn backend-architect for implementation. Monitor completion. If task >= 3 minutes, spawn reality-checker for code review. Coordinate review workflow."

### 3. Specialist Agents Don't Have sessions_spawn Access
**Issue:** Backend-architect attempted to spawn reality-checker using CLI (`openclaw agent spawn`) instead of the `sessions_spawn` tool.

**Evidence:** Agent tried wrong spawning method, then fell back to self-review

**Potential Fix:**
- Grant sessions_spawn access to specialist agents for coordination
- OR: Require all coordination to go through orchestrator
- OR: Update specialist agent training to use correct spawn method

---

## Updated Orchestrator Configuration

### Added Rules:
1. **Never implement directly** - always delegate to specialists
2. **Task analysis** - determine which specialist(s) to spawn
3. **Use sessions_spawn tool** for all delegation
4. **Specialist selection guide:**
   - Backend/API → backend-architect
   - Frontend/UI → frontend-developer
   - Testing/QA → reality-checker or test-results-analyzer
   - Full-stack → spawn multiple specialists

5. **Automatic QA trigger:** Tasks >= 3 minutes must spawn review agent
6. **Workflow coordination:** Monitor completion, trigger QA, process review results

### Example Workflow Added:
Clear step-by-step example of handling a backend API task:
1. Analyze task
2. Spawn backend-architect with sessions_spawn
3. Monitor completion
4. Trigger QA (if >= 3 min)
5. Process review results
6. Deliver final result

---

## Lessons Learned

### Critical Insight:
**Partial passes accumulate technical debt.**

When tests don't fully meet requirements:
1. Mark as FAILED (not "passed with notes")
2. Identify root cause
3. Fix the system
4. Re-run the test
5. Only proceed when fully passing

### System Design Lesson:
**Orchestrators need explicit delegation rules, not just coordination rules.**

It's not enough to say "coordinate QA" - the orchestrator must:
- Know when to delegate vs. do work itself
- Have clear specialist selection rules
- Use proper spawning mechanisms
- Never fall back to solo implementation

---

## Next Steps

### Option A: Re-run UAT-2 with Updated Orchestrator
- Test the updated delegation rules
- Verify orchestrator spawns backend-architect
- Verify automatic QA coordination triggers
- Confirm multi-agent workflow completes

### Option B: Create Orchestrator-Specific UAT
- Design test specifically for orchestrator coordination
- Explicit multi-agent workflow requirement in prompt
- Test orchestrator's ability to analyze, delegate, coordinate

### Option C: Refactor Orchestrator Role
- Split orchestrator into:
  - Task analyzer (determines agents needed)
  - Agent coordinator (spawns and monitors specialists)
  - Quality gatekeeper (enforces QA requirements)

---

## Test Requirements for Next Attempt

To properly validate UAT-2, the orchestrator must:

1. ✅ Receive backend API task
2. ✅ Analyze task and determine backend-architect is needed
3. ✅ Spawn backend-architect using sessions_spawn tool
4. ✅ Monitor backend-architect completion
5. ✅ Detect task duration >= 3 minutes
6. ✅ Automatically spawn reality-checker for code review
7. ✅ Coordinate review workflow
8. ✅ Process PASS/FAIL decision from QA
9. ✅ Handle rework loop if FAIL (max 3 attempts)
10. ✅ Deliver approved result to user

**All 10 steps must occur for UAT-2 to pass.**

---

**This is the way.** ⚡
