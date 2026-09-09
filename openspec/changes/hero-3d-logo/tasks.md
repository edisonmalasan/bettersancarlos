## 1. Asset Optimization (one-time, prerequisite)

- [ ] 1.1 Optimize the source GLB with gltf-transform per design D1 (`bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb ...`) — verify output exists at `public/assets/models/san-carlos-logo-3d.glb`, is ≤ 3 MB, `git status` shows the source `assets/images/logo/san-carlos-logo-3d.glb` untouched, and the derivative opens correctly (three.js GLTFLoader load succeeds in the component once built, or a viewer sanity check)
- [ ] 1.2 Visually compare derivative vs source at hero scale (desktop size + 2× DPR zoom) — verify colors, materials, proportions, and front-face orientation are preserved (no texture mangling from simplify); tune `--simplify-error`/ratio if degraded, staying ≤ 3 MB

## 2. Dependencies

- [ ] 2.1 `bun add three` and `bun add -d @types/three` — verify `bun install` completes, versions recorded in package.json, no other deps added (do NOT add R3F/model-viewer per design D2)

## 3. Hero3DLogo Component

- [ ] 3.1 Create `src/components/three/Hero3DLogo.tsx` per design D4/D5/D6: lazy three.js import, GLB load from `/assets/models/san-carlos-logo-3d.glb`, Box3 normalization + camera fit, alpha canvas, ResizeObserver sizing, DPR clamp ≤ 2 — verify component type-checks and renders the static placeholder initially
- [ ] 3.2 Animation: idle yaw oscillation (A ≈ ±28°, T ≈ 10 s) + subtle float; pointer parallax on fine pointers only, eased, returning to idle on pointerleave; single rAF loop with clock — verify smooth motion at 60fps, no abrupt transitions, amplitude within spec bounds (±20°–±35°, cycle ≥ 8 s)
- [ ] 3.3 Reduced motion: honor `prefers-reduced-motion` (live via matchMedia listener) — verify static framed render, no oscillation/float/parallax when OS setting is on; verify animation resumes only if setting is turned off
- [ ] 3.4 Fallback state machine: WebGL init failure, context creation throw, or GLB load error → show static `better-san-carlos-logo-white.png` centered in the same container — verify fallback by forcing WebGL failure (or blocking the GLB request in devtools) and confirming PNG shows with no layout shift
- [ ] 3.5 Cleanup on unmount: cancel rAF, remove all listeners, `renderer.dispose()` + `forceContextLoss()`, traverse-and-dispose geometries/materials/textures — verify via React StrictMode double-mount + route navigation away (no console WebGL warnings, no leaked frame callbacks)
- [ ] 3.6 Accessibility: canvas `aria-hidden`, not focusable, no interactive semantics; loop pauses on `document.visibilitychange` hidden — verify tab order skips the canvas and the loop halts when the tab is hidden

## 4. Hero Markup Rework (src/app/page.tsx)

- [ ] 4.1 Delete the CTA row (Browse Services / Contact Us links + flex container) — verify no dead wrappers remain, `tsc --noEmit` clean
- [ ] 4.2 Move the white search card block (heading, form with `searchRef`/`handleSearchSubmit`, `SearchAutocomplete`, submit button, 3 popular pills) from the right column to directly under the description `<p>` in the left column, verbatim; apply design D7 tuning only (`max-w-[560px]`, padding/heading-margin tweaks, mobile centering) — verify search: typing, autocomplete dropdown, keyboard nav (↑↓/Enter/Esc), submission routing, popular links all behave exactly as before
- [ ] 4.3 Replace right column content with the dynamic import of `Hero3DLogo` (next/dynamic, `ssr: false`, static-PNG `loading` placeholder) in a centered flex container with design D7 sizing — verify no layout shift placeholder→canvas on desktop
- [ ] 4.4 Responsive pass: desktop two-column (> 992px), tablet (768–992px) no cramping/collisions, mobile (≤ 767px) stacks content → card → logo with usable search and no horizontal overflow/scroll interference — verify at 1440px, 1024px, 768px, 375px, 320px widths

## 5. Verification

- [ ] 5.1 Run `./node_modules/.bin/tsc --noEmit` — verify zero type errors
- [ ] 5.2 Run production build (`$env:NODE_ENV="production"; ./node_modules/.bin/next build`) — verify success; GLB present in `out/assets/models/`; First Load JS unchanged vs baseline (three.js only in lazy chunk); revert `tsconfig.tsbuildinfo` if dirtied
- [ ] 5.3 Browser pass: desktop (logo centered, subtle sway/float, parallax), mobile 375px (stacked, poster/video behavior per in-flight change untouched, search usable), reduced-motion (static logo), WebGL-failure fallback (PNG), tab-hidden pause — verify all and record results in this task
- [ ] 5.4 Confirm no regression to in-flight hero change: video autoplay + scrim + poster preload untouched, InfoBar unaffected — verify hero video layer markup diff is limited to the grid columns' contents
