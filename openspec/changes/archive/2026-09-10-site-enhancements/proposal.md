## Why

Task 5 (codebase audit & opportunities): after research-data-integration (21/21 categories) and quiz-game, a focused audit identified the remaining gaps by civic value. The brief's example features are already implemented (emergency hotlines, barangay directory, CMCI dashboard, demographics, transportation guide, evacuation centers) or blocked by unverified data (BLGF FY2017–2025, hazard maps, ordinance archive, CENPELCO hotlines, water district). What remains that is implementable with verified data and real user value: five service-category pages render as empty PageHeader stubs despite verified data existing for them, the 404 page falls back to Next's unstyled default, two components independently fetch the same weather API, and the site's only verified social channel (FB sccp.cio) was removed with the wrong-city embed and never restored anywhere visible.

## What Changes

- **Fill 5 stub service pages** (`/services/agriculture|business|environment|infrastructure|tax-payments`) with real content from verified research + existing JSON: agriculture (mango/bamboo identity, offices, link to `/agriculture`), business (eBPLS verified link, business-permit service links), environment (verified 2023 programs: plastic ordinance, tree planting, wildlife day; landlocked context), infrastructure (7 program buckets + known projects from `city-projects.json`, link from `/budget`), tax-payments (treasurer/assessor service links from `services.json`, eBPLS/forms).
- **Custom 404** (`src/app/not-found.tsx`): styled 404 with search entry point and popular links, matching site design.
- **Dedupe weather fetch**: InfoBar and WeatherWidget both call open-meteo independently on the homepage — share one fetch (module-level cache or lift to a shared hook) without changing either component's visible behavior.
- **Restore verified social link**: Footer "Official Channels" block with the one verified link (facebook.com/sccp.cio, from official-presence research) — replaces the dead removed block; no fake links.
- **Deferred (blocked) items recorded with reasons**: BLGF FY2017–2025 charts, hazard-map viewer, ordinance archive digitization, power-outage hotline card, water-district identity — all pending verified data per research.

## Capabilities

### New Capabilities

(none — these are completions/conformance under existing capabilities: `civic-data-surfacing` (correct/traceable data, one canonical source), `visual-design-system` (design consistency), `hero-media`/`brand-color-palette` untouched)

### Modified Capabilities

(none)

## Impact

- 5 service pages + `not-found.tsx` + Footer + a small shared-fetch change in two layout components.
- No new routes, no dependency changes, no data schema changes (consumes existing JSON + one new small environment section or inline verified facts).
- Build gates + visual smoke as usual; news-editor/search untouched.
