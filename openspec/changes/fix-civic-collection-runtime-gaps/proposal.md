## Why

The civic-data pipeline is architecturally complete, but auditing the implementation on `main` surfaced four runtime/integration gaps that weaken its guarantees: the diff reports false MISSINGs for records no collector attempted, scheduled Facebook collection fetches an HTML page into a Graph-JSON collector, promotion is not truly atomic across its two files, and scheduled due-calculation cannot see pending runs on its own open branch. Fixing these now closes the foundation before collector coverage expands.

## What Changes

- **Explicit collector fact coverage**: collectors declare which canonical record IDs they attempted (`expectedRecordIds` or equivalent); MISSING fires only for covered-but-absent records, while out-of-coverage records are excluded from fact-level comparison. Dynamic NEW-record discovery still works without pre-listing.
- **Source-specific acquisition**: the fetch step is routed per source — normal HTTP sources keep the shared text fetcher, Facebook collection goes through the Graph API path (existing `ingest-facebook.ts` logic, unified so no two pipelines diverge). Tokens never touch evidence, manifests, logs, or git.
- **Transactional promotion**: `records.json` + `sources.json` commit via a staged two-file transaction with rollback/recovery, so a failure between replacements cannot leave a torn canonical pair; `data:validate`/`data:promote` detect or recover interrupted transactions.
- **Branch-aware scheduled refresh**: the workflow starts from latest `main` code while retaining pending `research/runs/` history from the open refresh branch, keeping due-calculation, run-ID suffixing, and single-PR updates correct.
- Docs, schemas, runbook, and the collector roadmap note updated; no new collectors, no frontend changes, no backend.

## Capabilities

### New Capabilities

None — every behavior lands as a delta on the existing pipeline contract.

### Modified Capabilities

- `civic-data-pipeline`: fact-level collector coverage model and MISSING/SOURCE_UNAVAILABLE/SOURCE_CHANGED semantics; source-specific acquisition routing with credential safety; transactional promotion persistence and recovery; scheduled-refresh branch/history/run-ID semantics.

## Impact

- **Modified code**: `scripts/data/collectors/types.ts` (+ facebook/city-website collectors), `scripts/data/refresh.ts` (acquisition routing, coverage plumbing), `scripts/data/diff.ts` (coverage-gated MISSING, dependent-record mapping for failed sources), `scripts/data/promote.ts` (+ shared transaction helper), `scripts/data/validate.ts` (torn-state detection), `scripts/data/lib/` (coverage types, transaction helper), `scripts/data/ingest-facebook.ts` (kept as the single Graph path — wrapper, alias, or folded in, not duplicated), `data/civic/schemas/` (coverage fields, acquisition field only if needed), `.github/workflows/refresh.yml` (branch/history handling).
- **Data**: no canonical record/source migration; run manifests may gain a small coverage field (backwards-compatible readers).
- **Dependencies**: none (Bun/Node stdlib only, as before).
- **Risk containment**: each phase is independently testable with fixture/mocked-fetch tests; fail-closed behavior is extended, never relaxed; rollback per phase is a revert.
