# Civic-data pipeline

How civic facts flow from public sources to the website without blind overwrites:

```text
public / government sources
        -> source-specific collectors (scripts/data/collectors)
        -> research run (research/runs/<date>: manifest, evidence, candidates, conflicts)
        -> diff (candidates vs canonical records -> review report)
        -> independent review -> promote (canonical records in data/civic)
        -> validate (bun run data:validate)
        -> generate (canonical records -> data/*.json compatibility outputs)
        -> Next.js website (unchanged imports/fetches)
```

Research and collection produce evidence and candidates only. They never
overwrite canonical records or frontend JSON directly.

## Commands

| Command | Purpose |
|---|---|
| `bun run data:refresh [-- --source=<id>] [-- --domain=<d>]` | Collect due/selected sources into a new research run |
| `bun run data:diff` | Diff candidates against canonical records, emit a review report |
| `bun run data:validate` | Offline contract validation (runs in CI) |
| `bun run data:generate [-- --domain=<name>]` | Regenerate compatibility `data/*.json` + mirrors from canonical records |
| `bun run data:report` | Data-health summary (staleness, conflicts, coverage) |
| `bun run verify` | Typecheck + data validation + production build |

## Canonical layer (data/civic)

- `records.json` — accepted civic records keyed by stable ID (value may change, ID persists).
- `sources.json` — retrieved evidence instances backing the records.
- `source-registry.yaml` — known collectable sources. Every entry cites an
  existing `research/` file in `evidenceRef`; no invented URLs.
- `schemas/` — JSON Schema contracts for records, sources, registry, candidates, run manifests.

## Record conventions

- Councilor IDs use `sp-member-<ballot-rank>` from the seeding election
  (e.g. `sp-member-01` = rank 1 in 2025).
- `nextReviewOn` equal to `acceptedAt` means review is due immediately
  (used for `needs-reverification` seeds and `manual`-cadence records).
- `manual` and `per-document` cadences are exempt from staleness failures;
  every other published (`verified`/`reported`) record must have a future `nextReviewOn`.
- Statuses `needs-reverification`, `blocked`, and `provisional` are flagged as
  warnings by validation and must never be presented as current fact.
- History inside a record is append-only; superseded values stay retrievable.

## Producer map (data/*.json)

Exactly one designated producer per file. `canonical` = `bun run data:generate`
from `data/civic` records. Legacy scripts stay untouched until their row says retired.

| File | Producer | Phase target |
|---|---|---|
| `officials.json` | canonical | done (phase 2) |
| `emergency-hotlines.json` | canonical | done (phase 2) |
| `news.json` | canonical | done (phase 4) |
| `demographics.json` | canonical | done (phase 5) |
| `city-profile.json` | canonical | done (phase 5) |
| `fiscal_transparency.json` | canonical | done (phase 5) |
| `competitive-index.json` | canonical | done (phase 5) |
| `ordinances.json` | canonical | done (phase 5) |
| `resolutions.json` | canonical | done (phase 5) |
| `dpwh-projects.json` | canonical | done (phase 5) |
| `barangays.json` (`data/` home + `public/data/` + `src/data/` mirrors) | canonical | done (phase 5) |
| `barangay-officials.json` (`data/` home + `public/data/` + `src/data/` mirrors) | canonical | done (phase 5) |
| `agriculture.json` | manual (partially-verified) | refresh 2008-era stats on new PSA/agriculture releases |
| `city-projects.json` | manual (partially-verified) | verify buckets against DPWH/FDPP project lists |
| `evacuation-centers.json` | manual (partially-verified) | re-verify shelters with CDRRMO |
| `government-directory.json` | manual (partially-verified) | reconcile office-holder names with canonical officials records when migrated |
| `health-facilities.json` | manual (partially-verified) | verify facilities against the DOH HFDB list |
| `schools.json` | manual (partially-verified) | verify institution lists against the DepEd school directory |
| `services.json` | manual (57-service hand directory, no provenance block) | add per-service research provenance before migration |
| `tourism.json` | manual (partially-verified) | — |
| `transparency-docs.json` | manual (partially-verified) | refresh FDP links on the DILG posting cycle |
| `transportation.json` | manual (historical) | re-verify routes/fares (2017-era sources) |
| `utilities.json` | manual (partially-verified) | re-verify CENPELCO contacts |

`src/data/barangays.json` and `src/data/barangay-officials.json` are generated
from canonical barangay records by `bun run data:generate`, with `data/*.json`
as the home and byte-identical `public/data/` + `src/data/` mirrors
(done, phase 5).

## Retired scripts log

- `scripts/gen-profile-emergency.ps1` (fully retired, phases 2+5):
  emergency-hotlines facts moved in phase 2, city-profile facts in phase 5;
  `data:generate` is the producer for both. The script throws instead of
  writing so it can never fork either file again.
- `scripts/gen-demographics.ps1` (phase 5): all facts moved to canonical
  demographics records; `data:generate -- --domain=demographics` is the
  producer. The script throws instead of writing.
- `scripts/gen-fiscal-cmci.ps1` (phase 5): fiscal + CMCI facts moved to
  canonical records; `data:generate` is the producer for both files.
  The script throws instead of writing.
- `scripts/gen-legislative.ps1` (phase 5): ordinances/resolutions/DPWH facts
  moved to canonical records; `data:generate` is the producer for all three
  files. The script throws instead of writing.
- `scripts/gen-barangays.ps1` (phase 5): captain/directory facts moved to
  canonical barangay records (populations join from the demographics table);
  `data:generate` is the producer. The script throws instead of writing.
- `scripts/gen-news.ps1` (phase 4): all facts moved to canonical news
  records; `data:generate` is the producer. The script throws instead of
  writing so it can never fork `news.json` again.
- `scripts/gen-demographics.ps1`, `scripts/gen-fiscal-cmci.ps1`,
  `scripts/gen-legislative.ps1`, `scripts/gen-barangays.ps1`: active until
  their phase-5 parity is verified.

## Agent refresh runbook

Follow these steps in order. You need no other context: the source registry
(`data/civic/source-registry.yaml`) tells you what can be collected, and every
command below is safe to run (collection never modifies canonical data).

1. Read the registry entry for your target: `id`, `collector`, `updateCadence`,
   `domains`, `accessNotes`. Collectors run registry sources only — an
   unregistered source is refused, never scraped.
2. Refresh: `bun run data:refresh` (narrow with `-- --source=<id>` and/or
   `-- --domain=<d>`; add `-- --due` for due sources only). This creates
   `research/runs/<YYYY-MM-DD[-n]>/` and nothing else.
3. Inspect the new run directory (requirements — every run must contain):
   - `manifest.json`: run id, start/end, parameters, per-source entries
     (`sourceId`, `checkedAt`, outcome, error if failed, evidence SHA-256),
     candidate/conflict counts, `collectedBy`.
   - `evidence/`: raw retrieved bytes (hash recorded in the manifest).
   - `candidates.json`: record-shaped candidates, all `provisional`, each with
     `collectedBy` + `runId`, and NO reviewer fields (`acceptedBy`/`acceptedAt`
     on a candidate fails validation).
   - `findings.md` (what changed/failed) and `conflicts.md` (disagreements).
4. Diff: `bun run data:diff [-- --run=<id>]` and read the review report in the
   run directory (`OLD` / `CANDIDATE` / `SOURCE` / `RESULT` / `ACTION` per
   record). Outcomes: `UNCHANGED` (no action), `NEW` / `CHANGED` (review),
   `MISSING` (coverage gap — never a deletion), `STALE` (past `nextReviewOn`),
   `CONFLICT` (blocked), `SOURCE_UNAVAILABLE` / `SOURCE_CHANGED` (keep existing
   data, deadlines unchanged).
5. Stop. Do NOT edit `data/civic/records.json`, `data/civic/sources.json`,
   or any `data/*.json` directly.

### Never-overwrite rules

- Research and collection produce evidence + candidates only. Canonical records
  change exclusively through `data:promote`; compatibility JSON exclusively
  through `data:generate`.
- No pipeline command modifies `research/` outside `research/runs/`
  (validation fails otherwise).
- Empty results, zero valid items, or unreachable sources leave canonical data
  and compatibility outputs byte-identical. A failed source never deletes data
  or extends a review deadline. An interrupted run leaves everything untouched.

### Promotion rules (reviewer step, separate from collection)

- `bun run data:promote -- --run=<id> (--record=<id> ... | --all) --reviewer=<name>`
  appends a history revision, sets `acceptedBy`/`acceptedAt`/`lastVerified`,
  recomputes `nextReviewOn` from cadence, and flips `provisional` → `verified`.
- A collector must never accept its own high-risk candidates: promotion refuses
  when `--reviewer` equals the candidate's `collectedBy` on high-risk records
  (emergency contacts, officials, fees, budgets, legislation, procurement).
- Conflict-blocked candidates are refused; resolve first, never auto-resolve.
- Official-page news may use the low-risk auto-path (see below).
- After any accepted promotion: `bun run data:generate`, then `bun run verify`.

### Conflict handling

1. `CONFLICT` means two candidates/sources disagree: the candidate is blocked
   from promotion and the disagreement is documented in `conflicts.md`.
2. Re-check the sources (a new refresh run often resolves stale disagreements).
3. A reviewer decides based on authoritative evidence; the losing side stays in
   run history, never deleted. No pipeline step silently resolves a conflict.

### Scenario H self-test (fixture refresh with no other context)

An agent with only this file must be able to produce a research run:

```bash
bun run data:refresh -- --source=lgu-website --offline --collected-by=<your-name>
bun run data:diff
bun run data:report
bun run data:validate
```

The refresh records the source as `skipped` (offline, no evidence supplied) and
still writes a complete run directory; diff/report/validate all run offline.
Deeper fixture scenarios (changed values, conflicts, unavailable sources) run
via `bun test scripts/data/refresh.test.ts`. If any command above fails on a
clean tree, the runbook — not your intuition — is what needs fixing.

## News auto-promotion (low-risk path only)

Official-page news candidates (`domain: news`, sourced from the registered
`lgu-facebook-cio` page) may be accepted without an independent reviewer via
`bun run data:promote -- --auto-news`. Justification: news items are
low-risk (informational, never emergency contacts / officials / fees /
budgets), the source is the official LGU page itself, and every auto-accepted
record keeps status `reported` — never `verified` — so the site labels it as
reported, not independently confirmed. The gate refuses anything else:
non-news domains, non-official sources, and updates to existing canonical
records all require normal reviewer promotion. High-risk categories can never
use this path.
