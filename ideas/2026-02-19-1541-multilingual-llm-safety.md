# Multilingual LLM Guardrails Research
**Source:** Hacker News (123 points, 44 comments)  
**Date:** 2026-02-19  
**Link:** https://royapakzad.substack.com/p/multilingual-llm-evaluation-to-guardrails

## Summary
Article explores multilingual safety issues in LLMs - how guardrails fail across different languages, evaluation challenges, and practical guardrail implementation.

## Project Ideas

### 1. Multilingual Prompt Injection Tester
Build a skill/tool that tests OpenClaw agents against multilingual prompt injection attacks:
- Test suite with common jailbreak patterns in 10+ languages
- Automated testing framework for agent SOUL.md safety rules
- Report generator showing which languages bypass guardrails
- **Relevance:** Helps VS7 ensure LG2 and other agents are safe across languages

### 2. Cross-Language Safety Audit Integration
Create an OpenClaw skill that monitors agent responses for safety violations:
- Hook into agent message output pipeline
- Run parallel safety checks in multiple languages
- Flag responses that would be blocked in English but pass in other languages
- Log violations to memory/ for review
- **Relevance:** Proactive safety monitoring for multi-language deployments

### 3. Guardrail Effectiveness Dashboard
Web-based visualization tool for LLM safety testing:
- Import test results from various guardrail tools
- Compare effectiveness across languages, models, attack types
- Track guardrail bypass trends over time
- Generate reports for model selection decisions
- **Relevance:** Helps choose which models to use for specific agent roles

## Next Steps
- Review article in detail
- Assess which idea fits current OpenClaw architecture best
- Prototype multilingual test suite as proof of concept
