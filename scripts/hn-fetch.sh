#!/usr/bin/env bash
# hn-fetch.sh - Fetch top Hacker News stories (AI/ML filtered)

set -euo pipefail

LIMIT=${1:-50}  # Increased default for more variety

echo "# Hacker News - Top Stories (AI/ML)"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Fetch top story IDs
TOP_IDS=$(curl -s 'https://hacker-news.firebaseio.com/v0/topstories.json' | jq -r ".[:${LIMIT}][]")

count=0
for id in $TOP_IDS; do
  # Fetch story details
  STORY=$(curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json")
  
  TITLE=$(echo "$STORY" | jq -r '.title // "No title"')
  URL=$(echo "$STORY" | jq -r '.url // ""')
  SCORE=$(echo "$STORY" | jq -r '.score // 0')
  COMMENTS=$(echo "$STORY" | jq -r '.descendants // 0')
  
  # Filter: only show if title contains AI/ML keywords (case-insensitive)
  if echo "$TITLE" | grep -qiE 'ai|llm|gpt|claude|ml|machine learning|neural|transformer|model|agent'; then
    count=$((count + 1))
    echo "## ${count}. ${TITLE}"
    echo "**Score:** ${SCORE} | **Comments:** ${COMMENTS}"
    if [ -n "$URL" ]; then
      echo "**Link:** ${URL}"
    else
      echo "**Discussion:** https://news.ycombinator.com/item?id=${id}"
    fi
    echo ""
  fi
  
  # Stop if we've found enough AI/ML stories
  if [ "$count" -ge 5 ]; then
    break
  fi
done

if [ "$count" -eq 0 ]; then
  echo "No AI/ML stories found in top ${LIMIT} HN posts."
fi
