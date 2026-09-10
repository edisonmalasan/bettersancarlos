## 1. Setup

- [x] 1.1 Create branch `feat/quiz-game` from `main`, push with `-u origin` — verify clean tree
- [x] 1.2 Read change artifacts + the two research files (`research/culture-history/26-09-history.md`, `research/culture-history/26-09-culture-heritage.md`) and design skills: `.agents/skills/gsap-react/SKILL.md`, `.agents/skills/gsap-core/SKILL.md`, `.agents/skills/emil-design-eng/SKILL.md`, `.agents/skills/design-taste-frontend/SKILL.md` (Section 4.5/5.D rules apply)

## 2. Data

- [x] 2.1 Create `src/data/quiz.json` with ~12 questions per design.md D2 (shape: `{ id, question, options[4], answer, explanation, source }`), every fact traceable to the research files — audit each answer against the research text and record the audit in the commit message

## 3. Dependencies

- [x] 3.1 `bun install gsap @gsap/react` — verify package.json updated and lockfile regenerated; if install fails, skip to CSS-only fallback and record deviation. Never use npm. (Installed: gsap@3.15.0, @gsap/react@2.1.2 via `bun add`.)

## 4. Implementation

- [x] 4.1 Create `src/components/quiz/HistoryQuiz.tsx` ('use client'): three-state flow (intro/playing/results) per D3, score tracking, progress indicator, per-question source-grounded explanations in results, restart without reload — verify in dev at 1440/768/375
- [x] 4.2 GSAP transitions per D4 (useGSAP, 240ms power2.out, stagger 40ms results, reduced-motion collapse, cleanup) — verify transitions play and reduced-motion emulation collapses them
- [x] 4.3 Create `src/app/quiz/page.tsx` (metadata + PageHeader + dynamic HistoryQuiz import) styled per D5 (token utilities, radius/timing locks) — verify page renders and /quiz route prerenders
- [x] 4.4 Add /quiz to `/sitemap` page + cross-link from `/about` (Learn-more context) — verify links resolve

## 5. Verification & delivery

- [x] 5.1 Gates: `./node_modules/.bin/tsc --noEmit` PASS; `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` PASS with /quiz prerendered; verify `/` first-load JS unchanged vs previous build (route bundle isolation); full playthrough check at 1440 + 375 (intro → 12 answers → results shows all correct answers → restart); revert tsbuildinfo/next-env.d.ts if dirtied
- [x] 5.2 Check off tasks.md boxes, commit `feat: add San Carlos City history quiz game` (include openspec change files), push
- [x] 5.3 Send `worker_done` with --outcome succeeded (or failed): question count + fact-audit note, bundle-isolation check, gate results. Do NOT create PR/merge/archive.
