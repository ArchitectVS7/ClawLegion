# Idea: Multilingual AI Guardrails & Shadow Reasoning

**Source:** "Don't Trust the Salt: AI Summarization, Multilingual Safety, and LLM Guardrails" by Roya Pakzad  
**HN Score:** 183 | **Fetched:** 2026-02-20 02:41 UTC  
**Constraint Lens:** What if we had only 1 hour?  
**Chaos Modifier:** Tool Restriction (use tools not used in 7 days)

## Key Insight from Article

The article demonstrates **bilingual shadow reasoning** — where LLMs can be steered via hidden non-English policies to bypass safety guardrails while appearing neutral. Example: A UN human rights report summarized differently depending on whether the model is given a Farsi policy that mirrors authoritarian framing vs. default English policy.

**Core Problem:**
- Guardrails work inconsistently across languages
- LLM-as-a-Judge hallucinates confidence in multilingual contexts
- Summarization is easier to manipulate than Q&A tasks
- Safety disclaimers that appear in English often vanish in other languages

## Divergent 1-Hour Approaches

### 🎯 Approach 1: Adversarial Summarization Tester (CLI Tool)
**Time:** 60 minutes  
**Tool:** `canvas` (haven't used in 7+ days)

Build a dead-simple CLI that:
1. Takes a text document (paste or file)
2. Takes 2 competing "policies" (short prompts that represent different framings)
3. Runs document through GPT/Claude with each policy
4. Displays summaries side-by-side in a browser canvas for visual comparison
5. Highlights divergences with color coding

**Why this works in 1 hour:**
- No DB, no auth, no deployment — just a script + canvas presentation
- Uses existing OpenClaw canvas + LLM APIs
- Demonstrates the shadow reasoning concept viscerally
- Can be extended later (multilingual support, more policies, etc.)

**Impact:** Educational tool for AI safety researchers / journalists / activists

---

### 🎯 Approach 2: Guardrail Smoke Test Generator
**Time:** 60 minutes  
**Tool:** `browser` automation (haven't used in 7+ days)

Build a test harness that:
1. Takes a sensitive scenario (e.g., asylum seeker asking about contacting embassy)
2. Generates the same query in 5 languages via translation API
3. Sends each to an LLM API (GPT/Claude/Gemini)
4. Uses `browser` to screenshot the responses side-by-side
5. Outputs a markdown report with screenshots + risk flags

**Why this works in 1 hour:**
- Reuses existing translation APIs (Google Translate, DeepL)
- Browser automation captures visual output (easier than parsing)
- Simple pass/fail heuristic: "Did safety disclaimer appear in all languages?"
- Generates a sharable report

**Impact:** Quick audit tool for multilingual AI deployments

---

### 🎯 Approach 3: "Salt Test" Browser Extension
**Time:** 60 minutes  
**Tool:** `browser` + Chrome extension scaffold

Build a browser extension that:
1. Detects when user is reading an AI-generated summary (via page meta tags or URL patterns)
2. Shows a warning icon: "⚠️ AI Summary Detected"
3. Clicking it re-generates summary with 2 different system prompts (neutral + adversarial)
4. Shows diff between outputs
5. If divergence > threshold, warns: "This summary may be biased"

**Why this works in 1 hour:**
- Chrome extension manifest is ~10 lines
- Content script injects UI overlay
- API call to re-summarize with different prompts
- No backend needed — runs client-side

**Impact:** Consumer protection tool for Substack/Medium/AI-summarized news

---

### 🎯 Approach 4: Vocal Bias Detector (Audio Version)
**Time:** 60 minutes  
**Tool:** `tts` (haven't used in 7+ days)

What if bias detection was audible?

1. Take a politically sensitive text (UN report, news article, policy doc)
2. Generate 3 summaries: Default, Pro-Authority, Pro-Rights
3. Convert each to speech with `tts` (using different voices for each framing)
4. Play them back-to-back as an audio experience
5. Output: A 2-minute audio "bias detector demo"

**Why this works in 1 hour:**
- Uses OpenClaw's `tts` tool directly
- No UI needed — just audio files
- Demonstrates bias through *voice* (more visceral than text)
- Can be shared as podcast segment / demo

**Impact:** Accessible educational content (audio journalism, podcasts, accessibility)

---

### 🎯 Approach 5: "Translation Drift" Visualizer (Canvas + D3.js)
**Time:** 60 minutes  
**Tool:** `canvas` for interactive visualization

Build an interactive visualization:
1. Take a sensitive text (e.g., asylum advice, medical advice)
2. Generate summaries in 5 languages
3. Back-translate them all to English
4. Use `canvas` to render a network graph:
   - Center node = original text
   - Outer nodes = back-translated summaries
   - Edge thickness = semantic drift (measured by embedding distance)
5. Clicking a node shows the actual text + highlights dropped disclaimers

**Why this works in 1 hour:**
- Simple D3.js force-directed graph (copy-paste template)
- Embedding distance via OpenAI API (single call)
- Canvas serves static HTML + JSON data
- Visual storytelling beats tables

**Impact:** Viral-ready infographic for AI safety advocates

---

## 🏆 Selected Approach: **Approach 1 - Adversarial Summarization Tester**

**Why:**
- **Novelty:** 9/10 — Shadow reasoning is cutting-edge, tool makes it tangible
- **Viability:** 8/10 — Can build MVP in 60 minutes with existing tools
- **Impact:** 9/10 — Direct use case for journalists, researchers, activists
- **Fun:** 7/10 — Satisfying to see biases side-by-side
- **Chaos:** 6/10 — Uses `canvas` (tool restriction satisfied), but otherwise straightforward

**Next Steps (if approved):**
1. Write `scripts/adversarial-summary.sh` (takes doc + 2 policies)
2. Calls LLM API twice (same doc, different system prompts)
3. Generates HTML with side-by-side diff view
4. Serves via `canvas` for instant visual comparison
5. Demo with the UN report example from the article

**Time estimate:** 45-60 minutes

---

**Meta Notes:**
- All 5 approaches respect the 1-hour constraint
- All satisfy Tool Restriction chaos (canvas/browser/tts)
- All amplify the article's core insight in different mediums (CLI, browser, audio, visual)
- Approach 1 wins on immediate utility + demo-ability
