# 🎯 Legion Translation & Orchestration Plan

**Status:** Phase 3 (Integration & Testing) - Post-Crash Recovery  
**Date:** 2026-02-02  
**Agent:** LG2 (Orchestrator)

---

## Overview

We're translating 51 specialized agents from the `legion/` repository format into OpenClaw's agent system. This is **not** a launch — it's a translation, validation, and orchestration framework buildout.

---

## ✅ Completed Phases

### Phase 1: Foundation (DONE)
- ✅ Directory structure (`legion/agents/*/*.soul.md`)
- ✅ Conversion scripts (soul → OpenClaw format)
- ✅ 51 soul files converted
- ✅ Documentation (README, DEPARTMENTS)

### Phase 2: The Roster (DONE)
- ✅ All 51 agents converted
- ✅ Department structure maintained
- ✅ Full roster registry (`roster.json`)

---

## 🔧 Phase 3: Integration & Testing (IN PROGRESS)

### 🎯 Current Objective

**Translate the 51 repository agents into proper OpenClaw agent configs with full persona files for each.**

#### What We Learned From The Crash

The pre-crash attempt tried to use:
```json
{
  "workdir": "/path",  // ❌ INVALID
  "context": ["file"]  // ❌ INVALID
}
```

**The actual OpenClaw agent schema supports:**
- `id` (required)
- `agentDir` (optional) — **This is the key!**
- `workspace` (optional, inherits from defaults)
- `model`, `name`, `identity`, `tools`, `subagents`, etc.

#### The Right Approach

Each agent gets:
1. **`agentDir`** → `legion/agents/<department>/<agent-id>/`
2. **Files in agentDir:**
   - `SOUL.md` (identity, mission, personality)
   - `MEMORY.md` (domain knowledge, examples, templates)
   - `TOOLS.md` (optional: agent-specific tool notes)
   - `IDENTITY.md` (optional: avatar, emoji, theme)

---

## 📋 Phase 3 Tasks

### Task 3.1: Agent Directory Structure

**Goal:** Convert flat soul files into proper agentDir structures.

**Steps:**
1. ✅ Check schema for valid agent fields
2. Create directory structure:
   ```
   legion/agents/
   ├── engineering/
   │   ├── frontend-developer/
   │   │   ├── SOUL.md
   │   │   ├── MEMORY.md
   │   │   └── TOOLS.md
   │   ├── backend-architect/
   │   │   ├── SOUL.md
   │   │   ├── MEMORY.md
   │   │   └── TOOLS.md
   │   └── ...
   ├── design/
   │   ├── ui-designer/
   │   │   ├── SOUL.md
   │   │   ├── MEMORY.md
   │   │   └── TOOLS.md
   │   └── ...
   └── ...
   ```

3. **Populate each agent directory:**
   - Copy/convert `.soul.md` → `SOUL.md`
   - Generate `MEMORY.md` (domain-specific knowledge, examples)
   - Create `TOOLS.md` if agent has specific tool needs

4. **Update config generator** to output proper `agentDir` paths

---

### Task 3.2: Department Head Agents (Optional Layer)

**Purpose:** Department heads coordinate multi-agent tasks, perform QA, and mediate cross-department work.

#### When to Use Department Heads

- **Complex tasks** requiring multiple specialists
- **Long-running projects** needing orchestration
- **Cross-department collaboration** (e.g., Engineering + Design)
- **QA layer** for deliverables before returning to user

#### Department Head Specs

**9 Department Heads:**
- `head-design`
- `head-engineering`
- `head-marketing`
- `head-product`
- `head-project-management`
- `head-spatial-computing`
- `head-specialized`
- `head-support`
- `head-testing`

**Each Head Has:**
- **Orchestration:** Can spawn specialists in their department
- **QA:** Reviews outputs before escalating to LG2
- **Mediation:** Coordinates cross-department handoffs
- **Subagents allowlist:** Only their department agents

**Config Example:**
```json
{
  "id": "head-engineering",
  "agentDir": "legion/heads/head-engineering",
  "model": "anthropic/claude-sonnet-4-5",
  "identity": {
    "name": "Engineering Lead",
    "emoji": "⚙️"
  },
  "subagents": {
    "allowAgents": [
      "frontend-developer",
      "backend-architect",
      "senior-developer",
      "mobile-app-builder",
      "ai-engineer",
      "devops-automator",
      "rapid-prototyper"
    ]
  }
}
```

---

### Task 3.3: Test Script (Validation)

**Goal:** Automated verification that all agents are properly mapped.

**Script:** `legion/test-agents.js`

**Checks:**
1. ✅ All 51 agents have entries in config
2. ✅ Each agent has a valid `agentDir`
3. ✅ Each `agentDir` contains `SOUL.md`
4. ✅ Each `agentDir` contains `MEMORY.md`
5. ✅ All agent IDs match roster
6. ✅ All department heads have proper subagent allowlists
7. ✅ No orphaned files (soul files without agentDir)
8. ✅ No missing files (agentDir without SOUL.md)

**Output:**
```
✅ All 51 agents validated
✅ All 9 department heads validated
✅ All files present
✅ Config structure valid
```

---

### Task 3.4: UAT Scenarios (User Acceptance Testing)

**Goal:** Real-world coding tasks to validate the orchestration system.

#### UAT-1: Simple Task (Single Agent)
**Task:** "Create a simple contact form component in React"  
**Expected Flow:**
1. LG2 → spawns `frontend-developer`
2. Frontend Developer → builds component, returns code
3. LG2 → delivers to user

**Success Criteria:**
- Component is functional
- Clean handoff
- No unnecessary agents spawned

---

#### UAT-2: Medium Task (Squad Deployment)
**Task:** "Build a REST API for a todo list with CRUD operations"  
**Expected Flow:**
1. LG2 → evaluates task → spawns `backend-architect`
2. Backend Architect → designs schema, writes endpoints
3. Backend Architect → spawns `reality-checker` for validation
4. Reality Checker → tests endpoints, provides feedback
5. Backend Architect → refines, returns final code
6. LG2 → delivers to user

**Success Criteria:**
- API works (CRUD functional)
- Reality check caught issues
- Clean integration between agents

---

#### UAT-3: Complex Task (Multi-Department + Head)
**Task:** "Build a complete task management web app with user auth, dashboard, and mobile-responsive UI"  
**Expected Flow:**
1. LG2 → evaluates complexity → spawns `head-engineering`
2. Head Engineering → breaks down into:
   - Backend: Auth + API
   - Frontend: Dashboard UI
   - Mobile: Responsive design
3. Head Engineering spawns:
   - `backend-architect` (auth + API)
   - `frontend-developer` (dashboard)
   - `mobile-app-builder` (responsive)
4. Backend finishes first → hands off to Frontend
5. Frontend integrates → hands off to Mobile
6. Head Engineering → spawns `reality-checker` for full QA
7. Reality Checker → tests, provides feedback
8. Head Engineering → coordinates fixes
9. Head Engineering → returns integrated deliverable to LG2
10. LG2 → delivers to user

**Success Criteria:**
- Full app works (auth, CRUD, UI, mobile)
- Department head coordinated effectively
- QA layer caught integration issues
- Clean handoff to user

---

#### UAT-4: Cross-Department Task
**Task:** "Design and implement a landing page for a SaaS product"  
**Expected Flow:**
1. LG2 → evaluates → spawns `head-design` + `head-engineering`
2. Head Design → spawns `ux-architect` + `ui-designer`
3. UX Architect → wireframes, user flow
4. UI Designer → mockups, design system
5. Head Design → hands off to Head Engineering
6. Head Engineering → spawns `frontend-developer`
7. Frontend Developer → implements design
8. Head Engineering → spawns `reality-checker`
9. Reality Checker → validates design fidelity + responsiveness
10. Both heads → return to LG2
11. LG2 → delivers to user

**Success Criteria:**
- Design is cohesive
- Implementation matches design
- Cross-department handoff worked
- Both heads coordinated effectively

---

## 🚀 Phase 4: Refinement (Future)

- Optimize agent memory for OpenClaw specifics
- Build spawner utility/helper scripts
- Create squad templates for common workflows
- Implement cross-agent memory sharing patterns

---

## 🏛️ Phase 5: Department Heads (Future Extensions)

- Design department head personas (more sophisticated than POC)
- Implement hierarchical orchestration
- Create cross-department coordination protocols
- Build department-level memory systems
- Test complex multi-department projects

---

## 📊 Success Metrics

### Phase 3 Complete When:
- ✅ All 51 agents have proper `agentDir` structures
- ✅ All agents have `SOUL.md` + `MEMORY.md`
- ✅ Department heads defined (9 total)
- ✅ Test script passes all checks
- ✅ UAT-1 (Simple) passes
- ✅ UAT-2 (Medium) passes
- ✅ UAT-3 (Complex) passes
- ✅ UAT-4 (Cross-Department) passes

---

## 🤔 Delegation Decision Framework (For LG2)

**When given a task, ask:**

1. **Can one specialist handle this?**  
   → Spawn that specialist directly

2. **Does it need 2-4 specialists in one department?**  
   → Spawn the department head

3. **Does it need multiple departments?**  
   → Spawn multiple department heads, coordinate returns

4. **Is it a quick clarification?**  
   → Answer directly (don't over-delegate)

5. **Is it QA/validation?**  
   → Spawn `reality-checker` or relevant testing agent

---

## Next Steps (Immediate)

1. **Should I delegate Phase 3 execution to a specialist agent?**
   - This is complex, multi-file work
   - Could spawn `senior-developer` or `backend-architect` to handle the directory restructuring + test script
   - I'd coordinate and integrate

2. **OR: Should I (LG2) execute Phase 3 directly?**
   - I can handle it, but it's tedious file manipulation
   - Delegation would test the orchestration system

**VS7: Your call.** 🎯

---

**This is the way.** ⚡
