#!/bin/bash
# Master UAT Verification Script
# Runs all UAT verifications and generates summary report

LEGION_DIR="/root/.openclaw/workspace/legion"
cd "$LEGION_DIR" || exit 1

echo "════════════════════════════════════════════════════════════════"
echo "  ClawLegion UAT Suite - Master Verification"
echo "════════════════════════════════════════════════════════════════"
echo ""

VARIANT=${1:-"A"}  # Default to variant A
RUN_UAT=${2:-"all"}  # Default to all UATs

RESULTS=()
TOTAL_PASSED=0
TOTAL_FAILED=0

run_uat() {
  local uat_num=$1
  local variant=$2
  
  echo ""
  echo "▶ Running UAT-${uat_num} Variant ${variant}..."
  echo ""
  
  if bash "./verify-uat-${uat_num}.sh" "$variant"; then
    RESULTS+=("✅ UAT-${uat_num} Variant ${variant}: PASS")
    ((TOTAL_PASSED++))
  else
    RESULTS+=("❌ UAT-${uat_num} Variant ${variant}: FAIL")
    ((TOTAL_FAILED++))
  fi
  
  echo ""
  echo "────────────────────────────────────────────────────────────────"
}

# Run requested UATs
if [ "$RUN_UAT" = "all" ]; then
  for i in 1 2 3 4; do
    run_uat "$i" "$VARIANT"
  done
else
  run_uat "$RUN_UAT" "$VARIANT"
fi

# Final Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  FINAL SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""

for result in "${RESULTS[@]}"; do
  echo "  $result"
done

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "  Total Passed: $TOTAL_PASSED"
echo "  Total Failed: $TOTAL_FAILED"
echo "────────────────────────────────────────────────────────────────"
echo ""

if [ $TOTAL_FAILED -eq 0 ]; then
  echo "🎉 ALL UATS PASSED - ClawLegion orchestration working correctly!"
  exit 0
else
  echo "⚠️  SOME UATS FAILED - Review failures above"
  exit 1
fi
