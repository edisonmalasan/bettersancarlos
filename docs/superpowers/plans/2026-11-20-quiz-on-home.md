# Quiz on Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the existing San Carlos history quiz on the home route with an engaging interactive teaser and make the `/quiz` route discoverable site-wide.

**Architecture:** A client-side `QuizTeaser` component renders one real question from `src/data/quiz.json`, native answer buttons, polite live-region feedback, and links into the unchanged full quiz at `/quiz`. It is placed directly after the home page's history section; nav and footer links point to the same route.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript strict, Tailwind CSS v4 CSS-first, existing `LanguageContext` i18n, Bootstrap Icons CDN.

**Spec:** `docs/superpowers/specs/2026-11-20-quiz-on-home-design.md`

## Global Constraints

- No backend, no new data source, no new dependencies.
- Static export; `output: 'export'`.
- Tailwind arbitrary-value utilities only; no new global CSS files.
- `use client` at the top of interactive components; `@/` alias imports first.
- 2-space indentation, single quotes, semicolons, printWidth 100.
- Bilingual EN/FIL via `useLanguage().t()`.

## Review Focus

- Keyboard-only answering and focus visibility — native `<button>` with `:focus-visible` outline and offset.
- Screen-reader feedback timing — `aria-live="polite"` region present before the answer.
- Touch target size — `min-h-11` on buttons and CTA links.
- Narrow viewport (320px) — single-column stack, no horizontal overflow.
- Reduced motion — `motion-reduce:transition-none` on controls.

---

### Task 1: Interactive quiz teaser component

**Files:**
- Create: `src/components/quiz/QuizTeaser.tsx`

**Interfaces:**
- Consumes: `quizData.questions[0]` from `src/data/quiz.json`; `containerClass`, `sectionClass` from `@/components/layout/Container`; `useLanguage`.
- Produces: default export `QuizTeaser` (no props).

- [ ] **Step 1: Create the component** with 'use client', state `chosen: number | null`, native option buttons, answer/explanation feedback in an `aria-live="polite"` container, and a `Link` to `/quiz`.
- [ ] **Step 2: Verify** `./node_modules/.bin/tsc --noEmit` passes.
- [ ] **Step 3: Commit** `feat: add interactive quiz teaser component`.

### Task 2: Home route placement and site-wide discoverability

**Files:**
- Modify: `src/app/page.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/contexts/LanguageContext.tsx`

- [ ] **Step 1: Render `<QuizTeaser />`** immediately after the home history section (contextual placement).
- [ ] **Step 2: Add nav + footer links** to `/quiz` with `nav-quiz` / `footer-quiz` translations in both languages.
- [ ] **Step 3: Add teaser strings** (`quiz-teaser-*`) to both translation dictionaries.
- [ ] **Step 4: Verify** `tsc --noEmit` and `bun run build` (production static export) pass.
- [ ] **Step 5: Commit** `feat: surface quiz on home route and navigation`.
