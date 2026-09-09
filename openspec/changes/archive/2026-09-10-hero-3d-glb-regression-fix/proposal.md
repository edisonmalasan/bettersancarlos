## Why

The hero 3D logo derivative committed to `public/assets/models/san-carlos-logo-3d.glb` is the unoptimized 50.4 MB source asset, not the ≤3 MB web-optimized derivative recorded in the archived `hero-3d-logo` change (commit `c7b7545` recorded "52.89 MB → 2.60 MB" but the committed file is 52,889,128 bytes). This violates the `hero-logo` spec's asset budget, bloats the Serwist precache and initial hero load by ~47 MB, and is the dominant remaining cause of hero jank on mid-range devices — the video (3.3 MB) and renderer code are already compliant.

## What Changes

- Re-optimize the hero GLB derivative with `@gltf-transform/cli` (weld → simplify → quantize → prune, WebP textures preserved) so `public/assets/models/san-carlos-logo-3d.glb` is ≤3 MB, visually identical at hero scale, and byte-replaces the oversized file.
- Verify the source asset `assets/images/logo/san-carlos-logo-3d.glb` (50.4 MB) remains untouched and still gitignored/out of the deployed bundle.
- Confirm the homepage hero (video + 3D logo + poster LCP) meets the remaining Task-1 performance verification criteria (no layout shift, lazy 3D chunk, DPR clamp, cleanup) which code inspection shows already implemented; fix only what regressed.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none — no spec-level behavior changes. The existing `hero-logo` spec already mandates the ≤3 MB asset budget and all performance constraints; this change restores implementation conformance to it. `skip_specs: true` is therefore set.)

## Impact

- `public/assets/models/san-carlos-logo-3d.glb` — replaced with the optimized derivative (~2.6 MB expected).
- Serwist precache manifest (`public/sw.js`, generated) — shrinks by ~47 MB on next build.
- No component code changes expected (`src/components/three/Hero3DLogo.tsx` already lazy-loads three.js, clamps DPR ≤2, pauses when hidden, and disposes on unmount).
- Deployment artifacts (`out/`) shrink accordingly; no API, data, or routing changes.
