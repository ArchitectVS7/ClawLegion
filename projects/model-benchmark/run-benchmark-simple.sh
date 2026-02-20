#!/usr/bin/env bash
# Model Benchmark Runner (Simplified)
# LG2 runs this script, spawns sub-agents for each test

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace/projects/model-benchmark"

echo "🔬 Model Benchmark Suite"
echo "Testing 2 models (Claude Sonnet 4.5, Qwen Coder) on 3 tasks"
echo ""
echo "This will spawn 6 isolated sub-agent sessions (2 models × 3 tasks)"
echo "Each session will complete its task and save results to outputs/"
echo ""
echo "Estimated time: ~15-20 minutes"
echo ""
read -p "Press Enter to start benchmark..."

# We'll call sessions_spawn via the LG2 tool (not via openclaw CLI)
# This script just documents the process
# LG2 will execute the spawns directly using the sessions_spawn tool

echo "Ready to spawn benchmark sessions."
echo "LG2: Use sessions_spawn tool to create 6 sessions with these specs:"
echo ""
echo "Models: anthropic/claude-sonnet-4-5, qwen-portal/coder-model"
echo "Tasks: task1-feature, task2-refactor, task3-webapp"
echo ""
echo "Session naming: bench-{model-name}-{task-number}-{timestamp}"
echo "Cleanup: keep (we need to review outputs)"
echo "Timeout: 300s (task1,task2), 600s (task3)"
