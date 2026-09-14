## Design Read

Feature build inside an existing Redesign-Preserve system. Dials: VARIANCE 3 / MOTION 4 (quiz transitions are the one place motion earns its keep — state transition feedback) / DENSITY 5. All visual-system rules from visual-design-system spec apply.

## Decisions

### D1 — Route and structure
Route `/quiz`. Page file `src/app/quiz/page.tsx` (server component: metadata + PageHeader) rendering a dynamically-imported client component `src/components/quiz/HistoryQuiz.tsx` (`next/dynamic`, `ssr: false` not required — a client component is fine; gsap imports live inside it). Data: `src/data/quiz.json` static-imported into the client component.

### D2 — Question bank (~12 questions from verified research)
Source facts (from research/culture-history/26-09-history.md + 26-09-culture-heritage.md):
1. Pre-colonial name: Binalatongan (from *balatong* = mongo bean; Caboloan capital)
2. 1660 Malong revolt (Andres Malong)
3. 1762–63 Palaris revolt (Juan de la Cruz Palaris)
4. Rename by King Carlos III of Spain → San Carlos
5. Cityhood: RA 4487, signed June 19, 1965, effective Jan 1, 1966 (component city, 3rd class)
6. Basista separated via RA 4866
7. 1718: poblacion moved to its present site (Caragay-related episode per research)
8. Founding by Dominican friar (Juan dela Lama, 1587 — footnote the 1578 conflict)
9. Mango-Bamboo Festival: launched 2001, last week of April (from festivals research, cited via history file's modern-markers section)
10. 2011 giant mango pie record (100 m², ~2,000 kg)
11. Minor Basilica of St. Dominic: built 1773, rebuilt 1803; declared Minor Basilica by Pope Francis (July 6, 2022)
12. 1988 NHCP historical marker / nickname "Mango-Bamboo Capital"

Each question: `{ id, question, options[4], answer (index), explanation, source: 'research/culture-history/26-09-....md#<section>' }`. Distractors are plausible-but-wrong (other Pangasinan cities' facts, off-by-one dates from the same file) — fabricated only as distractors, never as explanations.

### D3 — UX flow
Three states: `intro` (title, question count, Start) → `playing` (progress bar "Question X of 12", one question at a time, 4 option buttons; on select: immediate visual confirm/deny then auto-advance ~600ms) → `results` (score ring/number, per-question list with correct answers highlighted, "Learn more" link to /about, Restart). No timer (civic-educational, not competitive). No localStorage persistence requirement (sessionless is fine).

### D4 — Motion (gsap-react skill rules)
- `useGSAP` hook from `@gsap/react` inside HistoryQuiz; gsap imported statically in that one client component (component itself dynamically imported → bundle isolation).
- Transitions: outgoing question fades/slides -16px, incoming from +16px, 240ms `power2.out`; option press `scale 0.97` 120ms; results reveal stagger 40ms.
- All animation gated by `prefers-reduced-motion` (gsap.matchMedia or a media check) → opacity-only or instant.
- Cleanup via useGSAP context revert; no ScrollTrigger needed.

### D5 — Design system
PageHeader ("San Carlos City History Quiz"); quiz card `rounded-xl border-line bg-white p-6/p-8` centered `max-w-[640px]`; options as full-width buttons with `border-line`, hover `border-primary` + `bg-primary/5`, correct/incorrect states `bg-success/10 text-foreground` / `bg-danger/10`; progress bar `bg-primary` on `bg-muted` track; all token utilities, `duration-200`.

### D6 — Verification
1. tsc + `next build --webpack` (route prerenders; first-load JS of `/` unchanged vs baseline — compare build output).
2. Prerendered HTML shows intro state; manual/CDP playthrough of full loop (answer → advance → results → restart) at 1440 + 375.
3. Fact audit: each of the 12 questions' answers re-checked against the two research files.
4. Reduced-motion: transitions collapse (verify via emulation).

## Risks / Trade-offs

- [gsap adds ~30-60KB gz to the /quiz route] → isolated to the quiz route; brief mandates it.
- [Distractors risk teaching wrong facts] → explanations always state the correct fact; distractors drawn from same-domain plausible values.
- [Editor conflict (1587 vs 1578)] → use 1587 (research primary) and footnote the conflict in that question's explanation.

## Migration Plan

Single branch `feat/quiz-game`: data + component + page + links → gates → PR → merge → sync+archive.

## Resilience Expectations

- If gsap/bun install fails → CSS transitions fallback, record deviation.
- If any question's fact cannot be traced to research → drop the question rather than guess (9+ questions still satisfies "~12").
