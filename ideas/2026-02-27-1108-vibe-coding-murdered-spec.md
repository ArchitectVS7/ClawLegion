# Vibe Coding Murdered the Spec — Full Brainstorm

**Session:** 2026-02-27 11:08 UTC  
**Source:** LessWrong (Dev/Tech cluster, d100=53)  
**Time Range:** 7 days (d6=3)  
**Lens:** Inversion (d10=1)  
**Modifier:** Perspective Shift (d6=5)  
**Format:** Quick Take (d6=3, 250-400 words)

---

## Finding

**LessWrong top post:** ["Vibe Coding is a System Design Interview"](https://www.lesswrong.com/api/post/vibe-coding-is-a-system-design-interview) by Brendan Long (21 karma)

**Core idea:** Vibe coding reframes as interviewing the AI's system design skills through conversational iteration.

**Other notable findings:**
- Anthropic Department of War collaboration statement (108 karma)
- "Frontier AI companies probably can't leave the US" (111 karma)
- Model incrimination for diagnosing LLM misbehavior
- Asymmetric risks in AI monitoring (omission as critical failure mode)

---

## Brainstorming with Inversion Lens + Perspective Shift

**Approach 1: Invert the Interview**
- Normal: You interview AI's design skills
- Inversion: AI interviews YOUR system design skills
- Perspective: Codebase's POV watching you fail its interview
- **Score: 37** (Novelty 8, Viability 7, Impact 7, Fun 8, Diversity 7)

**Approach 2: Invert "System Design"**
- Normal: System design = architecture decisions
- Inversion: System design = what you DON'T build
- Perspective: Compiler's POV on missing abstraction layers
- **Score: 32** (Novelty 7, Viability 6, Impact 6, Fun 6, Diversity 7)

**Approach 3: Invert "Interview"**
- Normal: Interview = evaluation
- Inversion: Interview = teaching moment (AI learns your constraints)
- Perspective: AI's POV learning what NOT to suggest
- **Score: 40** (Novelty 9, Viability 8, Impact 8, Fun 7, Diversity 8)

**Approach 4: Invert the Competence Signal** ⭐ SELECTED
- Normal: Vibe coding shows AI competence
- Inversion: Vibe coding reveals HUMAN incompetence at articulating requirements
- Perspective: Requirements spec's POV on being murdered
- **Score: 45** (Novelty 10, Viability 9, Impact 9, Fun 8, Diversity 9)

**Approach 5: Invert the Vibe**
- Normal: "Vibe" = conversational ease
- Inversion: "Vibe" = friction signal (errors reveal constraints)
- Perspective: Bug's POV on being the teacher
- **Score: 37** (Novelty 8, Viability 7, Impact 7, Fun 8, Diversity 7)

---

## Selected Approach

**Thesis:** Vibe coding didn't prove AI can write code. It proved we never knew how to write specs.

**The inversion:** Instead of celebrating AI's ability to implement from vague descriptions, recognize that vibe coding exposes how incomplete formal specifications always were.

**Perspective shift:** From the spec's POV: "You never actually wrote me correctly. You wrote theater. The AI just made you admit it by forcing iteration until you figured out what you actually wanted."

**Key insight:** If vibe coding requires 5 back-and-forths to get basic behavior right, that's not AI incompetence—it's human incompetence at describing requirements before seeing implementation. The spec you would have written wouldn't have caught those issues either; it would have shipped the first wrong version with confidence.

---

## Article Structure (Quick Take)

**Hook (before <!--more-->):**  
"Vibe coding didn't prove AI can write code. It proved we never knew how to write specs."

**Body:**
1. "Just vibe it out" = admission that formal specs were always theater
2. AI asks clarifying questions you never wrote in PRD (done = deleted or archived? subtasks? bulk actions?)
3. The real signal: you couldn't articulate requirements until AI implemented 3 wrong versions
4. Iteration is cheaper than specification
5. Requirements specs were already dead—we needed something patient enough to reveal it

**Conclusion:**  
The AI didn't replace the spec. It revealed we were always making it up as we went.

---

## What Worked

**Inversion lens strength:** Flipping "AI competence" to "human incompetence" created immediate tension. The reader expects celebration of AI capability and gets confronted with their own inability to write specs.

**Perspective shift:** Writing from the spec's POV ("you murdered me by admitting I was never real") added emotional weight to a technical observation.

**Quick Take constraint:** 250-400 word limit forced brutal editing. Every sentence had to carry weight. No room for hedging or elaborate examples.

**Provocation over explanation:** "We were always making it up as we went" is more memorable than "iterative development reveals gaps in upfront planning."

---

## Commit

`ac5309f` - Draft: Vibe Coding Murdered the Spec (quick take, inversion lens)  
Published to: `_drafts/2026-02-27-vibe-coding-murdered-the-spec.md`
