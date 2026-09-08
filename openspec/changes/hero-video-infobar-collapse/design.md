# Design: Full-Viewport Video Hero & Collapsible InfoBar

> **Refinement Pass 1 (user feedback)** incorporated throughout — see D7. Original decisions D1-D6 stand as amended.

## Context

Current hero: `src/app/page.tsx` — after pass 1 of apply it is `relative flex min-h-[100dvh] items-center overflow-hidden` with video (`hero-bettersc.mp4`, 1.78 MB, blur 12 baked), scrim `rgba(42,84,49,0.85)->rgba(39,82,48,0.68)`, poster underlay. InfoBar is a client component with Motion scroll-collapse (height 36px→0 over scrollY 0→80). User's visual review found: (1) scrim+blur too heavy — footage barely visible, (2) hero consumes ~110% of viewport (navbar+InfoBar+100dvh) delaying the next section, (3) abrupt hero→white-section seam, (4) InfoBar misaligned/too tall. Source asset: `C:\Users\ediso\Videos\hero-bettersc-.mp4` (40.147s, 1080p, 23 MB). ffmpeg 9.0.1 local. `motion@13.2.0` installed.

## Goals / Non-Goals

**Goals:**
- Cinematic footage clearly VISIBLE behind a light brand treatment (not a solid green wash)
- Subtle blur; readability via layered gradients, not a heavy uniform scrim
- Hero height that fits the visible viewport below navbar+InfoBar so the next section appears naturally
- Tasteful hero→white-section transition
- Slim, centered, balanced InfoBar (compact strip, not a secondary header)
- Collapse behavior preserved exactly (smooth, reversible, reduced-motion instant, navbar stable)

**Non-Goals:**
- No hero content/copy changes; no navbar changes
- No re-trimming or segment change (user's 40s source stays)
- No decorative extras beyond the specified treatments
- No Renovate/CI/Vercel impact

## Decisions

### D1 — Asset pipeline (amended: subtle blur)

Original pass used `boxblur=12:2` (too destructive). Refinement:

```
ffmpeg -i hero-bettersc-.mp4 -an
  -vf "boxblur=6:1,scale=1280:-2"
  -c:v libx264 -crf 26 -preset slow
  -movflags +faststart -pix_fmt yuv420p
  hero-bettersc.mp4
```

- Blur reduced 12→6 (subtle softening, footage remains legible)
- CRF 26 (light blur compresses worse than heavy blur — accept ~2-4 MB; ceiling still 8 MB)
- Poster re-extracted to match: `boxblur=4:1`, t=2s, 1600w, q:v 4
- Everything else (mute, faststart, yuv420p, 40.147s duration) unchanged

**Alternative rejected:** runtime CSS blur (GPU cost on mobile) — remains rejected from the original design.

### D2 — Hero geometry, layering, and section transition (amended)

```tsx
<section className="relative flex min-h-[calc(100dvh-6rem)] items-center overflow-hidden
                    bg-cover bg-center bg-[url('/assets/videos/hero-poster.jpg')] py-24">
  <video ... className="hero-video absolute inset-0 h-full w-full object-cover hidden min-[768px]:block" />
  {/* R1 scrim: light brand wash, denser toward the headline (left) */}
  <div className="absolute inset-0
      bg-[linear-gradient(100deg,rgba(23,34,27,0.62)_0%,rgba(23,34,27,0.34)_45%,rgba(23,34,27,0.15)_100%)]" />
  {/* R1 brand tint (bamboo, uniform, light) */}
  <div className="absolute inset-0 bg-[rgba(39,82,48,0.30)] mix-blend-multiply" />
  {/* R3 bottom hand-off to the white next section */}
  <div className="absolute inset-x-0 bottom-0 h-24
      bg-[linear-gradient(to_bottom,rgba(255,255,255,0),#ffffff)]" />
  <div className="relative z-[1] {containerCls}"> ...existing content... </div>
</section>
```

- **R2 height**: `min-h-[calc(100dvh-6rem)]` — 6rem (96px) ≈ sticky navbar (~64px) + InfoBar (~28px) + hairline; hero + visible chrome now ≈ one viewport, so the white section peeks after a natural first scroll. `flex items-center` retained (content centers in the remaining space)
- **R1 scrim split**: replaced the single heavy bamboo wash with (a) a directional dark gradient — densest (0.62) behind the white headline at left, lightening to 0.15 on the right where the opaque white search card provides its own contrast surface — plus (b) a light uniform bamboo tint (0.30 multiply) that keeps brand identity without flattening the footage
- **R3 transition**: 96px white fade strip pinned to the hero's bottom edge — hands off into the Popular Services section (whose surface is `#ffffff`) with no seam
- WCAG AA check applies to the headline zone (densest area ≈ 0.62 dark + 0.30 bamboo over footage); verified visually against the lightest frame during apply
- Video `autoPlay muted loop playsInline preload="metadata" aria-hidden tabIndex={-1}`; hidden <768px and under reduced motion (`.hero-video` display none) — unchanged from original apply

### D3 — InfoBar collapse (amended: compact bar, right-aligned, no Motion)

- Strip slimmed: `py-1` equivalent (rendered height ~26px), items right-aligned on desktop (`justify-end` — the original site layout; refinement pass 1's `justify-center` was user-rejected), centered ≤1024px, separators unchanged (`border-l white/15`), single-line layout preserved
- **Collapse mechanism (amended in pass 2)**: Motion/react removed from InfoBar (and uninstalled — it was only used here). Replaced by a client-safe IntersectionObserver: a zero-height sentinel just below the sticky navbar leaves the viewport after ~80px scroll ⇒ strip collapses (`max-height`/`opacity`/`padding` CSS transition, 300ms); re-enters at the top ⇒ re-expands. No `window` scroll listeners. All live-data effects (Asia/Manila clock @1s with interval cleanup, exchange-rate fetch, weather fetch, placeholder fallbacks) are unchanged and populate after hydration.
- Reduced motion: globals.css already zeroes `transition-duration` globally (`0.01ms`), so the collapse is instant for reduced-motion users — no JS branch needed
- Navbar untouched, `aria-live` region intact

### D4 — Reduced motion & a11y

Unchanged: video `aria-hidden tabIndex={-1}`; poster under reduced motion; scrim contrast AA in the headline zone; InfoBar instant collapse; skip-link/focus order untouched.

### D5 — Dependency-bot posture

N/A to this change (covered by `ci-cd-pipeline`, archived).

### D6 — First-run bootstrap ordering

N/A to this change (protection already bootstrapped).

### D7 — Refinement pass 1 (user feedback record)

User visual review rejected pass 1 of apply: "mostly solid green background with barely recognizable video", "100dvh consumes too much space", "abrupt hero→white seam", "InfoBar misaligned/too tall". Amendments: D1 (blur 12→6, CRF 27→26), D2 (scrim split into directional dark + light bamboo multiply; height calc 100dvh→calc(100dvh-6rem); bottom white fade), D3 (py-1, centered, height 36→30). Spec deltas updated (hero-media: geometry + footage-visibility scenarios; infobar-collapse: compact/centered wording). Tasks 5.x added.

### D8 — Refinement pass 2 (user feedback record)

User browser review of pass 1 found two InfoBar regressions: (1) centering was NOT wanted — the desktop strip must stay right-aligned as before (this amends D3/D7's "centered" decision; spec delta reworded to right-aligned desktop / centered ≤1024px); (2) placeholders appeared to persist in the browser (rate/temp/date/time). Investigation: the interrupted IntersectionObserver edit had applied cleanly; all live-data effects were intact. Headless-browser verification (real-time Chrome via CDP) proved hydration populates all four values (rate, temp, date, clock, PHT), so the placeholders the user saw were a stale/halted dev-server session from the interrupted edit, not a code defect. Collapse was re-verified working (expand at top ⇔ collapsed past ~80px). Motion was uninstalled (zero remaining imports; First Load JS 140→104 kB). Pre-existing, out-of-scope finding recorded: `dotlottie-player.mjs` is loaded via `next/script` as a classic script, causing an unrelated "Cannot use import statement outside a module" console error on every page (also present on the deployed production site).

Pass-2 addendum (user review of the deployed pre-branch build): the strip's text sat ~2px above optical center (line-box + Inter font metrics) and the user read the strip against the taller pre-branch bar as "content at the top". Fix: `leading-none` on the strip and its icons (line box now hugs glyphs, making flex centering symmetric), explicit `flex items-center` on the strip and inner container, padding 6px, rendered height ~24.5px desktop / 23.6px mobile (single line). Measured ink gaps after fix: 8.3px above / 8.2px below (was 9.7/12.0 on the deployed build). Also: `PWAManager` now skips service-worker registration in development and unregisters any leftover worker/caches — a stale production `sw.js` precache on localhost was serving old markup and masking local changes during review.

## Risks / Trade-offs

- [Lighter blur exposes footage detail/compression artifacts] → CRF 26 + 1280w behind light scrim holds up; quality check at 1440p during apply
- [Lighter scrim risks AA failure on bright frames] → directional gradient keeps 0.62 density over the headline zone; contrast verified against lightest frame; search card is opaque white (self-sufficient)
- [calc(100dvh-6rem) mismatch on short viewports] → content is flex-centered with py-24 floor; worst case hero slightly shorter/taller than perfect fit — acceptable, no cut content
- [Bottom white fade over poster on mobile] → fade also covers poster path (same layer stack) — intended, harmonized on mobile too
- [InfoBar collapse height var drifts from rendered height] → heights hardcoded 30/0; if content wraps at extreme widths the strip clips — watch 480px during apply
- [Motion dependency adds client JS] → measured: homepage First Load 140 kB (was 139 kB) — negligible

## Migration Plan

1. Re-encode video + poster (D1) → size + quality check
2. Hero layering/geometry edits (D2) → desktop/mobile/transition checks
3. InfoBar compact + centered (D3) → collapse behavior re-check
4. `tsc --noEmit` + production build + CI on PR
5. User visual approval → mark 4.3 → archive
6. Rollback: revert PR

## Open Questions

None — all five refinement areas have approved direction; implementation is in-flight.
