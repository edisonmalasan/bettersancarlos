## 1. Explicit collector coverage contract

- [x] 1.1 Add `coverage: { expectedRecordIds: string[] }` to the collector result contract plus manifest per-source coverage metadata and schema updates; verify with unit tests that coverage survives a write/read round-trip and absent coverage stays absent (backwards compatible)
- [x] 1.2 Declare fact coverage in the city-website collector (currently `city-hall-trunk-line`) and the Facebook collector (news items it can emit); verify with recorded fixtures that coverage output is deterministic alongside candidates
- [x] 1.3 Gate MISSING on declared coverage in `diff.ts` (covered + successful source + no candidate; domain-only sharing no longer suffices) while keeping provenance-based SOURCE_UNAVAILABLE/SOURCE_CHANGED working with zero candidates; verify the full existing diff suite still passes
- [x] 1.4 Add integration tests A–F: narrow coverage excludes unrelated records; covered-but-absent record is MISSING; failed fetch yields SOURCE_UNAVAILABLE with zero candidates; parse failure yields scoped SOURCE_CHANGED; undiscovered ID yields NEW; second collector's record is untouched by the first source's run; verify each passes offline

## 2. Source-specific acquisition

- [x] 2.1 Extract the Graph fetcher into a shared acquisition module with the retry/auth taxonomy and token redaction on every log/error/manifest path; verify existing ingest tests pass unchanged against the extracted module
- [x] 2.2 Route `refresh.ts` acquisition per source (HTTP fetcher by default, Graph path for Facebook-backed entries, registry `acquisition` field with schema/docs); verify normal HTTP sources behave identically and Facebook registry entries never reach the generic page fetcher
- [x] 2.3 Convert `data:ingest-facebook` into a thin wrapper over shared acquisition + `runRefresh` preserving its CLI/env/fixture/dormant contract; verify no duplicated fetch logic remains and no canonical writes occur
- [x] 2.4 Add acquisition tests A–G: HTTP path unchanged; HTML-into-Graph-collector refused; Graph fixture yields evidence + instance + candidates + correct outcome; missing credentials skip dormant without touching canonical data; expired token fails visibly with no leakage; retries stay bounded; scheduled-shape refresh mixes HTTP + Graph runs without competing formats; verify all pass offline except mocked-fetch cases

## 3. Promotion transaction

- [x] 3.1 Implement the stage/commit/rollback/recovery helper for the records+sources pair (temp staging, live backups, atomic renames, success cleanup, torn-state detection); verify unit tests for the helper in isolation
- [x] 3.2 Rewire `promote.ts` through the transaction helper and add torn-state detection/recovery to `data:validate` (loud, record-identifying) plus promote startup; verify failure-injection tests A–H: pre-staging failure, post-stage failure, forced mid-commit failure with recovery, success path, artifact cleanup, simulated interruption handling, existing provenance tests green, identical-evidence no-op preserved

## 4. Scheduled branch/history fix

- [x] 4.1 Rework `refresh.yml` to checkout latest `main`, import only `research/runs/` from the open refresh branch, compute collision-free run IDs across both histories, and push via fast-forward-or-merge to a single PR; verify the workflow file parses and each step's logic is reviewed
- [x] 4.2 Verify workflow behavior A–F with a manual dispatch on a fixture source plus a local git-harness simulation of pending-branch history, main-code updates, same-day reruns, and existing-PR updates; verify due calculation sees pending runs, latest code executes, suffixes stay unique, one PR updates, and canonical files never change

## 5. Documentation and validation

- [x] 5.1 Update `AGENTS.md`, `docs/data-pipeline.md`, `docs/facebook-sync.md`, and schemas for the coverage model, acquisition routing, transaction/recovery rules, and branch strategy; verify a fresh-agent Scenario-H dry run following only the runbook
- [x] 5.2 Sync the accepted spec delta into `openspec/specs/civic-data-pipeline/spec.md` before archiving (no other capability changes); verify `openspec validate --specs` passes

## 6. Full verification

- [x] 6.1 Run `bun run data:validate`, `bun run data:test`, `bun run verify` (tsc + validate + production build) and the frontend spot-check; verify generated compatibility JSON is byte-identical and the site renders identically
