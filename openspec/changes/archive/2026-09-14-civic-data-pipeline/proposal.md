## Why

Civic facts about San Carlos City change constantly (officials after elections/BSKE, department heads, emergency contacts, fees, budgets, FDP documents, advisories), but the repository has no repeatable, safe way to refresh them. Today the flow is `research/` (markdown evidence) → hardcoded facts inside `scripts/gen-*.ps1` and hand-edited `data/*.json` → frontend. Generator scripts duplicate every civic fact they emit, production JSON is overwritten blindly (Facebook sync writes `data/news.json` directly), verification metadata is a single file-wide `_status`/`_updated` string, and no tooling distinguishes an unchanged fact from a changed, conflicting, or stale one. A future AI agent (or maintainer) cannot refresh any dataset without reconstructing it from scratch and without risking silent overwrites of verified production data.

## What Changes

- **Canonical civic-data layer** (`data/civic/`): stable civic record IDs (e.g. `city-mayor-current`), record-level provenance (per-claim source references), verification status vocabulary, per-record freshness metadata, and a machine-readable **source registry** (`source-registry.yaml`) describing every known authoritative source (LGU website, PSA, PSGC, Comelec, DILG FDPP, BLGF, DPWH, DTI CMCI, DOH, DepEd, BFP, PNP, Facebook page) with cadence, collector, and access notes. No invented source URLs — the registry starts from sources already verified in `research/`.
- **Research-run structure** (`research/runs/<date>/`): chronological runs capturing manifest, raw evidence (with SHA-256 where appropriate), candidate records, conflicts, and findings — answering when a source was checked, what changed/failed, and what evidence backs each candidate. Existing topic-organized `research/` directories remain untouched.
- **Candidate/diff workflow**: refresh produces candidate records, `diff` compares them against canonical records and yields a human-readable review report with outcomes (`UNCHANGED`, `NEW`, `CHANGED`, `MISSING`, `STALE`, `CONFLICT`, `SOURCE_UNAVAILABLE`, `SOURCE_CHANGED`). Source failure never deletes production data or extends its review deadline.
- **Promotion gates**: only an independent reviewer/maintainer (not the collecting agent) may accept candidates into canonical data via reviewer-owned fields (`acceptedBy`, `acceptedAt`). Conflicts fail closed. Risk-tiered publication gates protect high-impact data (emergency contacts, officials, fees, budgets, procurement).
- **Source-specific collectors** (`scripts/data/`): small deterministic adapters per source (starting with Facebook + city website/HTML), shared parsers, and a `refresh`/`diff`/`validate`/`promote`/`generate` command surface — no giant universal scraper.
- **Validator + compatibility generation**: `bun run data:validate` (and `bun run verify` integrating it) enforces the civic-data contract (unique IDs, resolvable source references, valid statuses/cadences, no expired review dates on published records, no secrets/machine-local paths, hash integrity). `generate` emits the existing `data/*.json` formats from canonical records so the current frontend keeps working unchanged during migration.
- **Facebook sync redesign**: `sync-facebook.js` keeps its retry/backoff, validation, fixture, and atomic-write behavior but feeds candidates into research runs/news ingestion rather than overwriting production JSON directly (a fast path for low-risk news may be justified in design); its stale header comment referencing a nonexistent workflow is corrected.
- **Generator-script migration**: `gen-*.ps1` scripts stop being factual sources of truth — their facts move into canonical records and generators become pure transforms. Working scripts are not deleted until their replacement is verified.
- **Future scheduled refresh**: GitHub Actions periodic refresh → research run → diff/report → PR, never auto-merge. Deferred to a late phase.
- **Agent refresh runbook**: repository instructions (AGENTS.md/data-pipeline docs) so any future agent can run a refresh without rediscovering the workflow.

No frontend rewrite, no backend/database, no automatic trust of scraped data. Static deployment compatibility is preserved.

## Capabilities

### New Capabilities

- `civic-data-pipeline`: the end-to-end contract for civic-data refresh — canonical data model, source model, verification/freshness models, research-run and candidate/diff lifecycle, review/promotion gates, collector architecture, validator requirements, developer command surface, and failure semantics.
- `civic-data-compat-generation`: how canonical civic records are validated and transformed into the existing `data/*.json` frontend formats (including the byte-identical `public/data/` mirror and `_source`-style metadata preservation) without breaking current consumers.

### Modified Capabilities

- `civic-data-surfacing`: the "one canonical data source per fact" requirement extends from "one JSON file per fact" to "canonical civic records with stable IDs and per-record provenance, with compatibility JSON generated from them"; verification-status visibility requirements now trace to record-level status vocabulary instead of file-wide `_status` strings.
- `ci-verification`: the CI contract gains a civic-data validation step (`bun run data:validate`) alongside typecheck and production build; network scraping remains excluded from ordinary builds.

## Impact

- **New code**: `data/civic/` (records, sources, source registry, schemas), `scripts/data/` (collectors, parsers, refresh/diff/validate/promote/generate), `research/runs/`, package.json scripts (`data:refresh`, `data:diff`, `data:validate`, `data:generate`, `data:report`, `verify`), CI workflow step, future GitHub Actions refresh workflow.
- **Modified code**: `scripts/sync-facebook.js` (re-routed into candidate production), `scripts/gen-*.ps1` (fact removal → transform-only, phased), `.github/workflows/ci.yml` (validation step), AGENTS.md (agent refresh runbook).
- **Data**: initial canonical seeding for phase-1 domains (elected officials, emergency contacts) from existing verified research; existing `data/*.json` continue to ship as compatibility outputs — frontend imports/fetches unchanged.
- **Dependencies**: none expected (Node/Bun stdlib + existing toolchain; YAML parsing to be resolved in design without new deps where practical).
- **Risk containment**: phased migration; production JSON never auto-overwritten; conflicts block rather than resolve; historical provenance never erased (record revisions, not in-place mutation).
