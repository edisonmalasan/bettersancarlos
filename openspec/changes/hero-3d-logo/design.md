# Design: Hero Layout Rework — Search Card Left, 3D Logo Right

## Context

- Hero markup lives in `src/app/page.tsx:36-95` (client component; static export, so no SSR constraints on WebGL code). The hero's video background, scrim, and `min-h-[calc(100dvh-6rem)]` geometry come from the in-flight `hero-video-infobar-collapse` change and are fixed constraints here.
- The "Find a Service" card is currently inline in the hero's right column: white rounded card wrapping `<SearchAutocomplete>` (`src/components/SearchAutocomplete.tsx`, self-contained, `forwardRef` + `SearchAutocompleteHandle.submit()`), a submit `<form>` wired via `searchRef`/`handleSearchSubmit` in `page.tsx`, and three popular-service `Link` pills. `id="hero-search"` and `.service-search-input` exist only on this single instance, so relocating the block wholesale is safe.
- Source model `assets/images/logo/san-carlos-logo-3d.glb`: 52.9 MB. Blender export (`Khronos glTF Blender I/O v5.0.21`), 2 meshes, ~1.09M triangles (3.28M uint32 indices ≈ 48.95 MB of the file), 3 WebP textures (1.48 MB, `KHR_texture_transform` + `EXT_texture_webp`), no baked animations. Node scale 0.000116 flattens it to ~1.9 × 1.9 × 0.1 units — a flat plate facing Z.
- Root `assets/` is a source folder; only `public/` ships. `public/assets/images/logo/better-san-carlos-logo-white.png` (34 KB) exists as the static fallback.
- Existing dependencies have no 3D stack (Chart.js is 2D). PWA precache (Serwist) will pick up anything placed in `public/`.

## Goals / Non-Goals

**Goals:**

- One new self-contained component owning all 3D concerns; hero markup change kept minimal.
- Optimized GLB derivative ≤ 3 MB with no visual identity loss at hero viewing distance.
- Subtle, eased idle motion + optional pointer parallax; static under reduced motion; static PNG fallback.
- Search behavior byte-for-byte preserved; no search logic duplication.

**Non-Goals:**

- No changes to hero video/scrim/geometry, InfoBar, or `SearchAutocomplete.tsx` internals.
- No post-processing, environment maps, shadows, or heavy lighting rigs.
- No interaction model on the logo beyond pointer parallax (no click/drag controls).
- Not removing the now-unused `hero-browse-services`/`hero-contact-us` keys from `LanguageContext.tsx` (scope tightness; they are shared translation data).

## Decisions

### D1 — Asset optimization via `@gltf-transform/cli`, quantize (not Draco/meshopt)

One-time command-line optimization; no runtime or dev dependency added to the repo:

```bash
bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb --simplify-error 0.0005 --texture-compression webp
```

(equivalent to weld → simplify ~97–98% → quantize → prune; exact flags tuned during apply until output is ≤ 3 MB and visually identical at hero scale)

- **Why quantize (KHR_mesh_quantization):** natively supported by three.js `GLTFLoader` — no decoder WASM/JS files to host, unlike Draco (`dracoDecoder`) or meshopt. Keeps the PWA precache and build simple.
- **Why simplify:** 1.09M triangles for a flat plate is ~15–30× beyond what's perceptible at hero size; ~97.5% reduction leaves ~25–35k triangles, indistinguishable at viewing distance.
- **Alternative rejected — `model-viewer`'s server-side optimization:** introduces the `<model-viewer>` runtime (see D2); not needed.
- **Committed artifact:** the optimized derivative is committed to `public/assets/models/` so builds/deploy are deterministic; the source in root `assets/` is untouched.

### D2 — Plain three.js in a custom component (no react-three-fiber, no model-viewer)

- **Why plain three.js:** the scene is one static mesh with two cheap lights and one animation — a ~150-line component covers load, normalize, animate, dispose. R3F adds a reconciler + 2 deps for zero benefit here; `<model-viewer>` is convenient but its animation/interaction model is coarser than the eased oscillate+parallax behavior required, and it wraps three.js anyway. Plain three.js keeps full control of the frame loop and cleanup.
- **Dependency:** `three` (runtime) + `@types/three` (dev). Tree-shaken ESM import in the lazy chunk only.

### D3 — Loading strategy: `next/dynamic` + static placeholder, no LCP impact

- `Hero3DLogo.tsx` is loaded with `next/dynamic(() => import('@/components/three/Hero3DLogo'), { ssr: false, loading: ... })` from the hero. The `loading` fallback renders the static `better-san-carlos-logo-white.png` centered in the same container, so the column never looks empty and there is no layout shift when the canvas swaps in.
- The same static PNG remains the permanent fallback when WebGL init fails, context creation throws, or the GLB fetch errors (component state machine: `loading → ready | fallback`).
- three.js lands in a lazy client chunk fetched after first paint; homepage First Load JS unchanged.

### D4 — Model normalization at runtime (no hardcoded fitting)

On load: compute `Box3` of the scene, center it, scale to a fixed logical height (e.g. 3 units), position camera to frame bounds with margin (fit by distance from bounding sphere). This is robust to the GLB's exact pivot/offset (node translations are non-zero) without baking transforms into the asset. Canvas is `alpha: true`, transparent, sized by its container (`ResizeObserver`), DPR clamped ≤ 2.

### D5 — Animation: oscillating yaw around front face + float; pointer parallax eased

- Model front faces Z (Blender export convention). Idle: `yaw = A·sin(2π·t/T)` with amplitude A ≈ 0.5 rad (~±28°, within the spec's ±20°–±35°) and period T ≈ 10 s; float `y = 0.05·sin(2π·t/T2)` with T2 ≈ 6 s. Oscillation (not 360°) because the plate is ~5% thick — a full spin shows edge-on/back views that read as broken.
- Pointer parallax (fine pointers only, `matchMedia('(pointer: fine)')`): hero-level pointermove maps normalized cursor offset to an extra tilt target of at most a few degrees; `lerp` each frame toward target; pointerleave eases target back to zero. Passes the "game object" test by amplitude + easing only.
- `prefers-reduced-motion: reduce` (live via `matchMedia`, change-listened): render loop still runs once to present a correctly framed static frame, then stops; no oscillation, float, or parallax listeners.
- Frame loop: single `requestAnimationFrame` chain using a shared `clock`; loop pauses on `document.visibilitychange` hidden and cancels on unmount.

### D6 — Disposal discipline

On unmount: cancel RAF, remove listeners (`resize`/`ResizeObserver`, `pointermove`, `matchMedia` change, `visibilitychange`), `renderer.dispose()`, `renderer.forceContextLoss()`, traverse scene disposing geometries/materials/textures. GLTFLoader cache not retained.

### D7 — Hero markup change kept to the existing grid columns

- Delete the CTA row (lines 57–64) entirely — no replacement wrapper.
- Move the white search card block (lines 67–91) from the right column into the left column directly after the description `<p>`; tuning limited to: `w-full max-w-[560px]`, reduced heading margin, slightly tighter padding (`p-6`/`max-[768px]:p-5`), `max-[992px]:mx-auto max-[992px]:text-left` so it centers under centered mobile text without restyling the card's interior. `searchRef`/`handleSearchSubmit`/form/pills move verbatim.
- Right column becomes `<Hero3DLogo />` (dynamic import) in a `flex items-center justify-center` container with an aspect-bounded box (e.g. `max-w-[520px] w-full aspect-[4/3]`), so mobile stacking (content → card → logo, natural DOM order) and tablet behavior fall out of the existing `grid-cols-2 → grid-cols-1` breakpoint — no new layout system.
- Static export: no config changes; `public/` copies to `out/` automatically. Serwist precache grows by the optimized GLB (≤ 3 MB) — acceptable.

## Risks / Trade-offs

- [Simplify degrades texture/color fidelity up close] → tune `--simplify-error` / ratio during apply; visually inspect the derivative at hero size (and 2× DPR) before committing; worst case raise the triangle budget within the 3 MB cap.
- [EXT_texture_webp/KHR_texture_transform in old Safari] → textures are unchanged by optimization and already webp in the source; three.js GLTFLoader handles both extensions; fallback PNG covers load failure regardless.
- [52.9 MB source read is slow but one-time] → optimization runs locally once; derivative committed; CI never reruns it.
- [PWA precache grows by ≤ 3 MB] → within reason for a decorative hero asset; Serwist runtime caching unaffected; if size ever matters, the GLB can be moved to runtime-cache-only.
- [Pointer parallax jitter near screen edges] → amplitude cap (few degrees) + lerp smoothing; listener attached to the hero section, not window.
- [Two OpenSpec changes touch the same hero block] → this change's scope is the grid columns' contents only; video/scrim/geometry layers are untouched, minimizing merge surface with `hero-video-infobar-collapse`.

## Migration Plan

1. Optimize the GLB once; commit derivative to `public/assets/models/`.
2. Land component + hero markup changes on `feat/hero-3d-logo`; verify with `tsc --noEmit` + production build + visual/reduced-motion/fallback checks.
3. PR to `main` (merge commit, per repo convention). Rollback: revert the PR — the derivative asset and component are additive; the source GLB was never modified.

## Open Questions

- Exact oscillation amplitude/period and canvas aspect ratio will be tuned visually against the real asset during apply (bounds fixed by spec; safe to defer).
