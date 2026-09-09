# Proposal: Hero Layout Rework — Search Card Left, 3D Logo Right

## Why

The homepage hero currently spends its right column on the white "Find a Service" card while the left column ends in two flat CTA buttons (`Browse Services`, `Contact Us`). The recently added San Carlos 3D logo asset sits unused. Moving the search card directly under the hero description makes the hero's primary action (finding a service) immediately actionable in the reading flow, removes the low-value CTA row, and frees the right column for the 3D logo as the hero's visual anchor.

## What Changes

- **Remove hero CTA row** (`src/app/page.tsx`): delete the `Browse Services` / `Contact Us` link pair and its flex container from the hero's left column. No dead wrappers or spacing remain.
- **Relocate the "Find a Service" card** (`src/app/page.tsx`): the existing card (heading, `SearchAutocomplete` input, submit button, popular-service pills) moves from the right hero column to directly beneath the hero description paragraph in the left column. All search wiring (`searchRef`, `handleSearchSubmit`, form submit, autocomplete behavior, routing, keyboard nav, accessibility attributes, popular links, service data integration) is preserved verbatim — no search logic is duplicated or re-implemented. Card width/padding/spacing are tuned for the new, narrower left-column context while keeping the existing visual design language (white card, rounded corners, existing shadow/border treatment).
- **3D logo in the right hero column** (new `src/components/three/Hero3DLogo.tsx`): render `assets/images/logo/san-carlos-logo-3d.glb` in a transparent-background canvas, centered, normalized to fit the column. Behavior:
  - Subtle idle motion: slow eased Y-axis oscillation around the front-facing orientation (~±28°, not a full 360° spin — the model is a flat ~0.1-unit-thick plate), plus a gentle vertical float.
  - Optional subtle pointer parallax (desktop pointer devices only, eased, returns to idle); touch devices unaffected.
  - `prefers-reduced-motion: reduce` renders the logo static (no rotation/float/parallax).
  - Decorative: `aria-hidden` canvas, not keyboard-focusable; search form accessibility untouched.
- **Asset optimization (one-time, prerequisite)**: the source GLB is 52.9 MB (1.09M triangles; 1.48 MB of that is textures). A web-optimized derivative (`public/assets/models/san-carlos-logo-3d.glb`, target ≤ 3 MB) is produced once with `@gltf-transform/cli` (weld → simplify ~97% → quantize via KHR_mesh_quantization → prune) and committed. The original in root `assets/images/logo/` is not modified. The runtime loader falls back to the existing static `better-san-carlos-logo-white.png` if WebGL is unavailable or the model fails to load.
- **Performance guardrails**: three.js loaded lazily via `next/dynamic` after first paint (not in the critical bundle), device pixel ratio clamped (≤ 2), no post-processing, cheap lighting, full renderer/geometry/texture disposal on unmount.

## Capabilities

### New Capabilities

- `hero-logo`: Contract for the hero's right-column 3D San Carlos logo — asset requirements, framing/fit, idle animation, pointer interaction bounds, reduced-motion and WebGL-fallback behavior, performance constraints, and responsiveness across desktop/tablet/mobile.

### Modified Capabilities

- (none — the hero's video background, scrim, and geometry are governed by the in-flight `hero-media` change and are not altered; the search card's behavior has no existing capability spec and its behavior is unchanged by this relocation)

## Impact

- **Files changed**: `src/app/page.tsx` (hero block only: CTA row removed, search card relocated/re-tuned, right column hosts the 3D logo), new `src/components/three/Hero3DLogo.tsx` (+ a thin `next/dynamic` loader wrapper inside the hero or the component file itself)
- **New dependency**: `three` (runtime, lazy-loaded client chunk) + `@types/three` (dev); `@gltf-transform/cli` used one-time via `bunx` (not committed as a dependency)
- **New asset**: `public/assets/models/san-carlos-logo-3d.glb` (optimized derivative, ≤ 3 MB target); source `assets/images/logo/san-carlos-logo-3d.glb` untouched
- **Systems**: static export unaffected (`next build` copies `public/` to `out/`); PWA Serwist precache will pick up the new GLB — file size keeps precache reasonable; LCP unaffected (logo is not the LCP candidate; poster preload from `hero-video-infobar-collapse` untouched); First Load JS delta limited to the lazy chunk loaded after paint
- **Risks**: aggressive simplification could degrade texture fidelity at close inspection (verified visually during apply; simplify ratio tuned if needed); WebGL unavailable on rare devices (static PNG fallback covers); quantization extension (KHR_mesh_quantization) is natively supported by three.js GLTFLoader — no decoder files needed
- **Out of scope**: hero video/scrim/geometry (in-flight `hero-video-infobar-collapse` change), `SearchAutocomplete.tsx` internals, InfoBar, LanguageContext keys (`hero-browse-services`/`hero-contact-us` become unused on the page but remain in the context file to keep scope tight)
- **Verification**: `tsc --noEmit`, production `next build`, visual check desktop/tablet/mobile, reduced-motion check, WebGL-fallback check, optimized GLB visual parity review
