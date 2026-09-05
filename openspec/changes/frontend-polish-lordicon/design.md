# Design: Frontend Polish — Anti-Slop Cleanup & Lordicon Animated Icons

## Context

The site is a statically exported Next.js 15 PWA (React 18, Tailwind v4, `'use client'` islands). The anti-slop audit (see conversation exploration) found: 34 decorative `uppercase tracking` eyebrow labels (budget page: 12), four stray pre-rebrand blues (`#003399` homepage search hover gradient, `#00184d` InfoBar bg, `#0066cc` SearchAutocomplete link, `#0066a0` contact badge gradient end), a dead `lucide-react` dependency, and 541 static Bootstrap icons loaded via CDN CSS. Lordicon's React player (`@lordicon/react`) renders Lottie JSON via `lottie-web`; it requires a client component and self-hosted JSON for a static-export site. Free Lordicon tier restricts which icons may be downloaded — each selected icon must show a free download option in the Lordicon editor at selection time.

## Goals / Non-Goals

**Goals:**
- Remove decorative eyebrow labels while preserving data-semantic labels
- Zero legacy/stray blues in `src/`; extend the standing audit list
- Introduce a reusable, accessible `AnimatedIcon` client component with ≤8 sanctioned placements
- Keep lottie-web off pages that don't use it (dynamic import, code-split)
- Ship self-hosted, pre-colored, minified Lottie JSON assets

**Non-Goals:**
- No swap of the Bootstrap Icons baseline (535+ functional glyphs stay)
- No new layout, spacing, or typography redesign beyond eyebrow removal
- No paid Lordicon license; no runtime recoloring (`colorize`/`colors` props reload animations — pre-color in editor instead)
- No infinite/loop animations anywhere
- Do not touch generated output dirs, `version.json`, `package.json` version

## Decisions

### D1 — Eyebrow pruning rule (what stays, what goes)

Keep an uppercase label ONLY when it is a genuine data-field label attached to a data value (e.g., budget page's "Type of Work" / "Contractor" field labels above actual values — they aid scanning of tabular data). Remove every decorative section/kicker eyebrow whose removal loses no information (the budget page's 12 shrinks to ~3 field labels; homepage/services/contact/Footer decorative labels go).

- **Alternative rejected**: restyling eyebrows to non-uppercase. The skill's rule is about the templated rhythm, not just casing; deletion is the fix.

### D2 — Stray-blue mapping (extends the rebrand's D1 table)

| Hex | Location | New value | Rationale |
|---|---|---|---|
| `#003399` | homepage search button hover gradient end | `#275230` (primary-deep) | restores pure bamboo hover ramp |
| `#00184d` | InfoBar background | `#275230` | dark bamboo strip; same white-text contrast discipline as rebrand (verified 8.99:1) |
| `#0066cc` | SearchAutocomplete link | `#0077BE` (info) | aligns with retained info token |
| `#0066a0` | contact badge gradient end | `#005A8F` | deep info pair already used by `#0099cc`→`#005a8f` mapping in the rebrand |

Also extend the standing audit regex to `0032a0|003d82|002170|f77f00|0044cc|06a77d|003399|00184d|0066cc|0066a0`.

### D3 — Lordicon integration architecture

```
src/components/icons/AnimatedIcon.tsx        ('use client' wrapper)
  props: { name, size, state?, className?, label? }
  - renders <div style={{width:size,height:size}}> (fixed box, no CLS)
  - dynamic-imports @lordicon/react Player + lottie-web on mount
  - honors prefers-reduced-motion: renders nothing animated;
    if static SVG fallback asset exists, shows it; else shows
    first-frame via player.goToFirstFrame() without play()
  - triggers: playFromBeginning() on mouseenter/focus OR once on
    IntersectionObserver reveal (per-placement prop)
public/assets/icons/lordicon/<name>.json     (minified Lottie, pre-colored)
public/assets/icons/lordicon/<name>.svg      (static fallback, optional)
```

- Player is loaded per page via dynamic import; pages without animated icons never fetch lottie-web (~100KB gz stays off the critical path of 130+ pages).
- Trigger default: hover/focus. Reveal-trigger only for the hero search card (visible above fold — hover is the natural interaction there, so default is hover everywhere; reveal mode is available but expected unused).

**Alternative rejected**: `@lordicon/element` web component. The React player has first-class refs/state handling and the docs' recommended React path; the web-component route adds registration complexity inside Next.

### D4 — Sanctioned placements (the ≤8 list)

1. Hero search card header icon (homepage) — hover
2. Certificates category tile (homepage) — hover
3. Business permits category tile (homepage) — hover
4. Tax payments category tile (homepage) — hover
5. Weather widget main icon — hover
6–8. Reserved: at most 3 more if a natural fit emerges during apply (e.g., contact page channels, news empty state). Adding any requires updating this list.

Icon candidates from the free tier, System family preferred (minimalist, civic tone): search, document/certificate, storefront/building, cash/tax, weather/sun-cloud. Final pick constrained by free availability — user exports them.

### D5 — Asset pipeline (user-in-the-loop, one-time)

1. User opens lordicon.com editor, filters to free icons, picks per D4
2. In editor: recolor to bamboo `#3A7D44` / mango `#E8990A` / slate `#2F3E46` (light-mode values — icons sit on light surfaces; dark-mode usage is out of scope for these placements), set animation state to hover-appropriate, minify ON
3. Download Lottie JSON (+ optional static SVG) into `public/assets/icons/lordicon/`
4. Naming: kebab-case semantic names (`search.json`, `certificate.json`, `storefront.json`, `cash.json`, `weather.json`)

**Fallback if a desired icon is not free**: pick nearest free equivalent; do not purchase or hotlink.

### D6 — Dependency changes

- Add: `@lordicon/react`, `lottie-web` (peer of the player), installed with bun per AGENTS.md
- Remove: `lucide-react` (0 imports; also drop its AGENTS.md stack mention only if AGENTS.md edits are in scope — they are not, so leave AGENTS.md alone)
- Bootstrap Icons CDN CSS stays untouched

### D7 — Accessibility & performance guardrails

- Reduced motion: `useReducedMotion`-equivalent via `window.matchMedia('(prefers-reduced-motion: reduce)')` in the wrapper (no new dependency); animation never starts in that mode
- Layout stability: fixed-size container div before any asset loads (spec requirement)
- Idle CPU: player pauses after `onComplete`; nothing loops; IntersectionObserver disconnected after first reveal
- Serwist: JSON assets under `public/` are precached/runtime-cached by existing config — no sw.ts change expected; verify in build output

## Risks / Trade-offs

- [Free tier may not include a desired icon] → per D5 fallback: nearest free equivalent; placements list updated rather than licensing purchased
- [Lottie JSON adds per-icon payload (5–40KB each)] → minified exports, self-hosted, cached; total <300KB across ≤8 icons, loaded only on icon-bearing pages
- [Icon flash between placeholder and first frame] → fixed-size container + first-frame render before fade-in; acceptable brief fade, no shift
- [Eyebrow removal changes page rhythm users know] → change is visual de-noising; content and hierarchy unchanged; reviewed page-by-page in verification
- [lottie-web bundle leaks into shared chunks] → verify in build output that lottie lands in per-page chunks; if not, adjust dynamic-import boundary
- [Player API mismatch with @lordicon/react version] → pin exact versions in package.json; verify against the docs example pattern (`playFromBeginning`, `goToFirstFrame`)

## Migration Plan

1. Cleanup: eyebrow pruning + stray-blue sweep + audit-list extension (independent of icons)
2. Infrastructure: install deps, build `AnimatedIcon`, place JSON assets (user exports icons)
3. Placement: wire the 5 confirmed placements, keep ≤8 cap
4. Verify: `tsc --noEmit`, production build (confirm chunking), visual pass (normal + reduced-motion), idle-CPU check
5. Rollback: revert commits; icons degrade to empty fixed boxes only if JSON missing — the wrapper falls back gracefully by rendering the Bootstrap glyph when the Lottie asset fails to load

## Open Questions

None blocking. Free-tier availability of each specific icon is resolved during apply (D5 fallback rule governs).
