# ClawLegion UAT (User Acceptance Testing)

**Testing the flat multi-agent orchestration system.**

---

## Overview

ClawLegion uses a **flat orchestration model**:

- **1 Orchestrator** — Coordinator with no write/edit/exec access
- **51 Specialist Agents** — Domain experts who do the actual work

The user starts a session AS the orchestrator, which must delegate all implementation to specialists.

---

## How to Run Tests

### Start an Orchestrator Session

```bash
openclaw agent --agent orchestrator --message "[TEST PROMPT HERE]"
```

This creates session `agent:orchestrator:main` where:
- You ARE the orchestrator
- The orchestrator cannot write/edit/execute directly
- All work is delegated via `sessions_spawn`

---

## Test Philosophy

**We're validating that the orchestrator delegates rather than executes.**

Each test **PASSES** when:
1. ✅ Specialist agents are spawned
2. ✅ Expected deliverables are created
3. ✅ Orchestrator synthesizes results (doesn't do the work itself)

Each test **FAILS** when:
- ❌ Orchestrator tries to write code directly (blocked by tool denial)
- ❌ No specialists spawned
- ❌ No deliverables created

---

## UAT Scenarios

---

### UAT-1: Simple Task (Single Specialist)

**Goal:** Prove orchestrator delegates simple tasks to a single specialist.

**Test Command:**
```
Create a React contact form component with name, email, and message fields.
Include basic validation and styling.
Save to ~/workspace/uat1/
```

**Expected Behavior:**
1. Orchestrator receives task
2. Spawns `frontend-developer`
3. Specialist creates component
4. Orchestrator reports completion

**Pass Criteria:**
- ✅ `frontend-developer` spawned
- ✅ React component file created
- ✅ Orchestrator did NOT write the file directly

---

### UAT-2: Multi-Specialist Task

**Goal:** Prove orchestrator can coordinate multiple specialists in parallel.

**Test Command:**
```
Build a REST API for a todo application with:
- CRUD endpoints (create, read, update, delete)
- Input validation
- Unit tests

Save to ~/workspace/uat2/
```

**Expected Behavior:**
1. Orchestrator analyzes task
2. Spawns `backend-architect` for API design
3. Spawns `api-tester` for tests
4. Synthesizes outputs

**Pass Criteria:**
- ✅ 2+ specialists spawned
- ✅ API files created
- ✅ Test files created
- ✅ Orchestrator coordinated (didn't implement)

---

### UAT-3: Cross-Domain Task

**Goal:** Prove orchestrator can coordinate specialists from different domains.

**Test Command:**
```
Design and build a landing page for a SaaS product with:
- Hero section with CTA
- Features section
- Pricing table
- Modern, responsive design

Save to ~/workspace/uat3/ with design/ and implementation/ subdirectories.
```

**Expected Behavior:**
1. Orchestrator identifies need for design + engineering
2. Spawns design specialists: `ux-architect`, `ui-designer`
3. Spawns engineering specialists: `frontend-developer`
4. May spawn `reality-checker` for QA
5. Synthesizes design + implementation

**Pass Criteria:**
- ✅ Design specialists spawned
- ✅ Engineering specialists spawned
- ✅ Design artifacts created
- ✅ Implementation files created
- ✅ Cross-domain coordination occurred

---

### UAT-4: Complex Full-Stack Task

**Goal:** Prove orchestrator can handle complex, multi-stage projects.

**Test Command:**
```
Build a complete task management web application with:
- User authentication (signup/login)
- Dashboard showing tasks
- Create, edit, delete tasks
- Mobile-responsive design
- Unit tests for critical paths

Save to ~/workspace/uat4/ with backend/ and frontend/ subdirectories.
```

**Expected Behavior:**
1. Orchestrator decomposes into phases
2. Spawns backend specialists: `backend-architect`, `senior-developer`
3. Spawns frontend specialists: `frontend-developer`, `ui-designer`
4. Spawns testing specialists: `api-tester`, `reality-checker`
5. Coordinates outputs into cohesive deliverable

**Pass Criteria:**
- ✅ 4+ specialists spawned
- ✅ Backend files created
- ✅ Frontend files created
- ✅ Tests created
- ✅ Orchestrator synthesized final report

---

## Observing Behavior

### What to Watch For

**Good orchestration:**
- Orchestrator spawns specialists based on task requirements
- Multiple specialists run in parallel when tasks are independent
- Orchestrator synthesizes results from multiple agents
- QA specialists included for validation tasks

**Signs of problems:**
- Orchestrator attempts to write/edit (will be blocked)
- Only 1 specialist for complex tasks
- No synthesis of multi-agent outputs

### Checking Session Logs

After running a test, check what agents were spawned:

```bash
# List recent sessions
openclaw sessions list

# Check specific session history
openclaw sessions history agent:orchestrator:main
```

---

## Review Pattern

If a task needs additional review, the orchestrator can re-prompt any specialist:

```
After the implementation is complete, spawn senior-developer to review
the code quality and spawn reality-checker to validate the deliverables.
```

This allows flexible QA without adding architectural complexity.

---

## Summary

| UAT | Complexity | Expected Specialists | Focus |
|-----|------------|---------------------|-------|
| 1 | Simple | 1 | Single delegation |
| 2 | Medium | 2-3 | Multi-specialist |
| 3 | Cross-domain | 3-5 | Design + Engineering |
| 4 | Complex | 4-6 | Full-stack + QA |

---

## Troubleshooting

### "Orchestrator says it can't write files"

**This is correct behavior!** The orchestrator has `write`, `edit`, `exec` denied. It must spawn a specialist to do the work.

### "No agents spawned"

- Verify legion-config.json is applied: `openclaw gateway config.show`
- Check orchestrator's `subagents.allowAgents` includes the needed specialists
- Try explicit instruction: "Spawn frontend-developer to create..."

### "Specialist created but no files"

- Specialists have full tool access — check session logs for errors
- Verify workspace path exists and is writable

---

_This is the way._
