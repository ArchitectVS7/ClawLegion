#!/usr/bin/env bash
# reddit-fetch.sh - Fetch top posts from AI-related subreddits

set -euo pipefail

SUBREDDIT=${1:-"LocalLLaMA"}
TIME_RANGE=${2:-"week"}  # day, week, month, year, all
LIMIT=${3:-10}

echo "# Reddit - r/${SUBREDDIT} (Top ${TIME_RANGE})"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Fetch top posts
DATA=$(curl -s -A "LG2/1.0" "https://www.reddit.com/r/${SUBREDDIT}/top.json?t=${TIME_RANGE}&limit=${LIMIT}")

# Parse and display
echo "$DATA" | jq -r '
  .data.children[] |
  select(.data.stickied == false) |
  "## \(.data.title)\n**Score:** \(.data.score) | **Comments:** \(.data.num_comments)\n**Link:** https://reddit.com\(.data.permalink)\n"
' | head -50

# Count results
COUNT=$(echo "$DATA" | jq '.data.children | length')
if [ "$COUNT" -eq 0 ]; then
  echo "No posts found in r/${SUBREDDIT} for time range '${TIME_RANGE}'."
fi
