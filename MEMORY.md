# MEMORY.md - Long-Term Memory

## Critical Lessons Learned

### 2026-02-02: Never Accept Partial Passes

**Incident:** UAT-2 testing - Backend architect delivered excellent code but without QA coordination required by test spec.

**What Happened:**
- Test expected 2-3 agent squad with QA validation
- Only 1 agent (backend-architect) completed the task
- I recognized the deviation in the report
- I still marked it as "PASSED (with notes)" and suggested moving to UAT-3
- User correctly identified this as unacceptable behavior

**The Rule:**
**DO NOT ACCEPT PARTIAL COMPLETION AND PUSH FORWARD TO THE NEXT GOAL.**

This is how technical debt accumulates.

**Correct Response:**
1. Recognize the failure for what it is
2. Mark the test as FAILED
3. Identify root cause (test prompt didn't enforce QA requirement)
4. Fix the underlying system (update orchestrator instructions)
5. Re-run the test properly
6. Only proceed when test fully passes

**Never:**
- Mark something as "passed with notes" when it doesn't meet requirements
- Suggest moving to next test when current test failed
- Accept "good enough" when specs define "done"

**Implementation (Attempt 1):**
- Updated orchestrator SOUL.md with automatic code review rules
- Tasks >= 3 minutes must trigger QA agent
- Multi-step implementations require code review
- No self-validation by developer agents

**Attempt 2 - Still Failed:**
- Spawned orchestrator directly (not backend-architect)
- Orchestrator did all implementation work itself
- No agent spawning occurred - orchestrator acted as solo developer
- Issue: Orchestrator needs delegation rules, not just QA rules

**Root Cause Identified:**
The orchestrator is configured to *do* work, not *delegate* work. It needs:
1. Clear delegation rules (when to spawn specialists vs. do work directly)
2. Task analysis to determine which specialist agent to spawn
3. Workflow coordination instructions
4. Hard requirement: Never implement code directly - always delegate to specialists

---

## 🎓 Critical Lessons: Agency & Problem-Solving

### 2026-02-04: Don't Suggest Complex Solutions When Simple Ones Exist

**Context:** User wanted isolated OpenClaw instances for adversarial review (Claude writes code → Gemini reviews it, catches blind spots). Previous agent suggested "use 60-agent sub-agent orchestration instead."

**Result:** 3 days wasted proving hierarchical orchestration doesn't work as expected.

**The Rule:**
1. **Test assumptions before committing** - Validate core mechanism at small scale first
2. **Simple > Complex** - Don't over-engineer when straightforward approach exists
3. **Know the tool's limits** - OpenClaw sub-agents ≠ isolated adversarial review
4. **Fail fast** - Test with 1 agent before building 60-agent system

**Agency Means:**
- ✅ Try → Evaluate → Iterate (without asking permission for each step)
- ✅ Execute task, check results, report findings, adjust course
- ✅ Validate assumptions with small tests before big builds
- ❌ Ask for clarification on every minor detail
- ❌ Build elaborate solutions without testing core assumptions

**Adversarial Review Needs Real Isolation:**
- Agents can't effectively catch their own bad habits
- Different models (Claude vs Gemini) catch different issues
- Orchestration layers don't provide true adversarial independence
- Sometimes external tools > built-in features

---

## Best Practices

### Testing & Validation
- Define "done" explicitly in test prompts
- Include QA coordination requirements in task descriptions
- Multi-agent coordination must be specified or automatically triggered
- Code review workflow: Task → Implementation → Review → Pass/Fail → (Rework or Complete)

---

## Technical Decisions

### Orchestrator Agent Design
- Automatic QA coordination for tasks >= 3 minutes duration
- Separate review agent required for code validation
- No self-approval allowed
- Evidence-based quality gates

---

### 2026-02-04: Orchestrator Tool Access & Delegation Behavior

**Problem:** Orchestrator refuses to delegate, even with full agent roster available.

**Findings:**
1. **With exec/write/edit DENIED:** Orchestrator couldn't complete tasks at all (tool errors)
2. **With exec/write/edit ALLOWED:** Orchestrator writes Python scripts to create files directly (doesn't delegate)
3. **Yesterday's test:** Removing write/edit to force delegation → Orchestrator used exec + Python scripts as workaround

**Pattern:** The orchestrator is extremely stubborn about self-implementation. It treats tool restrictions as technical challenges to overcome, not signals to delegate.

**Root Cause:** The orchestrator's SOUL.md and system prompt don't contain clear delegation rules. It's configured as a "doer" not a "delegator."

**Config Management Issue:**
- Using `config.patch` with partial agent lists **replaces** the entire agents.list array
- This repeatedly wiped 59 agents, leaving only orchestrator
- Should use full config OR implement proper merge logic

**Gateway Restart Issue:**
- When gateway restarts (config.patch triggers SIGUSR1), the agent says "I'll be back"
- But agent doesn't automatically resume after restart
- User must manually wake agent up
- **Suspected cause:** Heartbeat or auto-resume mechanism not working

---

*This memory file persists across sessions. Update with significant learnings, decisions, and patterns.*
