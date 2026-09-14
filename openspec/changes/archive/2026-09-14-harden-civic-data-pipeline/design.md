# Design: harden-civic-data-pipeline

## Context

See `proposal.md` (Why) for motivation. Current state, verified against the
implementation on `main`:

- Collectors (`scripts/data/collectors/`) emit civic candidates with
  `sourceIds: [registryId]`; `promote.ts` copies them verbatim into canonical
  records; `validate.ts` `resolveSource` accepts registry IDs, so only 2 of 165
  records are visibly registry-only (both `*-publication-note` records) while
  any future collection can silently add more.
- `refresh.ts` records `parameters: { sources, domains[], due, offline }`, but
  `diff.ts` reads singular `parameters.domain`, which real runs never set —
  scope silently collapses to candidate domains, and the one test covering it
  hand-builds `{ domain }`, masking the bug.
- `lastCheckedAt` uses any outcome's `checkedAt`, so `failed` / `unavailable` /
  `skipped` satisfy cadence; `CADENCE_DAYS` (refresh) and
  `CADENCE_INTERVAL_DAYS` (promote) already disagree on non-scheduled cadences.
- `validate.ts` checks date validity, staleness, and `nextReviewOn < acceptedAt`
  but has no upper-bound window; the valid fixture itself uses
  quarterly + `2099-01-01`.
- Risk is split between `HIGH_RISK_DOMAINS` (5 domains) and
  `existing.riskTier ?? 'medium'`; `Candidate` carries no risk, so new facts in
  uncovered domains (e.g. a barangay official) default non-high.
- `nextReviewOn == acceptedAt` already holds for all 41 manual/per-document
  records (sentinel convention works); `changing` is defined identically in
  `validate.ts` and `report.ts`.
- 18 of 21 registry sources have `collector: null`; `verify` runs no tests.

## Goals / Non-Goals

**Goals:** exact evidence provenance end-to-end; scope derived from real
manifests; success-based cadence with bounded retry; one cadence policy;
one risk policy; unambiguous freshness classes; atomic promotion; integration
tests that would have caught the `domain`/`domains` bug.

**Non-Goals:** new collectors (roadmap only); frontend changes; backend/database;
null-migration of `nextReviewOn` (sentinel rule instead); new dependencies.

## Decisions

### D1. Source-instance artifact: separate `source-instances.json`
Each run writes `research/runs/<run>/source-instances.json`: a schema-backed
array of instance candidates `{ id, registryId, title, publisher, url?,
discovery?, documentType, retrievedAt, publishedAt?, effectivePeriod?,
sourceState, evidencePath, sha256, collectedBy, runId, notes? }`, plus a
`civicSources` map of candidate-ID → instance-ID. Alternatives: embedding in
`manifest.json` (bloats the audit index, mixes schema versions) or in
`candidates.json` (duplicates instances across candidates). Separate file keeps
each artifact single-purpose and independently schema-validated.

### D2. Instance IDs are content-keyed with a human date: `src-<registryId>-<yyyymmdd>-<hash8>`
`<hash8>` is the first 8 hex chars of the evidence SHA-256 (full hash stored in
the record). Same bytes re-collected get a different date segment, but
promotion dedupes on `(registryId, sha256)`: if `sources.json` already holds
that pair, the existing instance is reused and the re-retrieval stays recorded
only in the run manifest. This satisfies "byte-identical evidence twice → no
meaningless duplicates" while keeping IDs sortable and greppable. Alternative
(pure `registryId+hash` IDs) was rejected for losing the human date cue;
alternative (always-append) was rejected for unbounded duplicate growth.

### D3. Promotion is validate-then-write-twice with git as recovery
Promote loads both files, builds the complete proposed state in memory
(record updates + new/updated source instances + history entries), runs the
full validation suite on it (field validity, exact-source resolution,
cadence windows, risk rules, conflict absence), then writes both files via
tmp+rename. A crash between renames leaves a torn state that the next
`data:validate` reports as record-identifying errors (fail-closed); recovery
is re-running promotion or `git checkout` of the two files. Alternatives:
journal files (unnecessary complexity for two JSON files) and pre-write backups
(`git` already versions both files on every commit).

### D4. Diff scope = requested ∪ attempted ∪ observed, matched via registry linkage
`diffRun` gains the registry (or a precomputed source→domains map) alongside
its current inputs. Scope = `parameters.domains[]` ∪ registry domains of every
attempted source in `manifest.sources[]` ∪ candidate domains. For each in-scope
canonical record: attempted-and-failed supporting source → `SOURCE_UNAVAILABLE`;
attempted-and-succeeded with no covering candidate → `MISSING`; otherwise
current behavior; out-of-scope records produce no entry. Record→attempted
matching resolves canonical `sourceIds` through `sources.json` instances to
their `registryId`s. Precedence question resolved: attempted-source evidence
outranks candidate absence (a failed attempt is informative, an absent
candidate is not).

### D5. Due computation uses last SUCCESSFUL check; failures retry at min(normal, 7d)
`lastCheckedAt` is replaced by last-`collected`/`unchanged` semantics;
`skipped`/`unregistered` never count as checks. Retry intervals: daily→1d,
weekly→7d, monthly→7d, quarterly→7d, annually→30d, non-scheduled cadences never
auto-due (unchanged). Single-source live failure therefore recovers at the next
scheduled run without hammering sources. `lastVerified`/`acceptedAt`/
`nextReviewOn` remain write-locked to promotion only.

### D6. One cadence table; sentinel rule instead of null
`scripts/data/lib/policy.ts` owns `CADENCE_POLICY: { days, timeBased }`:
daily 1, weekly 7, monthly 31, quarterly 92, annually 366, per-term 1461
(explicit: covers 3-year terms plus transition; revisit if term law changes),
event-driven 366; `per-document`/`manual` are non-time-based with window 0,
i.e. `nextReviewOn` MUST equal `acceptedAt`. Verified: the entire current
corpus already satisfies these windows, so enforcement needs no grandfathering
(except the two note records in D9). `promote.ts`, `validate.ts`, `refresh.ts`,
and `report.ts` all import the table; the two existing maps are deleted.
`nextReviewOn: string | null` was rejected: it would migrate 165 records,
schemas, emitters, and reports for no behavioral gain over the sentinel rule
the corpus already follows.

### D7. `isHighRisk({ riskTier, domain, type })`, required tier, no downgrade
Central rule: `riskTier === 'high'` OR domain in
`{government, emergency, health, transparency, legislation, barangays,
infrastructure, disaster-risk}` (extends the current five with the domains that
actually hold officials, budgets-adjacent projects, and safety contacts) OR
`type === 'official'`. `riskTier` becomes required on canonical records
(backfilled once; safe default `medium` applies only where the rule still says
non-high). Candidates carry no risk field: promotion keeps the existing tier
(existing high is never overwritten) and otherwise applies the policy default.
Reviewer upgrades remain explicit record edits outside promotion.

### D8. Report groups by review class
`data:report` splits staleness/coverage output into scheduled, event-driven,
manual, and document-triggered classes; `STALE` keeps its diff meaning
(past-due scheduled/event-driven records only). No new fields; presentation
change only.

### D9. Migration: two records move, everything else stays
The only canonical records citing bare registry IDs are
`news-publication-note` and `city-profile-publication-note` (→ `lgu-website`).
Each gets a real retrieved-evidence source instance; validation thereafter
rejects bare registry IDs in canonical records with zero exemptions. All other
163 records and every source record stay byte-identical (verified by
re-running `data:validate` plus the generate parity tests). The existing
`validate.test.ts` valid fixture (quarterly + 2099) is updated to a
window-legal date as part of the change.

### D10. Schema versions: additive with legacy default
New `source-instances.json` ships at version 1; `manifest.json` gains an
optional `schemaVersion` (absent = v1 legacy, still readable); record/candidate
schemas gain optional instance-link fields. The validator accepts legacy runs
and only enforces new rules on current-version artifacts, so archived runs
stay readable.

### D11. `data:test` runs the offline suite in CI
New script `data:test` = the existing `bun test` invocation over
`scripts/data` + `sync-facebook.test.js` (all offline fixtures; ~seconds).
CI runs it between `data:validate` and build. No live scraping in CI (unchanged).

### D12. Collector roadmap (docs only, prioritized)
Order by value × volatility × stability × structuredness: 1) PSA/PhilAtlas
demographics (structured tables, high reuse), 2) DILG FDPP documents,
3) DPWH project lists, 4) Comelec-via-Rappler tallies, 5) DOH/DepEd
directories, 6) CENPELCO/utility contacts, 7) LWUA/NEA/Gazette/province
as needed. PSGC and CMCI stay parked until their portals are reachable
(403/404 at research time). Each future collector ships as its own scoped
OpenSpec change reusing the instance/candidate contract defined here.

## Risks / Trade-offs

- [Instance dedupe hides re-retrieval dates on the canonical record] →
  each retrieval stays timestamped in its run manifest; canonical keeps
  first-acceptance metadata. Documented in the runbook.
- [`riskTier` required + backfill] → one-time migration task audits every
  record missing the field; validator errors (not warnings) enforce it after.
- [Two-file promotion is not filesystem-atomic] → validate-before-write plus
  torn-state detection in `data:validate` plus git recovery; matches the
  static-deployment constraint (no database).
- [Weekly scheduled refresh caps retry granularity] → the 7-day retry floor
  aligns with the actual schedule; daily/weekly sources retry next run anyway.
- [Hash-8 collision] → negligible at this corpus scale; full SHA-256 stored
  and compared, so a prefix collision cannot merge distinct evidence.

## Migration Plan

Phases 1–7 implement behind the existing CLI surface (no flag days):
schemas/policy first, then refresh+diff, promotion+validation, cadence/risk,
freshness/reporting, CI/runbook/docs. Each phase ends with `bun run data:test`,
`data:validate`, and `tsc --noEmit` green on the untouched corpus plus new
fixture tests. Rollback per phase is `git revert` (additive changes; canonical
data untouched until promotion paths are exercised, and then only via reviewed
promotion). The two note-record migrations ship in the provenance phase with
before/after `data:validate` output in the commit message.

## Open Questions

None — all decisions above are locked by the spec deltas and this design.
The per-term 1461-day window is a recorded assumption (covers 3-year terms
plus transition), not an open question.
