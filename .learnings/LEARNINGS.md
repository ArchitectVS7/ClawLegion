# Learnings Log

Tracks corrections, knowledge gaps, and best practices for continuous improvement.

---

## [LRN-20260225-001] verify_file_exists_before_edit

**Logged**: 2026-02-25T19:52:00Z
**Priority**: high
**Status**: promoted
**Area**: workflow

### Summary
Always verify files exist before attempting to edit them

### Details
Attempted to edit `WORKFLOW_AUTO.md` which I assumed existed for tracking pipeline status. File doesn't exist - I invented the filename.

**What happened:**
1. Reviewed article, moved to hold, committed changes
2. Wanted to update "current status" in a tracking file
3. Assumed a file called WORKFLOW_AUTO.md existed
4. Tried to edit it with the `Edit` tool
5. Got "File not found" error

**What was wrong:**
- I assumed a file existed without checking
- I invented a filename that never existed in the workspace
- I didn't check workspace context or memory files first

**What's correct:**
- Pipeline status is already tracked in `memory/YYYY-MM-DD.md`
- Actual workflow files are: REVISION-WORKFLOW.md, RAILWAY-WORKFLOW.md
- If I need a tracking file, I should create it first with `Write`, then use `Edit` for updates

### Suggested Action
**Before editing any file:**
1. Check if it exists: `ls -la /path/to/file.md 2>&1`
2. If uncertain, search workspace: `find /root/.openclaw/workspace -name "*keyword*"`
3. If file doesn't exist and is needed, use `Write` to create it first
4. Only use `Edit` on files confirmed to exist

**For status tracking specifically:**
- Use memory files (`memory/YYYY-MM-DD.md`) - they're designed for this
- Don't create redundant tracking files unless there's a clear need
- Check existing workflow docs (REVISION-WORKFLOW.md, etc.) before inventing new ones

### Metadata
- Source: user_feedback
- Related Files: memory/2026-02-25.md, REVISION-WORKFLOW.md
- Tags: file_operations, assumptions, best_practice
- Category: best_practice
- See Also: ERR-20260225-001

### Resolution
- **Resolved**: 2026-02-25T19:55:00Z
- **Promoted**: AGENTS.md (added "File Operations - Check Before Edit" section)
- **Notes**: Core rule added to workspace guidelines - always verify file existence before editing

---

## [LRN-20260225-002] document_fallback_behavior

**Logged**: 2026-02-25T21:50:00Z
**Priority**: high
**Status**: resolved
**Area**: docs

### Summary
Revision workflow has fallback behavior (expand ideas when hold is empty) but it wasn't documented in REVISION-WORKFLOW.md

### Details
**What happened:**
1. Revision cron job ran at 21:45 UTC
2. Hold directory was empty (just cleared last article at 20:45)
3. Isolated session returned REVISION_SKIP
4. User corrected: "You're supposed to do something else when hold is empty"

**What was wrong:**
- Fallback behavior (expand ideas) was implemented in earlier sessions (17:55 UTC, 18:45 UTC)
- Memory logs show idea expansion working correctly
- But REVISION-WORKFLOW.md didn't document this fallback mode
- Isolated cron sessions can't access full memory/conversation history, only workspace files

**What's correct:**
- When hold is empty: select 3 random ideas, evaluate expansion potential, write article to 02-rough-draft/
- This keeps pipeline fed even when no rescue work needed
- Already working pattern from earlier today

### Suggested Action
✅ **COMPLETED:** Updated REVISION-WORKFLOW.md to document fallback mode:
- Added "or Expand Ideas" to Step 1 header
- Documented fallback selection criteria
- Added new Step 3b: Idea Expansion (full process)
- Clarified: ideas → rough-draft, held articles → drafts

### Metadata
- Source: user_correction
- Related Files: REVISION-WORKFLOW.md, memory/2026-02-25.md
- Tags: documentation, workflow, cron_jobs
- Category: correction

### Resolution
- **Resolved**: 2026-02-25T21:52:00Z
- **Updated**: REVISION-WORKFLOW.md (added fallback documentation)
- **Notes**: Fallback behavior was already working, just not documented. Isolated sessions need workspace files, not just memory.

---
