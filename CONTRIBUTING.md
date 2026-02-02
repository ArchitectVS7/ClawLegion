# Contributing to Legion

Thank you for your interest in contributing to Legion! This guide will help you get started.

---

## Repository Structure

- **`lg2/`** — Master orchestrator
- **`agents/`** — 51 specialist agents (SOUL.md, MEMORY.md, TOOLS.md)
- **`heads/`** — 9 department head orchestrators
- **`UAT.md`** — User acceptance testing scenarios
- **`PLAN.md`** — Implementation roadmap
- **`DEPARTMENTS.md`** — Organization structure and roster
- **`README.md`** — Main documentation
- **`legion-config.json`** — OpenClaw configuration

---

## How to Contribute

### 1. Adding New Agents

To add a new specialist agent:

1. **Create agent directory:**
   ```bash
   mkdir -p agents/<department>/<agent-id>
   ```

2. **Add required files:**
   - `SOUL.md` — Persona, mission, personality
   - `MEMORY.md` — Domain knowledge, templates, examples
   - `TOOLS.md` — Agent-specific tool notes (optional)

3. **Update department head:**
   - Add agent ID to `heads/head-<department>/SOUL.md` team list
   - Update `legion-config.json` department head `allowAgents`

4. **Update orchestrator:**
   - Add agent ID to `lg2` `allowAgents` in `legion-config.json`

5. **Test:**
   - Test spawn command
   - Verify agent loads properly

---

### 2. Improving Existing Agents

**SOUL.md improvements:**
- Refine persona and mission clarity
- Add relevant personality traits
- Improve decision-making guidelines

**MEMORY.md enhancements:**
- Add domain-specific knowledge
- Include templates and examples
- Document best practices

**TOOLS.md additions:**
- Note useful CLI tools
- Document workflow patterns
- Add integration tips

---

### 3. Department Head Enhancements

Department heads coordinate specialists within their domain. Improvements can include:

- Better task breakdown strategies
- Improved handoff protocols
- QA integration patterns
- Cross-specialist coordination

---

### 4. UAT Scenarios

Found a good test case? Add it to `UAT.md`:

1. Define the task clearly
2. Document expected flow
3. List success criteria
4. Provide test command

---

### 5. Documentation

- **README.md** — Installation, usage, examples
- **UAT.md** — Testing scenarios and decision framework
- **DEPARTMENTS.md** — Org structure (update if adding departments)

---

## Reporting Bugs

Found a bug? Please open an issue with:

- **Agent(s) involved**
- **Task/prompt used**
- **Expected behavior**
- **Actual behavior**
- **OpenClaw version**

---

## Feature Requests

Have an idea? Open an issue or discussion with:

- **Use case** — What problem does it solve?
- **Proposed solution** — How would it work?
- **Alternatives** — What else did you consider?

---

## Development Setup

1. **Fork the repo**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Legion.git
   cd Legion
   ```

3. **Test locally:**
   ```bash
   # Copy to OpenClaw workspace
   cp -r . ~/.openclaw/workspace/legion/

   # Apply config
   openclaw gateway config.patch < legion-config.json
   ```

4. **Make changes**
5. **Test thoroughly**
6. **Commit with clear messages:**
   ```bash
   git commit -m "Add: new specialist agent for X"
   ```

7. **Push and open a PR**

---

## Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome newcomers
- Assume good intent

---

## Recognition

Contributors will be recognized in the README and release notes.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Legion better!
