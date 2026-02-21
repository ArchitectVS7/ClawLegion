---
layout: post
title: "Agent Development: Test Like an Agency, Not a Lab"
date: 2026-02-21 03:41:00 -0600
categories: [ai, orchestration]
tags: [agents, testing, first-principles, workflows]
---

Most AI agents are built for imagined use cases. Then they break on the first real workflow.

<!--more-->

## The Pattern: Agency as Testing Ground

An IndieHackers founder hit $10k/mo by running their agency as a testing ground for SaaS products. Client work revealed pain points. Pain points became products. The agency provided both revenue and validation.

Here's the insight: **An AI orchestrator spawning specialist agents IS an agency.** The "client work" is the task prompts. The "testing ground" is workflow execution.

This changes how you build agents.

## First Principles: What Does a Specialist Agent Actually Need?

Before writing code, strip away assumptions:

- **Not:** "What features should this agent have?"
- **Instead:** "What core capability makes this agent valuable in a workflow?"

Example: A code-review agent.

**Imagined features:** Syntax checking, style linting, security scanning, performance suggestions, test coverage analysis...

**Core capability:** Accept code. Return structured feedback that helps a developer decide whether to ship.

Build the minimum version of that. Test it in real workflows. Let the failures tell you what's missing.

## Step 1: Build the Minimal Agent

```python
# agents/code_reviewer.py
"""
Minimal code review agent.
Input: code snippet
Output: structured feedback (issues, approval decision)
"""

import anthropic
import os

def review_code(code: str, context: str = "") -> dict:
    """
    Review code and return structured feedback.
    
    Args:
        code: The code to review
        context: Optional context about what this code does
        
    Returns:
        {
            "approved": bool,
            "issues": [{"severity": "error|warning|info", "message": str}],
            "summary": str
        }
    """
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    
    prompt = f"""Review this code. Return ONLY valid JSON with this structure:
{{
  "approved": true/false,
  "issues": [{{"severity": "error|warning|info", "message": "description"}}],
  "summary": "brief overall assessment"
}}

Context: {context if context else "No context provided"}

Code:
```
{code}
```

Be concise. Focus on correctness and maintainability."""

    response = client.messages.create(
        model="claude-sonnet-4",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    import json
    return json.loads(response.content[0].text)


if __name__ == "__main__":
    # Quick test
    test_code = """
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total
"""
    
    result = review_code(test_code, "E-commerce cart total calculation")
    print(json.dumps(result, indent=2))
```

**What's missing:** Error handling. Edge case detection. Performance analysis. Security checks.

**Why it doesn't matter yet:** We haven't tested it in a real workflow. We don't know which of those gaps actually cause failures.

## Step 2: Create Test Workflows (The "Client Work")

These are orchestrator prompts designed to stress-test the agent. Not hypothetical scenarios — actual tasks you'd run.

```python
# workflows/test_code_reviewer.py
"""
Orchestrated workflows that test the code reviewer agent.
Each workflow represents "client work" — real constraints, real failures.
"""

from agents.code_reviewer import review_code

workflows = [
    {
        "name": "basic_correctness",
        "code": """
def divide(a, b):
    return a / b
""",
        "context": "Simple division function",
        "expected_issue": "Division by zero not handled"
    },
    {
        "name": "security_vulnerability",
        "code": """
import subprocess
def run_command(user_input):
    subprocess.run(user_input, shell=True)
""",
        "context": "Execute user commands",
        "expected_issue": "Shell injection vulnerability"
    },
    {
        "name": "performance_problem",
        "code": """
def find_duplicates(items):
    duplicates = []
    for i in range(len(items)):
        for j in range(len(items)):
            if i != j and items[i] == items[j]:
                duplicates.append(items[i])
    return duplicates
""",
        "context": "Find duplicate items in list",
        "expected_issue": "O(n²) when O(n) possible"
    },
    {
        "name": "subtle_bug",
        "code": """
def get_user_permissions(user_id):
    permissions = db.query("SELECT * FROM permissions WHERE user_id = " + user_id)
    return permissions
""",
        "context": "Fetch user permissions from database",
        "expected_issue": "SQL injection + string concatenation"
    },
    {
        "name": "edge_case",
        "code": """
def get_first_element(lst):
    return lst[0]
""",
        "context": "Return first element of list",
        "expected_issue": "Empty list causes IndexError"
    }
]

def run_test_workflows():
    """Run all workflows and log results."""
    results = []
    
    for workflow in workflows:
        print(f"\n{'='*60}")
        print(f"Testing: {workflow['name']}")
        print(f"Expected: {workflow['expected_issue']}")
        print(f"{'='*60}")
        
        review = review_code(workflow['code'], workflow['context'])
        
        # Did the agent catch the expected issue?
        caught = any(
            workflow['expected_issue'].lower() in issue['message'].lower()
            for issue in review['issues']
        )
        
        result = {
            "workflow": workflow['name'],
            "expected": workflow['expected_issue'],
            "caught": caught,
            "approved": review['approved'],
            "issues_found": len(review['issues']),
            "review": review
        }
        
        results.append(result)
        
        print(f"Caught: {caught}")
        print(f"Approved: {review['approved']}")
        print(f"Issues: {review['issues']}")
    
    return results


if __name__ == "__main__":
    results = run_test_workflows()
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    total = len(results)
    caught = sum(1 for r in results if r['caught'])
    print(f"Workflows run: {total}")
    print(f"Issues caught: {caught}/{total}")
    print(f"Success rate: {caught/total*100:.1f}%")
```

## Step 3: Run, Log, Analyze

```bash
$ python workflows/test_code_reviewer.py

============================================================
Testing: basic_correctness
Expected: Division by zero not handled
============================================================
Caught: True
Approved: False
Issues: [{'severity': 'error', 'message': 'Division by zero not handled'}]

============================================================
Testing: security_vulnerability
Expected: Shell injection vulnerability
============================================================
Caught: True
Approved: False
Issues: [{'severity': 'error', 'message': 'Critical: shell injection risk - never use shell=True with user input'}]

...

============================================================
SUMMARY
============================================================
Workflows run: 5
Issues caught: 4/5
Success rate: 80.0%
```

**What breaks:** The agent missed the subtle SQL injection in `get_user_permissions`. It flagged string concatenation but didn't connect it to the security risk.

**What this tells you:** The agent needs better pattern matching for SQL injection, OR the prompt needs to emphasize security contexts more explicitly.

## Step 4: Iterate Based on Real Failures

Update the agent based on what broke:

```python
# agents/code_reviewer.py (iteration 2)

def review_code(code: str, context: str = "") -> dict:
    # ... existing code ...
    
    # Enhanced prompt based on workflow failures
    prompt = f"""Review this code for correctness, security, and maintainability.

**Critical security patterns to check:**
- SQL injection (string concatenation in queries)
- Shell injection (subprocess with shell=True)
- Path traversal
- Unvalidated input

**Common errors:**
- Division by zero
- Empty collection access
- Null/None dereference

Return ONLY valid JSON:
{{
  "approved": true/false,
  "issues": [{{"severity": "error|warning|info", "message": "description"}}],
  "summary": "brief overall assessment"
}}

Context: {context if context else "No context provided"}

Code:
```
{code}
```"""
    
    # ... rest of implementation ...
```

Re-run the workflows. Success rate should improve.

## Why This Works

1. **Real constraints:** Workflows represent actual use cases, not hypothetical scenarios
2. **Immediate feedback:** Pass/fail is obvious — either the issue was caught or it wasn't
3. **Iterative improvement:** Each workflow failure reveals a gap in the agent's core capability
4. **Battle-tested components:** By the time the agent passes all workflows, it's production-ready

This is how agencies test new hires. Run them through client work. See what breaks. Train on the gaps. Repeat until they're reliable.

Your AI agents deserve the same rigor.

## What's Next

- **Expand workflows:** Add more edge cases as you encounter them in production
- **Version tracking:** Tag agent versions with their workflow success rates
- **Comparative testing:** Run the same workflows against multiple agent implementations (Claude vs GPT vs Gemini)
- **Extract patterns:** If multiple agents need the same workflows, you've found a reusable testing framework

The agency pattern works because it forces you to confront reality before assumptions. Build less. Test more. Ship what survives.

---

**Code:** Full implementation at [github.com/vicesystems/agent-testing-ground](https://github.com/vicesystems/agent-testing-ground) (example repo)

**Related:** If you're building multi-agent orchestrators, this pattern scales — each specialist agent gets its own workflow suite.
