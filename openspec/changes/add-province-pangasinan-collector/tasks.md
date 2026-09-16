## 1. Source and canonical audit

- [ ] 1.1 Re-fetch the Province San Carlos page over plain HTTP and confirm the proposal-stage anchors still hold (H1, breadcrumb, title, labeled profile facts, RA/district/distance/land-area/population sentences, Officials heading); verify by saving the probe output (status, byte length, anchor hits) into the implementation notes, failing the task if auth/CAPTCHA/browser workarounds would be needed
- [ ] 1.2 Re-verify the record-mapping matrix against current canonical data (composite shapes, whole-record promotion semantics, PSA ownership, existing `src-province-geo` dependents) and confirm v1 coverage stays explicitly empty with land area notes-only; verify by recording the finalized matrix with source-field → parser-output → disposition rows, adjusting scope only through an artifact update, never silently
- [ ] 1.3 Confirm the exclusion boundaries still hold (no new officials/tourism/issuances modeling, `legislation` kept on the registry for charter context only, no canonical split proposed); verify by noting any live-source change that would force a reclassification, otherwise proceed

## 2. Fixture

- [ ] 2.1 Capture and sanitize the representative Province profile fixture at `scripts/data/fixtures/province-pangasinan-san-carlos-<date>.html` (real H1/breadcrumb/title, labeled facts, full narrative sentences incl. the hectare observation, Officials heading with minimal rows, scripts/styles/nav/ads/trackers stripped) with source + capture date documented; verify the fixture exists, parses standalone, and contains the required anchors

## 3. Parser

- [ ] 3.1 Implement the bounded profile parser (H1/breadcrumb/title jurisdiction guard, profile-region scoping ending at the Officials heading, labeled-fact extraction to notes with strict grammars, exact `San Carlos City (Main)`-free Pangasinan locality handling per design, duplicate/conflicting-value failure, verbatim hectare observation) with `parse:` failures per design; verify with unit tests covering the current fixture, wrong-city (Negros/other-city/generic-province) rejection, missing-label drift, duplicate/conflicting values, and unrelated-page passthrough failure
- [ ] 3.2 Implement the Officials/tourism ignore guarantee (bounded region parsing, no official-name scanning, no festival modeling); verify with unit tests proving officials-only and tourism-only variants yield byte-identical parser output

## 4. Collector

- [ ] 4.1 Implement `collectProvincePangasinan` in `scripts/data/collectors/province-pangasinan.ts` (single `buildSourceInstance` per blob, zero candidates with explicitly empty coverage, scoped observations and conflict note in `notes` only, per-field claim-source conventions ready for future scoped facts); verify with unit tests for determinism, single exact instance, empty candidates/coverage contents, provisional-only invariant, and hectare observation present without candidacy
- [ ] 4.2 Register `province-pangasinan` in the `COLLECTORS` dispatch preserving unknown-collector refusal; verify `resolveCollector('province-pangasinan')` returns the collector and existing collectors plus unknown/null refusal still behave

## 5. Registry

- [ ] 5.1 Assign `collector: province-pangasinan` to `province-pangasinan` in `data/civic/source-registry.yaml`, preserving id, publisher, URL, sourceType, annual cadence, medium tier, and city-profile + legislation domains, and rewriting `accessNotes` to state structure-monitoring scope, the unresolved land-area conflict, excluded officials, and single-page bounds; verify with `bun run data:validate` passing and the registry diff showing only the intended lines

## 6. Pipeline tests

- [ ] 6.1 Add run-behavior tests: current fixture produces a successful run with zero candidates, empty coverage, one exact instance, and byte-identical canonical files; a changed profile value (e.g., barangay count) is recorded in notes with still zero candidates and no MISSING; verify tests pass with canonical and city-profile compatibility files byte-identical
- [ ] 6.2 Add fail-closed tests: missing H1/labels → `SOURCE_CHANGED` (not MISSING or partial output), wrong-city evidence → failure with no output, duplicate/conflicting profile values → failure, hectare-observation regression (17,087 ha yields notes-only observation, no land-area candidate/coverage, canonical land area untouched); verify each asserts the `parse:` failure or scoped outcome
- [ ] 6.3 Add acquisition/cadence/confinement tests: explicit `data:refresh -- --source=province-pangasinan` creates a normal run, annual `--due` selects the source when due and skips it otherwise, failed runs do not satisfy cadence, refresh writes only under `research/runs/`, canonical and compatibility files stay byte-identical, repeated runs are deterministic, existing `src-province-geo` stays untouched, and no tokens/cookies/local paths leak; verify all tests pass offline with no network access

## 7. Provenance test

- [ ] 7.1 Add a fixture-based end-to-end test on an isolated fixture tree (reusing existing provenance/promotion test infrastructure) proving acquired evidence → refresh → source instance → diff (no entries by explicit design) → test-only reviewed promotion plumbing → data:generate still succeeds for the domain; verify the test passes, production canonical data and historical Province instances are untouched, and generated city-profile output is unchanged

## 8. Documentation

- [ ] 8.1 Update `docs/data-pipeline.md` moving `province-pangasinan` from the collector roadmap to implemented capability (empty coverage by design with matrix rationale, single-page bounds, notes-only land-area conflict handling, excluded officials/issuances, legislation domain retained for charter context only, annual research-only behavior, fail-closed drift, no auto-promotion); verify the roadmap diff and a docs-consistency read-through

## 9. Full verification

- [ ] 9.1 Run the full verification suite (`bun run research:validate`, `bun run research:index:check`, `bun run research:test`, `bun run data:validate`, `bun run data:test`, `bun run verify`) plus a fixture-driven `data:refresh -- --source=province-pangasinan` → `data:diff` → `data:report` → `data:validate` pass, confirming run artifacts, source-instance links, empty-coverage diff behavior, hectare-note presence, and byte-identical canonical/generated files; verify every command exits zero and record any command that could not run with its reason
