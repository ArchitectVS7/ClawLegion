#!/usr/bin/env bash
# OVI Briefing Generator — P5.2: Live Agent State Integration
# Outputs a structured OVI briefing summary for LG2 to narrate
# Usage: ovi-briefing.sh [--format text|json]
set -euo pipefail

WORKSPACE="${OVI_WORKSPACE:-/root/.openclaw/workspace}"
OVI_API="${OVI_API:-http://127.0.0.1:3721/api}"
FORMAT="text"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format) FORMAT="${2:-text}"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M UTC')

# === LIVE AGENT STATE ===
SESSIONS_JSON="/root/.openclaw/agents/main/sessions/sessions.json"
ACTIVE_COUNT=$(cat "$SESSIONS_JSON" 2>/dev/null | jq 'length' 2>/dev/null || echo 0)
ISOLATED_COUNT=$(cat "$SESSIONS_JSON" 2>/dev/null | jq '[.[] | select(.kind == "isolated")] | length' 2>/dev/null || echo 0)

# === CYBERSCAPE HEX STATE ===
WORKSPACE_STATE=$(curl -s "$OVI_API/workspace-state" 2>/dev/null || echo '{"hexes":[],"timestamp":""}')
ACTIVE_HEXES=$(echo "$WORKSPACE_STATE" | jq '[.hexes[] | select(.status == "active")] | length' 2>/dev/null || echo 0)
ACTIVE_HEX_NAMES=$(echo "$WORKSPACE_STATE" | jq -r '[.hexes[] | select(.status == "active")] | .[].label' 2>/dev/null | paste -sd',' - || echo "")

# === RECENT GIT ACTIVITY ===
GIT_RECENT=""
if [[ -d "$WORKSPACE/.git" ]]; then
  RECENT=$(git -C "$WORKSPACE" log --oneline --since="4 hours ago" 2>/dev/null | head -2 || true)
  if [[ -n "$RECENT" ]]; then
    GIT_RECENT=$(echo "$RECENT" | head -1 || true)
  fi
fi

# === OVI SPEC PROGRESS ===
OVI_SPEC="$WORKSPACE/sparks/OVI-SPEC.md"
CURRENT_PHASE="Unknown"
PHASE_PROGRESS=""
if [[ -f "$OVI_SPEC" ]]; then
  CURRENT_PHASE=$(grep "^\*\*Active Phase:\*\*" "$OVI_SPEC" | head -1 | sed 's/\*\*Active Phase:\*\* //' | sed 's/ —.*//' || echo "Unknown")
  # Simple progress: count [x] vs [ ] in entire spec
  COMPLETED=$(grep -c "\[x\]" "$OVI_SPEC" 2>/dev/null || echo 0)
  PENDING=$(grep -c "\[ \]" "$OVI_SPEC" 2>/dev/null || echo 0)
  TOTAL=$(( COMPLETED + PENDING ))
  if [[ $TOTAL -gt 0 ]]; then
    PHASE_PROGRESS="${COMPLETED}/${TOTAL} tasks complete overall"
  fi
fi

# === OUTPUT ===
if [[ "$FORMAT" == "json" ]]; then
  cat <<JSON
{
  "timestamp": "$TIMESTAMP",
  "active_sessions": $ACTIVE_COUNT,
  "isolated_sessions": $ISOLATED_COUNT,
  "active_hexes": $ACTIVE_HEXES,
  "active_hex_names": "$ACTIVE_HEX_NAMES",
  "current_phase": "$CURRENT_PHASE",
  "phase_progress": "$PHASE_PROGRESS",
  "git_recent": "$GIT_RECENT"
}
JSON
else
  echo "=== OVI BRIEFING === $TIMESTAMP"
  echo ""
  echo "[STATUS] $ACTIVE_COUNT session(s) active, $ISOLATED_COUNT isolated. $CURRENT_PHASE. $PHASE_PROGRESS"
  echo ""
  
  if [[ $ACTIVE_HEXES -gt 0 ]]; then
    echo "[ACTIVE] $ACTIVE_HEXES workspace module(s) active: $ACTIVE_HEX_NAMES"
  else
    echo "[ACTIVE] Workspace quiet — all modules idle"
  fi
  echo ""
  
  if [[ -n "$GIT_RECENT" ]]; then
    echo "[DONE] Recent: $GIT_RECENT"
  else
    echo "[DONE] No commits in the last 4 hours"
  fi
  echo ""
  
  echo "[DECISIONS] Check sparks/OVI-SPEC.md for current phase tasks"
  echo ""
  echo "[WATCH] Cyberscape Terminal: cd sparks/cyberscape-term && node index.js"
fi
