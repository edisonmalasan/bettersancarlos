## Design Read

Completion pass under existing capabilities; no new spec deltas (skip_specs). All UI follows visual-design-system spec. Dials unchanged.

## Audit basis (session-long tracking + spot checks)

- `/services/agriculture|business|environment|infrastructure|tax-payments` = 19-line PageHeader-only stubs; verified data exists for each (research/agriculture, official-presence eBPLS, environment 2023 programs, city-projects.json, services.json tax/assessor offices).
- No `src/app/not-found.tsx` — 404 uses Next's unstyled default (brand/dark-mode break).
- InfoBar.tsx:82 and WeatherWidget.tsx:111 both fetch open-meteo for the same coordinates on the homepage.
- Footer social block was removed in design-polish (was dead markup); the only VERIFIED channel from official-presence research is facebook.com/sccp.cio — nothing currently links it.

## Decisions

### D1 — Stub fills (content per page)
- **agriculture**: intro paragraph (mango-bamboo identity), 127,000-trees stat card (2008, re-verify badge), City Agriculture Office card (phone historical-2017 label), DirectoryLinkCard to `/agriculture`, service links from services.json (municipal-agriculture).
- **business**: eBPLS verified link card (from official-presence/full-disclosure research), business-permits-licensing + seedo service links, "Register a business" pointer to Citizen's Charter offices (transparency-docs.json).
- **environment**: verified 2023 programs (plastic-use regulation, BFP tree planting, World Wildlife Day), landlocked/no-coastal note, river context (Agno/San Juan), pending notice for waste-collection schedules (research gap).
- **infrastructure**: 7 program buckets + 4 known projects from city-projects.json (reference-only labels), Don Federico Mandapat Sports Dome + City Gymnasium, link to `/budget` projects section.
- **tax-payments**: municipal-treasurer/-assessor/property-declaration service links from services.json, eBPLS/forms link, "no online payment yet" factual note (verified: no payment portal in official-presence research).

### D2 — 404 page
`src/app/not-found.tsx`: PageHeader-less centered card (rounded-xl, border-line), "Page not found" h1, link home + `/services` + search hint; token utilities; works statically (no client JS needed).

### D3 — Weather fetch dedupe
Add `src/lib/weather.ts` exporting a module-level cached `fetchCurrentWeather()` (5-min TTL). InfoBar + WeatherWidget consume it. Visible behavior unchanged; two network calls collapse to one on pages where both render (homepage).

### D4 — Footer official channels
Footer: small "Official Channels" column/block with exactly: city website (sancarlospangasinan.gov.ph), FB CIO (facebook.com/sccp.cio), eBPLS portal. All three verified in official-presence research. External links `rel="noopener noreferrer"`, `target="_blank"`.

### D5 — Deferred items (recorded, not built)
BLGF FY2017–2025 extraction, hazard-map viewer, ordinance digitization, CENPELCO hotline card, water district — each blocked on unverified data (research gap docs). Recorded here; revisit when research resolves.

## Verification

1. tsc + next build --webpack; 404 renders styled (curl a bad route in `next start` or check `out/404.html`/`out/not-found.html` output exists).
2. Prerendered HTML checks: each of the 5 service pages contains its D1 facts; footer contains sccp.cio; homepage HTML identical except expected dedupe has no visible change.
3. Dev-server network tab (or code review) confirms single open-meteo call when both InfoBar+WeatherWidget mount.

## Risks / Trade-offs

- [Weather cache staleness] 5-min TTL is well within weather freshness norms.
- [404 static output location varies by Next version] verify `out/` artifact after build; if Next 16 emits `404.html` only, that is fine — both are static artifacts.

## Migration Plan

Single branch `feat/site-enhancements`: lib change → 5 pages → 404 → footer → gates → PR → merge.

## Resilience Expectations

- If a D1 fact cannot be traced to research/JSON, omit it rather than invent; page still ships with the traced subset.
- If weather refactor risks behavior change, revert that piece and record as gap (D3 is lowest priority of the four).
