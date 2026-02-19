#!/usr/bin/env bash
# OVI Status Command — P5.3: Narrative briefing with voice support
# Usage: ovi-status.sh [--voice]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
USE_VOICE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --voice) USE_VOICE=true; shift ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# Get structured data
DATA=$("$SCRIPT_DIR/ovi-briefing.sh" --format json)

TIMESTAMP=$(echo "$DATA" | jq -r '.timestamp')
SESSIONS=$(echo "$DATA" | jq -r '.active_sessions')
ISOLATED=$(echo "$DATA" | jq -r '.isolated_sessions')
PHASE=$(echo "$DATA" | jq -r '.current_phase')
PROGRESS=$(echo "$DATA" | jq -r '.phase_progress')
ACTIVE_HEXES=$(echo "$DATA" | jq -r '.active_hexes')
ACTIVE_HEX_NAMES=$(echo "$DATA" | jq -r '.active_hex_names')
GIT_RECENT=$(echo "$DATA" | jq -r '.git_recent')

# Get next task focus from OVI-SPEC.md
NEXT_TASK=$(grep "^- \[ \] P5\." /root/.openclaw/workspace/sparks/OVI-SPEC.md | head -1 | sed 's/^- \[ \] //' | sed 's/ —.*//' || echo "")

# Build narrative
NARRATIVE="🎙️ OVI STATUS — $TIMESTAMP

"

# Session status
if [[ $ISOLATED -gt 0 ]]; then
  NARRATIVE+="$SESSIONS session(s) active, $ISOLATED isolated. $PHASE in progress — $PROGRESS.

"
else
  NARRATIVE+="$SESSIONS session active. $PHASE in progress — $PROGRESS.

"
fi

# Active work
if [[ $ACTIVE_HEXES -gt 0 ]]; then
  NARRATIVE+="Active workspace modules: $ACTIVE_HEX_NAMES.

"
else
  NARRATIVE+="Workspace quiet. All modules idle.

"
fi

# Recent commits
if [[ -n "$GIT_RECENT" ]]; then
  NARRATIVE+="Recent: $GIT_RECENT.

"
else
  NARRATIVE+="No commits in the last 4 hours.

"
fi

# Next focus
if [[ -n "$NEXT_TASK" ]]; then
  NARRATIVE+="Current focus: $NEXT_TASK.

"
fi

# Reference
NARRATIVE+="Check sparks/OVI-SPEC.md for full phase work list."

# Output
if [[ "$USE_VOICE" == "true" ]] && command -v sag &>/dev/null && [[ -n "${ELEVENLABS_API_KEY:-}" ]]; then
  # Generate voice
  VOICE_FILE="/tmp/ovi-status-$(date +%s).mp3"
  sag -o "$VOICE_FILE" "$NARRATIVE" 2>/dev/null || {
    echo "$NARRATIVE"
    exit 0
  }
  echo "MEDIA:$VOICE_FILE"
else
  echo "$NARRATIVE"
fi
