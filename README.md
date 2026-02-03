# ClawLegion: Agent Orchestration System for OpenClaw

**A multi-agent system featuring 51 specialist agents coordinated by a central orchestrator.**

This project is a translation and orchestration layer built on top of [The Agency](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski) that define the personalities at the core of this system. Those agents were translated to [OpenClaw](https://github.com/openclaw/openclaw) with a central orchestrator that delegates all implementation work to specialists.

## Architecture

ClawLegion uses a **flat delegation model**:

```
User → Orchestrator (as agent profile) → Specialists
         depth 0, denied write/edit/exec      depth 1
```

**Key insight:** You start your OpenClaw session AS the orchestrator agent. The orchestrator has tool restrictions (`write`, `edit`, `exec` denied), forcing it to delegate all implementation work to specialists.

### What's Included

- **1 Orchestrator** — Central coordinator (cannot write code, must delegate)
- **51 Specialist Agents** — Domain experts across 9 categories

## Quick Start

### 1. Install OpenClaw

```bash
npm install -g openclaw
# or
pnpm add -g openclaw
```

### 2. Clone ClawLegion

```bash
cd ~/.openclaw/workspace
git clone https://github.com/ArchitectVS7/ClawLegion.git legion
```

### 3. Apply the Legion Config

```bash
openclaw gateway config.patch < legion/legion-config.json
```

Or manually merge `legion-config.json` into your `~/.openclaw/openclaw.json`.

### 4. Start a Session as the Orchestrator

```bash
openclaw agent --agent orchestrator --message "Build a REST API for a todo app"
```

This starts a session where:
- You ARE the orchestrator (session key: `agent:orchestrator:main`)
- The orchestrator cannot write/edit/execute directly
- All work is delegated to specialists via `sessions_spawn`

## How It Works

### The Orchestrator Pattern

The orchestrator evaluates your request and spawns appropriate specialists:

**Simple Task:**
```
"Create a React contact form"
→ Spawns: frontend-developer
→ Returns: Component code
```

**Multi-Specialist Task:**
```
"Build a REST API with tests"
→ Spawns: backend-architect, api-tester
→ Coordinates outputs
→ Returns: Tested, validated API
```

**Cross-Domain Task:**
```
"Design and build a landing page"
→ Spawns: ux-architect, ui-designer, frontend-developer, reality-checker
→ Synthesizes outputs
→ Returns: Complete, validated landing page
```

### QA and Review

Need an extra review step? The orchestrator can re-prompt any specialist to act as a supervisor:

```
→ Spawns: backend-architect (implementation)
→ Spawns: senior-developer (code review)
→ Spawns: reality-checker (QA certification)
```

## Specialist Roster

### Design (6 agents)
| Agent | Focus |
|-------|-------|
| brand-guardian | Brand identity, consistency, positioning |
| ui-designer | Visual design systems, component libraries |
| ux-architect | Technical architecture, CSS systems |
| ux-researcher | User testing, behavior analysis |
| visual-storyteller | Visual narratives, multimedia |
| whimsy-injector | Personality, delight, playful interactions |

### Engineering (7 agents)
| Agent | Focus |
|-------|-------|
| ai-engineer | ML models, deployment, AI integration |
| backend-architect | API design, database architecture |
| devops-automator | CI/CD, infrastructure automation |
| frontend-developer | React/Vue/Angular, UI implementation |
| mobile-app-builder | iOS/Android, cross-platform |
| rapid-prototyper | Fast POCs, MVPs |
| senior-developer | Laravel/Livewire, advanced patterns |

### Marketing (8 agents)
| Agent | Focus |
|-------|-------|
| app-store-optimizer | ASO, conversion optimization |
| content-creator | Multi-platform content, editorial |
| growth-hacker | User acquisition, viral loops |
| instagram-curator | Visual storytelling, community |
| reddit-community-builder | Authentic engagement |
| social-media-strategist | Cross-platform strategy |
| tiktok-strategist | Viral content, algorithm optimization |
| twitter-engager | Real-time engagement, thought leadership |

### Product (3 agents)
| Agent | Focus |
|-------|-------|
| feedback-synthesizer | User feedback analysis |
| sprint-prioritizer | Agile planning, feature prioritization |
| trend-researcher | Market intelligence, competitive analysis |

### Project Management (5 agents)
| Agent | Focus |
|-------|-------|
| management-experiment-tracker | A/B tests, hypothesis validation |
| management-project-shepherd | Cross-functional coordination |
| management-studio-operations | Day-to-day efficiency |
| management-studio-producer | High-level orchestration |
| manager-senior | Realistic scoping, task conversion |

### Spatial Computing (6 agents)
| Agent | Focus |
|-------|-------|
| cockpit-interaction-specialist | Cockpit controls |
| immersive-developer | WebXR, browser-based AR/VR |
| interface-architect | Spatial interaction design |
| integration-specialist | CLI tools, terminal workflows |
| spatial-engineer | Vision Pro apps |
| spatial-metal-engineer | Swift, Metal, Vision Pro |

### Specialized (2 agents)
| Agent | Focus |
|-------|-------|
| data-analytics-reporter | Business intelligence, insights |
| index-engineer | Code intelligence, LSP implementation |

### Support (6 agents)
| Agent | Focus |
|-------|-------|
| analytics-reporter | Data analysis, dashboards, KPIs |
| executive-summary-generator | C-suite communication |
| finance-tracker | Financial planning, budget management |
| infrastructure-maintainer | System reliability, performance |
| legal-compliance-checker | Compliance, regulations |
| support-responder | Customer service, issue resolution |

### Testing (7 agents)
| Agent | Focus |
|-------|-------|
| api-tester | API validation, integration testing |
| evidence-collector | Screenshot-based QA, visual proof |
| performance-benchmarker | Performance testing, optimization |
| reality-checker | Evidence-based certification, quality gates |
| test-results-analyzer | Test evaluation, metrics analysis |
| tool-evaluator | Technology assessment, tool selection |
| workflow-optimizer | Process analysis, workflow improvement |

## Structure

```
legion/
├── agents/
│   ├── 00-orchestrator/     # Central coordinator
│   ├── design/              # 6 design specialists
│   ├── engineering/         # 7 engineering specialists
│   ├── marketing/           # 8 marketing specialists
│   ├── product/             # 3 product specialists
│   ├── project-management/  # 5 PM specialists
│   ├── spatial-computing/   # 6 XR/spatial specialists
│   ├── specialized/         # 2 specialized agents
│   ├── support/             # 6 support specialists
│   └── testing/             # 7 testing specialists
├── legion-config.json       # Agent registry
├── README.md                # This file
└── UAT.md                   # User acceptance tests
```

Each specialist directory contains:
- **SOUL.md** — Persona, mission, personality
- **MEMORY.md** — Domain knowledge, templates, examples
- **TOOLS.md** — Agent-specific tool notes (optional)

## Why This Architecture?

### Problem: LLMs Do the Work Themselves

When given tools, LLMs tend to do tasks directly rather than delegating. An "orchestrator" with full tool access will just write the code itself.

### Solution: Tool Restrictions Force Delegation

By denying `write`, `edit`, and `exec` from the orchestrator:
- It MUST spawn specialists to do implementation work
- It focuses on task decomposition and coordination
- Specialists get focused, single-purpose tasks
- The orchestrator synthesizes results

### Why Not Deeper Hierarchies?

We considered adding "department heads" as an intermediate layer, but:
- Adds complexity without clear benefit
- Standard OpenClaw only allows 1 level of subagent spawning
- The orchestrator can spawn multiple specialists directly
- QA/review can be done by re-prompting any specialist

## Contributing

To add new specialists:
1. Create directory: `agents/<category>/<agent-id>/`
2. Add `SOUL.md`, `MEMORY.md`, `TOOLS.md`
3. Add agent to `legion-config.json`
4. Add to orchestrator's `allowAgents` list

## License

MIT License - see [LICENSE](./LICENSE)

## Links

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Original Agency Agents](https://github.com/msitarzewski/agency-agents)

---

_This is the way._
