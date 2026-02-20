#!/usr/bin/env bash
# github-trending.sh - Find trending AI repos on GitHub

set -euo pipefail

DAYS=${1:-7}
LIMIT=${2:-50}  # Increased default for more variety

SINCE_DATE=$(date -d "${DAYS} days ago" -I)

echo "# GitHub Trending AI Repos (Last ${DAYS} Days)"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Search for AI-related repos created/updated recently, sorted by stars
gh search repos \
  --created=">${SINCE_DATE}" \
  --sort=stars \
  --order=desc \
  --limit="${LIMIT}" \
  --json=name,owner,description,stargazersCount,url \
  'ai OR llm OR gpt OR machine-learning OR neural OR transformer' \
  --jq '.[] | "## \(.owner.login)/\(.name)\n**Stars:** \(.stargazersCount)\n**Description:** \(.description // "No description")\n**URL:** \(.url)\n"'

echo ""
echo "---"
echo "Query: repos created after ${SINCE_DATE}, AI-related keywords, sorted by stars"
