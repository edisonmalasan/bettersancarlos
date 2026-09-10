## Context

Measured current state (coordinator-verified): served file `public/assets/models/san-carlos-logo-3d.glb` = 24,078,696 bytes (22.96 MB), 1,094,486 tris, `NORMAL:i8_norm, POSITION:u16`, extensionsRequired `KHR_mesh_quantization, EXT_texture_webp` — NO meshopt. Source path `assets/images/logo/san-carlos-logo-3d.glb` is fully absent from git (owner deleted it deliberately). Component currently registers MeshoptDecoder (dead code since the meshopt fix). Owner confirms the re-export renders cleaner than the meshopt derivative (scratch artifacts gone at full fidelity).

## Decisions

### D1 — Spec: single asset, 30 MB budget, no decoder mandate
New requirement text per the delta. The 30 MB cap bounds the current 22.96 MB file with headroom for future re-exports while keeping a testable bound. The close-range artifact scenario is retained (it now guards the served file directly). The ≤3 MB / meshopt-decoder language is fully replaced, not appended.

### D2 — Code: remove the dead decoder wiring (exact lines)
In `src/components/three/Hero3DLogo.tsx`, remove:
```ts
const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
```
and:
```ts
loader.setMeshoptDecoder(MeshoptDecoder);
```
Keep the `const loader = new GLTFLoader();` construction and everything else (Timer, checkShaderErrors, lazy loading, fallback). KHR_mesh_quantization + EXT_texture_webp are native to GLTFLoader — no registration needed.

### D3 — Verification
1. `gltf-transform inspect` confirms extensions unchanged and size ≤ 30 MB.
2. Render check: load the served file through a plain GLTFLoader (no decoder) in the existing A/B harness and screenshot front + close-up — proves the decoder removal doesn't break loading and the render is clean.
3. `tsc --noEmit` + production `next build --webpack`.

## Risks / Trade-offs

- [23 MB precache/download] → accepted by owner; lazy chunk keeps it off first paint; recorded for future tightening.
- [Removing decoder breaks future meshopt files] → the spec no longer permits a meshopt-only file without re-adding registration; correct coupling.

## Migration Plan

Branch `chore/hero-logo-single-asset`: 2-line removal → render check → gates → commit → push → PR → merge → sync delta → archive → PR → merge.

## Resilience Expectations

- If the plain-loader render check fails (blank canvas), inspect the actual error before concluding — do not re-add the decoder blindly.
