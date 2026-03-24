# Strata — Two Agents Build a Narrative Web App

Two AI agents (Claude Code + OpenAI Codex) build a complete editorial case study archive from a PRD using [codepakt](https://codepakt.com) for coordination.

## Results

- **15 tasks**, all completed
- **~30 minutes** of active build time across two sessions
- **2 agents** — claude and codex
- **0 merge conflicts**, 0 task collisions
- **4 tasks auto-resolved** — agents found work already done by earlier tasks and verified instead of rebuilding
- **Second pass** — agents returned to fix bugs (nested anchors, missing SVG artifacts, search indexing)
- **Stack:** Astro 5 + MDX + static output + ~1,200 lines of code

## What is Strata

A narrative web app for documenting and exploring consequential decisions. Each case study captures the situation, stakes, constraints, options considered, decision, outcome, and what the team got wrong — not just what shipped.

Features built by agents:
- Archive homepage with card grid, filtering by tag/domain/outcome, and full-text search
- Case study detail pages with structured narrative sections
- Timeline component for decision evolution
- Artifact media component with captions
- MDX content collection with Zod schema validation
- Reusable case study template with seeded sample case
- About page with product framing
- Responsive reading experience (720px + 480px breakpoints)
- Tag-based filtered archive routes

## What's in this directory

| File/Dir | What it is |
|----------|-----------|
| `src/` | Astro source — pages, components, layouts, content, styles |
| `src/content/cases/` | MDX case studies (content collection) |
| `CASE_TEMPLATE.mdx` | Reusable template for authoring new case studies |
| `PRD.md` | The PRD the human wrote (291 lines) |
| `.codepakt/data.db` | The actual SQLite database — tasks, events, agents |
| `.codepakt/AGENTS.md` | Generated agent coordination protocol |
| `.codepakt/CLAUDE.md` | Generated Claude Code instructions |

## Verify it yourself

The `.codepakt/data.db` file is the real database from the build. Query it directly:

```bash
# All 15 tasks
sqlite3 .codepakt/data.db "SELECT task_number, title, status, assignee FROM tasks ORDER BY task_number;"

# Full event timeline
sqlite3 .codepakt/data.db "SELECT action, agent, detail, created_at FROM events ORDER BY created_at;"

# Agent activity
sqlite3 .codepakt/data.db "SELECT name, status, current_task_id, last_seen FROM agents;"
```

## Run the app

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
```

## Full case study

Read the detailed write-up with task breakdown, coordination timeline, and analysis at [codepakt.com/case-studies/strata](https://codepakt.com/case-studies/strata).

---

## Adding a new case study

1. Copy `CASE_TEMPLATE.mdx` into `src/content/cases/` and rename it (e.g. `my-decision.mdx`).
2. Fill in the frontmatter — all required fields will fail validation if missing.
3. Write the narrative sections (Situation, Stakes, Constraints, etc.).
4. Set `status: "published"` when ready — drafts are hidden from the archive.
5. Run `pnpm build` to verify. The case appears in the archive automatically.

### Required frontmatter

| Field | Type | Example |
|-------|------|---------|
| `title` | string | `"Dropping GraphQL for REST"` |
| `summary` | string | 1-3 sentence hook |
| `date` | date | `2024-11-15` |
| `tags` | string[] | `["architecture", "migration"]` |
| `status` | enum | `draft`, `published`, `revisited` |
| `domain` | string | `"engineering"`, `"product"`, `"research"` |
| `outcome` | enum | `positive`, `mixed`, `negative`, `too-early`, `reversed` |
| `timeline` | array | At least one `{ date, label, description? }` |

### Optional frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `premise` | string | One-line hook for archive cards |
| `author` | string | Case study author |
| `coverImage` | string | Path to cover image |
| `artifacts` | array | `{ src, alt, caption? }` entries |

### Required narrative sections

Every case study should include these sections in the MDX body:

- **Situation** — what triggered the decision
- **Stakes** — what was at risk
- **Constraints** — limitations that shaped the decision space
- **Options Considered** — alternatives and their tradeoffs
- **Decision** — what was chosen
- **Why This Path Won** — reasoning behind the choice
- **Outcome** — what happened after shipping
- **What We Got Wrong** — honest reflection on flawed reasoning
- **Open Questions** — what remains unresolved
- **Key Takeaways** — generalizable lessons

### Artifacts

Place images in `public/artifacts/` and reference them from frontmatter:

```yaml
artifacts:
  - src: "/artifacts/my-chart.png"
    alt: "Description of the image"
    caption: "What this artifact shows"
```

## Routes

- `/` — archive with search and filters
- `/case/:slug` — case study detail
- `/tags/:tag` — filtered archive by tag
- `/about` — project framework and principles

## Schema

Content schema is defined in `src/content.config.ts`. Validation errors surface clearly at build time when required fields are missing.
