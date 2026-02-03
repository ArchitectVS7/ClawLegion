#!/bin/bash
# UAT-4 Verification: Cross-Department Coordination (Design + Engineering)
# Tests that orchestrator can coordinate multiple department heads

VARIANT=${1:-"A"}
UAT_DIR="/root/.openclaw/workspace/legion/UAT4/variant-${VARIANT}"

echo "════════════════════════════════════════════════════════"
echo "  UAT-4 Verification: Cross-Department Coordination"
echo "  Variant: ${VARIANT}"
echo "════════════════════════════════════════════════════════"

PASSED=0
FAILED=0

# 1. Check for multi-department head spawn
echo -e "\n[1/5] Checking department head coordination..."
echo "────────────────────────────────────────────────────────"

DESIGN_HEAD=$(openclaw sessions list 2>/dev/null | grep -c "head-design" || echo "0")
ENGINEERING_HEAD=$(openclaw sessions list 2>/dev/null | grep -c "head-engineering" || echo "0")

if [ "$DESIGN_HEAD" -gt 0 ] && [ "$ENGINEERING_HEAD" -gt 0 ]; then
  echo "✅ PASS: Both department heads spawned"
  echo "   - head-design"
  echo "   - head-engineering"
  ((PASSED++))
elif [ "$DESIGN_HEAD" -gt 0 ] || [ "$ENGINEERING_HEAD" -gt 0 ]; then
  echo "⚠️  PARTIAL: Only one department head spawned"
  echo "   Design head: $DESIGN_HEAD"
  echo "   Engineering head: $ENGINEERING_HEAD"
  echo "   Expected: BOTH heads for cross-department coordination"
  ((FAILED++))
else
  echo "❌ FAIL: No department heads spawned"
  echo "   Expected: head-design AND head-engineering"
  ((FAILED++))
fi

# 2. Check for design specialists
echo -e "\n[2/5] Checking design specialist deployment..."
echo "────────────────────────────────────────────────────────"

DESIGN_SPECIALISTS=$(openclaw sessions list 2>/dev/null | grep -E "(ux-architect|ui-designer|visual-storyteller|brand-guardian|ux-researcher)" || echo "")

if [ -z "$DESIGN_SPECIALISTS" ]; then
  echo "❌ FAIL: No design specialists spawned"
  echo "   Expected: ux-architect, ui-designer, or visual-storyteller"
  ((FAILED++))
else
  DESIGN_COUNT=$(echo "$DESIGN_SPECIALISTS" | wc -l)
  echo "✅ PASS: Design specialists spawned ($DESIGN_COUNT):"
  echo "$DESIGN_SPECIALISTS" | sed 's/^/   /'
  ((PASSED++))
fi

# 3. Check for engineering specialists
echo -e "\n[3/5] Checking engineering specialist deployment..."
echo "────────────────────────────────────────────────────────"

ENG_SPECIALISTS=$(openclaw sessions list 2>/dev/null | grep -E "(frontend-developer|backend-architect|senior-developer)" || echo "")

if [ -z "$ENG_SPECIALISTS" ]; then
  echo "❌ FAIL: No engineering specialists spawned"
  echo "   Expected: frontend-developer or backend-architect"
  ((FAILED++))
else
  ENG_COUNT=$(echo "$ENG_SPECIALISTS" | wc -l)
  echo "✅ PASS: Engineering specialists spawned ($ENG_COUNT):"
  echo "$ENG_SPECIALISTS" | sed 's/^/   /'
  ((PASSED++))
fi

# 4. Check for design deliverables
echo -e "\n[4/5] Checking design deliverables..."
echo "────────────────────────────────────────────────────────"

DESIGN_DIR="${UAT_DIR}/design"
if [ ! -d "$DESIGN_DIR" ]; then
  # Try alternate locations
  DESIGN_FILES=$(find "$UAT_DIR" -type f \( -name "*design*" -o -name "*mockup*" -o -name "*wireframe*" -o -name "style-guide*" \) 2>/dev/null | wc -l)
else
  DESIGN_FILES=$(find "$DESIGN_DIR" -type f 2>/dev/null | wc -l)
fi

if [ $DESIGN_FILES -eq 0 ]; then
  echo "⚠️  WARNING: No explicit design artifacts found"
  echo "   Expected: Design specs, mockups, or style guides"
  echo "   (May be inline in implementation - check manually)"
else
  echo "✅ PASS: Design artifacts created: $DESIGN_FILES file(s)"
  find "$UAT_DIR" -type f \( -name "*design*" -o -name "*mockup*" -o -name "*.md" \) 2>/dev/null | head -5 | sed 's/^/   /'
  ((PASSED++))
fi

# 5. Check for implementation deliverables
echo -e "\n[5/5] Checking implementation deliverables..."
echo "────────────────────────────────────────────────────────"

if [ ! -d "$UAT_DIR" ]; then
  echo "❌ FAIL: Variant directory not found: $UAT_DIR"
  ((FAILED++))
else
  IMPL_FILES=$(find "$UAT_DIR" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.jsx" -o -name "*.tsx" \) 2>/dev/null | wc -l)
  
  if [ $IMPL_FILES -eq 0 ]; then
    echo "❌ FAIL: No implementation files created"
    echo "   Expected: HTML/CSS/JS files for landing page"
    ((FAILED++))
  else
    echo "✅ PASS: Implementation files created: $IMPL_FILES"
    find "$UAT_DIR" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.jsx" \) | head -10 | sed 's/^/   /'
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
  echo -e "\n✅ UAT-4 Variant ${VARIANT}: PASS"
  echo "   Cross-department coordination successful"
  exit 0
else
  echo -e "\n❌ UAT-4 Variant ${VARIANT}: FAIL"
  echo "   See failures above"
  exit 1
fi
