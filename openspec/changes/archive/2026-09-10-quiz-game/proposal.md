## Why

Task 4 of the orchestration brief: an interactive San Carlos City history quiz is a high-value civic engagement feature — it turns the already-integrated verified history/heritage research (surfaced on `/about` in research-data-integration) into an educational experience, and gives students/residents a reason to explore the portal's historical content. Content is fully available from verified research (`research/culture-history/26-09-history.md`, `26-09-culture-heritage.md`).

## What Changes

- New route `/quiz` with a client-side quiz: ~12 multiple-choice questions (4 options each), score tracking, progress indicator, question transitions, result summary with per-question correct answers and links to `/about` for further reading.
- Question bank in static JSON (`src/data/quiz.json`) sourced exclusively from the two verified research files; each question carries a `source` field (research file + claim) so facts are traceable.
- Tasteful GSAP transitions between questions (fade/slide, ≤300ms feel, reduced-motion honored) — motivated motion (state transition), not spectacle.
- Mobile-first responsive layout following the visual-design-system spec (PageHeader, token utilities, `rounded-xl`, canonical rhythm).
- Discovered from `/about`, homepage history section cross-link, and `/sitemap`.

## Capabilities

### New Capabilities

- `history-quiz`: contract for the quiz game — factual accuracy traceable to verified research, playability end-to-end, accessibility (keyboard, reduced motion), and design consistency.

### Modified Capabilities

(none)

## Impact

- 1 new route + 1 JSON file + a client component; sitemap/cross-link additions. No changes to existing pages beyond links.
- **New dependencies**: `gsap` + `@gsap/react` — explicitly required by the task brief ("Apply GSAP skills for tasteful transitions"); installed with `bun install`; the quiz is a dynamically-imported client component so the GSAP bundle stays out of every other page's bundle.
- If `bun install` of gsap fails (network), fall back to CSS-only transitions and record the deviation — do not use npm.
