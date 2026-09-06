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

### D3 — InfoBar collapse (amended: compact bar)

- Strip slimmed: `py-1.5` → `py-1` (rendered height ~28px), items horizontally **centered** (`justify-center` at all widths — was right-aligned), separators unchanged (`border-l white/15`), single-line layout preserved
- Motion mapping updated to the new geometry: scrollY [0→80] ⇒ height [**30**→0], opacity [0→50] ⇒ [1→0] (was 36→0)
- Everything else stands: Motion values only (no scroll listeners), `useReducedMotion` renders static strip (instant), navbar untouched, `aria-live` region intact

### D4 — Reduced motion & a11y

Unchanged: video `aria-hidden tabIndex={-1}`; poster under reduced motion; scrim contrast AA in the headline zone; InfoBar instant collapse; skip-link/focus order untouched.

### D5 — Dependency-bot posture

N/A to this change (covered by `ci-cd-pipeline`, archived).

### D6 — First-run bootstrap ordering

N/A to this change (protection already bootstrapped).

### D7 — Refinement pass 1 (user feedback record)

User visual review rejected pass 1 of apply: "mostly solid green background with barely recognizable video", "100dvh consumes too much space", "abrupt hero→white seam", "InfoBar misaligned/too tall". Amendments: D1 (blur 12→6, CRF 27→26), D2 (scrim split into directional dark + light bamboo multiply; height calc 100dvh→calc(100dvh-6rem); bottom white fade), D3 (py-1, centered, height 36→30). Spec deltas updated (hero-media: geometry + footage-visibility scenarios; infobar-collapse: compact/centered wording). Tasks 5.x added.

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
