## 1. Asset

- [x] 1.1 Create branch `fix/hero-logo-meshopt` from `main`, push with `-u origin` — verify clean tree
- [x] 1.2 Regenerate derivative: `bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb --compress meshopt --simplify-error 0.0005 --texture-compress webp` — verify output ≤ 3 MB, `gltf-transform inspect` shows EXT_meshopt_compression in extensionsRequired, and `git status` shows ONLY the derivative changed (source untouched)

## 2. Code

- [x] 2.1 `src/components/three/Hero3DLogo.tsx`: inside the async init, import `MeshoptDecoder` from `three/examples/jsm/libs/meshopt_decoder.module.js` and call `loader.setMeshoptDecoder(MeshoptDecoder)` before loading the GLB — verify no other file changes; confirm the import is inside the dynamic component (bundle isolation)

## 3. A/B verification (acceptance gate)

- [x] 3.1 Build the harness per design.md D3 in `$env:TEMP\opencode\glb-ab\` (HTML + three from repo node_modules): render source GLB and derivative with identical env/lights/tonemapping/camera; produce 6 screenshots (source/derivative × front/+28°/close-up ring) — verify all 6 PNGs exist and are non-empty
- [x] 3.2 Self-check the derivative screenshots for streak/scratch artifacts on the green ring, lettering, and rim vs the source screenshots — if artifacts are visible that the source lacks, STOP and report REJECT in worker_done (do not commit); if clean, record the comparison result

## 4. Gates & delivery

- [x] 4.1 `./node_modules/.bin/tsc --noEmit` PASS; `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` PASS; revert dirtied generated files
- [x] 4.2 Check off tasks.md boxes, commit `fix: re-optimize hero GLB with meshopt to eliminate simplification streaks` (asset + component + openspec change files), push
- [x] 4.3 Send `worker_done` with --outcome succeeded (or failed): final size, extensions, screenshot paths for coordinator review, A/B self-check result

> Coordinator note (2026-09-10): tasks 4.2/4.3 executed by the coordinator after two worker dispatches were killed by Orca runtime restarts (exit 1073807364 / terminal no longer live). All 6 A/B screenshots (TEMP\opencode\glb-ab\{source,deriv}-{front,rot28,closeup}.png) personally reviewed by the coordinator: derivative shows NO streak/scratch artifacts vs source at front, +28 deg, and close-up. ACCEPTED.
