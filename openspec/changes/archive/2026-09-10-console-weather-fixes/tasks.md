## 1. Setup

- [x] 1.1 `git checkout -- next-env.d.ts` to drop generated churn; verify `git status` is otherwise clean; create branch `fix/console-weather-fixes` from `main`, push with `-u origin`

## 2. Implementation

- [x] 2.1 `src/components/three/Hero3DLogo.tsx`: Clock → Timer migration per D1 (construction, per-frame `update()`, `getDelta()`/`getElapsed()`, disposal in cleanup; no `connect()`) — verify tsc passes and the file diff is exactly the timer lines
- [x] 2.2 `src/components/three/Hero3DLogo.tsx`: `renderer.debug.checkShaderErrors = false;` right after renderer configuration per D2, with the production-guidance comment — verify the flag is on the constructed instance before any compile
- [x] 2.3 `src/lib/weather.ts`: delete the `current_weather: 'true',` line from `buildUrl()` per D3 — verify InfoBar.tsx is NOT modified (its fallback covers the new response shape)

- [x] 2.4 Generate the 4 missing PWA icons per D5 with a one-off `sharp` node script (plain 192/512 from `better-san-carlos-logo.png`; maskable 192/512 as white logo at 80% on full-bleed `#275230`) into `public/assets/images/logo/` — verify the files exist at the manifest's exact paths and the console 404 is gone

- [x] 3.1 Gates: `./node_modules/.bin/tsc --noEmit` PASS; `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` PASS; revert dirtied generated files
- [x] 3.2 Console gate: dev server + headless-Chrome console capture on `/` after hero canvas reaches ready state — assert ZERO `THREE.` warnings/errors; record the full captured console list in the report
- [x] 3.3 Weather gate: dev server homepage shows a live temperature in the weather widget (not "Weather data unavailable") AND InfoBar shows the temperature — record both values
- [x] 3.4 Check off tasks.md boxes, commit `fix: silence hero console warnings and restore live weather data` (only the 2 source files + openspec change files), push
- [x] 3.5 Send `worker_done` with --outcome succeeded (or failed): console-capture summary, weather values, gate results. Do NOT create PR/merge/archive.

> Coordinator note: worker implemented 2.1-2.3 then its terminal was stopped (orchestration incident); coordinator verified the diff line-for-line, added D5/2.4 (PWA icons), ran all gates, and completed delivery. Console: 0 warnings/errors. Weather: 25C live in widget + InfoBar. Build: PASS.
