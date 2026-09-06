# Design: Full-Viewport Video Hero & Collapsible InfoBar

## Context

Current hero: `src/app/page.tsx` line 37 — `<section class="bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] py-[120px]">` (~560px effective height) containing the two-column hero grid. Header is `sticky top-0 z-[1000]`; InfoBar is a normal-flow sibling below it (`bg-[#275230]`, `py-1.5`, ~28px tall), already a client component fetching FX/weather. User's trimmed source: `C:\Users\ediso\Videos\hero-bettersc-.mp4` — 40.147s, 1920x1080 h264 + AAC audio, **23.03 MB**, ~9.9 Mbps. Git-tracked `public/assets/videos/hero-bettersc.mp4` (83.5 MB original) was deleted from the working tree by the user; the re-encode replaces it. ffmpeg 9.0.1 available locally. Motion (`motion/react`) is NOT currently installed.

## Goals / Non-Goals

**Goals:**
- Cinematic `min-h-[100dvh]` hero with the video as background, existing hero content untouched above it
- Readability: baked-in blur + bamboo scrim (WCAG AA over white text)
- Asset: 40s footage preserved, audio stripped, blurred encode well under ~6 MB, poster extracted
- Mobile <768px: poster-only (no video bytes); desktop: poster-first, video swaps in
- InfoBar animated collapse/expand (scroll-driven), reduced-motion instant, navbar untouched

**Non-Goals:**
- No hero content/copy/layout redesign beyond background and height
- No Navbar changes (sticky behavior already correct)
- No other pages get video heroes (homepage only)
- No GitHub-hosted video/CDN change — self-hosted asset in `public/`
- Do not re-trim or select a different segment than the user's 40s source

## Decisions

### D1 — Asset pipeline (one-time ffmpeg, run during apply)

Source: `C:\Users\ediso\Videos\hero-bettersc-.mp4` (40.147s, 1080p, has AAC audio).

```
Pass 1 (video, blur baked in, muted):
ffmpeg -i hero-bettersc-.mp4 -an
  -vf "boxblur=12:2,scale=1280:-2"          <- blur then downscale (blur hides artifacts)
  -c:v libx264 -crf 27 -preset slow
  -movflags +faststart -pix_fmt yuv420p
  hero-bettersc.mp4
Pass 2 (poster, sharp-ish for LCP):
ffmpeg -ss 2 -i hero-bettersc-.mp4 -frames:v 1
  -vf "boxblur=10:1,scale=1600:-2" -q:v 4 hero-poster.jpg
```

- Blur ~10-12px baked into footage: guarantees readability at ANY frame, compresses drastically (flat regions), and removes any runtime CSS `filter: blur()` GPU cost
- Downscale 1080p → 1280w: behind a scrim + blur, indistinguishable at 1440p viewports
- CRF 27 + preset slow: quality floor for blurred content; expect **~3-5 MB** for 40s (from 23 MB)
- `-an`: audio stripped (user already edited muted content; guaranteed silent)
- `+faststart`: moov atom up front for streaming playback
- Poster: slight blur + scrim-friendly frame (t=2s), JPEG q4, target <150 KB
- Replace `public/assets/videos/hero-bettersc.mp4` with the encode; add `public/assets/videos/hero-poster.jpg`; commit both (old 83 MB blob stays in history — acceptable, already there)

**Alternative rejected:** runtime CSS `backdrop-filter`/`filter: blur()` on the video element — GPU cost on scroll/perf-sensitive mobile, and doesn't reduce file size.

### D2 — Hero geometry & markup

```tsx
<section className="relative flex min-h-[100dvh] items-center overflow-hidden py-24 ...">
  {/* video: desktop only */}
  <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline
         preload="metadata" poster="/assets/videos/hero-poster.jpg" aria-hidden="true" tabIndex={-1} />
  {/* scrim */}
  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(42,84,49,0.82)_0%,rgba(39,82,48,0.66)_100%)]" aria-hidden="true" />
  {/* existing content grid, wrapped in relative z-[1] container */}
</section>
```

- `min-h-[100dvh]` + `flex items-center`: content vertically centered in the *visible* viewport; `100dvh` tracks mobile address-bar collapse
- Sticky navbar overlays the top of the viewport — hero content clears it via `items-center` + generous padding; navbar itself is opaque white, no transparency juggling
- Scrim: bamboo-family gradient at ~66-82% opacity — preserves brand over any frame; exact opacity tuned during apply against WCAG (verify with contrast check on the lightest frame)
- `overflow-hidden` guards the blurred edges
- Mobile <768px: video element NOT rendered (CSS-hidden at the markup level via `hidden min-[768px]:block` — conditional render preferred if trivially checkable; poster path: section keeps `bg-[url('/assets/videos/hero-poster.jpg')] bg-cover bg-center` layered under the scrim so <768px never downloads video bytes
- `prefers-reduced-motion`: video hidden, poster path active (CSS `@media (prefers-reduced-motion: reduce) { .hero-video { display: none } }` plus the mobile bg class always present beneath)

LCP: poster is preloaded in `layout.tsx`/page head (`<link rel="preload" as="image">` via Next metadata or explicit `<link>`) — the video is `preload="metadata"` so it never fights the poster.

### D3 — InfoBar collapse: Motion (added dependency) over hand-rolled

Add `motion` (Motion for React, `motion/react`). InfoBar becomes a scroll-aware client component:

```tsx
const { scrollY } = useScroll();
const height = useTransform(scrollY, [0, 80], [BAR_H, 0]);
const opacity = useTransform(scrollY, [0, 60], [1, 0]);
// <motion.div style={{ height, opacity, overflow: 'hidden' }}>
```

- Motion value-driven (no `window` scroll listeners, no setState per frame — skill-mandated)
- Threshold ~80px: InfoBar fully collapsed by the time the hero's first rows scroll past; re-expands identically on reverse
- `overflow: hidden` + animated height: content below (hero) glides up smoothly — no jump because the height change is continuous
- `useReducedMotion()` → render plain static div (collapse instant/no animation or keep static — instant, per spec)
- Navbar untouched: it is `sticky` and sits above; InfoBar collapse happens beneath it in flow

**Alternative rejected:** CSS-only `animation-timeline: scroll()` — browser support still patchy for production confidence; Motion is the skill's sanctioned library and future-proof for further header polish. If bundle weight becomes a concern, `motion`'s `m` + LazyMotion trims it (apply-time detail).

### D4 — Reduced motion & a11y summary

- Hero: `aria-hidden` on video + scrim; poster under reduced motion; contrast AA enforced by scrim opacity
- InfoBar: `useReducedMotion` → instant state, no tween; content remains accessible (`aria-live` region preserved)
- Keyboard: video `tabIndex={-1}`; hero content focus order unchanged

## Risks / Trade-offs

- [Compressed blurred video looks muddy on huge screens] → 1280w behind scrim+blur is a texture, not detail content; quality check at 1440p during apply
- [Bamboo scrim alters footage mood] → scrim opacity is the tuning knob (0.6-0.85 range); pick lowest that passes AA on the lightest frame
- [Motion dependency adds client JS] → LazyMotion/m variant available; alternative CSS-only fallback recorded if it measures heavy
- [iOS Safari `100dvh` + sticky address-bar jumps] → `100dvh` is the fix (not `100vh`); verify on iOS profile during apply
- [Video file still large after encode] → hard ceiling: if >8 MB at CRF 27, step to CRF 29 / 960w; do not exceed 8 MB
- [Poster/video flash-of-content] → poster always painted first (it's the section bg on mobile AND video `poster` attr on desktop); video fades/starts only when ready
- [Old 83 MB blob remains in git history] → accepted (already public history); future: bfg/lfs if repo weight matters

## Migration Plan

1. Encode assets (D1) → verify sizes + loop seam visually
2. Hero markup + scrim + poster preload (D2) → desktop/mobile/reduced-motion visual check + contrast check
3. Install `motion`, InfoBar collapse (D3) → scroll behavior + reduced-motion check
4. `tsc --noEmit` + production build + CI on PR
5. Rollback: revert PR (asset + markup are additive; InfoBar reverts to static strip)

## Open Questions

None — all decisions confirmed by the user (Option B both features; 40s source preserved; audio stripped; mobile poster fallback; cinematic full viewport).
