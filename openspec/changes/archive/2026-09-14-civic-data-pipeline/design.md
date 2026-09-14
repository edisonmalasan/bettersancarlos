## Context

The repository is a statically exported Next.js PWA with no backend; all civic facts flow `research/` → `scripts/gen-*.ps1` (hardcoded facts) / manual edits → `data/*.json` (mirrored byte-identical to `src/data/` + `public/data/`) → frontend imports/fetches. `scripts/sync-facebook.js` writes `data/news.json` directly (with good retry/backoff, validation, fixtures, atomic writes, and dormant-without-token behavior, but citing a nonexistent workflow in its header). CI (`.github/workflows/ci.yml`) runs typecheck + build only. The `civic-data-surfacing` spec already mandates research traceability and the mirror invariant. There is no test suite; verification is `tsc --noEmit` + production build. Bun is the toolchain (npm install is broken in this repo).

See `proposal.md` for motivation and the four delta specs for normative behavior.

## Goals / Non-Goals

**Goals:**

- A safe, repeatable refresh pipeline: collect evidence → candidates → diff → review → promote → generate.
- Canonical civic data with stable record IDs, per-record provenance/status/freshness, append-only history.
- Deterministic offline validation wired into CI, and a documented agent runbook.
- Incremental migration with zero frontend changes (compatibility generation preserves existing JSON shapes).

**Non-Goals:**

- No frontend rewrite, no backend/database, no new page routes.
- No automatic trust, merge, or verification of scraped data.
- No scraping during ordinary builds or CI verification.
- No migration of every civic dataset inside this change (only officials + emergency contacts seed phase).
- No reorganization of existing `research/` topic directories.
- No new runtime dependencies unless demonstrated in a task (see Decisions).

## Decisions

### D1. Pipeline language: TypeScript run with Bun, no new dependencies

New pipeline code lives in `scripts/data/` as TypeScript modules executed with `bun run` (the pinned toolchain already used for CI). Rationale: `tsc --noEmit` already checks the repo; bun runs TS directly; PowerShell generators are being retired, not extended; no test framework exists so deterministic CLI output + `data:validate` self-checks carry the verification burden.

Alternatives: extending PowerShell `gen-*.ps1` (poor parsing/testing ergonomics, platform lock-in); Python (a second toolchain for a Bun/TS repo). YAML registry parsing: the registry is small; implement a minimal purpose-built parser or hand-write the registry as structured JSON with a YAML-friendly layout. Decision: `source-registry.yaml` stays YAML (human-friendly diffs), parsed with a small, fixed-purpose parser (registry is constrained: flat list, known fields). If parsing complexity grows, revisit with an explicit task — not a silent dependency addition.

### D2. Directory layout

```text
data/civic/
├── records.json          # all canonical civic records (stable IDs, revisions inline)
├── sources.json          # source records (evidence metadata, hashes)
├── source-registry.yaml  # known sources, collector + cadence + risk tier
└── schemas/              # JSON Schema files for records/sources/candidates/runs

scripts/data/
├── lib/                  # shared core: load/save, registry, diff engine, hashing, atomic writes
├── collectors/           # facebook.ts, city-website.ts (phase 1); psa.ts, dilg-fdpp.ts ... later
├── parsers/              # html.ts, json.ts (phase 1); pdf/xlsx/csv later if justified
├── refresh.ts            # orchestration: due sources → research run → candidates
├── diff.ts               # candidates vs canonical → review report
├── validate.ts           # offline contract validation
├── promote.ts            # reviewer-side acceptance (writes revisions + history)
└── generate.ts           # canonical → compatibility data/*.json + mirrors

research/runs/<YYYY-MM-DD[-n]>/   # manifest.json, findings.md, candidates.json, conflicts.md, evidence/
```

Rationale: matches the requested architecture; `research/runs/` is additive so existing topic dirs are untouched (spec: never modify research outside `runs/`).

### D3. Canonical record model

`data/civic/records.json` — one object per record keyed by stable ID:

```json
{
  "id": "city-engineer-current",
  "domain": "government",
  "type": "official",
  "label": "City Engineer",
  "data": { "name": "..." },
  "claimSources": { "name": ["src-2024-lgu-directory"] },
  "sourceIds": ["src-2024-lgu-directory"],
  "status": "verified",
  "riskTier": "high",
  "lastVerified": "2026-09-04",
  "acceptedBy": "maintainer",
  "acceptedAt": "2026-09-05",
  "nextReviewOn": "2026-12-05",
  "updateCadence": "quarterly",
  "effectiveFrom": "2025-07-01",
  "effectiveTo": null,
  "notes": "...",
  "history": [ { "revision": 1, "data": {...}, "acceptedBy": "...", "acceptedAt": "...", "sourceIds": [...] } ]
}
```

Decisions within the model:

- **History is inline, append-only.** Promotions append a `history` entry; nothing is erased (spec: superseded evidence preserved). Cap unbounded growth later if it ever matters; correctness first.
- **`claimSources` maps field paths to source IDs** so multi-source records trace each displayed claim (spec requirement).
- **`riskTier` on the record** (`high` default for the listed high-impact categories) drives promotion gates and stale-degradation in generation.
- **Sources are records too** (`sources.json`): `id`, `title`, `publisher`, `url`, `documentType`, `publishedAt`, `effectivePeriod`, `retrievedAt`, `verifiedAt`, `verifier`, `sourceState` (`active|archived|unavailable|moved`), `sha256` + `evidencePath` when appropriate, `notes`.
- **Registry vs sources.json**: the registry describes *where/what/how to collect* (source families, cadence, risk, collector assignment, access notes); `sources.json` describes *retrieved evidence instances* (documents) and grows as runs retrieve. Record `sourceIds` reference `sources.json` instances; collectors resolve their target through the registry.
- Status vocabulary, cadence values, and domain list live in `data/civic/schemas/` as the single machine-readable definition validators and generators share.

### D4. Research run format

`research/runs/<date>/manifest.json` (run id, startedAt/endedAt, parameters, per-source entries: sourceId, checkedAt, outcome, error, evidence hashes), `candidates.json` (record-shaped candidates, `provisional` status, run-scoped source refs), `conflicts.md` + `findings.md` (human-readable), `evidence/` (raw retrieved documents; hash recorded in both manifest and `sources.json`). Runs are write-once; a re-run on the same date suffixes `-2`. This answers all six audit questions in the spec with no new tooling.

### D5. Diff engine outcomes and semantics

Per canonical record (or candidate for `NEW`): compare candidate `data` against canonical `data` with stable JSON normalization (key order, whitespace). Outcomes per spec. Semantics decided:

- `UNCHANGED` never rewrites the record (no timestamp-only churn — Scenario A).
- `MISSING` = canonical record exists but no candidate covered it this run → surfaced in report as coverage gap, not data deletion.
- `STALE` is a validator-time outcome (past `nextReviewOn`), also surfaced by `data:report`; the diff report includes it when relevant.
- `CONFLICT` blocks a candidate; `conflicts.md` documents both sides; promotion refuses (fail-closed).
- `SOURCE_UNAVAILABLE`/`SOURCE_CHANGED` never touch `lastVerified`/`nextReviewOn` (Scenario C).
- Report format: markdown, one block per changed/blocked record with OLD/CANDIDATE/SOURCE/RESULT/ACTION.

### D6. Promotion and reviewer authority

`promote.ts <run> --record <id>` (or `--all-reviewed`) applies reviewed candidates: appends history, sets `acceptedBy`/`acceptedAt`/`lastVerified`/`nextReviewOn` (recomputed from cadence), flips status `provisional → verified`. Reviewer identity comes from an explicit `--reviewer <name>` or git-configured user; the collecting agent must not supply its own identity for collection it performed (enforced by convention documented in the runbook + validated: candidates carry `collectedBy`; promote refuses when `--reviewer == collectedBy` for high-risk records — two-agent rule from the spec; a maintainer is a different principal by definition). Low-risk automated path: news items from the official Facebook page may be auto-promoted with status `reported` (never `verified`) — this is the explicitly justified exception in the spec; everything else requires review.

### D7. Facebook sync re-route

Phase 1 keeps `scripts/sync-facebook.js` behavior but re-targets its merge step: it writes research-run candidates (reusing `categorize`/`transformPost`/`isValidItem`/`mergeFeeds` logic, moved to a shared lib or invoked as a function) instead of `data/news.json`. `data:generate` then emits `news.json` from canonical news records (manual entries seeded as accepted records; fb items as `reported`). Preserve: retries/backoff, fixture mode, dormant-without-token, atomic writes, no-write-on-empty/invalid. Stale header comment (nonexistent `facebook-sync.yml`, `assets/js/news.js`) is corrected to the actual flow. `/admin/news-editor` continues to work against the generated `news.json` shape (manual edits go through the pipeline: import → canonical manual-record update).

### D8. Generator migration map

Each `data/*.json` file gets an entry in `docs/data-pipeline.md` (migration map): producer = `canonical` | `legacy-script` | `manual`, with phase targets. `gen-*.ps1` facts are seeded INTO canonical records (officials, emergency, demographics, fiscal/CMCI, legislative, news, profile) by extraction tasks per domain — extraction is a one-time seeding with evidence sources taken from each script's `_source` fields and the research files. After a domain's generation is verified byte-comparable (or diff-justified), the legacy script is retired with a `docs/` note. No script is deleted before its replacement is verified.

### D9. Validation and CI

`validate.ts` implements every check in the spec (offline, deterministic). package.json scripts:

```json
"data:refresh": "bun run scripts/data/refresh.ts",
"data:diff": "bun run scripts/data/diff.ts",
"data:validate": "bun run scripts/data/validate.ts",
"data:generate": "bun run scripts/data/generate.ts",
"data:report": "bun run scripts/data/report.ts",
"verify": "tsc --noEmit && bun run data:validate && bun run build"
```

CI (`ci.yml`) adds one step: `bun run data:validate` between typecheck and build. No scraping in CI (spec: CI never scrapes). Future `refresh.yml` (phase 6): scheduled/manual → `data:refresh --due` → `data:diff` → open/update PR with `gh` — never auto-merge; token-only secrets stay in GitHub secrets, never in repo data.

### D10. Seeding provenance for phase-1 domains

Officials + emergency contacts seed from existing verified research (`research/government/26-09-city-officials.md`, `research/emergency/26-09-emergency-hotlines.md`): source records created from the research files' documented sources (Comelec via Rappler, city CIO Facebook, official LGU site, archived 2017 site for historical numbers), statuses mapped (`historical - re-verify` → `needs-reverification` + `reported` labeling in generation). This preserves the existing `civic-data-surfacing` behaviors (historical numbers visibly not current) from day one.

## Risks / Trade-offs

- [Inline record history grows `records.json`] → acceptable at this corpus size; history capping is a documented later option; splitting per-domain record files is possible without changing the contract.
- [No test framework exists] → validators and diff engine get fixture-based self-checks runnable via `bun run data:validate` on fixture trees + `bun test` (bun's built-in runner, zero new deps) for unit tests of diff/registry/parsers; CI runs them via `verify`.
- [Hand-rolled YAML parsing may drift] → registry schema is deliberately tiny and validated on load; revisit with an explicit task if requirements grow.
- [Two-agent rule is conventionally enforced for agents, literally for CLI] → promote refuses `--reviewer == collectedBy` on high-risk records; runbook documents that a maintainer is always a distinct principal.
- [`news.json` compat shape must stay byte-stable for `/admin/news-editor` and fetches] → generation uses the exact serializer shape; verified in phase 5 with a before/after diff on unchanged content.
- [Registry could invite invented URLs] → spec + validator: every registry entry must cite a research file (`evidenceRef`) documenting the source; entries without a resolvable research citation fail validation.
- [Script retirement removes working tooling] → retirement only after `data:generate` output is verified for that domain; map documents the swap.

## Migration Plan

Phases (each a coherent, individually verifiable slice; see tasks.md for the unit breakdown):

1. **Foundation** — civic schemas, registry (research-cited sources only), records/sources files, `lib/` core, `validate` + `data:validate` in CI, `verify` script, runbook skeleton.
2. **Phase-1 domains** — seed officials + emergency contacts into canonical records; `generate` emits `officials.json` + `emergency-hotlines.json` compatibly; legacy `gen-profile-emergency.ps1` retired for those outputs after verification.
3. **Diff/refresh/promote** — research-run format, `diff`, `refresh` (fixture-driven Facebook + city-website collectors), `promote`, `data:report`; end-to-end Scenario A–D dry runs on fixtures.
4. **Facebook productionization** — re-route `sync-facebook.js` into run candidates + `reported` auto-path; fix stale docs; retire `gen-news.ps1` after parity.
5. **Remaining script domains** — seed/generate fiscal, CMCI, legislative, profile, demographics domains; retire remaining `gen-*.ps1` per the migration map.
6. **Scheduled refresh** — `refresh.yml` scheduled/manual trigger producing PRs (never auto-merge); agent runbook final polish.

Rollback: every phase is additive; compatibility JSON remains generated from canonical data whose seed came from the existing verified files — reverting a phase = reverting its commits; no data is destroyed at any point (history is append-only). If canonical generation misbehaves for a domain, that domain's file reverts to its previous producer per the migration map (documented in `docs/data-pipeline.md`).

## Open Questions

- Exact collector set beyond Facebook + city website for phase 3/4 (PSA, FDPP, DPWH, CMCI availability is documented as flaky in research) — each later collector is its own task gated on a verified source entry; no spec/design change needed to add one.
- Whether `nextReviewOn` auto-recompute on promotion should respect per-domain overrides (e.g. post-BSKE event-driven reviews for barangay officials) — the `event-driven` cadence value already models this; concrete domain assignments are settled during domain seeding tasks.
