# Cyberscape Behavior Testing Oracle
**Date:** 2026-02-20 19:41 UTC  
**Source:** HN Story - "Testing Super Mario Using a Behavior Model Autonomously"  
**Dice Rolls:** d20=14 (HN), d6=4 (7d), lens=3 (Constraint), chaos=2 (Tool Restriction)

## Context
Hacker News featured an article on autonomous game testing using behavior models. Applied 1-hour constraint lens + tool restriction chaos modifier.

## Research Finding
**Original Article:** https://testflows.com/blog/testing-super-mario-using-a-behavior-model-autonomously-part1/

Key concept: Model game behavior as state machine → generate valid action sequences → verify expected outcomes autonomously.

## Divergent Brainstorm (5 Approaches)

### 1. Cyberscape Behavior Oracle ⭐ SELECTED
Build state machine model of Cyberscape hex grid interactions. Autonomous test agent executes valid moves and validates game state consistency.

**1-Hour MVP:**
- Model: Hex grid state (occupied/empty, agent positions)
- Actions: Move (6 directions), spawn agent, task assignment
- Assertions: No overlapping agents, valid pathfinding, energy conservation
- Output: Pass/fail report + state transition log

**Why Selected:**
- Novelty: 8/10 - Emerging technique for game testing
- Viability: 7/10 - Achievable prototype in 1 hour
- Impact: 9/10 - Directly supports Project Cyberscape
- Fun: 9/10 - Games + autonomous testing
- Chaos: 8/10 - Forces exploration of new testing frameworks

**Tool Restriction Applied:** Must use testing framework not used in past 7 days (candidates: Playwright, Puppeteer, TestFlows, Hypothesis property testing)

### 2. Autonomous Game Test Framework
Generic framework that plays browser games and validates expected behaviors.

**Pros:** Reusable across projects  
**Cons:** Less focused, harder to complete in 1 hour

### 3. Visual Regression Testing
Canvas snapshot + diff tool for detecting UI breaks in game development.

**Pros:** Visual feedback, catches rendering bugs  
**Cons:** Doesn't test game logic, only presentation

### 4. Gameplay Recording & Replay
Record user actions → replay → assert expected outcomes.

**Pros:** Captures real user flows  
**Cons:** Replay brittleness, setup overhead

### 5. Procedural Test Generator
Generate random valid game actions, verify state consistency.

**Pros:** Explores edge cases automatically  
**Cons:** Requires sophisticated input generation

## Implementation Plan (Selected Approach)

### Phase 1: Model Definition (15 min)
```javascript
// Cyberscape state model
const GameState = {
  hexGrid: Map<HexCoord, HexData>,
  agents: Map<AgentID, AgentState>,
  tasks: Map<TaskID, TaskState>
};

// Valid actions
const Actions = [
  'moveAgent(agentId, direction)',
  'spawnAgent(hexCoord, type)',
  'assignTask(agentId, taskId)',
  'completeTask(taskId)'
];

// Invariants to validate
const Invariants = [
  'no two agents occupy same hex',
  'agent positions are valid hex coordinates',
  'task assignments reference existing agents',
  'energy balance is non-negative'
];
```

### Phase 2: Test Harness (20 min)
- Set up Canvas environment (Playwright or Puppeteer)
- Inject state inspection hooks
- Implement action executor
- Capture state snapshots before/after actions

### Phase 3: Behavior Tests (20 min)
- Generate sequence of 100 random valid moves
- Execute each action
- Validate invariants after each step
- Log failures with state dump

### Phase 4: Reporting (5 min)
- Pass/fail summary
- State transition log (JSON)
- Failure replay instructions

## Expected Outcomes
- ✅ Catches invalid state transitions early
- ✅ Documents expected game behavior
- ✅ Enables continuous testing during development
- ✅ Foundation for more sophisticated testing (AI players, performance)

## Next Steps (If Approved)
1. Choose testing framework (Playwright recommended)
2. Create `/workspace/cyberscape-tests/` directory
3. Implement behavior model
4. Run initial test suite
5. Document findings in Cyberscape project folder

## Related Projects
- **Project Cyberscape** - Primary beneficiary
- **Healthcheck skill** - Could add game testing to health audit
- **OVI** - Could narrate test results ("Cyberscape tests passed with 3 warnings...")

## Tools to Explore (Tool Restriction Constraint)
- TestFlows (from original article)
- Hypothesis (property-based testing in Python)
- fast-check (property testing in JS)
- Puppeteer (haven't used for game testing yet)

---

**Status:** Awaiting approval from VS7  
**Estimated Time:** 1 hour (MVP), 4 hours (full test suite)  
**Chaos Level:** 🎲🎲🎲 (High - new tools, tight deadline, cross-pollination with research)
