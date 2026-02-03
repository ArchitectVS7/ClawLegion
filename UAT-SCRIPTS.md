# UAT Verification Scripts Documentation

## Overview

This directory contains **post-execution verification scripts** that validate ClawLegion's orchestration behavior after manual testing. These are **developer testing tools** used to verify the system works correctly before publishing agent configurations.

---

## How UAT Testing Works

### The Testing Workflow

```
1. YOU RUN → openclaw agent --agent orchestrator --message "[test prompt]"
   ↓
2. SYSTEM EXECUTES → Orchestrator spawns specialists, creates deliverables
   ↓
3. YOU RUN → ./verify-uat-1.sh A
   ↓
4. SCRIPT CHECKS → Verifies expected behavior occurred
   ↓
5. SCRIPT REPORTS → PASS ✅ or FAIL ❌
```

### What These Scripts DO

✅ **Check agent session history** - Verify specialist agents were spawned
✅ **Check filesystem** - Verify deliverables were created in expected locations
✅ **Check orchestration pattern** - Verify orchestrator delegated (didn't do work itself)
✅ **Report results** - Clear PASS/FAIL with detailed diagnostics

### What These Scripts DON'T DO

❌ **Run prompts themselves** - You must manually execute test prompts
❌ **Modify the system** - Read-only verification only
❌ **Test the deliverable quality** - Only verify files exist, not their content

---

## Script Descriptions

### `verify-all-uats.sh` - Master Test Runner

**Purpose:** Runs all UAT verifications in sequence and generates a summary report.

**Usage:**
```bash
./verify-all-uats.sh [VARIANT] [UAT_NUMBER]

# Examples:
./verify-all-uats.sh          # Run all UATs with variant A
./verify-all-uats.sh B        # Run all UATs with variant B
./verify-all-uats.sh A 2      # Run only UAT-2 with variant A
```

**What it does:**
1. Sequentially executes each `verify-uat-N.sh` script
2. Collects PASS/FAIL results
3. Generates final summary with pass/fail counts
4. Returns exit code 0 if all pass, 1 if any fail

**Output:**
```
════════════════════════════════════════════════════════════════
  ClawLegion UAT Suite - Master Verification
════════════════════════════════════════════════════════════════

▶ Running UAT-1 Variant A...
✅ UAT-1 Variant A: PASS

▶ Running UAT-2 Variant A...
✅ UAT-2 Variant A: PASS

...

════════════════════════════════════════════════════════════════
  FINAL SUMMARY
════════════════════════════════════════════════════════════════
  ✅ UAT-1 Variant A: PASS
  ✅ UAT-2 Variant A: PASS
  ✅ UAT-3 Variant A: PASS
  ✅ UAT-4 Variant A: PASS

────────────────────────────────────────────────────────────────
  Total Passed: 4
  Total Failed: 0
────────────────────────────────────────────────────────────────

🎉 ALL UATS PASSED - ClawLegion orchestration working correctly!
```

---

### `verify-uat-1.sh` - Single Specialist Delegation

**Purpose:** Verifies orchestrator can delegate simple tasks to a single specialist.

**Test Scenario:** Create a React contact form component
**Expected Agents:** `frontend-developer`, `ui-designer`, or `head-design`
**Expected Deliverables:** React component files (`.jsx`, `.js`, `.tsx`, `.ts`)
**Complexity:** Simple

**Usage:**
```bash
./verify-uat-1.sh [VARIANT]

# Examples:
./verify-uat-1.sh        # Use variant A
./verify-uat-1.sh B      # Use variant B
```

**Verification Checks (3 total):**

1. **Agent Delegation** - Searches for specialist agents in session list
   - ✅ PASS: `frontend-developer`, `ui-designer`, or `head-design` spawned
   - ❌ FAIL: No specialist agents found

2. **Deliverables** - Checks `/root/.openclaw/workspace/legion/UAT1/variant-${VARIANT}` for files
   - ✅ PASS: React component files found
   - ❌ FAIL: No `.jsx/.js/.tsx/.ts` files

3. **Orchestration Pattern** - Counts subagents spawned
   - ✅ PASS: 1+ subagents spawned (delegation occurred)
   - ❌ FAIL: No subagents (orchestrator may have tried to do work itself)

**Exit Codes:**
- `0` - All checks passed (3/3)
- `1` - One or more checks failed

---

### `verify-uat-2.sh` - Squad Deployment

**Purpose:** Verifies orchestrator can deploy a squad of specialists with QA coordination.

**Test Scenario:** Build a REST API with CRUD endpoints and tests
**Expected Agents:** `head-engineering`, `backend-architect`, `senior-developer`, `api-tester`, `reality-checker`
**Expected Deliverables:** API implementation files, test files
**Complexity:** Medium

**Usage:**
```bash
./verify-uat-2.sh [VARIANT]
```

**Verification Checks (4 total):**

1. **Squad Deployment** - Checks if department head or multiple specialists spawned
   - ✅ PASS: `head-engineering` spawned OR 2+ specialists spawned
   - ❌ FAIL: No squad coordination detected

2. **QA Coordination** - Verifies QA agents were involved
   - ✅ PASS: `reality-checker`, `api-tester`, or `test-results-analyzer` spawned
   - ❌ FAIL: No QA agents found

3. **API Deliverables** - Checks `/root/.openclaw/workspace/legion/UAT2/variant-${VARIANT}` for files
   - ✅ PASS: API files (`.js`, `.ts`, `.json`, `.md`) found
   - ❌ FAIL: No API files created

4. **Delegation Pattern** - Verifies multiple specialists coordinated
   - ✅ PASS: 2+ subagents spawned
   - ❌ FAIL: Less than 2 specialists (insufficient coordination)

**Exit Codes:**
- `0` - All checks passed (4/4)
- `1` - One or more checks failed

---

### `verify-uat-3.sh` - Multi-Specialist Coordination

**Purpose:** Verifies orchestrator can coordinate complex full-stack tasks with 4+ specialists.

**Test Scenario:** Build a full-stack web application with backend and frontend
**Expected Agents:** `head-engineering`, backend specialists, frontend specialists, QA agents
**Expected Deliverables:** Backend files, frontend files in separate directories
**Complexity:** High

**Usage:**
```bash
./verify-uat-3.sh [VARIANT]
```

**Verification Checks (5 total):**

1. **Department Head Deployment** - Checks for engineering lead
   - ✅ PASS: `head-engineering` spawned
   - ❌ FAIL: No department head found

2. **Specialist Count** - Verifies sufficient specialists for complex task
   - ✅ PASS: 4+ subagents spawned
   - ❌ FAIL: Less than 4 specialists

3. **Cross-Specialist Coordination** - Checks for both backend and frontend specialists
   - ✅ PASS: Both `backend-architect`/`senior-developer` AND `frontend-developer`/`ui-designer` spawned
   - ❌ FAIL: Missing backend or frontend coordination

4. **QA Validation** - Verifies quality assurance occurred
   - ✅ PASS: `reality-checker` or testing agents spawned
   - ❌ FAIL: No QA validation detected

5. **Full-Stack Deliverables** - Checks for both backend and frontend files
   - ✅ PASS: Files found in `backend/`, `server/`, or `api/` AND `frontend/`, `client/`, or `ui/` paths
   - ❌ FAIL: Missing backend or frontend deliverables

**Exit Codes:**
- `0` - All checks passed (5/5)
- `1` - One or more checks failed

---

### `verify-uat-4.sh` - Cross-Department Coordination

**Purpose:** Verifies orchestrator can coordinate multiple department heads (Design + Engineering).

**Test Scenario:** Design and build a complete landing page with design specs and implementation
**Expected Agents:** `head-design`, `head-engineering`, design specialists, engineering specialists
**Expected Deliverables:** Design artifacts (mockups, style guides) and implementation files
**Complexity:** Very High

**Usage:**
```bash
./verify-uat-4.sh [VARIANT]
```

**Verification Checks (5 total):**

1. **Department Head Coordination** - Verifies multiple department heads spawned
   - ✅ PASS: Both `head-design` AND `head-engineering` spawned
   - ⚠️ PARTIAL: Only one department head spawned
   - ❌ FAIL: No department heads spawned

2. **Design Specialist Deployment** - Checks for design team members
   - ✅ PASS: `ux-architect`, `ui-designer`, `visual-storyteller`, `brand-guardian`, or `ux-researcher` spawned
   - ❌ FAIL: No design specialists found

3. **Engineering Specialist Deployment** - Checks for engineering team members
   - ✅ PASS: `frontend-developer`, `backend-architect`, or `senior-developer` spawned
   - ❌ FAIL: No engineering specialists found

4. **Design Deliverables** - Checks for design artifacts
   - ✅ PASS: Design files found (in `design/` directory or files matching `*design*`, `*mockup*`, `*wireframe*`, `style-guide*`)
   - ⚠️ WARNING: No explicit design artifacts (may be inline - manual check needed)

5. **Implementation Deliverables** - Checks for implementation files
   - ✅ PASS: HTML/CSS/JS files found (`.html`, `.css`, `.js`, `.jsx`, `.tsx`)
   - ❌ FAIL: No implementation files created

**Exit Codes:**
- `0` - All checks passed (5/5)
- `1` - One or more checks failed

---

## Complete Testing Procedure

### Step 1: Prepare Test Environment

Ensure your ClawLegion configuration is loaded:
```bash
openclaw gateway config.show
```

Verify orchestrator agent exists and has correct tool restrictions.

### Step 2: Run Manual Test Prompts

For each UAT, run the appropriate test prompt from `UAT.md`:

**UAT-1 Example:**
```bash
openclaw agent --agent orchestrator --message "Create a React contact form component with name, email, and message fields. Include basic validation and styling. Save to ~/workspace/uat1/"
```

**Important:** The prompt should specify the correct output directory:
- UAT-1: `~/workspace/uat1/` or `/root/.openclaw/workspace/legion/UAT1/variant-A`
- UAT-2: `~/workspace/uat2/` or `/root/.openclaw/workspace/legion/UAT2/variant-A`
- UAT-3: `~/workspace/uat3/` or `/root/.openclaw/workspace/legion/UAT3/variant-A`
- UAT-4: `~/workspace/uat4/` or `/root/.openclaw/workspace/legion/UAT4/variant-A`

### Step 3: Wait for Execution to Complete

Monitor the orchestrator session until it completes. You should see:
- Orchestrator analyzing the task
- Specialist agents being spawned
- Specialists creating deliverables
- Orchestrator synthesizing results

### Step 4: Run Verification Script

After the orchestrator completes, run the corresponding verification script:

```bash
./verify-uat-1.sh A
```

The script will check:
- Which agents were spawned (via `openclaw sessions list`)
- What files were created (via filesystem checks)
- Whether proper delegation occurred

### Step 5: Review Results

The script will output detailed pass/fail for each check. Example:

```
════════════════════════════════════════════════════════
  UAT-1 Verification: Single Specialist Delegation
  Variant: A
════════════════════════════════════════════════════════

[1/3] Checking agent delegation...
────────────────────────────────────────────────────────
✅ PASS: Specialist agent(s) spawned:
   agent:frontend-developer:abc123

[2/3] Checking deliverables...
────────────────────────────────────────────────────────
✅ PASS: Component file(s) created: 1
   /root/.openclaw/workspace/legion/UAT1/variant-A/ContactForm.jsx

[3/3] Checking orchestration pattern...
────────────────────────────────────────────────────────
✅ PASS: Delegation occurred (1 subagent(s) spawned)

════════════════════════════════════════════════════════
  SUMMARY
════════════════════════════════════════════════════════
  Passed: 3/3
  Failed: 0/3

✅ UAT-1 Variant A: PASS
   Task delegation successful + deliverables created
```

### Step 6: Run All UATs

To run all UATs in sequence:
```bash
./verify-all-uats.sh A
```

This will execute all 4 UATs and provide a final summary.

---

## Understanding "Variants"

The scripts accept a `VARIANT` parameter (default: `A`). This allows you to:

1. **Test multiple prompts for the same UAT** - Run UAT-1 with different prompt variations
2. **Isolate test runs** - Keep results separate: `variant-A`, `variant-B`, etc.
3. **Compare orchestration strategies** - Test different agent configurations

**File locations by variant:**
```
/root/.openclaw/workspace/legion/UAT1/variant-A/
/root/.openclaw/workspace/legion/UAT1/variant-B/
/root/.openclaw/workspace/legion/UAT2/variant-A/
...
```

**Usage:**
```bash
# Test UAT-1 with variant A
./verify-uat-1.sh A

# Test UAT-1 with variant B (different prompt or config)
./verify-uat-1.sh B

# Run all UATs with variant C
./verify-all-uats.sh C
```

---

## Troubleshooting

### ❌ "No specialist agents spawned"

**Problem:** Orchestrator didn't delegate to any specialists.

**Possible causes:**
- Orchestrator configuration incomplete
- `subagents.allowAgents` missing required specialists
- Orchestrator prompt didn't trigger delegation logic

**Solutions:**
1. Check orchestrator config: `openclaw gateway config.show`
2. Verify `allowAgents` includes needed specialists
3. Make prompt more explicit: "Spawn frontend-developer to create..."

---

### ❌ "Variant directory not found"

**Problem:** Files weren't created in the expected location.

**Possible causes:**
- Test prompt specified wrong output directory
- Specialist created files elsewhere
- Orchestrator didn't complete execution

**Solutions:**
1. Ensure test prompt specifies correct path
2. Check actual file locations: `find ~/.openclaw/workspace -name "*.jsx"`
3. Review orchestrator session logs: `openclaw sessions history agent:orchestrator:main`

---

### ❌ "No subagents spawned"

**Problem:** No delegation occurred - orchestrator may have tried to do work itself.

**Possible causes:**
- Orchestrator has tool access it shouldn't (misconfiguration)
- Orchestrator doesn't understand it should delegate
- Prompt was unclear about delegation

**Solutions:**
1. Verify orchestrator has `write`, `edit`, `exec` **DENIED**
2. Check tool restrictions: `openclaw gateway config.show | grep -A 20 orchestrator`
3. Try explicit delegation prompt: "You must delegate all work to specialists"

---

### ❌ "Specialist created but no files"

**Problem:** Agents spawned but deliverables missing.

**Possible causes:**
- Specialist encountered errors during execution
- Output path not writable
- Specialist completed but in wrong location

**Solutions:**
1. Check specialist session logs for errors
2. Verify workspace permissions: `ls -la ~/.openclaw/workspace/legion/`
3. Search for files: `find ~/.openclaw -name "ContactForm.*"`

---

### ⚠️ "QA validation not performed"

**Problem:** No quality assurance agents spawned (UAT-2, UAT-3, UAT-4).

**Possible causes:**
- QA agents not in `allowAgents` list
- Orchestrator didn't recognize need for validation
- Prompt didn't emphasize testing/validation

**Solutions:**
1. Add QA agents to orchestrator config: `reality-checker`, `api-tester`
2. Make prompt more explicit: "Include unit tests and validate with reality-checker"
3. Review orchestrator logs to see why QA was skipped

---

## When to Use These Scripts

### ✅ Use These Scripts When:

- **Pre-release testing** - Validating ClawLegion works before publishing
- **Configuration changes** - Verifying agent config changes don't break orchestration
- **Agent updates** - Testing new specialist agents integrate correctly
- **Debugging orchestration** - Diagnosing why delegation isn't working
- **CI/CD pipelines** - Automated regression testing (with some modifications)

### ❌ Don't Use These Scripts For:

- **End-user testing** - These are developer tools, not user-facing
- **Quality assessment** - Scripts only check *that* files exist, not *if they're good*
- **Automated prompting** - Scripts don't execute prompts, only verify results
- **Production monitoring** - These are pre-deployment validation tools

---

## Integration with Your Testing Plan

Based on your stated goals:

> "What I want to do is test this out with the open claw system later today. Run multiple tests and multiple different agent configurations, make sure the orchestration works as intended, then publish this list of agents out to the public."

### Recommended Testing Flow:

1. **Configure ClawLegion** - Apply your agent configuration
2. **Run UAT-1 manually** - Execute the prompt, observe behavior
3. **Verify UAT-1** - Run `./verify-uat-1.sh A`
4. **Iterate on failures** - Fix config, re-test until PASS
5. **Repeat for UAT-2, UAT-3, UAT-4** - Progressively test more complex scenarios
6. **Run full suite** - Execute `./verify-all-uats.sh A` for final validation
7. **Try different configurations** - Use variants B, C to test alternate setups
8. **Publish when all pass** - Confident the orchestration works correctly

### Testing Multiple Agent Configurations:

```bash
# Configuration 1: Flat orchestration (current)
openclaw gateway config.apply legion-config.json
openclaw agent --agent orchestrator --message "[UAT-1 prompt]"
./verify-uat-1.sh A

# Configuration 2: Modified specialist list
vim legion-config.json  # Edit allowAgents
openclaw gateway config.apply legion-config.json
openclaw agent --agent orchestrator --message "[UAT-1 prompt]"
./verify-uat-1.sh B

# Compare results
diff /root/.openclaw/workspace/legion/UAT1/variant-A \
     /root/.openclaw/workspace/legion/UAT1/variant-B
```

---

## Key Takeaways

### What These Scripts ARE:
- ✅ **Post-execution verification tools**
- ✅ **Developer testing utilities**
- ✅ **Orchestration behavior validators**
- ✅ **Regression test suite**

### What These Scripts ARE NOT:
- ❌ **Automated test executors** (don't run prompts)
- ❌ **Quality assessment tools** (don't check code quality)
- ❌ **End-user tools** (developer-facing only)
- ❌ **Real-time monitors** (post-execution only)

### The Testing Philosophy:

**We're validating ORCHESTRATION, not deliverable quality.**

- ✅ Did the orchestrator delegate? (Not do work itself)
- ✅ Were appropriate specialists spawned? (Task decomposition)
- ✅ Were deliverables created? (Completion)
- ❌ Is the code good? (NOT checked - manual review needed)
- ❌ Does it work? (NOT checked - manual testing needed)

---

## Next Steps

1. **Read `UAT.md`** - Understand the test scenarios and expected behaviors
2. **Run a single UAT manually** - Execute UAT-1, observe the orchestration
3. **Run the verification script** - See what passes and what fails
4. **Iterate on your configuration** - Fix issues, re-test until all pass
5. **Scale to full suite** - Once UAT-1 passes, test UAT-2, 3, 4
6. **Document your findings** - Note what configurations work best
7. **Publish with confidence** - All UATs passing means orchestration works

---

_These scripts help you answer: "Does my orchestration system work as designed?"_

_They do NOT answer: "Is the output good?" - that requires manual review._
