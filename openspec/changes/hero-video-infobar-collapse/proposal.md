# Proposal: Full-Viewport Video Hero & Collapsible InfoBar

## Why

The homepage hero is a flat bamboo gradient at partial viewport height, while an 83 MB hero video asset sits unused. The user produced a trimmed 40-second, 23 MB source (`C:\Users\ediso\Videos\hero-bettersc-.mp4`, 1080p, muted content) for a cinematic landing experience. Separately, the InfoBar (exchange rate, weather, date/time strip) scrolls away abruptly under the sticky navbar; a smooth animated collapse makes the header stack feel intentional.

## What Changes

- **Full-viewport video hero** (`src/app/page.tsx`):
  - Hero section becomes `min-h-[100dvh]` (accounting for the sticky navbar; content centered in the visible viewport)
  - `public/assets/videos/hero-bettersc.mp4` re-encoded from the user's 40s source: audio removed, baked-in blur (readability + compression), web-optimized H.264, `faststart`, loop-ready; target well under ~6 MB (from 23 MB)
  - `<video>` fills the section via `object-cover` (`absolute inset-0`), `autoPlay muted loop playsInline preload="metadata"`, `aria-hidden`
  - Brand-colored scrim overlay (bamboo gradient, ~60-75%) for WCAG contrast over white text; hero content unchanged above it
  - Poster/fallback image generated from the video (`poster.jpg`), used as LCP asset and as the **mobile fallback below 768px** (video not loaded — data-saver choice), and under `prefers-reduced-motion`
- **Collapsible InfoBar** (`src/components/layout/InfoBar.tsx`):
  - Animated collapse on scroll-down past a small threshold; smooth re-expand at top
  - Implemented with Motion (`useScroll`/`useTransform` or equivalent) — no `window` scroll listeners; height/transform only, no layout jumps; `prefers-reduced-motion` collapses instantly (no animation)
  - Sticky navbar behavior unchanged
- **Asset pipeline**: one-time ffmpeg encode + poster extraction from the user's trimmed source (does not modify the git-history 83 MB file; the new video replaces `public/assets/videos/hero-bettersc.mp4` going forward)

## Capabilities

### New Capabilities

- `hero-media`: Contract for the homepage hero's full-viewport video background — geometry, readability (blur + scrim), autoplay/loop/playsInline behavior, poster/mobile fallbacks, reduced-motion handling, and asset constraints.
- `infobar-collapse`: Contract for the InfoBar's scroll-driven collapse/expand behavior — thresholds, animation constraints, reduced-motion behavior, and navbar independence.

### Modified Capabilities

- (none — no existing capability covers the homepage hero geometry or InfoBar display)

## Impact

- **Files changed**: `src/app/page.tsx` (hero markup/classes), `src/components/layout/InfoBar.tsx` (collapse behavior), `public/assets/videos/hero-bettersc.mp4` (re-encoded replacement), new `public/assets/videos/hero-poster.jpg`
- **New dependency**: `motion` (Motion for React) for the scroll-driven InfoBar collapse — the design-taste skill's sanctioned animation library; CI/size impact minimal (client-chunk). If a pure-CSS approach proves sufficient during apply, skip the dependency and record the skip
- **Systems**: LCP changes from gradient text to poster/video — poster must be `fetchpriority="high"`-treated; Vercel/CI unaffected; mobile ships poster only below 768px
- **Risks**: video quality at blur+compression (mitigated by baked blur hiding artifacts), iOS `100dvh` address-bar behavior (use `min-h-[100dvh]`), autoplay policies (muted+playsInline covers), CLS from video load (absolute positioning + poster)
- **Verification**: `tsc --noEmit`, production `next build`, visual check light/dark + reduced-motion, mobile-width check, video loop seam inspection
