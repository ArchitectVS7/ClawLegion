# Oscilloscope Calculus → Agent Offload Computation

**Source:** Hackaday (Feb 23, 2026) — "Calculus By Oscilloscope"  
**Finding:** Modern oscilloscopes can perform integration and differentiation in hardware, offloading computation from software.

**Lens:** Cross-Domain Steal (d10=10)  
**Modifier:** Tool Restriction (only use tools unused in last 7 days)  
**Format:** Tutorial (d6=2)

**Core Insight:** Oscilloscopes do calculus in analog hardware instead of sampling + software. What's the agent equivalent? What "computation" can we offload to external systems instead of burning LLM tokens?

---

## Brainstorm: 5 Divergent Approaches

### Approach 1: Database-as-Differentiator
**Thesis:** Use SQL window functions to compute deltas instead of loading full history into context.

**Implementation:**
```sql
-- Instead of: Load all logs, ask LLM "what changed?"
SELECT 
  timestamp,
  value,
  value - LAG(value) OVER (ORDER BY timestamp) as delta,
  (value - LAG(value) OVER (ORDER BY timestamp)) / 
    EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (ORDER BY timestamp))) as rate
FROM metrics
WHERE timestamp > NOW() - INTERVAL '1 hour';
```

Agent asks: "Show me rate-of-change > threshold" instead of "analyze this time series."

**Tool Restriction:** Use raw SQL (psql), not an ORM. Haven't touched psql directly in weeks.

**Score:**
- Novelty: 7 (SQL as compute, not just storage)
- Viability: 9 (works today)
- Impact: 6 (niche — only applies to time-series data)
- Fun: 5 (SQL isn't exciting)
- Diversity: 6 (incremental optimization)

**Total: 33/50**

---

### Approach 2: grep-as-Integrator
**Thesis:** Use shell tools to accumulate/summarize instead of loading everything into context.

**Implementation:**
```bash
# Instead of: Load all logs, ask LLM "how many errors?"
grep ERROR app.log | wc -l

# Instead of: "Summarize today's deployments"
git log --since="midnight" --grep="deploy" --oneline | \
  awk '{print $1}' | \
  xargs -I {} git show --stat {} | \
  grep "files changed" | \
  awk '{sum+=$1} END {print sum " files changed today"}'
```

Agent should call shell pipelines for accumulation/aggregation before asking LLM for interpretation.

**Tool Restriction:** Use awk/sed/grep — classic UNIX tools, not touched recently.

**Score:**
- Novelty: 5 (this is what UNIX is for)
- Viability: 10 (instant, universal)
- Impact: 7 (high for log analysis)
- Fun: 6 (shell golf is satisfying)
- Diversity: 7 (totally different implementation)

**Total: 35/50**

---

### Approach 3: Cron-as-Differentiator (Time-Domain Offload)
**Thesis:** Instead of "check if X changed," schedule a cron job that only notifies on delta.

**Implementation:**
```bash
#!/bin/bash
# Save to /usr/local/bin/notify-on-price-change.sh

LAST=$(cat /tmp/btc-price 2>/dev/null || echo 0)
CURRENT=$(curl -s 'https://api.coinbase.com/v2/prices/BTC-USD/spot' | jq -r '.data.amount')

DELTA=$(echo "$CURRENT - $LAST" | bc)
PERCENT=$(echo "scale=2; ($DELTA / $LAST) * 100" | bc)

if (( $(echo "$PERCENT > 5 || $PERCENT < -5" | bc -l) )); then
  echo "$CURRENT" > /tmp/btc-price
  notify-send "BTC moved ${PERCENT}%"
fi
```

Add to crontab: `*/15 * * * * /usr/local/bin/notify-on-price-change.sh`

Agent never needs to "check price" — it gets notified only when the derivative exceeds threshold.

**Tool Restriction:** Use cron + shell scripts, not heartbeat system.

**Score:**
- Novelty: 8 (time-domain computation offload)
- Viability: 9 (classic UNIX)
- Impact: 8 (applies to any monitoring scenario)
- Fun: 7 (elegant)
- Diversity: 8 (totally different from SQL)

**Total: 40/50**

---

### Approach 4: File Watcher as Integrator (Event-Driven Accumulation)
**Thesis:** Use `inotifywait` to accumulate events, only call agent when threshold reached.

**Implementation:**
```bash
#!/bin/bash
# Watch a directory, accumulate file changes, notify agent every 10 edits

COUNT=0
inotifywait -m -e modify,create,delete /path/to/code | while read event; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge 10 ]; then
    echo "10 files changed, notifying agent..."
    # Call agent with summary, not individual events
    ls -lt /path/to/code | head -10 | openclaw send --session main
    COUNT=0
  fi
done
```

Agent sees: "10 files changed in last 5 minutes" (batched integration), not "file A changed, file B changed..." (spam).

**Tool Restriction:** Use inotify-tools, not previously used.

**Score:**
- Novelty: 8 (file-system as integrator)
- Viability: 8 (Linux only, but solid)
- Impact: 7 (applies to live coding scenarios)
- Fun: 8 (very elegant)
- Diversity: 9 (completely different domain)

**Total: 40/50**

---

### Approach 5: systemd Timer as Rate Limiter (Frequency-Domain Offload)
**Thesis:** Use systemd timers with `OnUnitInactiveSec` to rate-limit agent checks to "only when quiet."

**Implementation:**
```ini
# /etc/systemd/system/agent-backup-check.timer
[Unit]
Description=Check backups only when system is idle

[Timer]
OnUnitInactiveSec=30m
AccuracySec=5m

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/agent-backup-check.service
[Unit]
Description=Agent Backup Check

[Service]
Type=oneshot
ExecStart=/usr/local/bin/check-backups.sh
```

Agent never "polls" backups. Timer only fires when system is idle for 30 minutes — natural rate limiting without token cost.

**Tool Restriction:** Use systemd timers (not cron, not heartbeat).

**Score:**
- Novelty: 7 (systemd is underused for orchestration)
- Viability: 8 (Linux with systemd)
- Impact: 6 (narrow use case)
- Fun: 6 (systemd syntax is not exciting)
- Diversity: 7 (different from inotify)

**Total: 34/50**

---

## Selected Approach: #3 (Cron-as-Differentiator) + #4 (File Watcher as Integrator)

**Why:** Both score 40/50. Both exemplify the core insight: move accumulation/differentiation out of LLM context into external systems. Together they cover time-domain (cron) and event-domain (inotify).

**Article Plan (Tutorial Format):**
- Title: "Your Agent Shouldn't Compute — Offload to the OS"
- Hook: Oscilloscopes do calculus in hardware. Your shell can too.
- Section 1: The Token Tax (why agents shouldn't accumulate)
- Section 2: Cron as Differentiator (time-domain offload)
- Section 3: File Watcher as Integrator (event-domain offload)
- Section 4: When to Offload vs. When to Compute in Context
- Working code for both examples
- What's Next: Database window functions, systemd timers, other OS-level primitives

**Estimated length:** 700-900 words (tutorial format target)

---

**Timestamp:** 2026-02-24 00:50 UTC  
**Status:** Ready to write article
