## 1. Setup

- [x] 1.1 Create branch `feat/site-enhancements` from `main`, push with `-u origin` — verify clean tree
- [x] 1.2 Read change artifacts + design.md; verify audit claims with spot checks (5 stub pages, no not-found.tsx, duplicate fetches, no sccp.cio link in Footer)

## 2. Implementation

- [x] 2.1 `src/lib/weather.ts`: module-level cached `fetchCurrentWeather()` (5-min TTL); refactor `InfoBar.tsx` + `WeatherWidget.tsx` to use it — verify homepage makes ONE open-meteo call and both components render unchanged
- [x] 2.2 Fill `/services/agriculture` per D1 (research/agriculture + agriculture.json + services.json links) — verify prerendered content
- [x] 2.3 Fill `/services/business` per D1 (eBPLS verified + permit service links + Citizen's Charter pointer) — verify
- [x] 2.4 Fill `/services/environment` per D1 (verified 2023 programs + landlocked note + waste-schedule pending notice) — verify
- [x] 2.5 Fill `/services/infrastructure` per D1 (city-projects.json buckets/projects + dome/gym + /budget link) — verify
- [x] 2.6 Fill `/services/tax-payments` per D1 (treasurer/assessor/property-declaration links + eBPLS/forms + no-online-payment note) — verify
- [x] 2.7 Create `src/app/not-found.tsx` per D2 — verify styled 404 artifact in out/
- [x] 2.8 Footer "Official Channels" block per D4 (exactly 3 verified links, noopener) — verify footer renders

## 3. Verification & delivery

- [x] 3.1 Gates: `./node_modules/.bin/tsc --noEmit` PASS; `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` PASS; prerendered-HTML checks for all 5 service pages (each contains its D1 fact, e.g. agriculture has '127,000', infrastructure has 'Sports Dome', environment has 'plastic'); 404 artifact styled; footer shows sccp.cio; single open-meteo call confirmed; visual smoke at 1440/375 on 2 service pages + 404; revert dirtied generated files
- [x] 3.2 Check off tasks.md boxes, commit `feat: fill service stubs, styled 404, dedupe weather, official channels` (include openspec change files), push
- [x] 3.3 Send `worker_done` with --outcome succeeded (or failed) + gate results + any omissions per resilience rule. Do NOT create PR/merge/archive.
