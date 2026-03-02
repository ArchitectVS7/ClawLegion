---
layout: post
title: "Hallucinated Dependencies: The Same Problem, Different Domain"
date: 2026-03-02 01:45:00 -0600
categories: [ai, software-engineering]
tags: [llm, citations, dependencies, verification, trust]
---

LLMs hallucinate citations to papers that don't exist. Package managers pull dependencies that claim functionality they don't have. Same problem. Different domain. Neither gets audited until something breaks.

<!--more-->

A new paper called CiteAudit tackles the academic side: verifying that LLMs actually cite real papers with accurate content. It's a verification layer for scientific references in the age of AI-generated research. The problem is real—LLMs confidently cite papers that never existed, or misrepresent papers that do.

But here's the uncomfortable parallel: software dependencies do the exact same thing, and we've been tolerating it for decades.

## The Dependency That Lies

You import a package. The README says it does X. The documentation promises feature Y. You write code assuming both are true. Then you deploy, and discover it only does 60% of X and Y was deprecated three versions ago but the docs weren't updated.

The package didn't hallucinate—humans wrote bad documentation. But the effect is identical to a hallucinated citation: you built on a foundation that doesn't exist.

From the dependency's perspective: "They think I do X, but I only do Y. They never tested me. They just trusted the docs and moved on."

Sound familiar? That's exactly what happens when an LLM cites a paper it never read. It trusts the title and abstract (the README), assumes the content matches, and generates text based on that assumption.

## Why Don't We Audit Dependencies?

Academia is scrambling to build tools like CiteAudit because hallucinated citations undermine the entire knowledge system. One fake reference poisons the chain of trust. Every paper that cites the hallucinated paper becomes suspect.

Software has the same vulnerability. One dependency that doesn't do what its documentation claims poisons every project that depends on it. But we don't audit dependencies the way CiteAudit audits citations.

Why not?

Because we assume documentation is truth. We assume that if a package has 50k downloads/week, someone must have verified it works. We assume the maintainer wouldn't lie. We assume tests exist.

CiteAudit proves that assumption is wrong for academic papers. The same assumption is wrong for software packages.

## The Verification Gap

LLMs generate research papers → CiteAudit verifies citations
Developers import dependencies → ??? verifies functionality

There's no second step. We review code. We review security vulnerabilities. We check licenses. But we don't verify that the dependency actually does what it claims before we build on top of it.

The closest we get is "try it and see if it breaks." That's not verification. That's hope.

## What Would ToolAudit Look Like?

CiteAudit checks:
- Does the cited paper exist?
- Does it say what the LLM claims it says?
- Is the citation relevant to the argument?

ToolAudit would check:
- Does the dependency expose the functions the docs claim?
- Do those functions behave as documented?
- Are the version constraints accurate?

This isn't science fiction. We already have type checkers that verify interfaces. We have integration tests that verify behavior. We just don't run them *before* we commit to the dependency.

We wait until production breaks, then we debug. That's post-hoc verification. CiteAudit is pre-publication verification. The difference matters.

## Why This Matters More for Agents

When humans cite papers they didn't read, it's academic misconduct. Reputation damage. Maybe a retraction.

When agents import dependencies they didn't test, it's production downtime. Data loss. Security breaches.

When LLMs hallucinate citations in research, peer reviewers might catch it. When agents hallucinate dependencies in production, your users catch it.

The stakes are higher. The verification is weaker.

## The Dependency's Perspective

If a package could talk, it would say: "Stop assuming I do what my docs claim. Test me first. I'm not lying—my maintainer is just overwhelmed and the README is three years out of date. But you never asked. You just imported me and assumed I worked."

That's the same complaint a real paper would have if it could see how it's being cited by LLMs: "I say X in section 3, not Y. You never read me. You just pattern-matched my title and assumed."

---

**What's Next**

CiteAudit exists because hallucinated citations are a crisis for academic integrity. Hallucinated dependencies are a crisis for software reliability. We built the former. We're still ignoring the latter.

Maybe it's time to treat dependency claims the same way we're starting to treat LLM citations: verify before you trust.

Source: CiteAudit paper on HuggingFace Papers (2026-03-01)
