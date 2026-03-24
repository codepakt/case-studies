# Strata PRD

## 1. Product Overview

**Product name:** Strata

**Product type:** Narrative web app for documenting and exploring consequential product, engineering, research, and business decisions.

**Core idea:** Strata treats each case study like an investigation rather than a retrospective. Instead of only recording what was built, it captures the original problem, context, constraints, discarded options, final decision, downstream effects, and what later proved incorrect.

## 2. Problem

Most case studies are shallow. They optimize for presentation over reasoning.

Common failures:
- They describe outputs, not decisions.
- They erase uncertainty and rejected paths.
- They flatten timelines into a fake linear story.
- They make it hard to compare how different teams reason under pressure.
- They become dead documents instead of reusable organizational memory.

This creates a real gap: teams and individuals lose the ability to study decision quality over time.

## 3. Vision

Strata should feel like a cross between a dossier, field notebook, and editorial archive.

A reader should be able to:
- understand the original problem quickly
- inspect the constraints that shaped the decision
- see what alternatives were considered
- understand why the chosen path won
- track what happened after the decision shipped
- identify where the team was wrong, lucky, or early

## 4. Goals

### Primary goals
- Create a compelling reading experience for long-form decision case studies.
- Provide a structured framework for writing honest post-hoc analysis.
- Make decision history searchable, browsable, and comparable.
- Support reusable authoring so new case studies follow a consistent shape.

### Secondary goals
- Build an aesthetic that feels distinct from generic documentation tools.
- Make artifacts like screenshots, notes, and timeline events first-class.
- Encourage reflection through explicit sections like "what we got wrong."

## 5. Non-Goals

- Not a project management tool.
- Not a collaboration suite in v1.
- Not a wiki replacement.
- Not a metrics dashboard.
- Not a CMS with multi-user permissions in the MVP.

## 6. Target Users

### Primary users
- Product managers
- founders
- designers
- engineers
- researchers
- solo builders maintaining a body of work

### Secondary users
- hiring managers reviewing candidate work
- teams building internal decision memory
- readers studying how real tradeoffs were made

## 7. User Jobs

Users want to:
- write case studies that preserve decision context
- revisit old decisions and inspect whether they aged well
- compare multiple cases by theme, constraint, or outcome
- present their work credibly without reducing it to self-promotion
- extract patterns from previous decisions

## 8. Core Product Principles

### 1. Structure without sterility
The product should enforce a strong narrative skeleton but still allow expressive writing.

### 2. Decisions over deliverables
The unit of value is the decision story, not the shipped artifact.

### 3. Time matters
Before-and-after context should be explicit. Outcomes must be shown over time.

### 4. Honesty is a feature
Sections about uncertainty, failure, and revised beliefs are mandatory in the template.

### 5. Reading experience first
The interface should privilege deep reading, visual rhythm, and scanning.

## 9. MVP Scope

### Included
- Home page with archive of case studies
- Detail page for each case study
- Tag and status-based filtering
- Full-text local search
- Structured case study schema
- Markdown or MDX-based authoring
- Reusable author template
- Artifact support for images and captions
- Timeline section
- Outcome review section
- "What changed my mind" or "What we got wrong" section

### Excluded from MVP
- Multi-user editing
- Comments
- Rich collaborative annotations
- Auth
- Backend database
- Analytics pipeline
- AI writing features

## 10. Information Architecture

### Main routes
- `/` archive landing page
- `/case/:slug` case study detail page
- `/tags/:tag` filtered archive view
- `/about` short explanation of the project and framework

### Archive card fields
- title
- one-line premise
- decision category
- date
- status
- tags
- outcome signal

### Case study sections
- Title
- Summary
- Situation
- Stakes
- Constraints
- Options Considered
- Decision
- Why This Path Won
- Artifacts
- Timeline
- Outcome
- What We Got Wrong
- Open Questions
- Key Takeaways

## 11. Primary User Flows

### Flow 1: Browse archive
1. User lands on homepage.
2. User scans visually distinct case study cards.
3. User filters by tag, domain, or status.
4. User opens a case study.

### Flow 2: Read a case study
1. User reads a strong summary at top.
2. User scrolls through structured narrative sections.
3. User reviews artifacts inline with context.
4. User inspects timeline and outcome.
5. User exits with a clear understanding of decision quality.

### Flow 3: Author a new case study
1. Author duplicates the template file.
2. Author fills required frontmatter and core sections.
3. Author adds artifacts and timeline entries.
4. Case appears automatically in archive.

## 12. Functional Requirements

### Content model
Each case study must support:
- slug
- title
- summary
- date
- tags
- status
- domain
- outcome
- cover image optional
- sectioned body content
- timeline events
- artifact list

### Archive experience
- Show all published case studies.
- Support filtering by tag, domain, and status.
- Support search across title, summary, and body text.
- Sort by newest first by default.

### Detail experience
- Render long-form narrative cleanly on desktop and mobile.
- Display metadata at top without clutter.
- Show timeline in a distinct visual treatment.
- Show artifacts inline with captions.
- Surface key takeaways and revision points near the end.

### Authoring
- New case studies should be creatable from a documented template.
- Minimal technical setup should be required beyond editing Markdown/MDX.
- Validation should fail clearly if required metadata is missing.

## 13. Experience Requirements

- The product should feel editorial, not corporate.
- Typography should carry most of the identity.
- Layout should support long-form reading without becoming monotonous.
- Visual hierarchy should make scanning easy.
- Mobile reading must remain excellent.
- The UI should avoid generic dashboard components unless clearly justified.

## 14. Success Metrics

### Qualitative
- A reader can summarize the decision logic after reading a case.
- A writer feels pushed toward honest reflection instead of surface storytelling.
- The archive feels memorable and distinctive.

### Quantitative
- Time to first published case study under 20 minutes using the template
- 100% of published cases contain required decision sections
- Search and filter interactions lead to detail-page visits

## 15. Risks

- Over-structuring could make writing feel rigid.
- Excessive visual styling could hurt readability.
- Long-form content could become repetitive without strong templates.
- Search quality may be weak in a purely static MVP if indexing is minimal.

## 16. Open Questions

- Should timelines be embedded in content or modeled separately in frontmatter?
- Should artifacts support callout annotations in v1 or stay simple?
- Should case studies support private drafts later?
- How much schema rigidity is enough before it hurts authoring?

## 17. Recommended Tech Direction

### Preferred stack
- Next.js or Astro
- MDX for content
- Static generation
- Local content collection
- Lightweight client-side search

### Reasoning
- Fast to build
- Works well for editorial content
- Easy to version in git
- No backend required for MVP

## 18. Milestone Plan

### Milestone 1: Foundation
- Create project shell
- Define content schema
- Create one case study template
- Implement archive and detail pages

### Milestone 2: Reading Experience
- Refine typography and layout
- Add timeline and artifact components
- Add mobile polish

### Milestone 3: Discovery
- Add search
- Add filters and tags
- Improve archive browsing

## 19. MVP Exit Criteria

The MVP is complete when:
- a user can add a new case study from a template
- the case appears in the archive automatically
- archive filtering and search work
- each case study renders all required sections cleanly
- the overall visual identity feels deliberate and non-generic

## 20. One-Sentence Product Statement

Strata is a narrative archive for high-stakes decisions, built to preserve not just what happened, but how people reasoned, hesitated, chose, and later revised their beliefs.
