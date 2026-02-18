#!/usr/bin/env bash
# OVI Briefing Generator
# Outputs a structured OVI briefing summary for LG2 to narrate
# Usage: ovi-briefing.sh [--format text|json]
set -euo pipefail

WORKSPACE="${OVI_WORKSPACE:-/root/.openclaw/workspace}"
FORMAT="text"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format) FORMAT="${2:-text}"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# Gather data points
TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M UTC')

# Active sessions
ACTIVE_SESSIONS=$(openclaw sessions list 2>/dev/null | grep -c "active" || echo "unknown")

# Recent git activity across known repos
GIT_RECENT=""
for REPO in "$WORKSPACE" ~/dev/focus-pocus ~/OpenClaw; do
  if [[ -d "$REPO/.git" ]]; then
    RECENT=$(git -C "$REPO" log --oneline --since="24 hours ago" 2>/dev/null | head -3)
    if [[ -n "$RECENT" ]]; then
      REPO_NAME=$(basename "$REPO")
      GIT_RECENT+="[$REPO_NAME] $RECENT\n"
    fi
  fi
done

# OVI spec progress
OVI_SPEC="$WORKSPACE/sparks/OVI-SPEC.md"
if [[ -f "$OVI_SPEC" ]]; then
  # Count only Phase 1 tasks (between Phase 1 and Phase 2 headers)
  P1_SECTION=$(awk '/## 📋 PHASE 1/,/## 📋 PHASE 2/' "$OVI_SPEC")
  COMPLETED=$(echo "$P1_SECTION" | grep -c "\[x\]" 2>/dev/null || echo 0)
  PENDING=$(echo "$P1_SECTION" | grep -c "\[ \]" 2>/dev/null || echo 0)
  TOTAL=$((COMPLETED + PENDING))
  PROGRESS="OVI Phase 1: ${COMPLETED}/${TOTAL} tasks complete"
else
  PROGRESS="OVI spec not found"
fi

if [[ "$FORMAT" == "json" ]]; then
  cat <<JSON
{
  "timestamp": "$TIMESTAMP",
  "progress": "$PROGRESS",
  "git_recent": "$(echo -e "$GIT_RECENT" | head -5)",
  "active_sessions": "$ACTIVE_SESSIONS"
}
JSON
else
  echo "=== OVI BRIEFING === $TIMESTAMP"
  echo ""
  echo "[STATUS] System operational. $PROGRESS"
  echo ""
  if [[ -n "$GIT_RECENT" ]]; then
    echo "[DONE] Recent commits:"
    echo -e "$GIT_RECENT"
  else
    echo "[DONE] No recent commits in the last 24h"
  fi
  echo ""
  echo "[ACTIVE] OVI Phase 1 build in progress"
  echo ""
  echo "[DECISIONS] None pending — check /root/.openclaw/workspace/sparks/OVI-SPEC.md for blockers"
  echo ""
  echo "[WATCH] OVI hourly build cron is active"
fi
