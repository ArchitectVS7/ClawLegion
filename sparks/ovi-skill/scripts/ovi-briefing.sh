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

# Gather data points
TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M UTC')

# === LIVE AGENT STATE (from OpenClaw sessions) ===
SESSIONS_RAW=$(openclaw sessions list 2>/dev/null | tail -n +3 | grep -v "^$" || echo "")
ACTIVE_COUNT=$(echo "$SESSIONS_RAW" | grep -c "." || echo 0)
ISOLATED_COUNT=$(echo "$SESSIONS_RAW" | grep -c "isolated" || echo 0)

# === CYBERSCAPE HEX STATE (from workspace-state API) ===
WORKSPACE_STATE=$(curl -s "$OVI_API/workspace-state" 2>/dev/null || echo '{"hexes":[],"timestamp":""}')
ACTIVE_HEXES=$(echo "$WORKSPACE_STATE" | jq '[.hexes[] | select(.status == "active")] | length' 2>/dev/null || echo 0)
ACTIVE_HEX_NAMES=$(echo "$WORKSPACE_STATE" | jq -r '[.hexes[] | select(.status == "active")] | .[].label' 2>/dev/null | tr '\n' ',' | sed 's/,$//' || echo "")

# === RECENT GIT ACTIVITY ===
GIT_RECENT=""
for REPO in "$WORKSPACE" ~/dev/focus-pocus ~/OpenClaw; do
  if [[ -d "$REPO/.git" ]]; then
    RECENT=$(git -C "$REPO" log --oneline --since="4 hours ago" 2>/dev/null | head -2 || true)
    if [[ -n "$RECENT" ]]; then
      REPO_NAME=$(basename "$REPO")
      GIT_RECENT+="[$REPO_NAME] $(echo "$RECENT" | head -1 || true)\n"
    fi
  fi
done

# === OVI SPEC PROGRESS ===
OVI_SPEC="$WORKSPACE/sparks/OVI-SPEC.md"
CURRENT_PHASE=""
PHASE_PROGRESS=""
if [[ -f "$OVI_SPEC" ]]; then
  CURRENT_PHASE=$(grep "^\*\*Active Phase:\*\*" "$OVI_SPEC" | head -1 | sed 's/\*\*Active Phase:\*\* //' | sed 's/ (.*//')
  
  # Count checkboxes for the active phase section
  PHASE_NUM=$(echo "$CURRENT_PHASE" | grep -oE "Phase [0-9]" | grep -oE "[0-9]" || echo "0")
  if [[ "$PHASE_NUM" != "0" ]]; then
    PHASE_SECTION=$(awk "/## 📋 PHASE $PHASE_NUM/,/## 📋 PHASE/" "$OVI_SPEC")
    COMPLETED=$(echo "$PHASE_SECTION" | grep "\[x\]" | wc -l)
    PENDING=$(echo "$PHASE_SECTION" | grep "\[ \]" | wc -l)
    TOTAL=$(( $COMPLETED + $PENDING ))
    PHASE_PROGRESS="${COMPLETED}/${TOTAL} tasks complete"
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
  "git_recent": "$(echo -e "$GIT_RECENT" | head -3 | tr '\n' ';')"
}
JSON
else
  echo "=== OVI BRIEFING === $TIMESTAMP"
  echo ""
  echo "[STATUS] $ACTIVE_COUNT active session(s), $ISOLATED_COUNT isolated. $CURRENT_PHASE $PHASE_PROGRESS"
  echo ""
  
  if [[ "$ACTIVE_HEXES" -gt 0 ]]; then
    echo "[ACTIVE] $ACTIVE_HEXES workspace module(s) active: $ACTIVE_HEX_NAMES"
  else
    echo "[ACTIVE] Workspace quiet — all modules idle"
  fi
  echo ""
  
  if [[ -n "$GIT_RECENT" ]]; then
    echo "[DONE] Recent commits (4h window):"
    echo -e "$GIT_RECENT"
  else
    echo "[DONE] No commits in the last 4 hours"
  fi
  echo ""
  
  echo "[DECISIONS] Check sparks/OVI-SPEC.md for phase roll logs and pending tasks"
  echo ""
  echo "[WATCH] Cyberscape Terminal live at sparks/cyberscape-term/ — run 'node index.js' for ASCII hex view"
fi
