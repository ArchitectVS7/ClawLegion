#!/usr/bin/env bash
# Model Benchmark Runner
# Tests 3 coding tasks across multiple models

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace/projects/model-benchmark"
TASKS_DIR="${WORKSPACE}/tasks"
OUTPUTS_DIR="${WORKSPACE}/outputs"

# Models to test
MODELS=(
  "anthropic/claude-sonnet-4-5"
  "qwen-portal/coder-model"
  # "step-ai/step-3.5-flash"  # TODO: Add when available via OpenClaw routing
)

MODEL_NAMES=(
  "claude-sonnet-4.5"
  "qwen-coder"
  # "step-3.5-flash"
)

echo "🔬 Model Benchmark Suite"
echo "Testing ${#MODELS[@]} models on 3 tasks..."
echo ""

# Task 1: Feature Addition (Dark Mode)
run_task1() {
  local model=$1
  local model_name=$2
  local output_dir="${OUTPUTS_DIR}/${model_name}/task1"
  
  echo "  → Running Task 1 (Dark Mode Toggle) with ${model_name}..."
  
  # Create prompt
  local prompt=$(cat <<EOF
You are a coding assistant. Complete this task:

$(cat ${TASKS_DIR}/task1-feature.md)

Provide ONLY the complete modified HTML file. No explanations, just the code.
EOF
)
  
  # Run via isolated session with model override
  START=$(date +%s)
  
  # Use sessions_spawn to control model
  # Output will be announced back, we'll capture from session history
  SESSION_LABEL="bench-${model_name}-t1-$(date +%s)"
  
  # Spawn isolated session with specific model
  echo "${prompt}" | openclaw sessions spawn \
    --label="${SESSION_LABEL}" \
    --model="${model}" \
    --cleanup=keep \
    --timeout=300 \
    > "${output_dir}/spawn.log" 2>&1 || echo "ERROR" > "${output_dir}/error.log"
  
  # Wait for completion + extract response
  sleep 5
  openclaw sessions history --label="${SESSION_LABEL}" --limit=5 > "${output_dir}/response.txt" 2>&1
  
  END=$(date +%s)
  
  DURATION=$((END - START))
  echo "${DURATION}" > "${output_dir}/duration.txt"
  
  echo "     ✓ Completed in ${DURATION}s"
}

# Task 2: Refactoring
run_task2() {
  local model=$1
  local model_name=$2
  local output_dir="${OUTPUTS_DIR}/${model_name}/task2"
  
  echo "  → Running Task 2 (Express Refactor) with ${model_name}..."
  
  local prompt=$(cat <<EOF
You are a coding assistant. Complete this task:

$(cat ${TASKS_DIR}/task2-refactor.md)

Provide the refactored code structure. Show each file separately with clear filenames.
EOF
)
  
  START=$(date +%s)
  openclaw sessions send \
    --label="benchmark-${model_name}-task2" \
    --agent=lg2 \
    --message="${prompt}" \
    --timeout=300 \
    > "${output_dir}/response.txt" 2>&1 || echo "ERROR" > "${output_dir}/error.log"
  END=$(date +%s)
  
  DURATION=$((END - START))
  echo "${DURATION}" > "${output_dir}/duration.txt"
  
  echo "     ✓ Completed in ${DURATION}s"
}

# Task 3: Full Web App
run_task3() {
  local model=$1
  local model_name=$2
  local output_dir="${OUTPUTS_DIR}/${model_name}/task3"
  
  echo "  → Running Task 3 (Task Manager PWA) with ${model_name}..."
  
  local prompt=$(cat <<EOF
You are a coding assistant. Complete this task:

$(cat ${TASKS_DIR}/task3-webapp.md)

Provide the complete working application code. If single-file, show the full HTML. If multi-file, show each file clearly labeled.
EOF
)
  
  START=$(date +%s)
  openclaw sessions send \
    --label="benchmark-${model_name}-task3" \
    --agent=lg2 \
    --message="${prompt}" \
    --timeout=600 \
    > "${output_dir}/response.txt" 2>&1 || echo "ERROR" > "${output_dir}/error.log"
  END=$(date +%s)
  
  DURATION=$((END - START))
  echo "${DURATION}" > "${output_dir}/duration.txt"
  
  echo "     ✓ Completed in ${DURATION}s"
}

# Run all benchmarks
for i in "${!MODELS[@]}"; do
  model="${MODELS[$i]}"
  model_name="${MODEL_NAMES[$i]}"
  
  echo ""
  echo "📊 Testing ${model_name} (${model})"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  run_task1 "$model" "$model_name"
  run_task2 "$model" "$model_name"
  run_task3 "$model" "$model_name"
done

echo ""
echo "✅ Benchmark complete!"
echo "📁 Results saved to: ${OUTPUTS_DIR}/"
echo ""
echo "Next: Run './analyze-results.sh' to generate comparison report"
