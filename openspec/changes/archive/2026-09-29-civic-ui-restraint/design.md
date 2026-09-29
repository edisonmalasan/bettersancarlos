# Design

## Context

See `proposal.md` — Why. The engineering fact that shapes the approach: Tailwind v4's radius
utilities are all derived from a single `--radius` token in `src/app/globals.css`, so the entire
site's roundness is one value. See `specs/` for the required behaviour.

Constraints that bound the work: a static export with no backend; strict TypeScript; Tailwind
utilities only (no new global CSS files); no new dependencies; vanilla-JS class hooks (`.cmci-tab`,
`.metric-card`, search `.selected`) must keep their names; the CI gate runs typecheck, four
data/research suites, and a production build.

## Goals / Non-Goals

**Goals:**
- Change the site's visual character through a small number of high-leverage, shared decisions.
- Keep every existing behaviour, route, dataset, and accessibility affordance byte-identical.
- Leave the codebase easier to maintain (fewer duplicated class strings) than it was found.

**Non-Goals:**
- Not a redesign for novelty. No new visual concept, no new page, no reordering of content.
- Not a component-library extraction or a Tailwind/PostCSS reconfiguration.

## Decisions

### D1 — Retune the radius token instead of editing 612 radius usages
Set `--radius: 0.25rem` in `globals.css`. `rounded-xl` then resolves to 5.6px and nothing large
resolves past 8px.

*Why:* the `visual-design-system` spec mandates the *scale* (`rounded-xl` for cards), not a
pixel value, so this is spec-compliant by construction and de-rounds the site from one line.
*Alternative considered:* hand-editing ~60 files to swap `rounded-2xl`→`rounded-lg`. Rejected —
huge diff, no behavioural difference, and it would leave the underlying token still permitting
large radii.
*Risk:* one place also uses an arbitrary radius for the icon canvas; that class is left alone as
a documented exception.

### D2 — New shared layout primitives in `src/components/layout/`
Add `Container` (max-width + responsive horizontal padding) and `Section` (vertical rhythm), both
server components accepting `className` so callers can still extend them. Replace the 91 literal
container strings and 92 literal `py-16 …` rhythm strings with these components.

*Why:* collapses the largest duplication in the repo and makes the rhythm auditable in one place.
*Alternative considered:* a `@utility` in CSS. Rejected — components compose better in TSX, stay
tree-shakeable, and need no new CSS-first API surface.

### D3 — Canonical rhythm becomes `py-12 max-[1024px]:py-10 max-[767px]:py-8`
*Why:* the incumbent `py-16 / py-8 / py-6` is the "generic AI" rhythm. The new one is
monotonically non-increasing, never loses more than half at a step (satisfying the new
`civic-composition` requirement), and still uses the repo's exact-value arbitrary-variant
convention. Band-level padding (masthead, hero) stays a documented per-band exception.
*Alternative considered:* an even tighter `py-10 / py-8 / py-6`. Rejected — it would flatten
page rhythm too aggressively against the 53-page site.

### D4 — Hover = border/background emphasis, never lift or glow
Replace `hover:-translate-y-0.5` and `shadow-[0_8px_24px_rgba(58,125,68,0.12)]` on interactive
cards with `transition-colors duration-200` plus border/background emphasis. Keep a single
elevated treatment sitewide for the surface that most needs it (the hero search panel).

*Why:* motion-on-hover plus coloured glow is the strongest SaaS-template tell, and on a civic
site it also implies the card is a physical object rather than a record entry.
*Alternative considered:* keeping the lift but neutralising its colour. Rejected — half-measure;
the delta's `visual-design-system` amendment removes the mandated lift outright.

### D5 — Parallel service data becomes list rows, not a card grid
`/services` and its category pages currently render entries through one byte-identical card
string (20 occurrences across 5 files). Introduce a shared `ServiceEntry` that renders each entry
as a hairline-separated row in one column, with office/fee/time emitted as a real
`<dl>` term/definition pair.

*Why:* the entries are *parallel records with structured metadata*; a definition list is the
semantically correct and more scannable presentation, and it satisfies the new
"parallel service data" requirement. This is the main structural change in the change.
*Alternative considered:* restyling the grid to 2 columns. Rejected — preserves the card-grid
metaphor the task asks to remove.
*Constraint:* every service keeps its full title, description, and metadata. Nothing is
truncated to fit a narrower card.

### D6 — Masthead: flat solid band, badge removed
`PageHeader` loses its gradient and its pill badge and becomes a flat solid bamboo-green band with
left-aligned title/description. One component change covers 53 pages, so this is the single
highest-reach edit in the change.

*Why:* satisfies `brand-color-palette`'s amended "no decorative gradient on brand bands" and
`civic-composition`'s masthead requirement at once, and the pill badge was pure ornament.

### D7 — Hero: reduce the band, keep the spec'd features
`min-h-[calc(100dvh-…)]` → a restrained band, and the nested `rounded-2xl` shadowed search card
becomes a flat flush panel. The `hero-media` video, its scrim, the poster/mobile/reduced-motion
fallbacks, and the entire `hero-logo` 3D logo are left intact.

*Why:* the hero is the site's most template-like surface, but the video and 3D logo are
*specified product decisions* (6 + 10 requirements). Removing them would be a product change, not
a visual cleanup. This is the boundary the task's "remove or reduce" language allows.

### D8 — Motion: drop decorative entrance animation only
Remove the staggered `fadeInUp` entrance on the history timeline. Keep loading skeletons,
`prefers-reduced-motion` guards, chart animations, and the `AnimatedIcon` hover behaviour.

*Why:* entrance animation on informational content fights legibility and burns main-thread time
for no comprehension gain; skeletons and reduced-motion guards are functional.

## Risks / Trade-offs

- **Risk: too-aggressive flattening reduces scannability** — the list rows carry a border rule
  and a hover background, and the masthead keeps a strong flat brand fill, so grouping survives
  without container edges. → Mitigation: verified visually per page group during apply.
- **Risk: shrinking `--radius` changes unrelated controls too** (badges, chips, icon boxes).
  → Mitigation: these are small elements; the delta explicitly permits `rounded-full` pills and
  `rounded-lg` for small elements.
- **Trade-off: the code diff is smaller than the visual diff.** That is the intent — most of the
  visual change comes from D1 and D6.
- **Trade-off: `rounded-full` is retained for genuine pills** (status chips, admin tags). A civic
  portal with zero pills would be less clear, not more.

## Migration Plan

Single PR. Rollback = revert the merge commit. No data, schema, route, or content migration.
