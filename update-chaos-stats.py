import json
from datetime import datetime

# Read existing stats
with open('memory/chaos-stats.json', 'r') as f:
    stats = json.load(f)

# New session data
new_session = {
    "timestamp": "2026-02-24T10:50:00Z",
    "source": "Synthtopia",
    "sourceDomain": "Creative",
    "timeRange": "30 days",
    "lens": "crossDomainSteal",
    "modifier": "scopeExplosion",
    "format": "comparison",
    "topic": "Music Theory Engines for AI Agents",
    "selectedApproach": "Hybrid — Layered Theory Engine (fast static → precise Prolog → flexible LLM)",
    "score": 42,
    "published": False,
    "postPath": "_drafts/2026-02-24-agents-need-theory-engines.md"
}

# Add new session
stats['sessions'].append(new_session)

# Update lens stats
stats['lensStats']['crossDomainSteal']['used'] += 1
stats['lensStats']['crossDomainSteal']['selected'] += 1

# Update modifier stats
stats['modifierStats']['scopeExplosion']['used'] += 1
stats['modifierStats']['scopeExplosion']['selected'] += 1

# Update format stats
stats['formatStats']['comparison']['used'] += 1

# Update recentSourceDomains
stats['recentSourceDomains'] = stats['recentSourceDomains'][-2:] + ['Creative']

# Update review gate total
stats['reviewGate']['total'] += 1

# Write updated stats
with open('memory/chaos-stats.json', 'w') as f:
    json.dump(stats, f, indent=2)

print("✓ chaos-stats.json updated")
print(f"  Total sessions: {len(stats['sessions'])}")
print(f"  Recent domains: {stats['recentSourceDomains']}")
print(f"  Review gate total: {stats['reviewGate']['total']}")
