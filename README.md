# ClawLegion: Agent Orchestration System for OpenClaw

**A hierarchical multi-agent system featuring 51 specialized agents, 9 department heads, and 1 orchestrator.**

This project is a translation and orchestration layer built on top of [The Agency](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski) that define the personalities at the core of this system. Those agents were translated to [OpenClaw](https://github.com/openclaw/openclaw) with an additional "department head" layer in each grouping. Finally one master orchestrator agent is provided, or you can run this with your primary OpenClaw persona.

## Overview

ClawLegion is a complete agent orchestration framework for [OpenClaw](https://github.com/openclaw/openclaw) designed for complex, multi-stage projects that require coordinated specialist collaboration.

### What's Included

- **1 Orchestrator** — Top-level coordinator
- **9 Department Heads** — Orchestrate specialists within their domains
- **51 Specialist Agents** — Domain experts across 9 departments

## Structure

```
legion/
├── lg2/                 # Master orchestrator
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
│
├── UAT.md              # Sample User Acceptance Test 
├── DEPARTMENTS.md      # Department structure & agent roster
└── README.md           # This file
```

Each agent directory contains:
- **SOUL.md** — Persona, mission, personality
- **MEMORY.md** — Domain knowledge, templates, examples
- **TOOLS.md** — Agent-specific tool notes (optional)

## Installation

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and configured

### Setup

1. **Clone this repository into your OpenClaw workspace:**
   ```bash
   cd ~/.openclaw/workspace
   git clone https://github.com/ArchitectVS7/Legion.git legion
   ```

2. **Apply the Legion config:**
   ```bash
   openclaw gateway config.patch < legion/legion-config.json
   ```

   Or manually add the agent config from `legion-config.json` to your `openclaw.json`.

3. **Verify installation:**
   ```bash
   openclaw agents list | grep -E "(lg2|head-)"
   ```

   You should see `lg2` and 9 `head-*` agents listed.

## Usage

Legion uses **intelligent delegation** — the orchestrator automatically picks the right level of coordination based on task complexity.

### Example: Simple to Complex

**Simple Task** (1 specialist):
```
"Create a React contact form component"
→ Spawns: frontend-developer
→ Returns: Component code
```

**Medium Task** (squad with QA):
```
"Build a REST API for a todo list with CRUD operations"
→ Spawns: head-engineering
→ Coordinates: backend-architect → reality-checker
→ Returns: Tested, validated API
```

**Complex Task** (department orchestration):
```
"Build a complete task management web app with auth and dashboard"
→ Spawns: head-engineering
→ Coordinates: backend-architect, frontend-developer, mobile-app-builder, reality-checker
→ Returns: Full-stack integrated application
```

**Cross-Department** (multiple heads):
```
"Design and implement a SaaS landing page"
→ Spawns: head-design + head-engineering
→ Design: ux-architect → ui-designer
→ Engineering: frontend-developer → reality-checker
→ Returns: Designed, implemented, and validated landing page
```

### Direct Specialist Spawn

You can also spawn specialists directly:

```bash
"Please spawn frontend-developer to build a contact form component"
```

### Delegation Decision Framework

The orchestrator evaluates each task and picks the optimal approach. See [UAT.md](./UAT.md) for the complete decision framework.

## Use Cases

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

## Testing

We include 4 UAT scenarios to validate the orchestration system:

1. **UAT-1**: Simple task (single specialist)
2. **UAT-2**: Medium task (multi-specialist squad)
3. **UAT-3**: Complex task (department head orchestration)
4. **UAT-4**: Cross-department coordination

**See [UAT.md](./UAT.md) for complete test scenarios, success criteria, and test commands.**

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding agents and improving the system.

To add new agents:
1. Create agent directory: `agents/<department>/<agent-id>/`
2. Add `SOUL.md`, `MEMORY.md`, `TOOLS.md`
3. Update department head's `allowAgents` list
4. Add agent to `lg2`'s `allowAgents` list
5. Test spawn command

## License

MIT License - see [LICENSE](./LICENSE)


## Links

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Original Agency Agents](https://github.com/msitarzewski/agency-agents)

---

This is the way.
