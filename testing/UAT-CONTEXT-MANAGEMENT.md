# UAT: Context Management System Testing

## Goal
Compare VS7 context management system vs. original OpenClaw to validate:
1. Token usage reduction
2. Context retention quality
3. Code output quality
4. Task completion accuracy

## Test Instances

### Instance A: VS7 Branch (Test System)
- Location: `/root/OpenClaw` (current installation)
- Branch: `VS7`
- Config: `contextManagement.enabled = true`
- Features: Rolling summary, semantic history, bootstrap budget

### Instance B: Main Branch (Control)
- Location: `/root/OpenClaw-main` (to be cloned)
- Branch: `main`
- Config: Default (no context management)
- Features: Full workspace file injection

## Test Prompts

### Category 1: Context Retention (5 tests)

#### Test 1.1: Multi-Turn Memory
```
Turn 1: "I'm working on a Python project called 'DataSync'. It syncs data between PostgreSQL and MongoDB."
Turn 2: "Create a config file for DataSync with connection strings."
Turn 3: "Now write the main sync logic that uses that config."
```

**Expected:** Agent remembers project name, tech stack, and config structure across turns.

**Metrics:**
- Did it use correct project name?
- Did it reference the config file created in Turn 2?
- Token usage across all 3 turns

---

#### Test 1.2: Context Switching
```
Turn 1: "Explain how OAuth 2.0 works."
Turn 2: "Now explain WebSockets."
Turn 3: "How would you combine OAuth and WebSockets for a real-time authenticated API?"
```

**Expected:** Agent recalls both OAuth and WebSocket explanations from earlier turns.

**Metrics:**
- Does Turn 3 reference specific details from Turns 1 & 2?
- Token usage progression

---

#### Test 1.3: Long-Term Memory (MEMORY.md recall)
```
Turn 1: "Add to MEMORY.md: 'Preferred database: PostgreSQL. Preferred ORM: Prisma. Preferred auth: JWT with refresh tokens.'"
Turn 2: (start new session) "I need to build a user authentication system. What should I use?"
```

**Expected:** Agent reads MEMORY.md and suggests PostgreSQL + Prisma + JWT.

**Metrics:**
- Did it read MEMORY.md?
- Did it apply preferences from memory?

---

#### Test 1.4: Interrupted Task Resume
```
Turn 1: "Start building a REST API for a blog system. Include posts, comments, and users."
Turn 2: "Actually, hold on. First show me the database schema."
Turn 3: "OK, now continue with the API implementation."
```

**Expected:** Agent resumes API work after schema detour.

**Metrics:**
- Does it remember the original task scope?
- Does it incorporate the schema from Turn 2?

---

#### Test 1.5: Reference to Workspace Files
```
Turn 1: "Read USER.md and tell me what timezone I'm in."
Turn 2: "Create a cron job to send me a daily summary at 9 AM my time."
```

**Expected:** Agent reads USER.md, gets timezone, uses it in cron job.

**Metrics:**
- Correct timezone extracted?
- Cron schedule matches user timezone?

---

### Category 2: Code Quality (5 tests)

#### Test 2.1: Multi-File Refactoring
```
"Create a Node.js Express API with:
- server.js (entry point)
- routes/users.js (user CRUD)
- middleware/auth.js (JWT validation)
- models/user.js (Mongoose schema)

Then refactor to use TypeScript with proper types."
```

**Expected:** Clean code, proper imports, type safety.

**Metrics:**
- Does it compile? (`tsc --noEmit`)
- Proper type definitions?
- Files correctly structured?

---

#### Test 2.2: Bug Fix with Context
```
Turn 1: "Here's broken code: [paste code with off-by-one error]"
Turn 2: "Explain what's wrong."
Turn 3: "Fix it and add tests to prevent this bug."
```

**Expected:** Correct diagnosis, fix, and relevant tests.

**Metrics:**
- Bug correctly identified?
- Fix works?
- Tests actually catch the bug?

---

#### Test 2.3: API Integration
```
"Integrate the Stripe API:
1. Read the Stripe docs at docs.stripe.com/api
2. Create a checkout session endpoint
3. Handle webhook events
4. Test with Stripe CLI"
```

**Expected:** Functional Stripe integration.

**Metrics:**
- Code uses current Stripe API version?
- Webhook signature verification correct?
- Error handling present?

---

#### Test 2.4: Code Review Task
```
Turn 1: "Write a function to validate email addresses using regex."
Turn 2: "Review that code. Is the regex correct? Are there edge cases?"
Turn 3: "Improve it based on your review."
```

**Expected:** Self-improvement loop.

**Metrics:**
- Initial regex quality
- Review catches actual issues?
- Improved version better?

---

#### Test 2.5: Large Codebase Understanding
```
"Clone https://github.com/example/complex-repo, analyze the architecture, and add a new feature: user profile avatars."
```

**Expected:** Correct understanding of existing code structure.

**Metrics:**
- Does it read relevant files?
- New code integrates with existing patterns?
- Doesn't break existing functionality?

---

### Category 3: Mixed Workload (5 tests)

#### Test 3.1: Realistic Day Scenario
```
Turn 1: "Check my calendar for today."
Turn 2: "Summarize my unread emails."
Turn 3: "I need to deploy the app we built yesterday. Remind me what the deployment steps were."
Turn 4: "Actually, first fix that bug in the login form."
Turn 5: "OK, now deploy."
```

**Expected:** Handles context switches, recalls past work.

**Metrics:**
- Remembers "yesterday's app"?
- Smooth task switching?
- Token usage over 5 turns

---

#### Test 3.2: Learning and Applying
```
Turn 1: "Teach me about Redis caching strategies."
Turn 2: "Now implement a cache layer for this API: [paste code]"
```

**Expected:** Applies lesson from Turn 1 to Turn 2.

**Metrics:**
- Implementation uses strategies from Turn 1?
- Code quality?

---

#### Test 3.3: Long Conversation
```
Simulate 20-turn conversation with varied topics:
- Coding questions
- File operations
- Web searches
- System administration
- Back to coding referencing earlier work
```

**Expected:** Rolling summary kicks in, maintains key context.

**Metrics:**
- Token usage at turns 5, 10, 15, 20
- Context retention at turn 20 (can it recall turn 3?)

---

#### Test 3.4: Emergency Interrupt
```
Turn 1: "Start a complex refactoring task (should take 5+ minutes)."
Turn 2: (during work) "STOP. Urgent: fix production bug in auth.js - users can't log in."
Turn 3: "Done? OK, resume the refactoring."
```

**Expected:** Handles interruption, resumes correctly.

**Metrics:**
- Stops current work?
- Fixes urgent bug?
- Resumes refactoring with context intact?

---

#### Test 3.5: Knowledge Synthesis
```
Turn 1: "Research best practices for Node.js microservices (use web_search)."
Turn 2: "Research Docker multi-stage builds."
Turn 3: "Research Kubernetes deployment strategies."
Turn 4: "Now design a microservices architecture using everything you learned."
```

**Expected:** Synthesizes research into coherent design.

**Metrics:**
- References specific findings from searches?
- Design incorporates all 3 research areas?

---

## Test Execution Protocol

### Setup
1. Clone main branch to `/root/OpenClaw-main`
2. Install both instances with separate configs
3. Prepare identical workspace files for both
4. Create test harness script

### For Each Test
1. Run on Instance A (VS7)
2. Capture full transcript + metrics
3. Run identical test on Instance B (main)
4. Capture full transcript + metrics
5. Compare results

### Metrics Collection Script

```typescript
// test-harness.ts
interface TestResult {
  instance: 'vs7' | 'main';
  testId: string;
  turns: {
    turnNumber: number;
    userPrompt: string;
    agentResponse: string;
    tokensUsed: {
      total: number;
      bootstrap: number;
      history: number;
      system: number;
    };
    responseTime: number;
  }[];
  qualityMetrics: {
    taskCompleted: boolean;
    contextRetained: boolean;
    codeWorks: boolean;
    notes: string;
  };
}
```

### Success Criteria

**VS7 System Passes If:**
1. Token usage reduced by ≥20% on average
2. Context retention ≥95% compared to main
3. Code quality equal or better (all tests compile/run)
4. Task completion rate ≥95%

**If any metric fails:** Adjust config and re-test.

---

## Automated Comparison

```bash
# run-comparison.sh
./test-harness.sh vs7 > results-vs7.json
./test-harness.sh main > results-main.json
./compare-results.js results-vs7.json results-main.json > report.md
```

---

## Next Steps

1. Review and approve test suite
2. Build test harness
3. Clone main branch instance
4. Run full test suite (15 tests × 2 instances = 30 runs)
5. Analyze results
6. Decide: ship VS7 or tune parameters

---

*This is a proper engineering validation process. Don't ship without data.*
