## 1. Source and record audit

- [x] 1.1 Re-fetch the live PhilAtlas San Carlos page over plain HTTP and confirm the proposal-stage anchors still hold (public access, `sectionHistPop`/`histPop`, `sectionHouseholds`/`households-table`, barangay header row, Pangasinan jurisdiction markers); verify by saving the probe output (status, byte length, anchor hits) into the implementation notes, failing the task if auth/CAPTCHA/browser workarounds would be needed
- [x] 1.2 Inventory the page sections against the design mapping matrix and verify each canonical shape in `data/civic/records.json` (`population-total-2020`, `demographics-census-history`, `demographics-households`, `demographics-barangay-populations`, plus explicit exclusion of `demographics-core`/`city-geo-core`); verify by producing the finalized watched-record matrix with source-field → parser-output → record-field rows for all four covered records
- [x] 1.3 Verify promotion's per-field `claimSources` expectations in `scripts/data/promote.ts` (`acceptCandidateSources`) so candidate claim attribution matches; verify by noting the exact expected shape in the collector code comments and citing the lines checked

## 2. Fixture and parser

- [x] 2.1 Capture and sanitize the representative PhilAtlas HTML fixture per repo conventions (real headings/table structure/locality identity retained; credentials, cookies, tracking IDs, and unrelated third-party content stripped) with source + capture date documented; verify the fixture file exists, parses standalone, and contains the required anchors
- [x] 2.2 Implement the source-specific anchor parser (section location, row extraction, strict numeric/date normalization, jurisdiction guard, structural integrity checks) with `parse:` failures per design; verify with parser unit tests covering current-fixture parse, duplicate years/rows, malformed numerics, and no hardcoded current values in the parser
- [x] 2.3 Implement deterministic barangay-name handling (safe presentation normalization only, `(Poblacion)` qualifiers preserved, duplicates fail closed); verify with unit tests for equivalent-punctuation matches and duplicate/ambiguous-identity failure

## 3. Collector

- [x] 3.1 Implement `collectPsaPhilatlas` in `scripts/data/collectors/psa-philatlas.ts` (single `buildSourceInstance` per evidence blob, four provisional candidates with exact `sourceInstanceIds`/`sourceIds`, exact four-ID coverage, diagnostics in `notes` only); verify with unit tests for determinism, single instance linked from every candidate, provisional-only status with no reviewer fields, and exact coverage contents
- [x] 3.2 Register `psa-philatlas` in `COLLECTORS` dispatch (`scripts/data/collectors/index.ts`) preserving unknown-collector refusal; verify `resolveCollector('psa-philatlas')` returns the collector and `resolveCollector('universal-scraper')`/`resolveCollector(null)` still return null

## 4. Source registry

- [x] 4.1 Assign `collector: psa-philatlas` to `psa-census-philatlas` in `data/civic/source-registry.yaml`, preserving id, publisher, URL, `per-document` cadence, medium tier, and domains, and updating `accessNotes` to reflect the implemented collector; verify with `bun run data:validate` passing and the registry diff showing only the intended lines

## 5. Pipeline tests

- [x] 5.1 Add UNCHANGED test: current fixture produces UNCHANGED for the three exactly-matching records (`population-total-2020`, `demographics-census-history`, `demographics-households`); the barangay candidate is asserted source-faithful (86 rows, footer-consistent sums) and diffs as name-only CHANGED against current canonical data (6 documented source-vs-canonical name divergences, including the canonical `Malaca\u00f1ang` literal-escape bug — evidence-faithful per the non-fuzzy rule, left for review, never papered over); verify the test passes and canonical files are byte-identical after the run
- [x] 5.2 Add CHANGED tests: a modified valid fixture changes the 2020 total (CHANGED on `population-total-2020` only) and a modified census/household/barangay value (CHANGED on the intended composite only); verify unrelated records stay UNCHANGED and canonical files remain byte-identical
- [x] 5.3 Add fail-closed tests: renamed/missing table header → `SOURCE_CHANGED` (not MISSING or partial candidate), Negros Occidental evidence rejected, ambiguous-jurisdiction evidence yields no candidates, duplicate census/barangay rows fail closed, malformed numerics fail closed; verify each test asserts the `parse:` failure/`SOURCE_CHANGED` outcome
- [x] 5.4 Add coverage/cadence/confinement tests: exact four-ID coverage with an unrelated demographics/barangay record asserting no MISSING, explicit `data:refresh -- --source=psa-census-philatlas` creating a normal run, `--due` excluding the per-document source, refresh writing only under `research/runs/`, canonical and generated compatibility JSON byte-identical, determinism of repeated runs, and no tokens/cookies/local paths in evidence metadata; verify all tests pass offline with no network access

## 6. Provenance test

- [x] 6.1 Add a fixture-based end-to-end test (isolated fixture tree, reusing existing provenance/promotion test infrastructure) proving acquired evidence → refresh → source instance → candidate → diff → test-only reviewed promotion → canonical exact source instance → `data:generate`; verify the test passes and production canonical data is untouched

## 7. Documentation

- [x] 7.1 Update `docs/data-pipeline.md` moving `psa-census-philatlas` from the collector roadmap to implemented capability (facts covered, PSA-via-PhilAtlas identity, per-document cadence + explicit refresh command, fact-level coverage, fail-closed layout-drift behavior, no auto-promotion, no weekly schedule claim); verify the roadmap diff and a docs-consistency read-through

## 8. Full verification

- [x] 8.1 Run the full verification suite (`bun run research:validate`, `bun run research:index:check`, `bun run research:test`, `bun run data:validate`, `bun run data:test`, `bun run verify`) plus a fixture-driven `data:refresh -- --source=psa-census-philatlas` → `data:diff` → `data:report` → `data:validate` pass, confirming run artifacts, source-instance links, diff correctness, and byte-identical canonical/generated files; verify every command exits zero and record any command that could not run with its reason
