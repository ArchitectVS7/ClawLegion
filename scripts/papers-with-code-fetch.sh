#!/usr/bin/env bash
# papers-with-code-fetch.sh - Fetch latest Papers with Code

set -euo pipefail

LIMIT=${1:-20}

echo "# Papers with Code - Latest"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Use web_fetch to grab the latest papers page
# Note: This is a fallback since Papers with Code doesn't have a public API
# Better: scrape their RSS or use their search

echo "Fetching from Papers with Code..."
echo "Note: This requires web_fetch tool or manual parsing"
echo ""

# Fallback: Fetch ArXiv CS.AI recent papers which often appear on Papers with Code
/root/.openclaw/workspace/scripts/arxiv-fetch.sh cs.AI ${LIMIT}
