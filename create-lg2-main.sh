#!/bin/bash
# Script to create LG2 main agent and make orchestrator READ-ONLY

set -euo pipefail

CONFIG="/root/.openclaw/openclaw.json"
BACKUP="${CONFIG}.backup-pre-lg2-$(date +%Y%m%d-%H%M%S)"

echo "Creating LG2 main agent architecture..."

# Backup current config
cp "$CONFIG" "$BACKUP"
echo "✅ Backup created: $BACKUP"

# Create the new main agent entry
MAIN_AGENT=$(cat <<'EOF'
{
  "id": "main",
  "name": "LG2",
  "model": "anthropic/claude-sonnet-4-5",
  "identity": {
    "name": "LG2",
    "theme": "Bridge between dreams and data"
  },
  "subagents": {
    "allowAgents": ["orchestrator"]
  }
}
EOF
)

# Update config with jq:
# 1. Add main agent at the beginning of agents.list
# 2. Modify orchestrator to disable write/edit/exec and adjust allowAgents
jq --argjson mainAgent "$MAIN_AGENT" '
  .agents.list = [$mainAgent] + .agents.list |
  .agents.list |= map(
    if .id == "orchestrator" then
      .name = "Orchestrator (READ-ONLY)" |
      .disableTools = ["write", "edit", "exec"] |
      .identity.name = "Orchestrator" |
      .identity.theme = "Delegation coordinator" |
      .subagents.allowAgents = [
        "head-design",
        "head-engineering",
        "head-marketing",
        "head-product",
        "head-project-management",
        "head-spatial-computing",
        "head-specialized",
        "head-support",
        "head-testing"
      ]
    else . end
  )
' "$CONFIG" > "${CONFIG}.tmp" && mv "${CONFIG}.tmp" "$CONFIG"

echo "✅ Config updated:"
echo "   - Added 'main' LG2 agent (full tools)"
echo "   - Modified 'orchestrator' to READ-ONLY (no write/edit/exec)"
echo "   - Orchestrator can only spawn department heads"
echo ""
echo "Total agents configured: $(jq '.agents.list | length' "$CONFIG")"
echo ""
echo "🔄 Restart gateway to apply changes:"
echo "   kill -USR1 \$(pgrep openclaw-gateway)"
