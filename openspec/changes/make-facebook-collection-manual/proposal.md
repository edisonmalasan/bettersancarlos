## Why

BetterSanCarlos is an independent community civic-data project with no administrative, employee, task, or Page-management access to the official LGU Facebook Page. A usable Page access token requires authorized Page access the project cannot assume, so the registry entry `lgu-facebook-cio` must not carry a time-based `weekly` cadence that implies normally schedulable automatic collection.

## What Changes

- Change `lgu-facebook-cio` in `data/civic/source-registry.yaml` from `updateCadence: weekly` to `updateCadence: manual`; preserve `collector: facebook` and `acquisition: facebook-graph`.
- Update its `accessNotes` to state Page-authorized access is unavailable, the source is manual/dormant by default, and the Graph collector is kept for fixture testing and possible future authorized use.
- Reframe `docs/facebook-sync.md` as optional/manual: independent-project disclaimer, no expectation of Page admin or tokens in normal setup, scheduled refreshes require no Facebook credentials, technical activation steps kept only as future/optional.
- Update `docs/data-pipeline.md` only where it describes Facebook as normally scheduled (collector roadmap "already automated" wording, any `--due` implication); document the rule "time-based cadence → eligible for `--due`; manual cadence → explicit invocation only" without duplicating policy.
- Touch `.github/workflows/refresh.yml` comments only if they imply Facebook credentials are expected for normal scheduled operation (implementation already omits `FB_ACCESS_TOKEN` and treats missing credentials as dormant skip).
- Leave AGENTS.md alone unless it instructs agents to expect Facebook credentials (verify during design).
- Add or adjust focused tests only where coverage is missing: manual cadence on the registry entry, `--due` exclusion, explicit-invocation path, dormant skip without credentials, fixture collection still producing evidence/instances/candidates.
- No new cadence values, no schema/policy redesign, no scraper, no canonical data changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `civic-data-pipeline`: clarify that manual-cadence sources are not eligible for normal scheduled `--due` collection and require explicit invocation (`--source=<id>` / dedicated manual path). The implementation already excludes non-time-based cadences from due calculation (`refresh.ts` returns null due-days for manual/per-document/per-term), and the spec defines manual as non-time-based with the `nextReviewOn == acceptedAt` sentinel — but no requirement currently states the `--due` exclusion explicitly.

## Impact

- Affected: `data/civic/source-registry.yaml` (one entry), `docs/facebook-sync.md`, `docs/data-pipeline.md` (small clarifications), workflow comments (if needed), focused tests.
- Behavior: `bun run data:refresh -- --due` no longer selects `lgu-facebook-cio` on elapsed time; explicit `bun run data:refresh -- --source=lgu-facebook-cio` and `bun run data:ingest-facebook` (with fixture or future authorized token) keep working; missing credentials stay dormant/skipped without failing other sources; canonical data untouched.
- Preserved: full pipeline (registry → acquisition → collector → research run → diff → review → promotion → generation), Graph collector and acquisition code (`collectors/facebook.ts`, `lib/facebook.ts`, `lib/acquire.ts`, `ingest-facebook.ts`, `sync-facebook.js`), offline CI, provenance and promotion safety invariants.
- Explicitly out of scope: removing automation or the Facebook collector, HTML/login scraping or auth bypass, new collectors (PSA/Comelec/FDPP/etc.), frontend or canonical-record changes, auto-promotion/auto-merge.
