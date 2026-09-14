## Why

The civic-data pipeline (`2026-09-14-civic-data-pipeline`, implemented and archived) is architecturally sound, but an audit of the actual implementation found integration gaps that weaken its core guarantees: accepted records can cite registry IDs instead of exact evidence, the diff can miss failed refreshes entirely, failed attempts can satisfy refresh cadence, review dates can be stretched without bound, and risk classification lives in two places that can disagree. Each gap is small; together they erode fail-closed behavior.

## What Changes

- **Exact source-instance provenance**: collectors emit source-instance candidates alongside civic candidates; promotion appends accepted instances to `sources.json` atomically with record updates; canonical `sourceIds` must resolve to exact `sources.json` entries (registry IDs alone no longer satisfy canonical provenance).
- **Diff scope fix**: the diff derives scope from the real refresh manifest (`domains[]` plus attempted-source registry domains plus candidate domains), so failed or empty refreshes still report `SOURCE_UNAVAILABLE` / `MISSING`.
- **Success-based cadence**: only `collected` / `unchanged` outcomes advance a source's normal cadence; failures retry sooner on a fixed policy and never touch `lastVerified` / `acceptedAt` / `nextReviewOn`.
- **Cadence-window enforcement**: one shared policy maps each cadence to a maximum review window (non-time-based cadences must keep `nextReviewOn == acceptedAt`); promotion computes with it, validation rejects stretched dates.
- **Centralized risk policy**: a single `isHighRisk` policy (record tier, domain, type) with no-downgrade semantics replaces the scattered domain list + tier default.
- **Explicit freshness semantics**: `manual` / `per-document` / `event-driven` behavior is pinned down (sentinel rule, no new fields), and `data:report` distinguishes scheduled, event-driven, manual, and document-triggered review.
- **CI + runbook + roadmap**: pipeline tests run in CI (`data:test`), the runbook and scheduled workflow are updated for the hardened schema, and a prioritized collector roadmap is documented (no new collectors implemented here).

## Capabilities

### New Capabilities

None — this change hardens existing capabilities; every behavior lands as a delta on an existing spec.

### Modified Capabilities

- `civic-data-pipeline`: exact source-instance lifecycle and provenance invariant; canonical diff-scope model; success-based cadence with retry policy; cadence-window enforcement; centralized risk classification; explicit non-scheduled freshness semantics; atomic promotion; research-run source-instance artifact.
- `civic-data-compat-generation`: generation resolves source labels from exact `sources.json` instances and fails loudly on unresolvable references instead of rendering raw IDs.
- `ci-verification`: CI runs the civic pipeline unit/integration tests (`data:test`) alongside typecheck, civic-data validation, and production build; still no network scraping.

## Impact

- **New code**: `scripts/data/lib/policy.ts` (cadence/risk/status/outcome policy), source-instance read/write helpers, `research/runs/<run>/source-instances.json` artifact + JSON Schema files, promotion transaction across `records.json` + `sources.json`.
- **Modified code**: `refresh.ts` (scope parameters contract, success-based due), `diff.ts` (scope derivation, registry input), `promote.ts` (instance acceptance, atomic writes, policy-driven dates/risk), `validate.ts` (exact-source resolution, window checks, sentinel rule), `report.ts` (review-class grouping), `generate.ts` (strict source resolution), collectors (instance candidates), `package.json` (`data:test`), `.github/workflows/ci.yml` + `refresh.yml` (only if the run schema requires it), `AGENTS.md`, `docs/data-pipeline.md`.
- **Data**: 2 existing records referencing bare registry IDs migrate to exact source instances; all other canonical records and sources stay untouched (verified: the rest already resolve exactly). No frontend changes; generated JSON shapes unchanged.
- **Dependencies**: none (Bun/Node stdlib only, as before).
- **Risk containment**: additive schema changes with explicit versions; old research runs stay readable; every phase is verifiable by fixture tests before the next begins; rollback per phase is a revert.
