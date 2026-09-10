## Why

Two user-reported defects on the live site: (1) the browser console shows THREE.js warnings from the hero 3D logo — `THREE.Clock` deprecation ("Please use THREE.Timer instead") and ANGLE/D3D shader info-log warnings (X4122) from the model renderer; (2) the homepage weather widget permanently shows "Weather data unavailable". Coordinator investigation pinned both root causes: the Clock API is deprecated in the installed three 0.186.0 (Timer is exported and typed), the X4122 logs are benign driver info-logs guarded by `renderer.debug.checkShaderErrors` (standard production practice is to disable), and the open-meteo request sends the legacy `current_weather=true` alongside `current=...` — verified live that the API then returns NO `current` key, which the widget requires.

## What Changes

- `src/components/three/Hero3DLogo.tsx`: replace `new THREE.Clock()` with `new THREE.Timer()` (`timer.update()` per frame, `getDelta()`/`getElapsed()`, dispose in cleanup); set `renderer.debug.checkShaderErrors = false` immediately after renderer creation (silences benign driver info-log spam; programs compile identically; PNG fallback path still guards real failures).
- `src/lib/weather.ts`: remove the legacy `current_weather=true` parameter from the request so the API returns the `current` block the widget parses. InfoBar already reads `current_weather?.temperature ?? current?.temperature_2m`, so it keeps working via its existing fallback — no InfoBar change needed.
- No visual, behavioral, routing, or dependency changes.

## Capabilities

### New Capabilities

(none — pure conformance fixes; `skip_specs: true`)

### Modified Capabilities

(none)

## Impact

- 2 source files touched (`Hero3DLogo.tsx`, `weather.ts`); first frame timing semantics unchanged (Timer seconds match Clock seconds).
- Verification: dev-server homepage with CDP console capture — zero THREE.* warnings/errors after load; weather widget renders live temperature instead of the unavailable state.
- Out of scope (recorded separately): PR #63 emptied the source GLB (`assets/images/logo/san-carlos-logo-3d.glb` is 0 bytes, spec violation) and replaced the meshopt derivative with a 24 MB unoptimized export (spec budget violation) — needs a dedicated follow-up, offered to the user.
