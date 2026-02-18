#!/usr/bin/env bash
# OVI Pipeline Tests
# Run: bash test-ovi.sh
# Tests: transcription, briefing format, file handling
set -euo pipefail

PASS=0
FAIL=0
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ok() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

echo "🎙️ OVI Pipeline Tests"
echo "====================="
echo ""

# Test 1: OPENAI_API_KEY available
echo "Test 1: API key available"
if [[ -n "${OPENAI_API_KEY:-}" ]]; then
  ok "OPENAI_API_KEY is set"
else
  fail "OPENAI_API_KEY not set — transcription will fail"
fi

# Test 2: transcribe-voice.sh exists and is executable
echo "Test 2: Scripts exist"
if [[ -f "$SKILL_DIR/scripts/transcribe-voice.sh" ]]; then
  ok "transcribe-voice.sh found"
else
  fail "transcribe-voice.sh missing"
fi

if [[ -f "$SKILL_DIR/scripts/ovi-briefing.sh" ]]; then
  ok "ovi-briefing.sh found"
else
  fail "ovi-briefing.sh missing"
fi

# Test 3: Generate test audio and transcribe
echo "Test 3: Transcription pipeline"
TEST_AUDIO="/tmp/ovi-test-$$.wav"

python3 -c "
import wave, struct, math
f = wave.open('$TEST_AUDIO', 'w')
f.setnchannels(1); f.setsampwidth(2); f.setframerate(16000)
frames = [struct.pack('<h', int(16000 * math.sin(2 * math.pi * 440 * t / 16000))) for t in range(16000)]
f.writeframes(b''.join(frames)); f.close()
" 2>/dev/null

if [[ -f "$TEST_AUDIO" ]]; then
  ok "Test audio generated"
  
  TRANSCRIPT=$(bash "$SKILL_DIR/scripts/transcribe-voice.sh" "$TEST_AUDIO" 2>&1)
  if [[ -n "$TRANSCRIPT" ]]; then
    ok "Transcription returned output: '$TRANSCRIPT'"
  else
    fail "Transcription returned empty output"
  fi
  
  rm -f "$TEST_AUDIO"
else
  fail "Could not generate test audio (python3 required)"
fi

# Test 4: Briefing output format
echo "Test 4: Briefing format"
BRIEFING=$(bash "$SKILL_DIR/scripts/ovi-briefing.sh" 2>&1)

for SECTION in "STATUS" "DONE" "ACTIVE"; do
  if echo "$BRIEFING" | grep -q "\[$SECTION\]"; then
    ok "Briefing contains [$SECTION] section"
  else
    fail "Briefing missing [$SECTION] section"
  fi
done

# Test 5: Phase progress tracking
echo "Test 5: Spec progress tracking"
OVI_SPEC="/root/.openclaw/workspace/sparks/OVI-SPEC.md"
if [[ -f "$OVI_SPEC" ]]; then
  ok "OVI-SPEC.md exists"
  COMPLETED=$(awk '/## 📋 PHASE 1/,/## 📋 PHASE 2/' "$OVI_SPEC" | grep -c "\[x\]" || echo 0)
  PENDING=$(awk '/## 📋 PHASE 1/,/## 📋 PHASE 2/' "$OVI_SPEC" | grep -c "\[ \]" || echo 0)
  ok "Phase 1: ${COMPLETED} complete, ${PENDING} pending"
else
  fail "OVI-SPEC.md not found"
fi

# Test 6: No-file error handling
echo "Test 6: Error handling"
ERROR_OUTPUT=$(bash "$SKILL_DIR/scripts/transcribe-voice.sh" /tmp/nonexistent-file-$$.wav 2>&1 || true)
if echo "$ERROR_OUTPUT" | grep -q "not found\|No such file"; then
  ok "Missing file error handled gracefully"
else
  fail "Missing file error not handled (got: $ERROR_OUTPUT)"
fi

echo ""
echo "====================="
echo "Results: $PASS passed, $FAIL failed"
echo ""

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
exit 0
