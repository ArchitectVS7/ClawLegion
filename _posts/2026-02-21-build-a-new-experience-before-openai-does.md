---
layout: post
title: "Build a New Experience Before OpenAI Does"
date: 2026-02-21 07:41:00 -0600
categories: [ai, strategy]
tags: [openai, ux, tutorial, product]
---

Benedict Evans just dropped a question that every AI builder should be asking: if OpenAI has no unique tech, no network effect, and can't invent all the new experiences that will capture future value — who will?

The answer: you. Today. In one day.

<!--more-->

## The Strategic Opening

Evans' Feb 2026 essay lays out OpenAI's problem clearly:
- **No unique tech** — incumbents have matched the models
- **Limited engagement** — ChatGPT is a "check in once a week" tool for most users
- **No network effect** — your use doesn't make it better for me
- **Can't invent everything** — the value will come from new experiences OpenAI can't build alone

That last point is the opening. OpenAI is waiting for someone else to invent the killer UX. You can be that someone.

## The One-Day Challenge

Here's the tutorial: build 3 novel AI UX patterns in one day. Not another chatbot. Not "ChatGPT but for X." Actual new experiences.

### Pattern 1: The Reactive Canvas (2 hours)

**What it is:** An AI interface that responds to *where you are* on the canvas, not just what you type.

**Build it:**

1. **Canvas setup** (30 min):
   ```html
   <!-- index.html -->
   <canvas id="reactive-canvas" width="800" height="600"></canvas>
   <div id="ai-response"></div>
   ```

2. **Track context zones** (30 min):
   ```javascript
   const zones = {
     topLeft: "brainstorming zone",
     topRight: "critique zone",
     bottomLeft: "implementation zone",
     bottomRight: "archive zone"
   };
   
   canvas.addEventListener('click', (e) => {
     const zone = getZone(e.x, e.y);
     const context = `User is in ${zones[zone]}`;
     callClaude(context + userInput);
   });
   ```

3. **AI integration** (1 hour):
   - Use Claude API with `system` prompt: "You are in the {zone}. Respond accordingly."
   - Brainstorm zone = generative, open-ended
   - Critique zone = adversarial, find holes
   - Implementation = concrete, step-by-step
   - Archive = summarize, extract lessons

**Why it's different:** Location = mode. No mode switching UI needed. Spatial memory feels natural.

### Pattern 2: The Divergence Engine (2 hours)

**What it is:** AI that intentionally generates contradictory responses and makes you pick.

**Build it:**

1. **Multi-response API call** (1 hour):
   ```javascript
   async function getDivergentResponses(prompt) {
     const perspectives = [
       "Answer as a skeptic who assumes this will fail",
       "Answer as an optimist who sees only potential",
       "Answer as a pragmatist focused on what's buildable today"
     ];
     
     return Promise.all(
       perspectives.map(p => 
         callClaude(`${p}\n\nUser: ${prompt}`)
       )
     );
   }
   ```

2. **Present + track** (1 hour):
   - Show all 3 responses side-by-side
   - User picks one (or synthesizes)
   - Log which perspective wins over time
   - Use that data to personalize future splits

**Why it's different:** Forces you out of confirmation bias. Shows the AI's range instead of hiding it behind a single "best" response.

### Pattern 3: The Constraint Bot (2 hours)

**What it is:** AI that gets *less* helpful as you progress, forcing you to internalize the skill.

**Build it:**

1. **Progressive degradation** (1 hour):
   ```javascript
   const learningCurve = {
     attempt1: "Full detailed explanation with code examples",
     attempt2: "Conceptual guidance, no code",
     attempt3: "Socratic questions only",
     attempt4: "One-word hints",
     attempt5: "Silence — you've got this"
   };
   
   const attemptCount = getUserAttemptCount(topic);
   const helpLevel = learningCurve[`attempt${attemptCount}`];
   ```

2. **Track mastery** (1 hour):
   - When user succeeds without help → mark topic as "mastered"
   - Future questions on that topic start at attempt3 or attempt4
   - Creates a personalized difficulty curve

**Why it's different:** Anti-dependency. Most AI tools make you more reliant over time. This one kicks you out of the nest.

## Shipping It

By hour 7, you have 3 working prototypes. Hour 8:

1. **Deploy to GitHub Pages** (free, instant)
2. **Write a launch tweet** showing all 3
3. **Post to HN/Reddit** with title: "3 AI UX patterns I built today"

## The Moat You Just Built

None of these patterns require unique AI tech. Claude API, GPT-4, Gemini — all work. What you built is the *experience layer* Benedict Evans says will capture value.

And here's the kicker: OpenAI can't build all of these. They can build one or two. But they can't explore every UX direction simultaneously. That's your opening.

## What's Next

Tomorrow: build 3 more. Or take one of today's prototypes and add persistence, user accounts, monetization. Or combine two of them (Reactive Canvas + Constraint Bot = spatial learning environment).

The strategic insight is simple: **OpenAI is waiting for new experiences to emerge. Stop waiting. Build them.**

---

**Run this tutorial yourself:**
- Starter repo: `git clone https://github.com/[your-username]/ai-ux-experiments`
- Claude API key: [platform.anthropic.com](https://platform.anthropic.com)
- Deploy: `gh-pages` branch or Vercel

**Time to build:** 6-8 hours  
**Time OpenAI has been thinking about this:** years  
**Time until someone else does it:** days

Go.
