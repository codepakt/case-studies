import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * Timeline event — a dated moment in the decision's evolution.
 * Each entry captures what happened and why it mattered.
 */
const timelineEventSchema = z.object({
  date: z.string(), // ISO date or human-readable ("2024-03", "Q1 2024")
  label: z.string(),
  description: z.string().optional(),
});

/**
 * Artifact — evidence that supports the narrative (screenshots, diagrams, docs).
 */
const artifactSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

/**
 * Case study status reflects where the decision is in its lifecycle.
 *   draft      — still being written, hidden from archive
 *   published  — visible in archive
 *   revisited  — the team has since updated their assessment
 */
const statusEnum = z.enum(["draft", "published", "revisited"]);

/**
 * Outcome signal — quick visual indicator of how the decision landed.
 */
const outcomeEnum = z.enum([
  "positive",
  "mixed",
  "negative",
  "too-early",
  "reversed",
]);

const cases = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/cases" }),
  schema: z.object({
    // --- Required metadata ---
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    date: z.coerce.date(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    status: statusEnum,
    domain: z.string().min(1, "Domain is required (e.g. 'engineering', 'product')"),
    outcome: outcomeEnum,

    // --- Optional metadata ---
    coverImage: z.string().optional(),
    premise: z.string().optional(), // one-line hook for archive cards
    author: z.string().optional(),

    // --- Structured data embedded in frontmatter ---
    timeline: z.array(timelineEventSchema).min(1, "At least one timeline event is required"),
    artifacts: z.array(artifactSchema).default([]),
  }),
});

export const collections = { cases };
