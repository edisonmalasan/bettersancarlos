## Why

A 12-dimension design audit (gradients, cards, hover states, animations, typography, tokens, rhythm, icons, slop-tells, shell, primitives, routes) found the site is internally inconsistent and carries AI-slop artifacts: two parallel styling systems (token classes exist but raw hexes duplicate them ~1,050 times), 8 different border-radius values, 5 different hover-lift values with durations ranging 150–1200ms plus 306 `transition-all` uses (some with no duration), three competing stat-card systems, two page-hero systems, mixed icon renderers in the same grid, an orphan dotlottie script with zero consumers, and several outright bugs (broken footer route, wrong-city Facebook embed, fake "Loading news" card). The result reads as templated rather than designed. Fixing this is required for the site to feel like a real civic portal (Task 2, design de-slopping).

## What Changes

- **Visual design system (new capability spec)**: lock one radius scale, one transition-timing scale, one section rhythm, token-exclusive color usage, and icon consistency as a durable spec.
- **Token migration**: add missing border tokens (`--color-line`, `--color-line-soft`); mechanically replace raw hex classes (`#2f3e46`, `#5c6b73`, `#e2e8e0`, `#faf9f6`, flat `#3a7d44`/`#275230`/`#2f6136`/`#0077be`) with the existing token utilities so palette swaps propagate site-wide (fulfills the existing brand-color-palette "single source of truth" requirement). Mandated banner gradients keep their hex values inside `linear-gradient()` or adopt the same tokens via `var()`.
- **Radius lock**: cards/panels = `rounded-xl`, inputs/chips/small icon boxes = `rounded-lg`, interactive pills = `rounded-full`; replace arbitrary pixel radii (`rounded-[10px]`, `[12px]`, `[14px]`, `[20px]`, inline `50px`) with the nearest scale step.
- **Motion timing lock**: hover/focus transitions = `duration-200` with explicit property lists (no `transition-all`), one lift value (`hover:-translate-y-0.5`) for interactive cards, `transition-[gap]` where gap nudges exist, `:active` press feedback (`scale-[0.97]`) on primary buttons; chart intro animation 2000ms → 800ms; remove per-fetch `rateFadeIn` re-animation in InfoBar.
- **Section rhythm**: align outliers (homepage Quick Stats, statistics ×6, legislative, budget, privacy/terms, health inverted tablet padding) to the canonical `py-16 max-[1024px]:py-8 max-[767px]:py-6`.
- **Card system unification**: one news-card pattern (homepage ↔ news page), one service-card pattern (homepage ↔ services/health), one border color for white cards (the new line token), one hover shadow family.
- **Icon consistency**: same renderer per row — replace the lone lordicon `AnimatedIcon` in the homepage services row with its Bootstrap fallback glyph; keep AnimatedIcon for the weather condition icon (dynamic state); remove the orphan dotlottie `<Script>` from layout.
- **Typography**: migrate Inter from a render-blocking Google Fonts `<link>` to `next/font/google` (self-hosted, `display: swap`); collapse the duplicated `--font-main`/`--font-sans` variables; standardize eyebrow tracking to `tracking-[0.5px]`.
- **Targeted de-slop**: replace health page's hand-rolled hero with the shared `PageHeader`; remove health's polka-dot decorative background; proper skeleton for the news loading state (no fake article card); remove the wrong-city Facebook page-plugin embed (`OfficialLGUSolano` — this is San Carlos, Pangasinan); fix Footer `/sitemap-page` → `/sitemap`; remove Footer's `hidden` dead social-links block.
- **Preserved (explicitly out of scope)**: brand-mandated bamboo-green page-header/hero gradients and gradient primary buttons (brand-color-palette spec), hero video/3D logo behavior (hero-media/hero-logo specs), information architecture, routes, nav labels, content copy, uniform card-grid layouts (correct for civic scanability), breakpoint values, dark/high-contrast mode behavior.

## Capabilities

### New Capabilities

- `visual-design-system`: locks the site's visual consistency contract — token exclusivity for brand/neutral colors, the radius scale, the transition-timing and lift rules, the section rhythm, and the one-icon-renderer-per-row rule — so future pages/components cannot reintroduce drift.

### Modified Capabilities

(none — brand-color-palette, hero-media, hero-logo, infobar-collapse, icon-system, ci-verification requirements are unchanged; this change enforces conformance with them)

## Impact

- ~48 files across `src/app/**` and `src/components/**` touched; majority of edits are mechanical class replacements (hex→token, radius, duration/transition).
- `src/app/globals.css`: new line tokens; `--font-main` consolidation; no new keyframes or global CSS files.
- `src/app/layout.tsx`: `next/font` migration; dotlottie script removed; Bootstrap Icons CDN link and preconnects unchanged.
- Zero behavior/API/route changes; all content and functionality preserved. Build (`tsc --noEmit` + production `next build --webpack`) and visual smoke check across homepage + statistics + budget + news + health + contact must pass.
- No dependency additions or removals (lordicon dep stays; its unused homepage call site is replaced by a Bootstrap glyph).
