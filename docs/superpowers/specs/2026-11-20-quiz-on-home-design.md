# Quiz on Home — Design

## Intent
The site already has a complete 12-question San Carlos history quiz at `/quiz`, but it is
only reachable from `/about` and the sitemap. Home visitors never see it. Surface the quiz
on the default route where it is easy to notice and genuinely engaging, and make the route
discoverable from anywhere on the site.

## Goals
- A prominent, contextual entry point on the home page.
- An interactive teaser that lets a visitor answer one real question and get instant feedback.
- A clear path into the full quiz at `/quiz`.
- Native, accessible controls; responsive down to 320px; bilingual (EN/FIL).

## Non-goals
- No backend, no new data source, no new dependencies, no rewriting of the full quiz.

## Constraints
- Static Next 16 export; Tailwind v4 CSS-first (`@theme`), no new global CSS files.
- `use client` needed for the interactive teaser; `@/` alias imports first.
- Existing design tokens (primary green, bg-alt, muted, line, success/danger).

## Approaches
1. **Static CTA banner** — cheapest, but no interaction; fails the "engaging" goal.
2. **Interactive teaser after the History section** (chosen) — contextual placement, one
   real question with instant feedback and explanation, CTA to `/quiz`. High engagement,
   low cost, no duplication of the full quiz state machine.
3. **Embed the full 12-question quiz on home** — heavy, duplicates `/quiz`, hurts the
   service-first flow.

## Builder decisions
- Main-nav link `Quiz` (`/quiz`) and footer quick link for site-wide discoverability.
- Teaser uses native `<button>` answer options, `aria-live="polite"` feedback region,
  `:focus-visible` outline with offset, 44px targets on coarse pointers, and a reduced-motion
  guard — following the modern-web-guidance `accessibility`, `card`, and
  `form-factor-adaptation` guides retrieved this session.
- Global typography polish: `text-wrap: balance` on headings, `text-wrap: pretty` on body
  text (graceful no-op where unsupported).
- Existing `/quiz` route and `HistoryQuiz` component stay unchanged.
