## Context

`src/components/three/Hero3DLogo.tsx` and the hero in `src/app/page.tsx` already implement all renderer-side performance constraints from the `hero-logo` and `hero-media` specs: lazy three.js import, fallback state machine (`loading → ready | fallback`), DPR clamp ≤2, visibility pause/resume, full disposal on unmount, poster-as-LCP via preload in `layout.tsx`, video only ≥768px, reduced-motion static render. The video asset (3.3 MB, baked blur 6, faststart, no audio) is spec-compliant.

The regression: commit `c7b7545` ("feat: hero 3D logo...") committed the **unoptimized** source GLB (52,889,128 bytes ≈ 50.4 MB) to `public/assets/models/san-carlos-logo-3d.glb`. The archived `hero-3d-logo` change's tasks.md records the optimization was run and produced 2.60 MB / 63,736 tris, but the file that landed in the working tree at commit time was the 50 MB source, not the derivative. The result ships a ~47 MB decorative asset to every homepage visitor and precaches it in the PWA.

## Goals / Non-Goals

**Goals:**
- Restore `public/assets/models/san-carlos-logo-3d.glb` to ≤3 MB with preserved visual identity.
- Keep the source asset `assets/images/logo/san-carlos-logo-3d.glb` byte-identical.
- Re-verify the hero performance criteria from Task 1 that depend on the fix (payload size, precache size, smooth render).

**Non-Goals:**
- No changes to `Hero3DLogo.tsx`, `page.tsx` hero markup, scrim, or video assets.
- No spec changes (`hero-logo` already covers this).
- No renderer changes beyond what verification demands.

## Decisions

### D1 — Re-run the recorded optimization pipeline
Per the archived change's recorded recipe (tasks.md 1.1: result "52.89 MB → 2.60 MB ... `--compress quantize --simplify-error 0.002`"):

```bash
bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb --compress quantize --simplify-error 0.002 --texture-compression webp
```

This runs weld → simplify → quantize (KHR_mesh_quantization) → prune, textures as WebP. Target ≤3 MB, identity preserved. The archived run found 0.0005/0.001 simplify-error exceeded the 3 MB cap; 0.002 fit. If the output exceeds 3 MB, step `--simplify-error` up (0.003, 0.005) until under cap while identity holds at hero scale.

### D2 — Verification of visual identity
Compare derivative vs current render at hero scale: run the dev server and screenshot at 1440 and 375 widths; confirm seal colors, textures, proportions, and front-face dominance match. The archived change already verified this flag preserved identity (63,736 tris, colors matched) via headless-browser screenshots — this is a proportionally lighter regression re-check against the current (oversized) render.

### D3 — Git-hygiene guard
Before commit, verify:
- `git status` shows ONLY the derivative file changed under `public/assets/models/`.
- Source `assets/images/logo/san-carlos-logo-3d.glb` is untouched (`git status` + `git diff --stat` must not list it).
- The root `assets/` directory is not part of the deployed bundle (Next.js serves only `public/` and compiled output; this is unchanged by the fix).

### D4 — Serwist precache impact
`public/sw.js` is generated at build; with the derivative at ~2.6 MB the precache shrinks ~47 MB. No code change to `src/app/sw.ts`.

## Risks / Trade-offs

- [Simplify (error 0.002) degrades fidelity] → visual check at hero scale (1440, 375); the archived change verified this flag preserved identity; step the error up only as needed to fit 3 MB.
- [Over-aggressive texture handling mangles WebP textures] → textures are small (1.48 MB total) and pass through as WebP; no transcode expected.
- [Runtime regression in the component] → none expected; URL unchanged, extensions (EXT_texture_webp, KHR_mesh_quantization, KHR_texture_transform) already loaded correctly in the archived headless verification; tsc + build gate the change.
- [git history already carries the 50 MB blob] → history rewrite is out of scope (destructive, not authorized); the fix only corrects the current tip.

## Migration Plan

1. Run the optimize command; check output ≤3 MB (`gltf-transform inspect`).
2. Visual regression check via dev server screenshots (1440, 375).
3. Commit the derivative on `fix/hero-performance`; verify tsc + production build; push; PR → merge (merge commit), delete branch.
4. Rollback: revert the PR — single binary file swap, source untouched.

## Resilience Expectations

- If `bunx` fails (network/registry), fall back to `npx @gltf-transform/cli` — same tool, different runner; report which runner was used.
- If output exceeds 3 MB at 0.002, escalate simplify error per D1.
- If the visual check shows mangled colors/textures, re-run with adjusted flags within the 3 MB cap and re-verify.
