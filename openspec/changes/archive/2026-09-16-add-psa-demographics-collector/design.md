## Context

See `proposal.md` (Why) for motivation. Current state (verified on `main`, 2026-09-16):

- `data/civic/source-registry.yaml` defines `psa-census-philatlas` (publisher `Philippine Statistics Authority (via PhilAtlas)`, portal, `collector: null`, `per-document`, medium, domains `demographics`/`barangays`).
- The `Collector` contract (`scripts/data/collectors/types.ts`) is `CollectorArgs → { candidates, sourceInstances, coverage, notes }`; dispatch is the `COLLECTORS` map in `scripts/data/collectors/index.ts` (`facebook`, `city-website`); unknown/null collectors resolve to null and refresh records `skipped`.
- Acquisition (`scripts/data/lib/acquire.ts`) defaults to the shared polite HTTP text fetcher when `acquisition` is absent — exactly what this source needs; the collector receives `evidenceText` and never fetches.
- Diff (`scripts/data/diff.ts`) already implements the needed semantics: `parse:`-prefixed collector errors on a `failed` source become `SOURCE_CHANGED` for dependent covered records; declared `coverage` gates `MISSING`; `stableStringify` equality decides UNCHANGED/CHANGED.
- Canonical shapes (from `data/civic/records.json`): `population-total-2020` = `{total: 205424, year: 2020, source: "PSA 2020 Census of Population and Housing"}`; `demographics-census-history` = `{entries: [{year, population}]}` (15 entries, 1903–2020, year-only keys); `demographics-households` = `{count: 42049, year: 2015, average_size: 4.48}` (2015 snapshot only); `demographics-barangay-populations` = `{barangays: [{name, population_2020, population_2015}]}` (86 entries); `demographics-core` = `{municipality, province, region, income_class}` (multi-source: PSA + LGU demography); `city-geo-core` = `{coordinates, elevation_m, elevation_note, land_area_km2, barangay_count}` (multi-source incl. province-geo/wikipedia, `manual` cadence, known land-area conflict).
- Proposal-stage probe of the live page (plain HTTP, ~56KB, no auth): deterministic anchors exist — `sectionHistPop` / table `histPop` (caption `Population of San Carlos (1903‑2020)`), `sectionHouseholds` / table `households-table` (caption `Number of households in San Carlos (1990‑2015)`), a barangay table headed `Barangay | Population percentage (2020) | Population (2020) | Population (2015) | Change (2015‑2020) | Annual Population Growth Rate`, and a profile summary table (`Type | Island group | Region | Province | Barangay count | … | Population (2020) | Density (2020) | Coordinates | Estimated elevation…`). Current values observed: `205,424` (×6), `188,571` (×4), `42,049` (×2). No CAPTCHA, login, or browser automation required; one bounded GET.

## Goals / Non-Goals

**Goals:**

- A narrow, deterministic PSA-via-PhilAtlas collector reusing every existing pipeline contract (acquisition, instances, provisional candidates, fact coverage, diff, promotion, generation).
- Fail-closed behavior on layout drift, wrong jurisdiction, duplicates, and malformed numerics.
- Offline fixture-based tests proving the full evidence → instance → candidate → diff → (test-only) promotion → generate chain without touching production canonical data.

**Non-Goals:**

- No new acquisition strategy, no generic table scraper, no shared-parser refactor beyond small reuse of `parsers/html.ts` helpers.
- No `demographics-core` / `city-geo-core` coverage in v1 (see Decisions); no new canonical record IDs; no derived-statistic recomputation.

## Decisions

### 1. Collector identity and placement

New module `scripts/data/collectors/psa-philatlas.ts` exporting `collectPsaPhilatlas`, registered as `psa-philatlas` in `COLLECTORS`; registry entry updated to `collector: psa-philatlas` with `accessNotes` noting the collector exists. Alternative (second registry source for a direct PSA endpoint) rejected: no direct PSA URL for this data was found during proposal research, and duplicating the registry entry would fork provenance.

### 2. Acquisition: reuse shared HTTP path, no registry `acquisition` field

The entry has no `acquisition` field today, so `acquireEvidence` already routes it through the polite fetcher with timeout/retry/redaction. Adding `acquisition: http` is redundant; leave it absent. Evidence is stored as `<registryId>.html` under `research/runs/<run>/evidence/` by the existing runner — the collector only parses `args.evidenceText`.

### 3. Parser: small source-specific anchor parser, not regexes over the whole page

Parse by locating the three anchored sections (`sectionHistPop`/`histPop`, `sectionHouseholds`/`households-table`, barangay table by its header row) and extracting rows from table markup, not by scanning page text for numbers. Each section parser requires its exact header/caption anchors first; anything else throws `parse: …`. Reuse `htmlToText`-style entity/whitespace handling from `parsers/html.ts` where it fits, but keep table-row extraction local to this collector.

### 4. Canonical record mapping (final v1 matrix)

| Canonical record | Source section | Candidate? | Coverage? | Reason |
|---|---|---:|---:|---|
| `population-total-2020` | Profile summary `Population (2020)` cell + `sectionHistPop` 2020 row | yes | yes | Exact 2020 fact; `{total, year: 2020, source: "PSA 2020 Census of Population and Housing"}` built verbatim, numbers as numbers |
| `demographics-census-history` | `histPop` table (caption `Population of San Carlos (1903‑2020)`) | yes | yes | Map each row to `{year, population}` only (strip census dates, growth rates); year derived from the row's census date; ascending order; exact key names |
| `demographics-households` | `households-table` + section paragraph | yes | yes | Canonical shape is the 2015 snapshot only (`{count, year: 2015, average_size}`); extract the 2015 row, not the full 1990–2015 series |
| `demographics-barangay-populations` | Barangay table (`Barangay | … | Population (2020) | Population (2015) | …`) | yes | yes | Map to `{name, population_2020, population_2015}` per row; drop percentage/change/rate columns; deterministic non-fuzzy name handling |
| `demographics-core` | Profile summary cells | no | no | Multi-source record (also cites LGU demography); `income_class` has no reliable anchor on this page; covering it would risk false CHANGED/MISSING against facts this evidence cannot fully support |
| `city-geo-core` | Profile summary cells | no | no | Multi-source (`manual` cadence) record with a known land-area conflict; out of the registry source's demographics/barangays scope intent; geographic facts belong to a future city-profile source change |

Exact coverage is therefore `{population-total-2020, demographics-census-history, demographics-households, demographics-barangay-populations}` — four IDs, nothing implied by domain.

### 5. Normalization (deterministic, strict)

Strip thousands commas, collapse whitespace/`&nbsp;`, decode basic entities, trim `%`/units only where the column contract defines them; then require a full-match numeric grammar (`^-?\d+(\.\d+)?$` after cleanup). Anything else (dashes, blanks, `—`, footnote markers inside a required cell) throws `parse:` — never coerced, never defaulted. Candidate `data` mirrors canonical key names, key order-insensitive (diff uses `stableStringify`), numbers stay numbers, no collector diagnostics inside `data` (those go in `notes`).

### 6. Jurisdiction guard before any candidate

Require positive markers for San Carlos City + Pangasinan (+ Ilocos Region breadcrumb where present) from the page header/breadcrumb/profile cells. Any marker of San Carlos City, Negros Occidental — or absence of sufficient Pangasinan identity — throws `parse:` before candidate construction.

### 7. Composite integrity + single-section failure fails the whole run (option A)

Each covered section must be structurally complete (unique census years, unique non-blank barangay names with `(Poblacion)`-style qualifiers preserved, known headers, source-supplied totals consistent where present) before its candidate is built. If any required section is malformed, the collector throws `parse:` and emits nothing — the run records `failed`, and the existing diff maps all covered records to `SOURCE_CHANGED`. Chosen over per-section partial success because partial coverage would interact subtly with `MISSING` (a skipped section's records would look missing rather than unparseable); option A keeps the existing diff semantics untouched. No hardcoded value/count rules (no `205424`, no `86`) inside the parser — those belong in fixture expectations only.

### 8. Year safety: 2020 slot is frozen, history may grow

`population-total-2020` always carries the evidence's 2020 value with `year: 2020`. A newer census year appearing in `histPop` flows into `demographics-census-history.entries` (→ legitimate `CHANGED` review); it never rewrites the 2020 slot and never mints a new record ID. Anything else novel goes to `notes`.

### 9. Provenance and candidate construction

One `buildSourceInstance` call per evidence blob (`documentType: 'webpage'`, title `<publisher> snapshot (<evidenceName>)`, registry URL carried through). Every candidate sets `sourceIds: ['psa-census-philatlas']`, `sourceInstanceIds: [instance.id]`, `status: 'provisional'`, `collectedBy`/`runId` from args, and per-field `claimSources` mirroring the canonical shape (each data leaf → registry ID; verify exact promotion expectations against `promote.ts` `acceptCandidateSources` during implementation).

### 10. Fixture strategy

One committed sanitized HTML fixture retaining real structure (header/breadcrumb, profile summary table, `histPop` + `households-table` with captions/headers, barangay table headers plus a representative row subset that still exercises duplicates/ordering edge cases in variant fixtures, locality identity, `205,424`-era formatting) with documented source + capture date; derived variant fixtures (changed value, missing header, wrong city, duplicate row, malformed number) built by minimal edits. No live network in tests.

## Risks / Trade-offs

- [Risk] PhilAtlas redesigns markup → collector throws `parse:` and explicit refreshes report `SOURCE_CHANGED` until the parser is updated. Mitigation: anchor on captions/headers, fail-closed contract, fixture documents the last-known-good structure.
- [Risk] `stableStringify` false CHANGED from key/order/type drift. Mitigation: candidate builders mirror canonical shapes field-for-field; UNCHANGED test against current canonical data guards it.
- [Risk] Barangay renames/splits (administrative change) look like duplicates or missing rows. Mitigation: fail closed and let review decide; never fuzzy-merge.
- [Risk] `demographics-households` canonical snapshot is 2015-only while the source table spans 1990–2015. Mitigation: extract the 2015 row only; document that a future household release is a separate modeling decision.
- [Risk] Excluding `demographics-core`/`city-geo-core` leaves those records without automated coverage. Mitigation: explicit non-coverage (no false MISSING) is safer than partial coverage; recorded as a deliberate v1 boundary.

## Migration Plan

No migration: additive collector + registry field flip (`null` → `psa-philatlas`) + docs. Rollback is reverting those commits; runs already produced remain valid immutable history. No canonical data changes ship in this change (promotion of real candidates happens later through normal review).

## Open Questions

None that block specs or tasks. The only deferred item is whether a future change should cover `demographics-core`/`city-geo-core` (or a newer census modeling change) — explicitly out of scope for v1 and safe to decide later without altering this design.
