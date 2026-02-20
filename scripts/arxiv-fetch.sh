#!/usr/bin/env bash
# arxiv-fetch.sh - Fetch recent AI papers from ArXiv

set -euo pipefail

CATEGORY=${1:-"cs.AI"}  # cs.AI, cs.LG, cs.CL, etc.
MAX_RESULTS=${2:-10}

echo "# ArXiv Recent Papers - ${CATEGORY}"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Fetch recent papers (sorted by submission date)
URL="http://export.arxiv.org/api/query?search_query=cat:${CATEGORY}&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_RESULTS}"

DATA=$(curl -s "$URL")

# Parse XML using basic grep/sed (no xmllint dependency)
echo "$DATA" | grep -o '<entry>.*</entry>' | while IFS= read -r entry; do
  TITLE=$(echo "$entry" | grep -o '<title>.*</title>' | sed 's/<title>//;s/<\/title>//' | head -1)
  SUMMARY=$(echo "$entry" | grep -o '<summary>.*</summary>' | sed 's/<summary>//;s/<\/summary>//' | head -1 | cut -c1-200)
  LINK=$(echo "$entry" | grep -o '<id>.*</id>' | sed 's/<id>//;s/<\/id>//' | head -1)
  PUBLISHED=$(echo "$entry" | grep -o '<published>.*</published>' | sed 's/<published>//;s/<\/published>//' | head -1 | cut -d'T' -f1)
  
  if [ -n "$TITLE" ]; then
    echo "## ${TITLE}"
    echo "**Published:** ${PUBLISHED}"
    echo "**Link:** ${LINK}"
    echo "**Summary:** ${SUMMARY}..."
    echo ""
  fi
done

# Fallback if no entries found
if ! echo "$DATA" | grep -q '<entry>'; then
  echo "No recent papers found in category '${CATEGORY}'."
fi
