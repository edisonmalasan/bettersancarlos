## ADDED Requirements

### Requirement: Exact source-instance provenance
Every accepted canonical claim SHALL resolve through its `sourceIds` to exact evidence records in `data/civic/sources.json`, each carrying the registry entry it was collected from. A bare source-registry ID (e.g. `lgu-website`) SHALL NOT satisfy canonical provenance: the chain SHALL be canonical record → source instance (`sources.json`) → `registryId` → source registry. Registry IDs remain valid in research-run candidates and in source-instance metadata.

#### Scenario: Registry ID alone is rejected for canonical claims
- **WHEN** a canonical record is promoted or validated with a `sourceId` that names a registry entry but no `sources.json` record
- **THEN** promotion refuses the candidate (or validation fails), naming the record and the unresolved source ID

#### Scenario: Accepted evidence is fully traceable
- **WHEN** a maintainer inspects a newly promoted record
- **THEN** they can identify the exact evidence bytes (with SHA-256 where stored), retrieval time, origin URL or discovery, collector, and producing research run

#### Scenario: Byte-identical re-collection creates no duplicate source
- **WHEN** the same evidence bytes are collected again in a later run and promoted
- **THEN** no meaningless duplicate source record is created; the existing instance (same registry ID and evidence hash) is reused and the re-retrieval stays recorded in the run manifest

### Requirement: Source-instance candidate lifecycle
Each successful evidence retrieval that may support a promoted claim SHALL be preserved as a source-instance candidate in the research run (alongside the retrieved evidence and its hash), and each civic-record candidate SHALL reference source-instance candidate IDs rather than registry IDs alone. Unaccepted evidence SHALL remain in the research run and SHALL NOT be appended to canonical `sources.json`.

#### Scenario: Refresh produces linked instance and civic candidates
- **WHEN** a refresh collects evidence for a source
- **THEN** the run contains the evidence bytes, a source-instance candidate with a stable ID, and civic candidates referencing that instance ID

#### Scenario: Unaccepted evidence stays out of canonical sources
- **WHEN** a run ends with candidates that are never promoted
- **THEN** canonical `sources.json` is unchanged and the evidence remains retrievable only from the research run

### Requirement: Atomic promotion across records and sources
Promotion SHALL update `data/civic/records.json` and `data/civic/sources.json` atomically: either both files reflect the accepted state or both remain unchanged. Promotion SHALL validate the complete proposed in-memory state (record fields, source-instance fields, cross-references, history preservation) before writing anything.

#### Scenario: Promotion failure leaves both files untouched
- **WHEN** an error is forced during promotion (after loading, before or between writes)
- **THEN** `records.json` and `sources.json` are byte-identical to before the attempt, and a subsequent validation run reports the pre-existing state

#### Scenario: History preserves superseded evidence
- **WHEN** a changed candidate supported by source B is promoted over a record referencing source A
- **THEN** the current record references source B while its history entry preserves source A

### Requirement: Canonical diff scope model
The diff SHALL determine its scope from the actual refresh manifest as the union of explicitly requested domains (`parameters.domains[]`), the registered domains of attempted sources (resolved through the source registry), and candidate domains. A canonical record in scope whose supporting source was attempted and failed SHALL be reported `SOURCE_UNAVAILABLE` even with zero candidates; an in-scope record whose source succeeded but produced no covering candidate SHALL be reported `MISSING`. Out-of-scope records SHALL be left untouched (no entry).

#### Scenario: Failed domain refresh with zero candidates still reports
- **WHEN** a `--domain=government` refresh attempts a government source that is unavailable and yields no candidates
- **THEN** the affected government records are reported `SOURCE_UNAVAILABLE`, not silently omitted

#### Scenario: Successful but uncovered record is missing, not deleted
- **WHEN** a scoped refresh succeeds yet emits no candidate for an existing in-scope record
- **THEN** the diff reports `MISSING` with a coverage-gap action, and canonical data is unchanged

#### Scenario: Out-of-scope records are untouched
- **WHEN** a run covers only the news domain
- **THEN** government records produce no diff entries at all

### Requirement: Success-based refresh cadence with retry
Only successful collection outcomes (`collected`, `unchanged`) SHALL satisfy a source's normal refresh cadence. `failed`, `unavailable`, `skipped`, and `unregistered` outcomes SHALL NOT advance the source's due date; failed sources retry sooner per a fixed policy (at most weekly for slow cadences) without creating excessive traffic. A failed fetch SHALL NEVER update `lastVerified`, `acceptedAt`, or `nextReviewOn` on dependent canonical records.

#### Scenario: Failed monthly source retries instead of waiting a month
- **WHEN** a monthly-cadence source fails today
- **THEN** it remains eligible at the next scheduled refresh (per the retry policy), not only after a full month

#### Scenario: Skipped sources do not satisfy cadence
- **WHEN** a source is skipped (no collector, offline without evidence, unregistered)
- **THEN** the skip is recorded but does not count as a check for due-date purposes

### Requirement: Shared cadence-window policy
A single shared cadence policy SHALL define each cadence's maximum review window, and promotion SHALL compute `nextReviewOn` with the same policy that validation enforces: `daily` 1 day, `weekly` 7, `monthly` 31, `quarterly` 92, `annually` 366, `per-term` 1461, `event-driven` 366; `per-document` and `manual` are not time-based and SHALL keep `nextReviewOn` equal to `acceptedAt` (sentinel meaning "no scheduled review; see cadence"). A published record whose window is exceeded SHALL fail validation.

#### Scenario: Stretched review date fails
- **WHEN** a quarterly record carries `acceptedAt: 2026-09-15` and `nextReviewOn: 2099-01-01`
- **THEN** validation fails naming the record and the exceeded window

#### Scenario: Promotion and validation agree
- **WHEN** promotion computes `nextReviewOn` for any cadence
- **THEN** the result always satisfies the validation window for that cadence

### Requirement: Centralized high-risk classification
A single shared policy SHALL decide high-risk status from record tier, domain, and type; no caller SHALL duplicate the rule. An existing high-risk record SHALL NEVER become medium or low merely because a candidate omitted risk information, and a new fact in a high-impact category SHALL require independent review. The same collector identity SHALL NOT self-verify high-risk candidates.

#### Scenario: Omitted risk cannot downgrade
- **WHEN** a candidate for a high-risk canonical record carries no risk information
- **THEN** the promoted record stays high-risk

#### Scenario: Same-identity high-risk promotion fails, independent succeeds
- **WHEN** a high-risk candidate collected by agent-a is promoted with reviewer agent-a
- **THEN** promotion is refused; with reviewer agent-b (all else valid) it proceeds

### Requirement: Explicit non-scheduled freshness semantics
Records with `manual`, `per-document`, or `event-driven` cadence SHALL NOT use far-future `nextReviewOn` dates to pretend a scheduled review exists. Non-time-based cadences (`manual`, `per-document`) SHALL use the `nextReviewOn == acceptedAt` sentinel; `event-driven` SHALL carry a real deadline within its window. The data-health report SHALL distinguish scheduled, event-driven, manual, and document-triggered review classes instead of a single stale list.

#### Scenario: Per-document record passes without a fake horizon
- **WHEN** a legitimate `per-document` record uses the sentinel with no future review date
- **THEN** validation passes and the report lists it under document-triggered review, not as stale and not as verified-forever

## MODIFIED Requirements

### Requirement: Candidate diff workflow
A refresh SHALL produce candidate records and compare them against currently accepted canonical records, yielding per-record outcomes: `UNCHANGED`, `NEW`, `CHANGED`, `MISSING` (canonical record not covered by any candidate), `STALE`, `CONFLICT` (candidates or sources disagree), `SOURCE_UNAVAILABLE` (source could not be reached/parse failed), and `SOURCE_CHANGED` (source location/format changed). Diff scope SHALL be derived from the actual refresh manifest (requested domains, attempted-source registry domains, candidate domains) per the canonical scope model, so failed or empty refreshes still surface affected records. The diff SHALL generate a human-readable review report showing, per record, the old accepted value, the candidate value, the supporting sources, the outcome, and the required action.

#### Scenario: No meaningful change
- **WHEN** candidates match current canonical values for a domain
- **THEN** the outcome is `UNCHANGED` and no production record is rewritten merely to refresh timestamps

#### Scenario: Changed value detected
- **WHEN** a current authoritative source names a different department head
- **THEN** the diff outcome for that record is `CHANGED`, a candidate is produced with evidence, and the old accepted record remains canonical until review

#### Scenario: Source unavailable
- **WHEN** a source returns a server error or cannot be fetched
- **THEN** the affected records' outcome is `SOURCE_UNAVAILABLE`, existing canonical data is not deleted, and no review deadline is extended

#### Scenario: Conflicting evidence fails closed
- **WHEN** two authoritative-looking sources disagree about a fact
- **THEN** the outcome is `CONFLICT`, the candidate is blocked from automatic promotion, and the conflict is documented for human review

#### Scenario: Zero-candidate failed refresh still reports scope
- **WHEN** a domain-scoped refresh fails with no candidates at all
- **THEN** in-scope records whose sources were attempted appear as `SOURCE_UNAVAILABLE` rather than vanishing from the report

### Requirement: Independent review and promotion
Acceptance of candidates into canonical data SHALL be performed by a reviewer (maintainer or agent explicitly acting in the reviewer role, distinct from the collecting agent) via a promotion command that records reviewer-owned fields (`acceptedBy`, `acceptedAt`) and updates verification status and `lastVerified`. High-risk status SHALL be decided by the centralized risk policy (record tier, domain, type) with no-downgrade semantics, never by ad-hoc per-command rules. Promotion SHALL be an explicit, reviewable action producing record history and SHALL update canonical records and `sources.json` atomically. High-risk data categories (emergency contacts, health contacts, elected officials, service fees/requirements, ordinances/resolutions, budgets, procurement/project status) SHALL require independent review before canonical change; automated promotion is allowed only for explicitly defined low-risk categories (e.g. news-feed items from the official page) with documented justification.

#### Scenario: Promotion records the reviewer
- **WHEN** a reviewer accepts a changed candidate
- **THEN** the canonical record's new revision carries `acceptedBy` and `acceptedAt` set by the promotion command, plus the candidate's evidence provenance

#### Scenario: High-risk change without review
- **WHEN** a high-risk record's candidate is promoted by the same automated process that collected it, without independent review
- **THEN** the promotion is refused

#### Scenario: Superseded evidence preserved
- **WHEN** new evidence replaces an outdated source for a record
- **THEN** the previous source reference and record revision remain in history rather than being erased

### Requirement: Research runs capture refresh evidence
Each refresh SHALL be recorded as a research run under `research/runs/<run-date>/` containing a manifest (sources checked, start/end, parameters including the canonical `sources`/`domains` scope filters), retrieved evidence, produced candidates, a source-instance candidate file linking each civic candidate to its exact evidence, found conflicts, and human-readable findings. Runs SHALL answer: when each source was checked, what changed, what failed, what evidence was retrieved, which candidates/conflicts were produced, and what was accepted or rejected. Existing topic-organized research directories SHALL remain in place and unmodified by pipeline automation.

#### Scenario: Run manifest answers audit questions
- **WHEN** a maintainer inspects a completed research run
- **THEN** the run records which sources were checked and when, each source's outcome, which candidates were produced, and which conflicts were found

#### Scenario: Existing research is preserved
- **WHEN** any pipeline command runs
- **THEN** existing topic-organized files under `research/` (outside `research/runs/`) are never modified or deleted

#### Scenario: Run links candidates to exact evidence
- **WHEN** a maintainer opens a run's source-instance file
- **THEN** each civic candidate ID maps to the evidence bytes, hash, retrieval time, and registry entry that produced it

### Requirement: Source-specific collectors
Data collection SHALL use source-specific collectors (one per registered source family) plus shared format parsers, rather than a single universal scraper. Collectors SHALL emit source-instance candidates (exact evidence metadata with stable IDs) alongside civic-record candidates referencing them, and SHALL be deterministic where practical (stable output for the same input evidence). AI-assisted interpretation SHALL produce candidates with `provisional` status subject to the same review gates. Collectors SHALL tolerate source unavailability without corrupting existing data.

#### Scenario: Deterministic collection from evidence
- **WHEN** a collector runs twice against the same saved evidence
- **THEN** it produces equivalent candidate output

#### Scenario: AI-assisted extraction is marked provisional
- **WHEN** an AI-assisted interpretation produces a candidate
- **THEN** the candidate's status is `provisional` and requires independent review before promotion

### Requirement: Civic data validation command
The repository SHALL provide `bun run data:validate` which validates repository state deterministically, without network access: unique record IDs; valid status values from the closed vocabulary; canonical `sourceIds` resolve to exact `sources.json` entries (bare registry IDs are rejected for canonical records, while remaining valid in research-run candidates); source instances chain to a known registry entry; claim-source references point to fields that exist; dates are valid and not in an impossible order; every record's `nextReviewOn` falls within its cadence's maximum window (non-time-based cadences require the `nextReviewOn == acceptedAt` sentinel); published changing records are not past `nextReviewOn`; evidence hashes match; no machine-local absolute paths or secrets exist in civic data; no duplicate civic records; and published records do not depend on blocked or non-publishable evidence. Validation failure SHALL exit non-zero with record-identifying errors.

#### Scenario: Validation catches a broken reference
- **WHEN** a record references a source ID absent from the registry
- **THEN** `data:validate` fails, naming the record and the missing source ID

#### Scenario: Validation is offline and deterministic
- **WHEN** `data:validate` runs twice on unchanged repository state
- **THEN** it produces the same result and performs no network requests

#### Scenario: Registry-only canonical provenance fails
- **WHEN** a canonical record cites a registry ID with no corresponding `sources.json` entry
- **THEN** validation fails naming the record, even though the registry ID itself is known

#### Scenario: Stretched review window fails
- **WHEN** a quarterly record's `nextReviewOn` exceeds its cadence window from `acceptedAt`
- **THEN** validation fails naming the record and the exceeded window

### Requirement: Refresh command surface
The repository SHALL provide developer commands: `data:refresh` (collect due/selected sources into a research run), `data:diff` (diff candidates against canonical records and emit a review report), `data:validate`, `data:generate` (produce compatibility JSON from canonical records), `data:report` (summarize data health: staleness, conflicts, source coverage), and `verify` (typecheck + build + data validation). Refresh SHALL accept source or domain filters (e.g. `--source`, `--domain`) and SHALL record them in the manifest under the canonical `sources`/`domains` scope contract. Only successful outcomes (`collected`, `unchanged`) SHALL satisfy a source's normal cadence; failures SHALL retry sooner per policy and skipped or unregistered sources SHALL never count as checks.

#### Scenario: Filtered refresh
- **WHEN** `bun run data:refresh -- --source=psa` runs
- **THEN** only the registered PSA-related sources are collected into a new research run

#### Scenario: Verify includes data validation
- **WHEN** `bun run verify` runs
- **THEN** it performs typecheck, production build prerequisites, and civic-data validation, and fails if any step fails

#### Scenario: Failed attempt does not satisfy cadence
- **WHEN** a monthly source fails and the next scheduled refresh runs days later
- **THEN** the source is eligible again per the retry policy instead of waiting out the month

### Requirement: Failure behavior is conservative
Pipeline failures SHALL be conservative: a failed or unreachable source SHALL mark records `SOURCE_UNAVAILABLE` without deleting or degrading existing canonical data; a parse failure SHALL be recorded in the run manifest as a failure, not silently skipped; an interrupted run SHALL leave canonical data and compatibility outputs untouched; a promotion that cannot complete SHALL leave both `records.json` and `sources.json` unchanged (validated as a transaction before any write); and no pipeline step SHALL silently resolve a conflict.

#### Scenario: Interrupted run is safe
- **WHEN** a refresh run is interrupted before completing
- **THEN** canonical records and compatibility JSON remain in their pre-run state

#### Scenario: Parse failure is visible
- **WHEN** a source responds but its content cannot be parsed as expected
- **THEN** the run manifest records the failure and affected records are marked `SOURCE_CHANGED` or `SOURCE_UNAVAILABLE` rather than treated as empty

#### Scenario: Partial promotion is impossible
- **WHEN** promotion fails after preparing a record update but before completing the sources update
- **THEN** both files remain in their pre-promotion state
