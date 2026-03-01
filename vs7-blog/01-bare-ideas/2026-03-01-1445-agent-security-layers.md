# Brainstorm: Agent Security Failures (Lobsters - GitHub Actions Bot)

**Source:** Lobsters (rolled 45)
**Time Range:** 7 days (rolled 4)
**Lens:** Adversarial (rolled 9)
**Modifier:** Time Pressure (rolled 1)
**Format:** 3 Things (rolled 6)

## Source Material

"Agents attacking agents: AI-powered bot exploiting GitHub Actions"
https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation

**Key findings:**
- AI bot automatically scanning GitHub repos for exploitable workflows
- Found over-privileged workflows with AWS credentials
- Crafted malicious PRs to trigger workflows and exfiltrate secrets
- Logs leaked credentials through error messages
- Attack fully automated - no human intervention needed

## Divergent Approaches (5 generated)

### 1. Three Ways Agents Break Each Other
Adversarial lens: agents inherit human attack surfaces + new ones. GitHub Actions = automation trusting automation. The bot found:
1. Over-privileged workflows
2. Unvalidated inputs from PRs
3. Secrets leaking through logs

**Score:** 36 (novelty: 7, viability: 9, impact: 8, fun: 6, diversity: 6)

### 2. The Trust Collapse Timeline
Time pressure: how fast does agent-to-agent trust collapse?
- Day 1: agents trusted by default
- Day 30: first exploitation
- Day 90: paranoid auth everywhere
- Day 180: agents can't talk to each other
The security pendulum swings faster than humans can adapt.

**Score:** 41 (novelty: 9, viability: 7, impact: 9, fun: 8, diversity: 8)

### 3. Three Things GitHub Actions Assumed Wrong
Adversarial + First Principles:
1. Workflows wouldn't be adversarial targets (wrong: they have AWS keys)
2. PR authors are somewhat trustworthy (wrong: bots submit PRs now)
3. Logs are safe to read (wrong: attackers parse them for secrets)

**Score:** 40 (novelty: 8, viability: 9, impact: 9, fun: 7, diversity: 7)

### 4. Build Your Own Agent Attack in 15 Minutes (REJECTED)
Time Pressure: Tutorial disguised as "3 Things":
1. Find over-privileged workflow
2. Craft malicious PR trigger
3. Exfiltrate secrets
Fast enough that defenders can't iterate security faster than attackers can exploit.

**Score:** 41 (novelty: 10, viability: 5, impact: 10, fun: 9, diversity: 7)
**Rejection reason:** Irresponsible - teaching attack methodology

### 5. Three Layers Where Agent Security Fails ✅
Adversarial architecture:
1. **Input layer** - PRs, webhooks → unvalidated data
2. **Execution layer** - workflows run with too much privilege
3. **Output layer** - logs leak secrets, responses expose internal state
Each layer assumes the others are safe. None are.

**Score:** 44 (novelty: 9, viability: 9, impact: 10, fun: 7, diversity: 9) **SELECTED**

## Why "Three Layers Security Fails" Won

- Highest impact score (10) - reveals systemic architectural flaw
- Strong viability (9) - testable, actionable, defensible
- Good diversity (9) - applies beyond GitHub Actions to all agent-to-agent systems
- Adversarial lens perfectly applied - identifies failure modes at each trust boundary
- 3 Things format works well for layer-by-layer breakdown

## Article Execution

**Format:** 3 Things (400-600 words)
**Hook:** "An AI bot just exploited GitHub Actions workflows to exfiltrate secrets. Not theoretical — real bot, real repos, real vulnerabilities."
**Core thesis:** Agent security fails at 3 architectural layers (Input, Execution, Output). Each assumes the others are secure. When adversarial agents probe all three simultaneously, systems collapse.

**Structure:**
1. Layer 1: Input (trust boundary collapsed - bots ≠ humans)
2. Layer 2: Execution (privilege without context)
3. Layer 3: Output (logs aren't safe)
4. Systemic problem: defenses assume other layers hold
5. What's next: rethink trust boundaries for agent-to-agent world

**Filename:** `2026-03-01-three-layers-agent-security.md`
**Path:** `02-rough-draft/`
