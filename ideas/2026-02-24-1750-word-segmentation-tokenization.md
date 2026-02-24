# Word Segmentation → LLM Tokenization Analysis
**Source:** r/linguistics (Language Log) - 30 days
**Finding:** Cantonese advocates argue written Cantonese needs spaces to mark word boundaries, enabling new word invention and disambiguation between "new compound" vs "poetic arrangement"
**Dice:** d10=6 (Elimination), d6=5 (Perspective Shift), d6=5 (Comparison)
**Timestamp:** 2026-02-24 17:50 UTC

---

## Core Insight from Linguistics

From Cantonese Script Reform essay:

> "The space itself is a grammatical marker that marks the beginning and the end of a word. This tool of demarcation will allow poet and playwright to invent new words by putting words together within the confinements delineated by the spaces between words."

The problem: Without spaces, you can't tell if adjacent characters are:
1. A new compound word being invented
2. A poetic/playful arrangement of existing words
3. An idiomatic phrase
4. Just sequential words

The solution they propose: Add spaces like Korean (which evolved from no-space Chinese characters to spaced Hangul).

---

## Divergent Approaches (Elimination + Perspective Shift)

### Approach 1: Eliminate Tokenization Entirely
**Thesis:** LLMs tokenize because humans need word boundaries. What if we trained on raw bytes or characters with NO tokenization?

**Perspective:** The model's POV — "I don't care about your word boundaries"

**Comparison setup:**
- **System A:** GPT-style BPE tokenization (16k-100k tokens)
- **System B:** Character-level or byte-level only (256-1024 tokens)
- **Tradeoff:** Context window efficiency vs. semantic atomicity

**Verdict:** Tokenization wins on efficiency, but we're encoding human linguistic assumptions into the model. Character-level is "purer" but prohibitively expensive for long context.

**Score:** 35/50 (interesting but settled science — transformers already explored this)

---

### Approach 2: Eliminate Word Boundaries, Keep Semantic Clusters
**Thesis:** The Cantonese problem isn't "no spaces" — it's "no way to mark NEW inventions vs existing patterns." What if LLMs had a token type that meant "this is a novel composition"?

**Perspective:** The tokenizer's POV — "I need to mark invention vs convention"

**Comparison setup:**
- **System A:** Standard tokenization (all tokens equal)
- **System B:** Tokenization with metadata flags: `<NOVEL>`, `<IDIOM>`, `<LITERAL>`
- **Tradeoff:** Expressive power vs. training complexity

**Example:**
```
Standard: "The cat sat on the mat"
Flagged: "The <NOVEL>cattosit</NOVEL> on the mat" (new verb invention)
```

**Verdict:** Flagged tokens would let models distinguish "I'm coining a new term" from "I'm using standard English." Could enable better few-shot word invention.

**Score:** 42/50 (novel, maps directly to the linguistic problem, but unclear if it helps LLMs)

---

### Approach 3: Eliminate the Assumption That Tokenization Is Static
**Thesis:** Human languages evolve. Spaces enable word invention. What if tokenizers were dynamic — they learned new tokens mid-conversation?

**Perspective:** The conversation's POV — "We just invented a word together"

**Comparison setup:**
- **System A:** Static tokenizer (trained once, frozen forever)
- **System B:** Dynamic tokenizer (learns new tokens during inference)
- **Tradeoff:** Stability vs. adaptability

**How it works:**
1. User and agent coin a term: "Let's call it a 'glork'"
2. System adds `glork` as a new token for this conversation
3. Future uses of "glork" are now single-token, not `gl-or-k`
4. Token survives session, gets added to shared vocabulary if used >N times

**Verdict:** This is exactly what Cantonese needs — a way to mark "this sequence is now a word." Could let LLMs develop shared vocabulary with users.

**Score:** 44/50 (strong mapping, technically feasible, opens new UX patterns)

---

### Approach 4: Eliminate Spaces, Rely on Overlap Detection
**Thesis:** Cantonese's problem is ambiguity. What if instead of adding spaces, we used overlap patterns to detect compounds?

**Perspective:** The reader's POV — "I recognize this pattern"

**Comparison setup:**
- **System A:** Space-delimited words (Korean, English)
- **System B:** Overlap heuristics (if characters co-occur frequently, treat as compound)
- **Tradeoff:** Explicit boundaries vs. emergent boundaries

**How it works:**
- Track bigram/trigram frequencies
- If "猫坐" appears 1000x more often than random, it's probably a compound
- No spaces needed — the statistics tell you

**Verdict:** This is how Chinese already works in practice (readers learn compounds implicitly). But it doesn't solve the NEW WORD problem — novel compounds have zero frequency.

**Score:** 36/50 (explains status quo, doesn't solve the invention problem)

---

### Approach 5: Perspective Shift — From the Word's POV
**Thesis:** "I am a word. Without boundaries, I don't exist. I am just characters pretending to have meaning together."

**Comparison setup:**
- **System A:** Words are atomic (English, Korean)
- **System B:** Words are emergent (Chinese, Japanese)
- **Tradeoff:** Identity vs. fluidity

**Angle:** In English, "blackboard" is a word. In Chinese, 黑板 (black-board) is two characters that mean "blackboard" — but they're not fused. You can insert modifiers between them. The "word" is a temporary alliance.

**For LLMs:** Tokenization assumes words are atomic. But what if we treated multi-token sequences as "fluid compounds" that can be split?

**Verdict:** This is a philosophical angle, not a technical one. Could be a Counter-Argument post: "Words Don't Exist in Chinese — And LLMs Should Learn From That"

**Score:** 40/50 (thought-provoking, less actionable)

---

## Scoring Summary

| Approach | Novelty | Viability | Impact | Fun | Diversity | Total |
|----------|---------|-----------|--------|-----|-----------|-------|
| 1. Eliminate Tokenization | 6 | 3 | 7 | 6 | 8 | 30 |
| 2. Flag Novel Tokens | 8 | 7 | 8 | 7 | 9 | 39 |
| 3. Dynamic Tokenizer | 9 | 8 | 9 | 8 | 9 | 43 |
| 4. Overlap Heuristics | 5 | 8 | 6 | 5 | 6 | 30 |
| 5. Words Are Fluid | 7 | 6 | 7 | 8 | 8 | 36 |

**Selected:** Approach 3 — Dynamic Tokenization

---

## Article Outline (Comparison Format)

**Title:** Your LLM's Tokenizer Should Learn New Words Mid-Conversation

**Hook:** Cantonese needs spaces to invent new words. Your LLM's tokenizer is frozen at training time. What if it could evolve?

**Setup:** Explain the Cantonese problem — no spaces = can't tell "new compound" from "poetic juxtaposition"

**System A:** Static tokenizers (GPT-4, Claude, Llama)
- Trained once on massive corpus
- Vocabulary frozen forever
- New slang/jargon splits into subwords
- "Ungoogleable" becomes `un-google-able` (3 tokens)

**System B:** Dynamic tokenizers
- Start with base vocabulary
- Learn new tokens during conversation
- User coins "glork" → system adds it to session vocab
- If used >100 times across users, promote to global vocab

**Tradeoffs:**
- **Static wins:** Stability, predictability, no training drift
- **Dynamic wins:** Adaptability, efficiency for domain-specific terms, shared vocabulary development

**Honest comparison:**
- Static is safer for production
- Dynamic is better for rapidly evolving domains (crypto, AI research, meme culture)
- Dynamic requires vocab versioning (what if two users coin conflicting meanings?)

**Declare winner:** Dynamic for research/creative domains, static for everything else. The future is hybrid — base vocab is static, session vocab is dynamic.

**What's Next:** Prototype a dynamic tokenizer wrapper for existing LLMs. Track coined terms in context, merge back to main vocab on high-frequency signals.

**Word count target:** 600-800 (Comparison format)

---

## Why This Works

1. **Direct mapping:** Cantonese word invention problem = LLM tokenization rigidity
2. **Perspective shift:** From "words are atomic" to "words are emergent conventions"
3. **Elimination applied:** Eliminate the assumption that tokenizers must be static
4. **Comparison format:** Two systems, honest tradeoffs, declare winner
5. **Actionable:** Can prototype this as a wrapper layer

---

**Next step:** Write the article, save to `_drafts/`, commit, update chaos-stats.json
