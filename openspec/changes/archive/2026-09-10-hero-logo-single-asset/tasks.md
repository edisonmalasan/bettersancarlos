## 1. Code + spec delta

- [x] 1.1 Verify clean tree on `main`; create branch `chore/hero-logo-single-asset`, push with `-u origin`
- [x] 1.2 `src/components/three/Hero3DLogo.tsx`: remove the MeshoptDecoder import line and the `loader.setMeshoptDecoder(MeshoptDecoder);` line per D2 — verify the file diff is exactly those 2 deletions and nothing else
- [x] 1.3 Confirm `assets/images/logo/san-carlos-logo-3d.glb` is absent from git (`git ls-files`) — no deletion needed; if present, remove it

## 2. Verification & delivery

- [x] 2.1 `gltf-transform inspect public/assets/models/san-carlos-logo-3d.glb`: confirm size ≤ 30 MB and extensionsRequired has NO meshopt entry
- [x] 2.2 Render check: harness with plain GLTFLoader (no decoder) loads the served file — front + close-up screenshots render the seal cleanly
- [x] 2.3 Gates: `./node_modules/.bin/tsc --noEmit` PASS; `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` PASS; revert dirtied generated files
- [x] 2.4 Check off tasks.md boxes, commit `chore: align hero logo spec and code to intentional single-asset setup` (component + openspec change files), push — coordinator owns PR/merge/archive
