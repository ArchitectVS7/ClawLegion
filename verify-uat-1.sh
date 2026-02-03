#!/bin/bash
# UAT-1 Verification: Single Specialist Delegation
# Tests that orchestrator delegates simple tasks to a single specialist

VARIANT=${1:-"A"}  # Default to variant A if not specified
UAT_DIR="/root/.openclaw/workspace/legion/UAT1/variant-${VARIANT}"

echo "════════════════════════════════════════════════════════"
echo "  UAT-1 Verification: Single Specialist Delegation"
echo "  Variant: ${VARIANT}"
echo "════════════════════════════════════════════════════════"

PASSED=0
FAILED=0

# 1. Check for agent delegation
echo -e "\n[1/3] Checking agent delegation..."
echo "────────────────────────────────────────────────────────"

SESSIONS=$(openclaw sessions list 2>/dev/null | grep -E "(frontend-developer|ui-designer|head-design)" || echo "")

if [ -z "$SESSIONS" ]; then
  echo "❌ FAIL: No specialist agents spawned"
  echo "   Expected: frontend-developer, ui-designer, or head-design"
  ((FAILED++))
else
  echo "✅ PASS: Specialist agent(s) spawned:"
  echo "$SESSIONS" | sed 's/^/   /'
  ((PASSED++))
fi

# 2. Check for deliverables
echo -e "\n[2/3] Checking deliverables..."
echo "────────────────────────────────────────────────────────"

if [ ! -d "$UAT_DIR" ]; then
  echo "❌ FAIL: Variant directory not found: $UAT_DIR"
  ((FAILED++))
else
  FILE_COUNT=$(find "$UAT_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | wc -l)
  
  if [ $FILE_COUNT -eq 0 ]; then
    echo "❌ FAIL: No component files created"
    echo "   Expected: React component file (.jsx/.js/.tsx/.ts)"
    ((FAILED++))
  else
    echo "✅ PASS: Component file(s) created: $FILE_COUNT"
    find "$UAT_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" \) -exec echo "   {}" \;
    ((PASSED++))
  fi
fi

# 3. Check orchestrator didn't do all the work
echo -e "\n[3/3] Checking orchestration pattern..."
echo "────────────────────────────────────────────────────────"

SUBAGENT_COUNT=$(openclaw sessions list 2>/dev/null | grep -c "subagent" || echo "0")

if [ "$SUBAGENT_COUNT" -eq 0 ]; then
  echo "⚠️  WARNING: No subagents spawned - orchestrator may have done all work"
  echo "   This is a delegation test failure"
  ((FAILED++))
else
  echo "✅ PASS: Delegation occurred ($SUBAGENT_COUNT subagent(s) spawned)"
  ((PASSED++))
fi

# Summary
echo -e "\n════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "════════════════════════════════════════════════════════"
echo "  Passed: $PASSED/3"
echo "  Failed: $FAILED/3"

if [ $FAILED -eq 0 ]; then
  echo -e "\n✅ UAT-1 Variant ${VARIANT}: PASS"
  echo "   Task delegation successful + deliverables created"
  exit 0
else
  echo -e "\n❌ UAT-1 Variant ${VARIANT}: FAIL"
  echo "   See failures above"
  exit 1
fi
