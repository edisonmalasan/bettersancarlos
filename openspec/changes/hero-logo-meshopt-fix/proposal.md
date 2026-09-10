## Why

User-visible regression report with screenshots: the current hero GLB derivative (quantize + `--simplify-error 0.002`, 2.60 MB, 63,736 tris from 1.09M) shows "scratch" artifacts — streak-like shading discontinuities on the green ring under the hero's env-map lighting that the original Blender model does not have. Root cause: the aggressive error tolerance collapses embossed lettering/rim geometry into sliver triangles whose interpolated normals catch specular highlights. The archived change's headless verification was at hero viewing distance and missed it at close range.

## What Changes

- Re-optimize the derivative with `EXT_meshopt_compression` instead of plain quantization, at a 4× gentler simplify error (0.0005): measured **2.23 MB** (under the 3 MB cap, smaller than the current 2.60 MB). Same command otherwise; source asset untouched.
- Wire `MeshoptDecoder` (ships inside the existing `three` dependency — no new package) into the `GLTFLoader` in `src/components/three/Hero3DLogo.tsx` (2 lines, inside the already-lazy component).
- Strengthen the `hero-logo` asset requirement: compression may use KHR_mesh_quantization **or** EXT_meshopt_compression (decoder MUST be registered when meshopt is used), and visual identity MUST hold at close viewing range — explicitly banning simplification shading artifacts (streaks/sliver-triangle artifacts).
- A/B verification: render the ORIGINAL source GLB and the new derivative in an identical harness (same env/lights/tonemapping/camera) and screenshot at front, ±28° sway extremes, and close-up on ring/lettering; coordinator visually compares against the pre-optimization appearance.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hero-logo`: MODIFIED "Hero 3D logo asset" requirement — allows EXT_meshopt_compression with mandatory decoder registration; adds close-range artifact-free visual-identity scenario.

## Impact

- `public/assets/models/san-carlos-logo-3d.glb` replaced (2.23 MB meshopt); `Hero3DLogo.tsx` +2 lines; no dependency changes; no bundle impact (decoder is in the lazy three chunk).
