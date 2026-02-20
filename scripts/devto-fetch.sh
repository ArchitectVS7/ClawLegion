#!/usr/bin/env bash
# devto-fetch.sh - Fetch top Dev.to articles (AI/ML tag)

set -euo pipefail

TAG=${1:-ai}
LIMIT=${2:-50}

echo "# Dev.to - ${TAG} Tag (Top Week)"
echo "Fetched: $(date -u '+%Y-%m-%d %H:%M UTC')"
echo ""

# Fetch articles from Dev.to API
ARTICLES=$(curl -s "https://dev.to/api/articles?tag=${TAG}&top=7&per_page=${LIMIT}")

echo "$ARTICLES" | jq -r '.[] | "## \(.title)\n**Author:** \(.user.name)\n**Reactions:** \(.public_reactions_count)\n**URL:** \(.url)\n**Published:** \(.published_at)\n\n\(.description)\n\n---\n"'

echo ""
echo "Total articles fetched: $(echo "$ARTICLES" | jq '. | length')"
