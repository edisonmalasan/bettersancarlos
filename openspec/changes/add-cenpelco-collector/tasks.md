## 1. Source and domain audit

- [ ] 1.1 Re-fetch the CENPELCO homepage shell over plain HTTP and confirm the proposal-stage anchors still hold (gallery heading, 15 `branches/<slug>/<slug>.jsp` links, exact `San Carlos City (Main)` entry, cooperative title); verify by saving the probe output (status, byte length, anchor hits) into the implementation notes, failing the task if auth/CAPTCHA/JS-rendering workarounds would be needed
- [ ] 1.2 Confirm the utilities readiness audit against current canonical data (zero `utilities`-domain records, no utilities emitter in `generate.ts`, manual `data/utilities.json` shape) and finalize the v1 record matrix (provider + office list as NEW stable IDs, contacts/GM/hours/addresses and water/telecom/cable/sewage explicitly out); verify by recording the finalized matrix with source-field → parser-output → candidate-field rows
- [ ] 1.3 Confirm the deferred-contact evaluation (main trunk, extensions, sub-area numbers, GM name with first-seen dates and per-field deferral reasons) still matches the live contact/GM pages; verify by noting any newly appeared, removed, or stabilized contact field and adjusting the deferral table rather than silently expanding scope

## 2. Fixture

- [ ] 2.1 Capture and sanitize the representative CENPELCO homepage-shell fixture at `scripts/data/fixtures/cenpelco-<purpose>-<capture-date>.html` (real title, gallery heading, all 15 links with slugs/texts/targets, minimal nav context, single San Carlos marker; scripts/styles/iframes/ads/trackers stripped) with source + capture date documented; verify the fixture exists, parses standalone, and contains the required anchors

## 3. Parser

- [ ] 3.1 Implement the source-specific gallery parser (heading + `branches/` href-shape anchoring, slug identifiers, verbatim names, title identity check, San Carlos `(Main)` guard, duplicate-slug and malformed-row failure, slug-sorted output) with `parse:` failures per design; verify with unit tests covering the current fixture, reordered-gallery equivalence, duplicate slugs, malformed rows, missing heading, and unrelated nav/news/footer text ignored
- [ ] 3.2 Implement the San Carlos ambiguity guard (bare `San Carlos` without context and missing `(Main)` qualifier fail closed with no San Carlos output); verify with unit tests for exact-match success and ambiguous-variant failure

## 4. Collector

- [ ] 4.1 Implement `collectCenpelco` in `scripts/data/collectors/cenpelco.ts` (single `buildSourceInstance` per blob, two provisional candidates with exact `sourceInstanceIds`/`sourceIds` and per-field claim sources, exact two-ID coverage, unmapped observations in `notes` only); verify with unit tests for determinism, single instance linked from every candidate, provisional-only status with no reviewer fields, exact coverage contents, and contacts/GM absent from output
- [ ] 4.2 Register `cenpelco` in the `COLLECTORS` dispatch preserving unknown-collector refusal; verify `resolveCollector('cenpelco')` returns the collector and existing collectors plus unknown/null refusal still behave

## 5. Registry

- [ ] 5.1 Assign `collector: cenpelco` to `cenpelco` in `data/civic/source-registry.yaml`, preserving id, publisher, URL, quarterly cadence, medium tier, and utilities domain, and rewriting `accessNotes` to state provider/office-presence coverage only with contacts explicitly outside coverage; verify with `bun run data:validate` passing and the registry diff showing only the intended lines

## 6. Canonical slice (only if the proposal explicitly requires it)

- [ ] 6.1 If and only if the approved proposal adds minimal canonical modeling beyond NEW-candidate flow, introduce the minimum stable records through the normal pipeline (never by hand-editing canonical files); verify through promotion-path tests, otherwise mark this task not-applicable with a one-line reason and proceed

## 7. Pipeline tests

- [ ] 7.1 Add UNCHANGED/NEW tests: current fixture against matching seeds produces UNCHANGED where applicable, and against an empty utilities slice produces exactly two NEW candidates; verify tests pass with canonical files byte-identical
- [ ] 7.2 Add CHANGED tests: an added/removed/renamed office (after complete structural parsing) produces CHANGED on the office list only, while gallery reorder alone stays UNCHANGED; verify provider presence is unaffected unless its own fields change
- [ ] 7.3 Add fail-closed tests: missing gallery anchor → `SOURCE_CHANGED` (not MISSING or partial candidate), duplicate office → failure, ambiguous San Carlos → no San Carlos output, unpublished contacts produce no candidates/coverage/MISSING; verify each asserts the `parse:` failure or scoped outcome with canonical files byte-identical
- [ ] 7.4 Add acquisition/cadence/confinement tests: explicit `data:refresh -- --source=cenpelco` creates a normal run, quarterly `--due` selects the source when due and skips it otherwise, failed runs do not satisfy cadence, refresh writes only under `research/runs/`, canonical and utilities compatibility files stay byte-identical, repeated runs are deterministic, and no tokens/cookies/local paths leak; verify all tests pass offline with no network access

## 8. Provenance test

- [ ] 8.1 Add a fixture-based end-to-end test on an isolated fixture tree (reusing existing provenance/promotion test infrastructure) proving acquired evidence → refresh → source instance → candidate → diff → test-only reviewed promotion → canonical exact source instance; verify the test passes and production canonical data is untouched

## 9. Documentation

- [ ] 9.1 Update `docs/data-pipeline.md` moving `cenpelco` from the collector roadmap to implemented capability (facts covered, single-page evidence, exact coverage, contacts/GM explicitly still unverified with first-seen dates, quarterly scheduled behavior, fail-closed drift, no auto-promotion, utilities.json stays manual); verify the roadmap diff and a docs-consistency read-through

## 10. Full verification

- [ ] 10.1 Run the full verification suite (`bun run research:validate`, `bun run research:index:check`, `bun run research:test`, `bun run data:validate`, `bun run data:test`, `bun run verify`) plus a fixture-driven `data:refresh -- --source=cenpelco` → `data:diff` → `data:report` → `data:validate` pass, confirming run artifacts, source-instance links, diff correctness, and byte-identical canonical/generated files; verify every command exits zero and record any command that could not run with its reason
