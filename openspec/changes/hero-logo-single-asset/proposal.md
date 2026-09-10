## Why

Owner decision (supersedes the meshopt approach): the hero 3D logo is intentionally a single full-fidelity GLB. The 52.9 MB source file was deliberately removed from the repo (one GLB is enough), and `public/assets/models/san-carlos-logo-3d.glb` was replaced with a 22.96 MB re-export (1,094,486 tris, KHR_mesh_quantization, no simplification) that renders cleaner than the meshopt derivative — the reported scratch artifacts are gone with full-fidelity geometry. The spec still describes the old two-file meshopt pipeline (≤3 MB derivative, mandatory decoder) and the component still registers a MeshoptDecoder nothing requires. This change aligns spec and code with the intentional single-asset setup. (Correction recorded: the coordinator's earlier "scratches risk is back" claim was wrong — the re-export resolved the artifacts.)

## What Changes

- `hero-logo` asset requirement rewritten: the hero renders ONE self-contained GLB at `public/assets/models/san-carlos-logo-3d.glb` (no source/derivative split, no repo-side source file); budget raised to ≤ 30 MB reflecting the intentional full-fidelity asset; no extension/decoder mandates — whatever the served file requires must be supported by the loader, with the PNG fallback unchanged.
- `src/components/three/Hero3DLogo.tsx`: remove the MeshoptDecoder import + `setMeshoptDecoder` call (dead code — the served file requires only KHR_mesh_quantization + EXT_texture_webp, both native to GLTFLoader). Timer migration, checkShaderErrors flag, lazy loading, DPR clamp, and all behavior stay.
- Verification: render check proving the plain loader (no decoder) loads and renders the 22.96 MB file cleanly; tsc + production build.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hero-logo`: MODIFIED "Hero 3D logo asset" requirement — single-asset model, 30 MB budget, decoder mandate removed, close-range artifact scenario retained.

## Impact

- 2-line removal in `Hero3DLogo.tsx`; one MODIFIED spec requirement; no dependency, route, or behavior changes.
- Recorded trade-off: the 23 MB asset precaches in the PWA and downloads on first hero view (lazy, off the critical path per the unchanged performance constraints). Future exports SHOULD target smaller files; the owner may tighten the budget later.
