#!/usr/bin/env bash
# OVI End-to-End Pipeline Test
# Simulates: VS7 sends voice note → OVI transcribes → LG2 processes → briefing output
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PASS=0
FAIL=0

ok() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

echo "🎙️ OVI End-to-End Test"
echo "========================"
echo "Simulating: voice note → transcript → briefing"
echo ""

# Step 1: Generate a simulated voice note
echo "Step 1: Generate simulated voice note"
VOICE_FILE="/tmp/ovi-e2e-$$.wav"
python3 -c "
import wave, struct, math
f = wave.open('$VOICE_FILE', 'w')
f.setnchannels(1); f.setsampwidth(2); f.setframerate(16000)
# Varied frequency pattern (more speech-like)
frames = []
for i in range(16000 * 2):
    t = i / 16000
    freq = 300 + 150 * math.sin(2 * math.pi * 2 * t)
    frames.append(struct.pack('<h', int(12000 * math.sin(2 * math.pi * freq * t))))
f.writeframes(b''.join(frames)); f.close()
print('Voice note created:', '$VOICE_FILE')
"

if [[ -f "$VOICE_FILE" ]]; then
  ok "Voice note file created ($(wc -c < "$VOICE_FILE") bytes)"
else
  fail "Voice note creation failed"
  exit 1
fi

# Step 2: Transcribe
echo ""
echo "Step 2: Whisper transcription"
START=$(date +%s%N)
TRANSCRIPT=$(bash "$SKILL_DIR/scripts/transcribe-voice.sh" "$VOICE_FILE" 2>&1)
END=$(date +%s%N)
LATENCY=$(( (END - START) / 1000000 ))

if [[ -n "$TRANSCRIPT" ]]; then
  ok "Transcript received in ${LATENCY}ms: '$TRANSCRIPT'"
  if [[ $LATENCY -lt 10000 ]]; then
    ok "Latency within target (${LATENCY}ms < 10000ms)"
  else
    fail "Latency too high (${LATENCY}ms >= 10000ms)"
  fi
else
  fail "Transcription returned empty"
fi

# Step 3: Generate briefing
echo ""
echo "Step 3: OVI briefing generation"
BRIEFING_START=$(date +%s%N)
BRIEFING=$(bash "$SKILL_DIR/scripts/ovi-briefing.sh" 2>&1)
BRIEFING_END=$(date +%s%N)
BRIEFING_LATENCY=$(( (BRIEFING_END - BRIEFING_START) / 1000000 ))

if [[ -n "$BRIEFING" ]]; then
  ok "Briefing generated in ${BRIEFING_LATENCY}ms"
else
  fail "Briefing returned empty"
fi

# Validate briefing structure
for SECTION in "STATUS" "DONE" "ACTIVE"; do
  if echo "$BRIEFING" | grep -q "\[$SECTION\]"; then
    ok "Briefing contains [$SECTION]"
  else
    fail "Briefing missing [$SECTION]"
  fi
done

# Step 4: Total pipeline latency
echo ""
echo "Step 4: Full pipeline metrics"
TOTAL_LATENCY=$((LATENCY + BRIEFING_LATENCY))
ok "Total round-trip: ${TOTAL_LATENCY}ms"

if [[ $TOTAL_LATENCY -lt 15000 ]]; then
  ok "Within 15s target for full pipeline"
else
  fail "Exceeds 15s target (${TOTAL_LATENCY}ms)"
fi

# Cleanup
rm -f "$VOICE_FILE"

echo ""
echo "========================"
echo "Briefing output:"
echo "$BRIEFING"
echo "========================"
echo "Results: $PASS passed, $FAIL failed"

[[ $FAIL -eq 0 ]] && exit 0 || exit 1
