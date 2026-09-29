# Tasks

## 1. Token layer (D1)

- [ ] 1.1 Set `--radius: 0.25rem` in `src/app/globals.css` and verify `rounded-xl` now resolves
      to at most 5.6px and no large surface exceeds 8px
- [ ] 1.2 Re-audit the source tree for remaining `rounded-2xl` / `rounded-3xl` usages on cards,
      panels and bands and confirm each remaining one is a documented exception (icon canvas) or
      a deliberate small element

## 2. Shared layout primitives (D2, D3)

- [ ] 2.1 Add `Container` and `Section` server components under `src/components/layout/`, each
      accepting and merging a caller `className` via `cn()`, and verify they render the correct
      element with the canonical max-width, padding and rhythm
- [ ] 2.2 Migrate page files from literal container and `py-16 …` rhythm strings to the
      primitives, and verify the source tree no longer contains duplicated literal
      container/rhythm strings

## 3. Masthead (D6)

- [ ] 3.1 Convert `PageHeader` to a flat solid bamboo-green band with left-aligned
      title/description and remove the pill badge, and verify every page using it renders an
      identical band differing only in text
- [ ] 3.2 Confirm the amended `brand-color-palette` requirement is met: no gradient, glow or
      overlay tint on the masthead, and white text still meets WCAG AA

## 4. Interactive surfaces (D4)

- [ ] 4.1 Replace hover lift and green-tinted glow with border/background emphasis on interactive
      cards, and verify no `hover:-translate-y-*` or arbitrary `shadow-[0_8px_24px_rgba(…)]`
      remains on cards
- [ ] 4.2 Replace remaining `transition-all` on modified components with explicit property lists
      and `duration-200`, and verify via source search
- [ ] 4.3 Add `active:scale-[0.97]` press feedback to `ui/button` primary variants and verify
      keyboard focus rings are unaffected

## 5. Service presentation (D5)

- [ ] 5.1 Add the `ServiceEntry` list-row primitive rendering office/fee/time as a `<dl>`
      term/definition pair, and verify the metadata is programmatically associated with its entry
- [ ] 5.2 Migrate `/services` and the 10 category pages to the list-row presentation, and verify
      each service still shows its full title, description and metadata with no truncation
- [ ] 5.3 Verify the list rows carry no per-row decorative icon container, and verify the layout
      is single-column and scroll-free on a mobile viewport

## 6. Hero and government (D7)

- [ ] 6.1 Reduce the hero to a restrained band that is not full-viewport, and verify the
      headline, description and search fit the first screen at desktop and mobile widths
- [ ] 6.2 Flatten the hero's nested search container and ensure at most one readability overlay
      remains, and verify hero text still meets WCAG AA
- [ ] 6.3 De-nest the `/government` official blocks (remove the gradient inside the card) and
      remove the section and role pills, and verify office/role text remains fully readable
- [ ] 6.4 Confirm the `hero-logo` 3D logo, the hero video, and the poster / mobile /
      reduced-motion fallbacks are all still present and unchanged

## 7. Motion and icons (D8)

- [ ] 7.1 Remove the staggered `fadeInUp` entrance on the history timeline and verify the
      timeline content is visible without scrolling-triggered animation
- [ ] 7.2 Confirm loading skeletons, `prefers-reduced-motion` guards, chart animations and
      `AnimatedIcon` behaviour are unchanged
- [ ] 7.3 Remove decorative per-item icon containers in the touched lists, keeping icons that
      convey meaning, and verify functional chrome icons remain static

## 8. Integration verification

- [ ] 8.1 Run `./node_modules/.bin/tsc --noEmit` and the production `next build`, and confirm
      both succeed with no new errors
- [ ] 8.2 Run `openspec validate civic-ui-restraint --strict` and confirm the change is valid
- [ ] 8.3 Review the full diff to confirm no data files, generated output, `version.json`,
      dependency manifests, or the civic data pipeline were modified
