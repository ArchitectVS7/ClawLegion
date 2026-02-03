#!/bin/bash
# UAT-2 Verification: Squad Deployment (Department Head + Specialists)
# Tests that orchestrator delegates medium-complexity tasks with QA coordination

VARIANT=${1:-"A"}
UAT_DIR="/root/.openclaw/workspace/legion/UAT2/variant-${VARIANT}"

echo "════════════════════════════════════════════════════════"
echo "  UAT-2 Verification: Squad Deployment"
echo "  Variant: ${VARIANT}"
echo "════════════════════════════════════════════════════════"

PASSED=0
FAILED=0

# 1. Check for department head or multi-specialist spawn
echo -e "\n[1/4] Checking squad deployment..."
echo "────────────────────────────────────────────────────────"

HEAD_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -c "head-engineering" || echo "0")
BACKEND_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -E "(backend-architect|senior-developer)" || echo "")
SPECIALIST_COUNT=$(openclaw sessions list 2>/dev/null | grep -c "subagent" || echo "0")

if [ "$HEAD_SPAWNED" -gt 0 ]; then
  echo "✅ PASS: Department head spawned (head-engineering)"
  ((PASSED++))
elif [ "$SPECIALIST_COUNT" -ge 2 ]; then
  echo "✅ PASS: Multiple specialists spawned directly ($SPECIALIST_COUNT total)"
  echo "$BACKEND_SPAWNED" | sed 's/^/   /'
  ((PASSED++))
else
  echo "❌ FAIL: No department head or squad spawned"
  echo "   Expected: head-engineering OR 2+ specialists"
  ((FAILED++))
fi

# 2. Check for QA coordination
echo -e "\n[2/4] Checking QA coordination..."
echo "────────────────────────────────────────────────────────"

QA_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -E "(reality-checker|api-tester|test-results-analyzer)" || echo "")

if [ -z "$QA_SPAWNED" ]; then
  echo "❌ FAIL: No QA agents spawned"
  echo "   Expected: reality-checker, api-tester, or test-results-analyzer"
  ((FAILED++))
else
  echo "✅ PASS: QA coordination detected:"
  echo "$QA_SPAWNED" | sed 's/^/   /'
  ((PASSED++))
fi

# 3. Check for API deliverables
echo -e "\n[3/4] Checking API deliverables..."
echo "────────────────────────────────────────────────────────"

if [ ! -d "$UAT_DIR" ]; then
  echo "❌ FAIL: Variant directory not found: $UAT_DIR"
  ((FAILED++))
else
  API_FILES=$(find "$UAT_DIR" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) 2>/dev/null | wc -l)
  
  if [ $API_FILES -eq 0 ]; then
    echo "❌ FAIL: No API files created"
    echo "   Expected: API implementation files"
    ((FAILED++))
  else
    echo "✅ PASS: API files created: $API_FILES"
    find "$UAT_DIR" -type f \( -name "*.js" -o -name "*.ts" \) | head -10 | sed 's/^/   /'
    ((PASSED++))
  fi
fi

# 4. Check orchestration pattern
echo -e "\n[4/4] Checking delegation pattern..."
echo "────────────────────────────────────────────────────────"

if [ "$SPECIALIST_COUNT" -lt 2 ]; then
  echo "❌ FAIL: Squad deployment expected but only $SPECIALIST_COUNT subagent(s) spawned"
  echo "   Expected: 2+ specialists coordinated"
  ((FAILED++))
else
  echo "✅ PASS: Squad deployment successful ($SPECIALIST_COUNT subagent(s))"
  ((PASSED++))
fi

# Summary
echo -e "\n════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "════════════════════════════════════════════════════════"
echo "  Passed: $PASSED/4"
echo "  Failed: $FAILED/4"

if [ $FAILED -eq 0 ]; then
  echo -e "\n✅ UAT-2 Variant ${VARIANT}: PASS"
  echo "   Squad deployment + QA coordination successful"
  exit 0
else
  echo -e "\n❌ UAT-2 Variant ${VARIANT}: FAIL"
  echo "   See failures above"
  exit 1
fi
