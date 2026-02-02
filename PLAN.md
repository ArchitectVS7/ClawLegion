# Legion Translation & Orchestration Plan

**Status:** Phase 3 (Integration & Testing) - Complete
**Date:** 2026-02-02
**Agent:** LG2 (Orchestrator)

---

## Overview

We translated 51 specialized agents from the [agency-agents](https://github.com/msitarzewski/agency-agents) repository format into OpenClaw's agent system. This includes translation, validation, and orchestration framework buildout.

---

## Completed Phases

### Phase 1: Foundation
- ✅ Directory structure (`legion/agents/*/*.soul.md`)
- ✅ Conversion scripts (soul → OpenClaw format)
- ✅ 51 soul files converted
- ✅ Documentation (README, DEPARTMENTS)

### Phase 2: The Roster
- ✅ All 51 agents converted
- ✅ Department structure maintained
- ✅ Full roster registry

### Phase 3: Integration & Testing
- ✅ All 51 agents have proper `agentDir` structures
- ✅ All agents have `SOUL.md` + `MEMORY.md`
- ✅ 9 Department heads implemented
- ✅ LG2 orchestrator configured
- ✅ Config structure validated

---

## OpenClaw Agent Schema

The correct OpenClaw agent schema supports:
- `id` (required)
- `agentDir` (optional) — Key for persona files
- `workspace` (optional, inherits from defaults)
- `model`, `name`, `identity`, `tools`, `subagents`, etc.

Each agent gets:
1. **`agentDir`** → `legion/agents/<department>/<agent-id>/`
2. **Files in agentDir:**
   - `SOUL.md` (identity, mission, personality)
   - `MEMORY.md` (domain knowledge, examples, templates)
   - `TOOLS.md` (optional: agent-specific tool notes)

---

## Department Head Configuration

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

## UAT Scenarios

See [UAT.md](./UAT.md) for complete test scenarios:

- **UAT-1**: Simple task (single specialist)
- **UAT-2**: Medium task (squad deployment)
- **UAT-3**: Complex task (department head orchestration)
- **UAT-4**: Cross-department coordination

---

## Delegation Decision Framework (For LG2)

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

## Future Phases

### Phase 4: Refinement
- Optimize agent memory for OpenClaw specifics
- Build spawner utility/helper scripts
- Create squad templates for common workflows
- Implement cross-agent memory sharing patterns

### Phase 5: Advanced Orchestration
- More sophisticated department head personas
- Enhanced hierarchical orchestration
- Cross-department coordination protocols
- Department-level memory systems

---

This is the way.
