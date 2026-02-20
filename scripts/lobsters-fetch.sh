#!/usr/bin/env bash
# lobsters-fetch.sh - Fetch top Lobsters stories

set -euo pipefail

LIMIT=${1:-50}

echo "# Lobsters - Top Stories"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Fetch hottest stories from Lobsters JSON API
STORIES=$(curl -s "https://lobste.rs/hottest.json")

echo "$STORIES" | jq -r ".[:${LIMIT}][] | \"## \(.title)\n**Score:** \(.score) | **Comments:** \(.comment_count)\n**Tags:** \(.tags | join(\", \"))\n**URL:** \(.url)\n**Discussion:** https://lobste.rs/s/\(.short_id)\n\n\(.description // \"No description\")\n\n---\n\""

echo ""
echo "Total stories fetched: $(echo "$STORIES" | jq '. | length')"
