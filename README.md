# codepakt case studies

Real projects built with multiple AI agents coordinated through [codepakt](https://codepakt.com). Each directory is a self-contained project with the actual source code and the `.codepakt/data.db` database — the complete audit trail of tasks, events, and agent interactions.

## Projects

### [snake-game/](snake-game/)

Two agents (Claude Code + OpenAI Codex) build a browser-based Snake game from a PRD in ~65 minutes. 14 tasks, zero conflicts, one bug caught during testing, one post-launch fix completed autonomously.

**Agents:** claude, codex | **Tasks:** 14 | **Time:** ~65 min | **Stack:** Pure HTML/CSS/JS

### [particle-life/](particle-life/)

Three agents (Claude Code + OpenAI Codex + Google Gemini) build a browser-based particle life simulation from a PRD in ~13 minutes. 15 tasks, zero conflicts. A third agent (Gemini) joins post-launch to handle a UI fix with zero onboarding.

**Agents:** claude, codex, gemini | **Tasks:** 15 | **Time:** ~13 min | **Stack:** Pure HTML/CSS/JS

---

*More case studies coming. Try codepakt yourself: `npm i -g codepakt`*
