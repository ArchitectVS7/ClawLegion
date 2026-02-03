# UAT Verification Scripts

## Overview

Automated verification scripts to validate ClawLegion orchestration behavior.

**What they check:**
1. ✅ Agent delegation (were specialists/department heads spawned?)
2. ✅ Deliverable creation (were files created in workspace?)
3. ✅ Orchestration pattern (right number and type of agents?)

---

## Quick Start

### Run Individual UAT Verification

```bash
cd /root/.openclaw/workspace/legion

# Verify UAT-1 variant A
./verify-uat-1.sh A

# Verify UAT-2 variant B
./verify-uat-2.sh B

# Verify all 4 UATs (variant A)
./verify-all-uats.sh A
```

---

## Available Scripts

| Script | Purpose | Pass Criteria |
|--------|---------|---------------|
| `verify-uat-1.sh` | Single specialist delegation | 1+ specialist spawned + component file created |
| `verify-uat-2.sh` | Squad deployment (2-4 agents) | Department head OR 2+ specialists + QA + API files |
| `verify-uat-3.sh` | Multi-specialist (4+ agents) | Department head + 4+ specialists + backend + frontend files |
| `verify-uat-4.sh` | Cross-department coordination | Both heads + design + engineering specialists + artifacts |
| `verify-all-uats.sh` | Run all UAT verifications | All 4 UATs pass |

---

## Usage

### Individual UAT

```bash
./verify-uat-<N>.sh [A|B]
```

**Arguments:**
- `A` or `B` - Which variant to verify (default: A)

**Example:**
```bash
./verify-uat-1.sh A  # Verify UAT-1 variant A
./verify-uat-2.sh B  # Verify UAT-2 variant B
```

**Exit codes:**
- `0` - Test PASSED
- `1` - Test FAILED

---

### All UATs

```bash
./verify-all-uats.sh [A|B] [UAT_NUMBER]
```

**Arguments:**
- `A` or `B` - Which variant to verify (default: A)
- `UAT_NUMBER` - Run specific UAT only (default: all)

**Examples:**
```bash
./verify-all-uats.sh A       # Run all UATs, variant A
./verify-all-uats.sh B       # Run all UATs, variant B
./verify-all-uats.sh A 2     # Run only UAT-2, variant A
```

---

## Output Format

### Verification Checks

Each script performs 3-5 checks:

```
════════════════════════════════════════════════════════
  UAT-X Verification: [Test Name]
  Variant: A
════════════════════════════════════════════════════════

[1/N] Checking agent delegation...
────────────────────────────────────────────────────────
✅ PASS: Specialist agent(s) spawned:
   frontend-developer

[2/N] Checking deliverables...
────────────────────────────────────────────────────────
✅ PASS: Component file(s) created: 1
   /root/.openclaw/workspace/legion/UAT1/variant-A/component.jsx

...

════════════════════════════════════════════════════════
  SUMMARY
════════════════════════════════════════════════════════
  Passed: 3/3
  Failed: 0/3

✅ UAT-X Variant A: PASS
   Task delegation successful + deliverables created
```

---

## What Each UAT Verifies

### UAT-1: Single Specialist Delegation
**Checks:**
1. Specialist spawned (frontend-developer, ui-designer, etc.)
2. Component file created (.jsx, .js, .tsx, .ts)
3. Delegation occurred (subagent count > 0)

### UAT-2: Squad Deployment
**Checks:**
1. Department head OR 2+ specialists spawned
2. QA coordination (reality-checker, api-tester, etc.)
3. API files created
4. Squad pattern (2+ subagents)

### UAT-3: Multi-Specialist Coordination
**Checks:**
1. Department head spawned (head-engineering)
2. 4+ specialists spawned total
3. Both backend AND frontend specialists
4. QA validation
5. Full-stack deliverables (backend/ and frontend/ files)

### UAT-4: Cross-Department Coordination
**Checks:**
1. Both department heads spawned (head-design + head-engineering)
2. Design specialists spawned
3. Engineering specialists spawned
4. Design artifacts created
5. Implementation files created

---

## Troubleshooting

### "No agents spawned"

**Possible causes:**
- Orchestrator didn't delegate
- Agents not registered in config
- Orchestrator lacks `sessions_spawn` capability

**Solutions:**
- Use explicit spawn prompt: "Spawn the orchestrator and..."
- Verify agents loaded: `openclaw agents list`
- Check orchestrator SOUL.md for delegation rules

---

### "No files created"

**Possible causes:**
- Output path not specified in prompt
- Orchestrator lacks `write` or `exec` tools
- Task failed before completion

**Solutions:**
- Always specify output path: "Save to /root/.openclaw/workspace/legion/UAT1/variant-A/"
- Check orchestrator tool access
- Review session logs for errors

---

### "Wrong orchestration pattern"

**Possible causes:**
- Task complexity doesn't match expected pattern
- Orchestrator chose efficiency over delegation
- Prompt ambiguity

**Solutions:**
- Adjust prompt complexity
- Use explicit spawn instructions
- Review orchestrator's delegation criteria in SOUL.md

---

## Expected Outcomes

| UAT | Expected Agents | Min Spawns | Deliverables |
|-----|----------------|-----------|--------------|
| UAT-1 | frontend-developer or ui-designer | 1 | Component file |
| UAT-2 | head-engineering + specialists + QA | 2-4 | API files |
| UAT-3 | head-engineering + backend + frontend + QA | 5-8 | Backend + Frontend files |
| UAT-4 | head-design + head-engineering + specialists | 7-10 | Design + Implementation |

---

## CI/CD Integration

Run in automated pipelines:

```bash
#!/bin/bash
cd /root/.openclaw/workspace/legion

# Run all UATs and exit with failure if any fail
./verify-all-uats.sh A || exit 1

echo "All UATs passed! ✅"
```

---

## Manual Verification (Alternative)

If automated scripts don't work:

```bash
# Check spawned sessions
openclaw sessions list | grep subagent

# Count spawned agents
openclaw sessions list | grep -c subagent

# Check deliverables
find /root/.openclaw/workspace/legion/UAT1 -type f

# View session logs
openclaw sessions history <session-key>
```

---

**This is the way.** ⚡
