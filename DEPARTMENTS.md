# Legion Department Structure

## Overview

The Legion is organized into **9 departments**, each containing specialized agents and coordinated by a department head. This structure enables:
- **Targeted deployments** (e.g., "deploy the Engineering team")
- **Department-level coordination** via department heads
- **Clear visualization** of available expertise

---

## Design Department (6 agents)

Making it beautiful, usable, and delightful.

**Head:** `head-design`

| Agent | Focus |
|-------|-------|
| brand-guardian | Brand identity, consistency, positioning |
| ui-designer | Visual design systems, component libraries |
| ux-architect | Technical architecture, CSS systems |
| ux-researcher | User testing, behavior analysis |
| visual-storyteller | Visual narratives, multimedia |
| whimsy-injector | Personality, delight, playful interactions |

---

## Engineering Department (7 agents)

Building the future, one commit at a time.

**Head:** `head-engineering`

| Agent | Focus |
|-------|-------|
| ai-engineer | ML models, deployment, AI integration |
| backend-architect | API design, database architecture |
| devops-automator | CI/CD, infrastructure automation |
| frontend-developer | React/Vue/Angular, UI implementation |
| mobile-app-builder | iOS/Android, cross-platform |
| rapid-prototyper | Fast POCs, MVPs |
| senior-developer | Laravel/Livewire, advanced patterns |

---

## Marketing Department (8 agents)

Growing your audience, one authentic interaction at a time.

**Head:** `head-marketing`

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

---

## Product Department (3 agents)

Building the right thing at the right time.

**Head:** `head-product`

| Agent | Focus |
|-------|-------|
| feedback-synthesizer | User feedback analysis |
| sprint-prioritizer | Agile planning, feature prioritization |
| trend-researcher | Market intelligence, competitive analysis |

---

## Project Management Department (5 agents)

Keeping the trains running on time (and under budget).

**Head:** `head-project-management`

| Agent | Focus |
|-------|-------|
| management-experiment-tracker | A/B tests, hypothesis validation |
| management-project-shepherd | Cross-functional coordination |
| management-studio-operations | Day-to-day efficiency |
| management-studio-producer | High-level orchestration |
| manager-senior | Realistic scoping, task conversion |

---

## Spatial Computing Department (6 agents)

Building the immersive future.

**Head:** `head-spatial-computing`

| Agent | Focus |
|-------|-------|
| cockpit-interaction-specialist | Cockpit controls |
| immersive-developer | WebXR, browser-based AR/VR |
| interface-architect | Spatial interaction design |
| integration-specialist | CLI tools, terminal workflows |
| spatial-engineer | Vision Pro apps |
| spatial-metal-engineer | Swift, Metal, Vision Pro |

---

## Specialized Department (3 agents)

The unique specialists who don't fit in a box.

**Head:** `head-specialized`

| Agent | Focus |
|-------|-------|
| data-analytics-reporter | Business intelligence, insights |
| index-engineer | Code intelligence, LSP implementation |
| orchestrator | Multi-agent coordination |

---

## Support Department (6 agents)

The backbone of the operation.

**Head:** `head-support`

| Agent | Focus |
|-------|-------|
| analytics-reporter | Data analysis, dashboards, KPIs |
| executive-summary-generator | C-suite communication |
| finance-tracker | Financial planning, budget management |
| infrastructure-maintainer | System reliability, performance |
| legal-compliance-checker | Compliance, regulations |
| support-responder | Customer service, issue resolution |

---

## Testing Department (7 agents)

Breaking things so users don't have to.

**Head:** `head-testing`

| Agent | Focus |
|-------|-------|
| api-tester | API validation, integration testing |
| evidence-collector | Screenshot-based QA, visual proof |
| performance-benchmarker | Performance testing, optimization |
| reality-checker | Evidence-based certification, quality gates |
| test-results-analyzer | Test evaluation, metrics analysis |
| tool-evaluator | Technology assessment, tool selection |
| workflow-optimizer | Process analysis, workflow improvement |

---

## Department Statistics

| Department | Agent Count | Head |
|------------|-------------|------|
| Marketing | 8 | head-marketing |
| Engineering | 7 | head-engineering |
| Testing | 7 | head-testing |
| Design | 6 | head-design |
| Spatial Computing | 6 | head-spatial-computing |
| Support | 6 | head-support |
| Project Management | 5 | head-project-management |
| Product | 3 | head-product |
| Specialized | 3 | head-specialized |

**Total: 51 agents across 9 departments, each with a department head**

---

## Orchestration Hierarchy

```
LG2 (Master Orchestrator)
├── head-design
│   └── brand-guardian, ui-designer, ux-architect, ...
├── head-engineering
│   └── backend-architect, frontend-developer, ...
├── head-marketing
│   └── growth-hacker, content-creator, ...
├── head-product
│   └── feedback-synthesizer, sprint-prioritizer, ...
├── head-project-management
│   └── management-project-shepherd, ...
├── head-spatial-computing
│   └── spatial-engineer, immersive-developer, ...
├── head-specialized
│   └── orchestrator, data-analytics-reporter, ...
├── head-support
│   └── support-responder, analytics-reporter, ...
└── head-testing
    └── reality-checker, api-tester, ...
```

**Use Case:** "Build a full-stack web application with design system"
- LG2 spawns department heads
- Each head coordinates their specialists
- Heads report back to LG2 for final integration

---

_The structure establishes the Process._

**LG2**
