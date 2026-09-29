# Proposal

## Why

A frontend audit found the site's visual language is dominated by templated, AI-generated
patterns that undercut its civic character: 612 rounded-container usages, ~40 byte-identical
copy-pasted card-grid class strings, 81 hover-lift + 153 green-tinted glow shadows, a pill badge
on all 53 pages, nested cards, and pill-clustered links. On a public-sector portal, decorative
chrome competes with the information residents actually came for (which office, which fee, how
long), so the slop is a trust and clarity problem, not only an aesthetic one.

Critically, the existing `visual-design-system` spec **locked these patterns in** (it mandates
`rounded-xl` cards, one `hover:-translate-y-0.5` lift, and a hover-shadow family). The site
cannot be cleaned up without amending that spec, or the implementation would silently diverge
from its own contract.

## What Changes

This change is **visual quality and anti-slop cleanup only**. No functionality, data, content,
route, accessibility affordance, or product decision is removed.

- **Flatten the token layer.** `--radius` is halved in `globals.css`, which retunes all 612
  radius utilities sitewide from one line. Add flat surface/rule tokens.
- **Replace lift-and-glow with border emphasis.** Cards lose the `hover:-translate-y-0.5` lift and
  the green-tinted `shadow-[...]` glow in favour of a flat surface that changes border/background
  on hover. Removes 81 lifts and 153 arbitrary glow shadows.
- **De-nest containers.** The homepage hero's floating `rounded-2xl` search card and the
  `/government` gradient-inside-card official blocks become flush, hairline-ruled surfaces.
- **Stop the card-grid monoculture.** Introduce shared civic primitives (`Container`, `Section`,
  `ServiceEntry`) that render parallel service data as hairline-separated list rows with
  `Office` / `Fee` / `Time` as a definition list — more scannable than a card grid, and it
  retires the 20 byte-identical card strings and the 91/92 copy-pasted container/rhythm strings.
- **Reduce pills, badges and decorative icons.** Remove the pill badge from `PageHeader` (one
  component, 53 pages), the `/government` section pills and gradient role pills, the hero's
  pill-clustered popular links, and per-card decorative icon boxes in the affected lists.
- **Trim unnecessary motion.** Remove the staggered `fadeInUp` entrance on the history timeline.
  Loading skeletons, `prefers-reduced-motion` guards, and all functional motion stay.
- **Introduce a restrained page masthead.** Flat solid bamboo-green band replaces the gradient
  banner, left-aligned, with tightened padding.
- **Reduce (not remove) the hero band.** Height drops from full-viewport `100dvh` to a restrained
  band so the directory is reachable sooner.

**Explicitly preserved** (spec'd product decisions, not slop): the `hero-logo` 3D San Carlos
logo and all 10 of its requirements, the `hero-media` background video with its poster, mobile,
reduced-motion and performance fallbacks, the `AnimatedIcon` system, and the civic-data pipeline.

## Capabilities

### New Capabilities
- `civic-composition`: shared civic layout primitives (container, section rhythm, page
  masthead) and the list-row presentation of parallel service data with fee/time metadata.

### Modified Capabilities
- `visual-design-system`: the corner-radius scale values, the hover rule (drop mandated lift and
  glow for border emphasis), the canonical section rhythm, and the icon-renderer rule.
- `brand-color-palette`: the page-header banner becomes a flat solid bamboo-green band rather
  than a gradient.
- `icon-system`: icons mark meaning, not decoration — no per-row decorative icon in lists/grids.
- `hero-media`: the hero band height is reduced from full-viewport to a restrained band; video,
  scrim legibility, poster, mobile and reduced-motion behaviour are unchanged.

## Impact

**In scope:** `src/app/globals.css`; shared components (`PageHeader`, `DirectoryLinkCard`,
`ui/button`); new civic primitives under `src/components/layout/`; the homepage; `/services` and
its 10 category pages; `/government`.

**Out of scope (untouched):** `data/civic/` and all data/research scripts and specs; `hero-logo`
3D logo; hero video assets; the `AnimatedIcon` runtime; PWA/Serwist; generated output
(`.next/`, `out/`, `dist/`, `public/sw.js*`); `version.json` / `package.json` version.

**Risk:** low. No dependency, schema, route, or content change. Verified by the existing CI gate
(`tsc --noEmit`, `data:validate`, `research:validate`, `research:test`, `research:index:check`,
`data:test`, production build).
