# 🎯 Legion: 61-Agent Orchestration System for OpenClaw

**A hierarchical multi-agent system featuring 51 specialized agents, 9 department heads, and 1 orchestrator.**

## Overview

Legion is a complete agent orchestration framework for [OpenClaw](https://openclaw.ai) — designed for complex, multi-stage projects that require coordinated specialist collaboration.

### What's Included

- **1 Orchestrator** (`lg2`) — Top-level coordinator
- **9 Department Heads** — Orchestrate specialists within their domains
- **51 Specialist Agents** — Domain experts across 9 departments

## 📂 Structure

```
legion/
├── agents/              # 51 specialist agents
│   ├── design/          # 6 agents (UI, UX, Brand, etc.)
│   ├── engineering/     # 7 agents (Frontend, Backend, Mobile, etc.)
│   ├── marketing/       # 8 agents (Growth, Social, Content, etc.)
│   ├── product/         # 3 agents (Strategy, Feedback, Sprint)
│   ├── project-management/ # 5 agents (PM, Studio Ops, etc.)
│   ├── spatial-computing/  # 6 agents (visionOS, Metal, AR/VR)
│   ├── specialized/     # 3 agents (Analytics, Indexing, Orchestration)
│   ├── support/         # 6 agents (Finance, Legal, Infra, etc.)
│   └── testing/         # 7 agents (QA, Performance, Reality Check)
│
├── heads/               # 9 department head orchestrators
│   ├── head-design/
│   ├── head-engineering/
│   ├── head-marketing/
│   ├── head-product/
│   ├── head-project-management/
│   ├── head-spatial-computing/
│   ├── head-specialized/
│   ├── head-support/
│   └── head-testing/
│
├── PLAN.md             # Full implementation plan & UAT scenarios
├── DEPARTMENTS.md      # Department structure & agent roster
└── README.md           # This file
```

Each agent directory contains:
- **SOUL.md** — Persona, mission, personality
- **MEMORY.md** — Domain knowledge, templates, examples
- **TOOLS.md** — Agent-specific tool notes (optional)

## 🚀 Installation

### Prerequisites

- [OpenClaw](https://openclaw.ai) installed and configured
- OpenClaw version `2026.2.1` or later

### Setup

1. **Clone this repository into your OpenClaw workspace:**
   ```bash
   cd ~/.openclaw/workspace
   git clone https://github.com/YOUR_USERNAME/legion.git
   ```

2. **Apply the Legion config:**
   ```bash
   openclaw gateway config.patch < legion-config.json
   ```

   Or manually add the agent config from `legion-config.json` to your `openclaw.json`.

3. **Verify installation:**
   ```bash
   openclaw agents list | grep -E "(lg2|head-)"
   ```

   You should see `lg2` and 9 `head-*` agents listed.

## 📋 Usage

### Direct Specialist Spawn

For simple tasks, spawn a specialist directly:

```bash
# In OpenClaw chat or via sessions_spawn
"Please spawn frontend-developer to build a contact form component"
```

### Department Head Orchestration

For multi-specialist tasks within one domain:

```bash
"Please spawn head-engineering to build a full-stack todo app with auth"
```

The department head will:
1. Break down the task
2. Spawn relevant specialists (Backend, Frontend, QA)
3. Coordinate handoffs
4. Return integrated deliverable

### Cross-Department Projects

For complex, multi-department work:

```bash
"Please spawn head-design and head-engineering to build and implement a SaaS landing page"
```

The orchestrator (lg2) coordinates between department heads for seamless collaboration.

## 🎯 Use Cases

### Engineering
- Full-stack web apps
- Mobile applications
- DevOps automation
- AI/ML integration
- Rapid prototyping

### Design
- UI/UX design systems
- Brand identity
- Visual storytelling
- Wireframes & mockups
- Whimsical interactions

### Marketing
- Growth campaigns
- Social media strategy
- Content creation
- Community building
- App store optimization

### Product
- Feature prioritization
- User feedback synthesis
- Trend research
- Sprint planning

### Testing & QA
- Reality checks
- Performance benchmarking
- API testing
- Evidence collection
- Workflow optimization

## 🧪 Testing

We include 4 UAT scenarios in `PLAN.md`:

1. **UAT-1**: Simple task (single specialist)
2. **UAT-2**: Medium task (multi-specialist squad)
3. **UAT-3**: Complex task (department head orchestration)
4. **UAT-4**: Cross-department coordination

Run `test-agents.js` (if included) to validate structure.

## 🤝 Contributing

This is a translation of agents from the original [legion repository](https://github.com/YOUR_ORIGINAL_REPO) to OpenClaw format.

To add new agents:
1. Create agent directory: `agents/<department>/<agent-id>/`
2. Add `SOUL.md`, `MEMORY.md`, `TOOLS.md`
3. Update department head's `allowAgents` list
4. Add agent to `lg2`'s `allowAgents` list
5. Test with `test-agents.js`

## 📄 License

[Your License Here — MIT recommended]

## 🔗 Links

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [OpenClaw Discord](https://discord.com/invite/clawd)
- [Skill Hub](https://clawhub.com)
- [GitHub Source](https://github.com/openclaw/openclaw)

## 🙏 Credits

- Original agent concepts from the [legion repository](https://github.com/YOUR_ORIGINAL_REPO)
- Translated and orchestrated by VS7 & LG2
- Built on [OpenClaw](https://openclaw.ai) by the OpenClaw team

---

**This is the way.** ⚡
