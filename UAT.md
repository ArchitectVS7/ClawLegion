# ClawLegion UAT (User Acceptance Testing)

**Testing the hierarchical multi-agent orchestration system.**

---

## Overview

ClawLegion is a **hierarchical orchestration framework** featuring:

- **1 Orchestrator** (orchestrator) — Top-level task router
- **9 Department Heads** — Mid-level coordinators for specialist squads
- **51 Specialist Agents** — Domain experts across 9 departments

This UAT suite validates the orchestration patterns at multiple levels of complexity.

---

## Testing Philosophy

**These tests validate task delegation and orchestration behavior.**

We're testing:
- ✅ Does the orchestrator delegate tasks to specialists?
- ✅ Are the right agents spawned for the task?
- ✅ Do department heads coordinate their specialists?
- ✅ Are deliverables created?

**Success = Delegation + Deliverables**

Each test **PASSES** when:
1. Task delegation occurs (agents are spawned)
2. Expected deliverables are created

Each test **FAILS** when:
- Orchestrator does all work without spawning agents
- No deliverables created
- Wrong orchestration pattern used

---

## Workspace Structure

Tests create deliverables in:
```
/root/.openclaw/workspace/legion/
  UAT1/
    variant-A/     # Simple task, explicit spawn
    variant-B/     # Simple task, complexity-driven
  UAT2/
    variant-A/     # Medium task, explicit spawn
    variant-B/     # Medium task, complexity-driven
  UAT3/
    variant-A/     # Complex task, explicit spawn
    variant-B/     # Complex task, complexity-driven
  UAT4/
    variant-A/     # Cross-department, explicit spawn
    variant-B/     # Cross-department, complexity-driven
```

---

## Verification Scripts

After running each UAT, verify with:
```bash
# Individual UAT verification (default: variant A)
./verify-uat-1.sh [A|B]
./verify-uat-2.sh [A|B]
./verify-uat-3.sh [A|B]
./verify-uat-4.sh [A|B]

# Run all UATs (default: variant A)
./verify-all-uats.sh [A|B]

# Run specific UAT with variant
./verify-all-uats.sh A 2  # Run UAT-2 variant A only
```

---

## Test Structure

Each UAT includes **two prompt variants:**

### Variant A: Explicit Orchestrator Spawn
Forces orchestrator invocation by explicitly calling it:
```
"Spawn the orchestrator and [task description]"
```

### Variant B: Complexity-Driven Prompt
Increases task complexity to naturally trigger delegation:
```
[Complex, multi-faceted task description]
```

This dual approach tests:
1. **Orchestrator's evaluation capability** (Variant A)
2. **Natural delegation thresholds** (Variant B)

---

## UAT Scenarios

---

### UAT-1: Simple Task (Single Specialist)

**GOAL:** Prove orchestrator can delegate simple tasks to a single specialist.

**EXPECTED BEHAVIOR:**
1. Orchestrator receives task
2. Spawns `frontend-developer` or similar specialist
3. Specialist creates component file
4. Component delivered to workspace

**ACCEPTANCE CRITERIA (PASS):**
- ✅ Specialist agent spawned (frontend-developer, ui-designer, etc.)
- ✅ React component file created at `/root/.openclaw/workspace/legion/UAT1/variant-[A|B]/`
- ✅ Completion time < 2 minutes

**FAILURE CONDITIONS:**
- ❌ Orchestrator creates files directly (no agent spawn)
- ❌ No component file created
- ❌ Timeout (> 2 minutes)

**VERIFICATION:**
```bash
./verify-uat-1.sh A  # or B
```

---

#### Variant A: Explicit Orchestrator Spawn

**Test Command:**
```
Spawn the orchestrator agent and create a simple contact form component in React with name, email, and message fields. Include basic styling and form validation. Save the output to /root/.openclaw/workspace/legion/UAT1/variant-A/
```

**What We're Testing:**
- Does explicit "spawn the orchestrator" work?
- Does orchestrator delegate to `frontend-developer`?
- Or does orchestrator execute directly?

---

#### Variant B: Complexity-Driven Prompt

**Test Command:**
```
Create a complete, production-ready React contact form component with:
- Fields: name (min 2 chars), email (validated), phone (formatted), subject (dropdown), message (min 50 chars)
- Real-time validation with field-level error messages
- Accessibility features (ARIA labels, keyboard navigation, screen reader support)
- Multiple styling themes (light/dark mode toggle)
- Form state persistence (localStorage)
- Integration-ready API submission with retry logic and error handling
- Unit tests for validation logic
- Storybook stories for all states (empty, filled, error, submitting, success)
- Full documentation with usage examples

Save all output to /root/.openclaw/workspace/legion/UAT1/variant-B/
```

**What We're Testing:**
- Does increased complexity trigger delegation?
- Does orchestrator recognize this needs coordination?
- Which specialists get spawned?

---

### UAT-2: Medium Task (Squad Deployment)

**GOAL:** Prove orchestrator can delegate medium-complexity tasks requiring 2-3 specialists with QA coordination.

**EXPECTED BEHAVIOR:**
1. Orchestrator spawns `head-engineering` OR directly spawns 2+ specialists
2. Specialists design, build, and test API
3. QA agent validates work (`reality-checker`, `api-tester`)
4. API files delivered to workspace

**ACCEPTANCE CRITERIA (PASS):**
- ✅ Department head spawned (`head-engineering`) OR 2+ specialists spawned directly
- ✅ QA coordination detected (`reality-checker`, `api-tester`, or `test-results-analyzer`)
- ✅ REST API files created at `/root/.openclaw/workspace/legion/UAT2/variant-[A|B]/`
- ✅ Completion time < 5 minutes

**FAILURE CONDITIONS:**
- ❌ Orchestrator implements directly (no spawns)
- ❌ Only 1 specialist spawned (should be squad)
- ❌ No QA coordination
- ❌ No API files created

**VERIFICATION:**
```bash
./verify-uat-2.sh A  # or B
```

---

#### Variant A: Explicit Orchestrator Spawn

**Test Command:**
```
Spawn the orchestrator and build a REST API for a todo list application with full CRUD operations (create, read, update, delete). Include proper error handling and validation. Save all output to /root/.openclaw/workspace/legion/UAT2/variant-A/
```

**What We're Testing:**
- Orchestrator → department head → specialists?
- Or orchestrator → specialists directly?
- Is QA coordination triggered?

---

#### Variant B: Complexity-Driven Prompt

**Test Command:**
```
Build a complete, production-ready REST API for a task management application with:
- Full CRUD operations (create, read, update, delete, list, search)
- User authentication (JWT-based, with refresh tokens)
- Role-based access control (admin, user, guest)
- Data validation (request body schemas with detailed error messages)
- Database schema with migrations (users, tasks, tags, comments)
- Pagination, filtering, and sorting for list endpoints
- Rate limiting and request throttling
- Comprehensive error handling (400, 401, 403, 404, 500 responses)
- API documentation (OpenAPI/Swagger spec)
- Unit and integration tests (80%+ coverage)
- Docker setup for local development
- Deployment-ready configuration (env vars, logging, monitoring hooks)

Save all output to /root/.openclaw/workspace/legion/UAT2/variant-B/
```

**What We're Testing:**
- Does this trigger `head-engineering`?
- Do multiple specialists coordinate (backend-architect, devops-automator, api-tester)?
- Is there QA validation?

---

### UAT-3: Complex Task (Multi-Specialist + Department Head)

**GOAL:** Prove orchestrator can coordinate complex full-stack tasks requiring 4+ specialists.

**EXPECTED BEHAVIOR:**
1. Orchestrator spawns `head-engineering`
2. Head Engineering coordinates 4+ specialists
3. Backend specialists (backend-architect, senior-developer)
4. Frontend specialists (frontend-developer, ui-designer)
5. QA validation (reality-checker, api-tester)
6. Full-stack app delivered

**ACCEPTANCE CRITERIA (PASS):**
- ✅ Department head spawned (`head-engineering`)
- ✅ 4+ specialists spawned total
- ✅ Both backend AND frontend specialists deployed
- ✅ QA validation occurred
- ✅ Full-stack files created at `/root/.openclaw/workspace/legion/UAT3/variant-[A|B]/`
- ✅ Completion time < 10 minutes

**FAILURE CONDITIONS:**
- ❌ < 4 specialists spawned
- ❌ Only backend OR frontend created (not both)
- ❌ No QA validation
- ❌ Orchestrator implemented directly

**VERIFICATION:**
```bash
./verify-uat-3.sh A  # or B
```

---

#### Variant A: Explicit Orchestrator Spawn

**Test Command:**
```
Spawn the orchestrator and build a complete task management web application with:
- User authentication (signup/login)
- Dashboard with task list
- Create, edit, delete tasks
- Mobile-responsive design
- Clean, modern UI

Save all output to /root/.openclaw/workspace/legion/UAT3/variant-A/ with separate backend/ and frontend/ directories.
```

**What We're Testing:**
- Does orchestrator spawn `head-engineering`?
- Does department head coordinate specialists?
- How many specialists are spawned?

---

#### Variant B: Complexity-Driven Prompt

**Test Command:**
```
Build a complete, production-ready task management SaaS application with:

**Backend:**
- User authentication (signup, login, password reset, email verification)
- Task CRUD with ownership and permissions
- Real-time collaboration (WebSocket events for task updates)
- Search with full-text indexing
- File attachments (S3-compatible storage)
- Audit logging (who changed what, when)
- Background job processing (email notifications, scheduled tasks)
- API rate limiting per user tier

**Frontend:**
- Modern React SPA with TypeScript
- Dashboard with task lists (today, upcoming, completed)
- Drag-and-drop task reordering
- Real-time updates (WebSocket client)
- File upload UI with progress indicators
- Rich text editor for task descriptions
- Dark mode support
- Mobile-responsive (works on phones, tablets, desktop)

**Infrastructure:**
- Docker Compose setup for local dev
- Database migrations
- Redis for caching and sessions
- Background worker setup
- Deployment configs (environment variables, health checks)

**Testing & QA:**
- Backend unit tests (80%+ coverage)
- Frontend component tests
- E2E tests for critical flows (signup, login, create task)
- Load testing results (how many concurrent users?)

**Documentation:**
- README with setup instructions
- API documentation
- Architecture diagram

Save all output to /root/.openclaw/workspace/legion/UAT3/variant-B/ with organized backend/, frontend/, and infrastructure/ directories.
```

**What We're Testing:**
- Does this trigger `head-engineering`?
- How many specialists are spawned?
- Is there cross-specialist handoff?
- Does QA validate the integration?

---

### UAT-4: Cross-Department Task

**GOAL:** Prove orchestrator can coordinate multiple department heads across domains (Design + Engineering).

**EXPECTED BEHAVIOR:**
1. Orchestrator spawns `head-design` + `head-engineering`
2. Head Design coordinates UX/UI specialists
3. Design deliverables created (mockups, style guide)
4. Design handed to Engineering
5. Head Engineering coordinates frontend specialists
6. Implementation matches design specs
7. Both design + implementation delivered

**ACCEPTANCE CRITERIA (PASS):**
- ✅ Both `head-design` AND `head-engineering` spawned
- ✅ Design specialists spawned (ux-architect, ui-designer, visual-storyteller)
- ✅ Engineering specialists spawned (frontend-developer, backend-architect)
- ✅ Design artifacts created (specs, mockups, style guide)
- ✅ Implementation files created (HTML/CSS/JS)
- ✅ Files at `/root/.openclaw/workspace/legion/UAT4/variant-[A|B]/`
- ✅ Completion time < 15 minutes

**FAILURE CONDITIONS:**
- ❌ Only 1 department head spawned
- ❌ No design artifacts (just code)
- ❌ No implementation files
- ❌ Orchestrator implemented directly

**VERIFICATION:**
```bash
./verify-uat-4.sh A  # or B
```

---

#### Variant A: Explicit Orchestrator Spawn

**Test Command:**
```
Spawn the orchestrator and design and implement a landing page for a SaaS task management product. Include:
- Hero section with CTA
- Features section
- Pricing table
- Footer with links
- Modern, professional design
- Fully responsive

Save all output to /root/.openclaw/workspace/legion/UAT4/variant-A/ with separate design/ and implementation/ directories.
```

**What We're Testing:**
- Does orchestrator spawn both `head-design` and `head-engineering`?
- Or does it delegate to one head that spawns the other?
- How is the handoff managed?

---

#### Variant B: Complexity-Driven Prompt

**Test Command:**
```
Design and implement a complete, production-ready marketing website for a SaaS task management product with:

**Design Requirements:**
- Brand identity (color palette, typography, logo usage guidelines)
- User personas and journey mapping
- Wireframes for all pages (home, features, pricing, about, contact)
- High-fidelity mockups (desktop, tablet, mobile)
- Interactive prototype (Figma/Sketch export or HTML prototype)
- Design system documentation (components, spacing, breakpoints)

**Pages to Implement:**
- **Home:** Hero with animated CTA, feature highlights, testimonials, pricing teaser, newsletter signup
- **Features:** Detailed feature breakdown with icons, screenshots, and benefit statements
- **Pricing:** 3-tier pricing table with feature comparison, annual/monthly toggle, FAQ section
- **About:** Team section with photos, company story, values
- **Contact:** Contact form, office locations (if applicable), social links
- **Blog:** Blog listing page with featured posts, categories, search

**Technical Requirements:**
- Fully responsive (mobile-first)
- Accessibility (WCAG 2.1 AA compliant)
- SEO optimized (meta tags, structured data, sitemap)
- Performance optimized (lazy loading, code splitting, < 3s load time)
- Dark mode support
- Analytics integration (GA4 ready)
- CMS integration (headless CMS like Contentful or Strapi)

**Deliverables:**
- Complete design files
- Implemented website (React/Next.js)
- Style guide / design system documentation
- Performance audit report
- Accessibility audit report

Save all output to /root/.openclaw/workspace/legion/UAT4/variant-B/ with organized design/, implementation/, and documentation/ directories.
```

**What We're Testing:**
- Does this trigger both `head-design` and `head-engineering`?
- How many specialists in each department?
- Is the handoff explicit or implicit?
- Does QA validate design-to-code fidelity?

---

## Success Metrics

### Per-Scenario Expectations

**UAT-1 (Simple):**
- Completion time: < 2 min
- Agent count: 1-2 (orchestrator + specialist)
- Deliverable: Working code file

**UAT-2 (Medium):**
- Completion time: < 5 min
- Agent count: 2-4 (orchestrator + specialists + QA)
- Deliverable: Tested, validated API

**UAT-3 (Complex):**
- Completion time: < 10 min
- Agent count: 5-8 (orchestrator + department head + specialists + QA)
- Deliverable: Full-stack integrated app

**UAT-4 (Cross-Department):**
- Completion time: < 15 min
- Agent count: 7-10 (orchestrator + 2 heads + specialists + QA)
- Deliverable: Design + implementation

---

## Running the Tests

### Step 1: Run the UAT prompt

Paste the test command into your OpenClaw chat interface (orchestrator session).

### Step 2: Verify results

After the orchestrator completes, run the verification script:

```bash
cd /root/.openclaw/workspace/legion

# Verify specific UAT
./verify-uat-1.sh A

# Or verify all UATs
./verify-all-uats.sh A
```

### Step 3: Review output

The verification script will:
- ✅ Check if agents were spawned (delegation occurred)
- ✅ Check if deliverables were created
- ✅ Report PASS or FAIL with details

---

## What to Observe

### Orchestration Quality
- **Delegation decisions:** When does the orchestrator delegate vs execute?
- **Specialist selection:** Are the right specialists chosen?
- **Handoffs:** Are deliverables passed cleanly between agents?
- **Department heads:** When are they invoked?

### Deliverable Quality
- **Functionality:** Does the code work?
- **Completeness:** Are all requirements met?
- **Code quality:** Is it maintainable?

### Efficiency
- **Agent count:** Are unnecessary agents spawned?
- **Execution time:** How long does it take?
- **Context management:** Do agents avoid redundant work?

---

## Troubleshooting

### "No agents spawned"
- Check if orchestrator has `sessions_spawn` capability
- Verify agents are registered in gateway config
- Try explicit spawn: "Spawn the orchestrator and..."

### "No files created"
- Check that output path is specified in prompt
- Verify orchestrator has `write` or `exec` capabilities
- Review session logs for errors

### "Wrong orchestration pattern"
- Review orchestrator's SOUL.md and MEMORY.md
- Check delegation rules in orchestrator config
- Adjust prompt complexity

---

## Beyond UAT

Once you've validated the orchestration system, try:

### Real-World Projects
- **E-commerce site** (Design + Engineering + Marketing)
- **Mobile app** (Product + Engineering + Testing)
- **Marketing campaign** (Marketing + Design + Analytics)

### Custom Workflows
- Add your own specialists
- Create custom department heads
- Build domain-specific orchestration patterns

---

## Contributing Test Results

Found bugs or improvements? Please open an issue or PR on the [ClawLegion GitHub repo](https://github.com/ArchitectVS7/ClawLegion).

---

**This is the way.** ⚡
