## Why

`psa-census-philatlas` is the highest-value uncollected source in the collector roadmap (`docs/data-pipeline.md`): it backs the canonical demographics records (`population-total-2020`, census history, households, barangay populations) that currently can only change via manual seeding. Adding the first public-source demographic collector proves the pipeline's source-specific collector contract on real structured portal tables, without redesigning the pipeline. Proposal-stage probing (2026-09-16) confirms the page is publicly fetchable with plain HTTP (~56KB), carries deterministic anchors (`sectionHistPop` / `histPop`, `sectionHouseholds` / `households-table`, barangay table with `Population (2020)` / `Population (2015)` headers), and needs no auth, browser automation, or CAPTCHA bypass.

## What Changes

- Add a deterministic `psa-philatlas` collector (`scripts/data/collectors/psa-philatlas.ts`) implementing the existing `Collector` contract (`CollectorArgs` → `candidates` + `sourceInstances` + `coverage` + `notes`); parsing is pure string/DOM-anchor logic, no network inside the collector.
- Register it in `COLLECTORS` dispatch (`scripts/data/collectors/index.ts`) and assign `collector: psa-philatlas` to the existing `psa-census-philatlas` registry entry; preserve `updateCadence: per-document`, `riskTier: medium`, `domains: [demographics, barangays]`, and the `PSA (via PhilAtlas)` publisher identity (no direct-PSA claims).
- Scope first-version fact coverage to the canonical records the evidence actually supports (to be finalized in design after shape audit; expected: `population-total-2020`, `demographics-census-history`, `demographics-households`, `demographics-barangay-populations`; `demographics-core` only if fully supported; `city-geo-core` excluded unless explicitly justified).
- Enforce fail-closed parsing: missing/renamed required table headers, jurisdiction ambiguity, duplicate census years or barangay identities, and malformed numerics throw `parse:` errors so the pipeline reports `SOURCE_CHANGED` — never partial composites, false `MISSING`, or coerced values.
- Enforce jurisdiction guard (San Carlos City, Pangasinan; reject Negros Occidental / ambiguous pages), provisional-only candidates, exact `buildSourceInstance` provenance, and no direct writes to `data/civic/` or generated compatibility JSON.
- Add offline fixture(s) + pipeline tests (unchanged/changed/layout-drift/wrong-city/coverage/cadence/immutability/provenance) and move `psa-census-philatlas` from roadmap to implemented in `docs/data-pipeline.md`.

## Capabilities

### New Capabilities

- None. This change introduces no new architectural capability; it implements the already-specified source-specific collector behavior for one registered source.

### Modified Capabilities

- `civic-data-pipeline`: extend the source-specific collector, provenance, coverage, failure-semantics, and per-document cadence requirements to the PSA-via-PhilAtlas demographic source (deterministic parsing, jurisdiction guard, composite integrity, explicit fact coverage, `SOURCE_CHANGED` on layout drift, explicit-trigger collection only).

## Impact

- Code: one new collector module + dispatcher entry; minimal registry YAML edit (`collector`, `accessNotes`); fixture + test files under existing `scripts/data/` conventions; docs update in `docs/data-pipeline.md`.
- Pipeline behavior: `bun run data:refresh -- --source=psa-census-philatlas` starts producing real runs; `bun run data:refresh -- --due` is unchanged (per-document stays excluded); diff gains UNCHANGED/CHANGED/MISSING/SOURCE_CHANGED/SOURCE_UNAVAILABLE outcomes for the covered demographic records.
- Non-goals (explicit): no pipeline redesign; no canonical-record redesign or direct canonical/generated-file writes; no auto-promotion or trusted-source bypass; no cadence change to periodic; no scheduled-workflow change; no census-release watcher; no additional collectors (Comelec, CENPELCO, PSGC, BLGF, etc.); no frontend/UI changes; no research rewrites; no fuzzy barangay matching; no live-network tests; no auth/CAPTCHA/proxy workarounds.
