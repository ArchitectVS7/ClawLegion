# 🧪 Legion UAT (User Acceptance Testing)

**Testing the hierarchical multi-agent orchestration system.**

---

## Overview

Legion is a **hierarchical orchestration framework** featuring:

- **1 Orchestrator** (lg2) — Top-level task router
- **9 Department Heads** — Mid-level coordinators for specialist squads
- **51 Specialist Agents** — Domain experts across 9 departments

This UAT suite validates the orchestration patterns at three levels of complexity:

1. **Simple** — Single specialist (direct spawn)
2. **Medium** — Multi-specialist squad (department head orchestration)
3. **Complex** — Cross-department coordination (multiple heads)
4. **Advanced** — Full lifecycle with QA layers

---

## 🎯 Delegation Decision Framework

**When given a task, the orchestrator (lg2) evaluates:**

### 1. Can one specialist handle this?
→ **Spawn that specialist directly**

**Example:** "Create a React contact form component"
- Spawn: `frontend-developer`
- Returns: Component code

---

### 2. Does it need 2-4 specialists in one department?
→ **Spawn the department head**

**Example:** "Build a REST API for a todo list with CRUD operations"
- Spawn: `head-engineering`
- Department head coordinates: `backend-architect` → `reality-checker`
- Returns: Tested, validated API

---

### 3. Does it need multiple departments?
→ **Spawn multiple department heads, coordinate returns**

**Example:** "Design and implement a SaaS landing page"
- Spawn: `head-design` + `head-engineering`
- Design produces mockups → Engineering implements → QA validates
- Returns: Complete, production-ready page

---

### 4. Is it a quick clarification?
→ **Answer directly (don't over-delegate)**

---

### 5. Is it QA/validation?
→ **Spawn `reality-checker` or relevant testing agent**

---

## 📋 UAT Scenarios

### UAT-1: Simple Task (Single Specialist)

**Task:** "Create a simple contact form component in React"

**Expected Flow:**
1. Orchestrator → spawns `frontend-developer`
2. Frontend Developer → builds component, returns code
3. Orchestrator → delivers to user

**Success Criteria:**
- ✅ Component is functional
- ✅ Clean handoff (no unnecessary agents)
- ✅ Response time < 2 minutes

**Test Command:**
```
"Please create a simple contact form component in React with name, email, and message fields."
```

---

### UAT-2: Medium Task (Squad Deployment)

**Task:** "Build a REST API for a todo list with CRUD operations"

**Expected Flow:**
1. Orchestrator → evaluates task → spawns `backend-architect`
2. Backend Architect → designs schema, writes endpoints
3. Backend Architect → spawns `reality-checker` for validation
4. Reality Checker → tests endpoints, provides feedback
5. Backend Architect → refines, returns final code
6. Orchestrator → delivers to user

**Success Criteria:**
- ✅ API works (CRUD functional)
- ✅ Reality check caught issues (if any)
- ✅ Clean integration between specialists
- ✅ Proper error handling and validation

**Test Command:**
```
"Build a REST API for a todo list application with full CRUD operations (create, read, update, delete). Include proper error handling and validation."
```

---

### UAT-3: Complex Task (Multi-Department + Head)

**Task:** "Build a complete task management web app with user auth, dashboard, and mobile-responsive UI"

**Expected Flow:**
1. Orchestrator → evaluates complexity → spawns `head-engineering`
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
9. Head Engineering → returns integrated deliverable
10. Orchestrator → delivers to user

**Success Criteria:**
- ✅ Full app works (auth, CRUD, UI, mobile)
- ✅ Department head coordinated effectively
- ✅ QA layer caught integration issues
- ✅ All specialists contributed
- ✅ Clean handoff to user

**Test Command:**
```
"Build a complete task management web application with:
- User authentication (signup/login)
- Dashboard with task list
- Create, edit, delete tasks
- Mobile-responsive design
- Clean, modern UI"
```

---

### UAT-4: Cross-Department Task

**Task:** "Design and implement a landing page for a SaaS product"

**Expected Flow:**
1. Orchestrator → evaluates → spawns `head-design` + `head-engineering`
2. Head Design → spawns `ux-architect` + `ui-designer`
3. UX Architect → wireframes, user flow
4. UI Designer → mockups, design system
5. Head Design → hands off to Head Engineering
6. Head Engineering → spawns `frontend-developer`
7. Frontend Developer → implements design
8. Head Engineering → spawns `reality-checker`
9. Reality Checker → validates design fidelity + responsiveness
10. Both heads → return to Orchestrator
11. Orchestrator → delivers to user

**Success Criteria:**
- ✅ Design is cohesive and professional
- ✅ Implementation matches design
- ✅ Cross-department handoff worked smoothly
- ✅ Both heads coordinated effectively
- ✅ Reality check validated fidelity
- ✅ Mobile responsive

**Test Command:**
```
"Design and implement a landing page for a SaaS task management product. Include:
- Hero section with CTA
- Features section
- Pricing table
- Footer with links
- Modern, professional design
- Fully responsive"
```

---

## 📊 Success Metrics

### Per-Scenario Metrics

**UAT-1 (Simple):**
- Completion time: < 2 min
- Agent count: 1 specialist
- Deliverable: Working code

**UAT-2 (Medium):**
- Completion time: < 5 min
- Agent count: 2-3 (architect + QA)
- Deliverable: Tested, validated API

**UAT-3 (Complex):**
- Completion time: < 10 min
- Agent count: 4-6 (head + specialists + QA)
- Deliverable: Full-stack integrated app

**UAT-4 (Cross-Department):**
- Completion time: < 12 min
- Agent count: 5-7 (2 heads + specialists + QA)
- Deliverable: Design + implementation

---

## 🧪 Running the Tests

### Method 1: Direct Chat

In your OpenClaw chat, paste the test commands above and observe the orchestration flow.

### Method 2: Via sessions_spawn

```bash
# UAT-1
openclaw spawn lg2 "Create a simple contact form component in React..."

# UAT-2
openclaw spawn lg2 "Build a REST API for a todo list..."

# UAT-3
openclaw spawn lg2 "Build a complete task management web app..."

# UAT-4
openclaw spawn lg2 "Design and implement a landing page..."
```

---

## 🔍 What to Observe

### Orchestration Quality
- Does the orchestrator pick the right level? (specialist vs head)
- Are handoffs clean between agents?
- Do department heads coordinate effectively?

### Deliverable Quality
- Does the code work?
- Is it clean and maintainable?
- Does it match requirements?

### Efficiency
- Are unnecessary agents spawned?
- Do agents collaborate or work in silos?
- Is the final deliverable integrated?

---

## 🚀 Beyond UAT

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

## 🤝 Contributing Test Results

Found bugs or improvements? Please open an issue or PR on the [Legion GitHub repo](https://github.com/ArchitectVS7/Legion).

---

**This is the way.** ⚡
