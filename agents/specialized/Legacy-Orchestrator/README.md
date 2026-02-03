# Legacy Orchestrator

This orchestrator was the original detailed workflow manager from the agency-agents translation. It has been superseded by the simplified `00-orchestrator` at the root agent level.

## Why This Is Not Actively Used

This orchestrator is kept for reference and legacy purposes but is not included in the active agent configuration for the following reasons:

❌ **Specific bash commands** - Too prescriptive; hardcoded commands don't adapt well to different project structures and environments

❌ **File path expectations** - Too brittle; assumes specific directory structures that may not exist or may vary across projects

❌ **Autonomous pipeline manager identity** - Conflicts with the delegation model; OpenClaw's max depth=2 constraint requires a simple routing orchestrator rather than an autonomous workflow manager

## Historical Context

This orchestrator was designed as a comprehensive pipeline manager with:
- Detailed phase-by-phase workflows (PM → ArchitectUX → Dev-QA Loop → Integration)
- Quality loop and retry logic
- Specific file system expectations
- End-to-end project orchestration capabilities

While valuable, these features were too complex for OpenClaw's delegation-focused architecture.

## Current Approach

The active `00-orchestrator` focuses on:
- Simple, clear delegation to specialist agents
- Tool restrictions (no write/edit/exec access)
- Working within OpenClaw's depth=2 constraint
- Routing intelligence without prescriptive workflows

Key workflow orchestration capabilities have been moved to dedicated agents like `management-studio-producer` and the quality assurance specialists.

---

*Preserved: February 2026 - For reference purposes only*
