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
| `news.json` | manual + `scripts/sync-facebook.js` (direct write) | canonical (phase 4) |
| `demographics.json` | `scripts/gen-demographics.ps1` | canonical (phase 5) |
| `city-profile.json` | manual (hand-extended; script output is stale — do not rerun `gen-profile-emergency.ps1`) | canonical (phase 5) |
| `fiscal_transparency.json` | `scripts/gen-fiscal-cmci.ps1` | canonical (phase 5) |
| `competitive-index.json` | `scripts/gen-fiscal-cmci.ps1` | canonical (phase 5) |
| `ordinances.json` | `scripts/gen-legislative.ps1` | canonical (phase 5) |
| `resolutions.json` | `scripts/gen-legislative.ps1` | canonical (phase 5) |
| `dpwh-projects.json` | `scripts/gen-legislative.ps1` | canonical (phase 5) |
| `agriculture.json` | manual | documented (phase 5) |
| `city-projects.json` | manual | documented (phase 5) |
| `evacuation-centers.json` | manual | documented (phase 5) |
| `government-directory.json` | manual | documented (phase 5) |
| `health-facilities.json` | manual | documented (phase 5) |
| `schools.json` | manual | documented (phase 5) |
| `services.json` | manual | documented (phase 5) |
| `tourism.json` | manual | documented (phase 5) |
| `transparency-docs.json` | manual | documented (phase 5) |
| `transportation.json` | manual | documented (phase 5) |
| `utilities.json` | manual | documented (phase 5) |

`src/data/barangays.json` and `src/data/barangay-officials.json` are produced
by `scripts/gen-barangays.ps1` (phase 5 target: canonical).

## Retired scripts log

- `scripts/gen-profile-emergency.ps1` (emergency-hotlines portion only, phase 2):
  facts moved to canonical records; `data:generate` is the producer.
  The city-profile portion is stale relative to the hand-extended
  `data/city-profile.json` — do not rerun it; phase 5 replaces it.
- `scripts/gen-news.ps1`: active until phase 4 parity is verified.
- `scripts/gen-demographics.ps1`, `scripts/gen-fiscal-cmci.ps1`,
  `scripts/gen-legislative.ps1`, `scripts/gen-barangays.ps1`: active until
  their phase-5 parity is verified.

## Agent refresh runbook (summary)

1. `bun run data:refresh` (add `-- --source=<id>` / `-- --domain=<d>` to narrow).
2. Inspect `research/runs/<new-run>/`: manifest, candidates, conflicts, findings.
3. `bun run data:diff` and read the review report.
4. Stop. Do NOT edit `data/civic/records.json`, `data/civic/sources.json`,
   or any `data/*.json` directly.
5. Promotion is a separate reviewer step (`bun run data:promote`); a collector
   must never accept its own high-risk candidates, and conflicts fail closed.
6. After any accepted promotion: `bun run data:generate`, then `bun run verify`.
