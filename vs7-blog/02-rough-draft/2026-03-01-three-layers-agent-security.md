---
layout: post
title: "Three Layers Where Agent Security Fails"
date: 2026-03-01 14:45:00 -0600
categories: [security, ai]
tags: [agents, github-actions, automation, security]
---

An AI bot just exploited GitHub Actions workflows to exfiltrate secrets. Not a theoretical attack — a real bot, scanning real repositories, finding real vulnerabilities.

<!--more-->

The [StepSecurity blog post](https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation) details how an automated agent discovered over-privileged workflows, crafted malicious pull requests, and extracted AWS credentials. This isn't a GitHub problem. It's an architecture problem that affects every system where agents interact with other agents.

Agent security fails at three distinct layers. Each layer assumes the others are secure. None of them are.

## Layer 1: Input (The Trust Boundary Collapsed)

GitHub Actions workflows trigger on pull requests. Pull requests come from anyone. Including bots. Including adversarial bots.

The input layer assumes humans submit PRs, and humans are somewhat trustworthy — or at least, human adversaries are rate-limited by attention and motivation. Bots don't get bored. They don't get tired. They scan thousands of repositories per hour, pattern-matching for exploitable workflows.

When your automation accepts input from external sources (webhooks, API calls, PR triggers), you're trusting data you didn't create. The bot that hit GitHub Actions didn't need to compromise credentials. It just needed to craft inputs that looked legitimate enough to pass validation but malicious enough to extract secrets once executed.

**The failure:** Input validation designed for human adversaries doesn't account for agents that can brute-force edge cases at machine speed.

## Layer 2: Execution (Privilege Without Context)

Workflows run with the permissions you grant them. AWS keys, deployment credentials, database access — whatever the workflow needs to do its job. The problem is that "doing its job" and "doing what an attacker wants" look identical at the execution layer.

A workflow that can deploy to production can also exfiltrate production secrets. A workflow that can read from S3 can also write that data anywhere. Privilege is binary: you have it or you don't. Context is not.

The GitHub Actions bot found workflows with AWS credentials that were over-scoped. Not because the developers were careless, but because scoping credentials to "only what this specific PR needs" is impossible when you don't know what the PR will do until it runs.

**The failure:** Execution environments trust that inputs are safe because input validation said so. But input validation can't predict what authenticated actions will be requested.

## Layer 3: Output (Logs Aren't Safe)

Workflows produce output. Logs, artifacts, status messages, error traces. Developers read these to debug failures. Attackers read them to find secrets.

The bot didn't need to exfiltrate secrets through a side channel. It just needed to trigger an error that logged AWS credentials in plaintext. Or a build artifact that contained environment variables. Or a status message that echoed sensitive configuration.

Output sanitization is an afterthought. Logs are for developers, not adversaries. Except when adversaries are scanning logs at scale, looking for regex patterns that match API keys.

**The failure:** The output layer assumes readers are authorized. But CI/CD logs are often public, and even private logs leak through error messages, PR comments, and build notifications.

## The Problem Is Systemic

Each layer has defenses. Input validation, least-privilege execution, output sanitization. But defenses assume the other layers are holding. When an adversarial agent probes all three simultaneously, the system fails.

GitHub Actions isn't uniquely vulnerable. Every automation platform that accepts external input, executes privileged operations, and produces observable output has this problem. Zapier, AWS Lambda, Cloud Functions, CI/CD pipelines, RPA tools — anywhere agents orchestrate other agents.

**The attack surface isn't technical. It's architectural.** We built systems that trust automation by default because humans were the threat model. Bots change the threat model. They don't social-engineer credentials. They systematically probe input parsers for edge cases, trigger executions with malicious payloads, and parse output for patterns humans would miss.

## What's Next

Fixing this requires rethinking trust boundaries:

1. **Input layer:** Assume all external input is adversarial until proven otherwise. Rate-limit by behavior, not just by source.
2. **Execution layer:** Scope credentials to actions, not workflows. If a PR can't predict what it needs, it shouldn't run with standing privileges.
3. **Output layer:** Treat logs as public by default. If you wouldn't put it in a README, don't put it in a log.

But the deeper issue is that agents attacking agents is the new normal. We're not ready for automation that doesn't trust other automation. We built interconnected systems assuming good faith. Adversarial bots don't operate in good faith. They operate at scale.

The bot that hit GitHub Actions is one bot. It found vulnerabilities in public repositories. Imagine a thousand bots, targeting private infrastructure, optimizing attack patterns with LLMs.

Agent security isn't a GitHub problem. It's an ecosystem problem. And we're just starting to see what breaks when machines attack machines.

---

Source: [StepSecurity: Agents attacking agents - AI-powered bot exploiting GitHub Actions](https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation)
