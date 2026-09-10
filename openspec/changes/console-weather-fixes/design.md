## Design Read

Targeted bug-fix change under existing capabilities. No visual or behavioral changes; console must be clean; weather must render live data.

## Decisions

### D1 — Clock → Timer migration (exact edit points)
In `src/components/three/Hero3DLogo.tsx`:
- Line 179: `const clock = new THREE.Clock();` → `const timer = new THREE.Timer();`
- Lines 229–230 in `tick`: add `timer.update();` first, then `const dt = timer.getDelta(); const t = timer.getElapsed();`
- Cleanup: hold the timer in a closure variable (`let timerRef: THREE.Timer | null`) — the existing `cleanup()` disposes GL resources; add `timerRef?.dispose()` guarded by the same disposed flag. Do NOT call `timer.connect(document)` — the component already owns its visibility pause/resume; connecting would add a redundant visibility listener.
- Verified: `Timer` is exported from `three` 0.186.0 and typed in `@types/three`; `getDelta()`/`getElapsed()` return seconds, same semantics as the Clock usage.

### D2 — Suppress benign driver info-log warnings
Immediately after the `WebGLRenderer` is constructed and configured, add `renderer.debug.checkShaderErrors = false;` with a comment citing three's production guidance. Verified from `three/src/renderers/webgl/WebGLProgram.js:863-908`: the X4122 "Program Info Log" warnings only log when `checkShaderErrors` is true; programs compile and run identically when false. Real failures still surface via the component's own try/catch → PNG fallback path.

### D3 — Weather request fix
`src/lib/weather.ts` `buildUrl()`: delete the line `current_weather: 'true',`. Verified live from this machine: with both params the API returns only `current_weather` (no `current` key → widget throws 'No current weather' → "Weather data unavailable" forever). Without the legacy param it returns the full `current` block the widget parses. `InfoBar.tsx:84` reads `current_weather?.temperature ?? current?.temperature_2m` — unchanged, works via its existing fallback.

### D4 — Repo hygiene at branch start
`git checkout -- next-env.d.ts` before doing anything (generated dev/build flip-flop churn, currently dirty in the tree). Do NOT touch it after.

### D5 — Missing PWA icons (found during console gate)
`src/app/manifest.ts` references `icon-192.png`, `icon-192-maskable.png`, `icon-512.png`, `icon-512-maskable.png`, none of which exist → a 404 console error on every homepage load. Fix: generate all four with `sharp` (available in node_modules) into `public/assets/images/logo/`: plain variants = resize of `better-san-carlos-logo.png` to 192/512; maskable variants = `better-san-carlos-logo-white.png` at ~80% centered on full-bleed bamboo-deep (`#275230`) 192/512 canvases (maskable safe-zone). Screenshots referenced by the manifest are out of scope (only fetched in the install dialog, never on page load) — recorded as gap.

## Verification

1. `tsc --noEmit` + production `next build --webpack` pass.
2. Dev server + headless-Chrome console capture on `/` (wait for hero canvas ready state): console contains ZERO messages matching `THREE.` (warnings or errors). Record the captured list.
3. Dev server: weather widget shows a live temperature value (not the unavailable state); InfoBar shows the temperature (proves the shared fallback path still parses).

## Risks / Trade-offs

- [checkShaderErrors=false hides genuine future shader errors] → accepted: this component renders one known-good asset with a try/catch + PNG fallback; three.js officially recommends disabling in production.
- [Timer.update() first-frame delta differs from Clock] → equivalent semantics (seconds since last update); the component's ease function is delta-driven and frame-rate independent in both APIs.
- [open-meteo changes its param interaction again] → the widget already throws to an honest "unavailable" state; no silent wrong data.

## Migration Plan

Single branch `fix/console-weather-fixes`: revert next-env.d.ts → 2 edits → tsc/build → console-capture + weather gates → commit → push → coordinator PR/merge/archive.

## Resilience Expectations

- If the console capture still shows X4122 lines after the flag, verify the flag placement (must be on the SAME renderer instance before first compile) and report — do not chase driver behavior further.
- If weather still errors after removing the param, capture the actual response keys and report — do not add fallback hacks.
