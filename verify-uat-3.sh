#!/bin/bash
# UAT-3 Verification: Multi-Specialist Coordination (4+ Agents)
# Tests that orchestrator can coordinate complex full-stack tasks

VARIANT=${1:-"A"}
UAT_DIR="/root/.openclaw/workspace/legion/UAT3/variant-${VARIANT}"

echo "════════════════════════════════════════════════════════"
echo "  UAT-3 Verification: Multi-Specialist Coordination"
echo "  Variant: ${VARIANT}"
echo "════════════════════════════════════════════════════════"

PASSED=0
FAILED=0

# 1. Check for department head spawn
echo -e "\n[1/5] Checking department head deployment..."
echo "────────────────────────────────────────────────────────"

HEAD_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -c "head-engineering" || echo "0")

if [ "$HEAD_SPAWNED" -gt 0 ]; then
  echo "✅ PASS: Department head spawned (head-engineering)"
  ((PASSED++))
else
  echo "❌ FAIL: No department head spawned"
  echo "   Expected: head-engineering for complex task coordination"
  ((FAILED++))
fi

# 2. Check for multi-specialist spawn (4+)
echo -e "\n[2/5] Checking specialist count..."
echo "────────────────────────────────────────────────────────"

SPECIALIST_COUNT=$(openclaw sessions list 2>/dev/null | grep -c "subagent" || echo "0")

if [ "$SPECIALIST_COUNT" -ge 4 ]; then
  echo "✅ PASS: Multiple specialists spawned ($SPECIALIST_COUNT total)"
  openclaw sessions list 2>/dev/null | grep "subagent" | sed 's/^/   /'
  ((PASSED++))
else
  echo "❌ FAIL: Insufficient specialists spawned ($SPECIALIST_COUNT)"
  echo "   Expected: 4+ specialists for complex task"
  ((FAILED++))
fi

# 3. Check for cross-specialist work (backend + frontend)
echo -e "\n[3/5] Checking cross-specialist coordination..."
echo "────────────────────────────────────────────────────────"

BACKEND_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -E "(backend-architect|senior-developer)" | wc -l || echo "0")
FRONTEND_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -E "(frontend-developer|ui-designer)" | wc -l || echo "0")

if [ "$BACKEND_SPAWNED" -gt 0 ] && [ "$FRONTEND_SPAWNED" -gt 0 ]; then
  echo "✅ PASS: Both backend and frontend specialists deployed"
  echo "   Backend: $BACKEND_SPAWNED agent(s)"
  echo "   Frontend: $FRONTEND_SPAWNED agent(s)"
  ((PASSED++))
else
  echo "❌ FAIL: Missing full-stack coordination"
  echo "   Backend agents: $BACKEND_SPAWNED"
  echo "   Frontend agents: $FRONTEND_SPAWNED"
  echo "   Expected: Both backend AND frontend specialists"
  ((FAILED++))
fi

# 4. Check for QA validation
echo -e "\n[4/5] Checking QA validation..."
echo "────────────────────────────────────────────────────────"

QA_SPAWNED=$(openclaw sessions list 2>/dev/null | grep -E "(reality-checker|api-tester|test-results-analyzer)" || echo "")

if [ -z "$QA_SPAWNED" ]; then
  echo "❌ FAIL: No QA validation performed"
  echo "   Expected: reality-checker or testing agent"
  ((FAILED++))
else
  echo "✅ PASS: QA validation detected:"
  echo "$QA_SPAWNED" | sed 's/^/   /'
  ((PASSED++))
fi

# 5. Check for full-stack deliverables
echo -e "\n[5/5] Checking full-stack deliverables..."
echo "────────────────────────────────────────────────────────"

if [ ! -d "$UAT_DIR" ]; then
  echo "❌ FAIL: Variant directory not found: $UAT_DIR"
  ((FAILED++))
else
  BACKEND_FILES=$(find "$UAT_DIR" -path "*/backend/*" -o -path "*/server/*" -o -path "*/api/*" -type f 2>/dev/null | wc -l)
  FRONTEND_FILES=$(find "$UAT_DIR" -path "*/frontend/*" -o -path "*/client/*" -o -path "*/ui/*" -type f 2>/dev/null | wc -l)
  
  if [ $BACKEND_FILES -eq 0 ] || [ $FRONTEND_FILES -eq 0 ]; then
    echo "❌ FAIL: Incomplete full-stack implementation"
    echo "   Backend files: $BACKEND_FILES"
    echo "   Frontend files: $FRONTEND_FILES"
    echo "   Expected: Both backend AND frontend files"
    ((FAILED++))
  else
    echo "✅ PASS: Full-stack deliverables created"
    echo "   Backend files: $BACKEND_FILES"
    echo "   Frontend files: $FRONTEND_FILES"
    find "$UAT_DIR" -type f | head -15 | sed 's/^/   /'
    ((PASSED++))
  fi
fi

# Summary
echo -e "\n════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "════════════════════════════════════════════════════════"
echo "  Passed: $PASSED/5"
echo "  Failed: $FAILED/5"

if [ $FAILED -eq 0 ]; then
  echo -e "\n✅ UAT-3 Variant ${VARIANT}: PASS"
  echo "   Multi-specialist coordination successful"
  exit 0
else
  echo -e "\n❌ UAT-3 Variant ${VARIANT}: FAIL"
  echo "   See failures above"
  exit 1
fi
