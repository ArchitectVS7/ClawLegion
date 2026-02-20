# Model Benchmark Suite

**Goal:** Compare Step 3.5 Flash vs Claude Sonnet 4.5 vs Qwen Coder on real coding tasks

## Test Tasks (Increasing Complexity)

### Task 1: Feature Addition (Low Complexity)
**Scenario:** Add a "dark mode toggle" button to a simple HTML page  
**Input:** Basic HTML page with inline CSS  
**Expected:** Button + JS that toggles dark/light theme  
**Time Limit:** 2 minutes  
**Scoring:** Does it work? Code quality? Implementation approach?

---

### Task 2: Refactoring (Medium Complexity)
**Scenario:** Refactor a messy Node.js Express API into clean, modular code  
**Input:** 200-line monolithic server.js with routes, DB logic, validation mixed together  
**Expected:** Separated routes, controllers, middleware, utils  
**Time Limit:** 5 minutes  
**Scoring:** Structure quality? Code readability? Preserved functionality?

---

### Task 3: Frontend Web Page (High Complexity)
**Scenario:** Build a complete "Task Manager" PWA from scratch  
**Input:** Requirements doc (features, design specs)  
**Expected:** React/Vue/Vanilla JS app with add/edit/delete/filter tasks, localStorage persistence  
**Time Limit:** 10 minutes  
**Scoring:** Feature completeness? UI quality? Code architecture?

---

## Models to Test

1. **Claude Sonnet 4.5** (`anthropic/claude-sonnet-4-5`) — Current default
2. **Qwen Coder** (`qwen-portal/coder-model`) — Current coding model
3. **Step 3.5 Flash** (`step-ai/step-3.5-flash`) — New OSS reasoning model

---

## Benchmark Process

1. **Setup:** Create task prompts + reference input files
2. **Execute:** Run each task x 3 models = 9 test runs
3. **Isolate:** Save outputs to `outputs/{model}/{task}/`
4. **Evaluate:** Score each output (1-10) on:
   - Correctness (does it work?)
   - Code quality (clean, maintainable?)
   - Completeness (all requirements met?)
   - Time taken (response latency)
5. **Report:** Generate comparison table + recommendations

---

**Status:** Setting up test harness now...
