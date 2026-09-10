## Context

Current derivative: quantize + simplify-error 0.002 → 2.60 MB, 63,736 tris (98.2% reduction from 1.09M), NORMAL:i16_norm. User report with screenshots: streak/scratch shading artifacts on the green ring absent in the Blender original. Measured candidates (all run on the untouched source):

| Variant | Size | Notes |
|---|---|---|
| current (quantize, 0.002) | 2.60 MB | scratched |
| quantize, 0.001 | 3.67 MB | over cap |
| quantize, 0.0005 | 5.30 MB | over cap |
| meshopt, 0.001 | 1.83 MB | fits |
| **meshopt, 0.0005** | **2.23 MB** | fits, 4× gentler |

## Decisions

### D1 — meshopt at simplify-error 0.0005
```bash
bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb --compress meshopt --simplify-error 0.0005 --texture-compress webp
```
Result: EXT_meshopt_compression replaces KHR_mesh_quantization; extensionsRequired grows accordingly; size ~2.23 MB ≤ 3 MB cap.

### D2 — Decoder wiring (the only code change)
In `src/components/three/Hero3DLogo.tsx`, inside the lazy-loaded async init where GLTFLoader is constructed:
```ts
const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
loader.setMeshoptDecoder(MeshoptDecoder);
```
No new dependency; the import stays inside the dynamic component so no other route's bundle grows.

### D3 — A/B verification harness (acceptance gate)
Build a standalone HTML harness in temp (outside the repo) that imports three from the repo's `node_modules`, and renders BOTH models with identical settings cloned from Hero3DLogo: `RoomEnvironment` PMREM env, same key/fill lights, ACESFilmic tone mapping exposure 1.12, same camera framing (Box3 fit, 0.75 distance factor). Screenshots via headless Chrome:
1. source GLB front view
2. derivative front view
3. source at +28° Y (idle sway extreme)
4. derivative at +28° Y
5. source close-up (camera at 0.4× distance) on ring/lettering
6. derivative same close-up
Screenshots saved under `$env:TEMP\opencode\glb-ab\`. Coordinator personally views all six PNGs and judges artifact parity vs the pre-optimization appearance. Any visible streak on the derivative not present in source = REJECT.

### D4 — Fallback unchanged
PNG fallback, reduced-motion static render, cleanup logic all untouched.

## Risks / Trade-offs

- [Meshopt adds a required extension] → decoder is bundled with three; GLTFLoader supports it natively once registered; guarded by the same try/catch fallback path.
- [0.0005 still shows streaks] → escalate: re-run at 0.0002 if ≤3 MB, and/or request a clean-normal re-export from the user's Blender source (root-cause fix) — recorded as next step, not silently accepted.
- [DPR-2 close-up shows texture compression differences] → textures pass through as WebP unchanged; only geometry changes.

## Migration Plan

1. Regenerate derivative (D1); inspect extensions/size.
2. Wire decoder (D2); tsc + build gates.
3. Harness A/B screenshots (D3); coordinator visual review.
4. Commit asset + code + tasks check-offs; PR → merge; sync delta → archive.

## Resilience Expectations

- If meshopt decode fails in the harness (blank canvas), check MeshoptDecoder import path against the installed three version before changing approach.
- If coordinator rejects the A/B, next steps in order: (a) 0.0002 if ≤3 MB, (b) Blender clean-normal re-export from the user, (c) relax the 3 MB cap via spec delta with user consent.
