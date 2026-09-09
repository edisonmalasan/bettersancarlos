## 1. Asset re-optimization

- [x] 1.1 Create branch `fix/hero-performance` from `main` and push it (`git push -u origin fix/hero-performance`) — verify `git status` is clean before starting and the branch tracks the remote
- [x] 1.2 Run `bunx @gltf-transform/cli optimize assets/images/logo/san-carlos-logo-3d.glb public/assets/models/san-carlos-logo-3d.glb --compress quantize --simplify-error 0.002 --texture-compression webp` — verify the output file exists, is ≤ 3 MB (`Get-Item` size check), and `gltf-transform inspect` (or the optimize log) reports quantized attributes and WebP textures; if > 3 MB, step `--simplify-error` up (0.003, 0.005) until under cap
- [x] 1.3 Verify source integrity — `git status` shows `assets/images/logo/san-carlos-logo-3d.glb` NOT modified and ONLY `public/assets/models/san-carlos-logo-3d.glb` changed in the working tree (plus openspec artifacts if included); verify the derivative loads by checking `gltf-transform inspect` exits successfully

## 2. Visual regression verification

- [x] 2.1 With the dev server running, screenshot the hero at 1440px and 375px widths and compare against the current (oversized) render — verify seal colors, textures, proportions, and front-face dominance are preserved; stop the dev server after verification

## 3. Build verification & delivery

- [x] 3.1 Run `./node_modules/.bin/tsc --noEmit` — must pass with no errors; revert `tsconfig.tsbuildinfo` if dirtied
- [x] 3.2 Run `$env:NODE_ENV="production"; ./node_modules/.bin/next build` — must succeed; revert `tsconfig.tsbuildinfo` and any dirtied `next-env.d.ts` before finishing
- [x] 3.3 Commit with Conventional Commits message (`fix: replace hero 3D logo GLB with web-optimized derivative (50.4 MB -> ~2.6 MB)`) touching only `public/assets/models/san-carlos-logo-3d.glb` and the openspec change artifacts — verify `git show --stat` lists exactly those files; push the branch
- [x] 3.4 Report completion via `worker_done` with final derivative size and the file list; coordinator handles PR, merge, sync, and archive
