# civic-data-pipeline Specification

## Purpose

Governs the end-to-end civic-data refresh pipeline: how evidence is collected from authoritative public sources into research runs, how candidate records are diffed against canonical civic records, how independent review promotes accepted facts, and how validation enforces provenance, freshness, and publication safety — so that changing LGU information can be refreshed repeatedly without blindly overwriting verified production data.

## Requirements

### Requirement: Research collection never mutates canonical data
A refresh run (agent, script, or scheduled job) SHALL collect evidence and produce candidate records only. It SHALL NOT directly modify canonical civic records, compatibility `data/*.json` outputs, or any file consumed by the frontend. Writing to canonical data SHALL be possible only through the promotion workflow after independent acceptance.

#### Scenario: Refresh leaves production data untouched
- **WHEN** a refresh run completes against sources whose data has changed
- **THEN** canonical records and compatibility `data/*.json` files are byte-identical to before the run, and only a research run directory (evidence, candidates, diff report) was added

#### Scenario: Research agent cannot self-verify
- **WHEN** the collecting agent attempts to set a candidate's verification status to independently verified, or set reviewer-owned acceptance fields
- **THEN** the attempt is rejected by validation, and reviewer-owned fields (`acceptedBy`, `acceptedAt`) remain absent on unaccepted candidates

### Requirement: Canonical civic records with stable IDs
Changing civic facts SHALL be stored as canonical records under `data/civic/` with a stable record ID independent of the record's current value (e.g. `city-mayor-current`, `cdrmo-emergency-contact`, `population-latest-census`). Each record SHALL carry its own provenance (source references), verification status, freshness metadata, and content. A fact change SHALL produce a new revision of the record while the record ID and its historical provenance remain stable.

#### Scenario: Value changes but ID persists
- **WHEN** the accepted city engineer record's value changes from one person to another
- **THEN** the canonical record `city-engineer-current` still exists with the new value, and the previous value remains retrievable as record history

#### Scenario: No duplicate records for the same fact
- **WHEN** canonical records are validated
- **THEN** no two published records claim the same civic fact ID, and every record ID is unique

### Requirement: Machine-readable source registry
Known civic sources SHALL be described in a machine-readable source registry at `data/civic/source-registry.yaml`, where each source has a stable source ID, publisher, URL or discovery strategy, source type, collector assignment, refresh cadence, risk tier where applicable, and notes on access limitations. Source definitions SHALL only include URLs and sources that are already documented in the research corpus; the registry SHALL NOT contain invented URLs. Collectors SHALL NOT run sources that the registry does not define.

#### Scenario: Registry entry drives a collector
- **WHEN** a refresh targets a registered source
- **THEN** the collector uses the registry entry's URL/discovery strategy and cadence, and the produced evidence references the registry's source ID

#### Scenario: Unregistered source is refused
- **WHEN** a refresh is asked to collect from a source with no registry entry
- **THEN** the refresh reports the source as unregistered and collects nothing from it

#### Scenario: Registry sources are real
- **WHEN** the source registry is validated
- **THEN** every registry entry resolves to a source documented in `research/` (or evidence of direct access), and no entry contains a fabricated URL

### Requirement: Record-level provenance and claim traceability
Canonical records SHALL reference their supporting sources by stable source ID, and SHALL be able to trace individual displayed claims to the specific source that supports them when a record combines multiple sources. Source metadata SHALL preserve retrieval/verification dates, verifier, document type, published/effective period where known, content hash for downloaded evidence where appropriate, and evidence path where legally stored.

#### Scenario: Claim traceable to source
- **WHEN** a record's displayed value is inspected
- **THEN** it can be traced to at least one specific source record with retrieval date and document type, including per-claim source mapping for multi-source records

#### Scenario: Evidence hash integrity
- **WHEN** a source record declares a SHA-256 hash for stored evidence
- **THEN** validation recomputes the hash of the evidence file and fails on mismatch

### Requirement: Controlled verification status vocabulary
Civic records SHALL use a controlled status vocabulary: `provisional` (collected but not independently confirmed), `verified` (independently confirmed against authoritative evidence), `reported` (published as reported by a source but not independently confirmed, and labeled as such), `needs-reverification` (previously verified but past its review date or flagged), `blocked` (conflicting or insufficient evidence; SHALL NOT be presented as unquestionably current), and `retired` (no longer current; excluded from new publication). The vocabulary SHALL be closed — validation rejects unknown status values.

#### Scenario: Unknown status rejected
- **WHEN** a record carries a status outside the vocabulary
- **THEN** validation fails with an error identifying the record

#### Scenario: Blocked data is not presented as current
- **WHEN** a high-impact record has status `blocked` or `needs-reverification`
- **THEN** the site does not present it as unquestionably current fact

### Requirement: Per-record freshness and review cadence
Each changing civic record SHALL carry its own freshness metadata: `lastVerified`, `nextReviewOn`, and `updateCadence` from a supported cadence set (at minimum: `daily`, `weekly`, `monthly`, `quarterly`, `annually`, `per-term`, `per-document`, `manual`, `event-driven`). File-wide timestamps SHALL NOT be the only freshness signal. A record past `nextReviewOn` without an accepted reverification SHALL be flagged by validation as requiring reverification.

#### Scenario: Stale record detected
- **WHEN** validation runs on a record whose `nextReviewOn` is in the past
- **THEN** validation reports the record as stale and requiring reverification

#### Scenario: Source failure does not extend deadlines
- **WHEN** a refresh cannot reach a source
- **THEN** dependent records' `nextReviewOn` and `lastVerified` are unchanged

### Requirement: Candidate diff workflow
A refresh SHALL produce candidate records and compare them against currently accepted canonical records, yielding per-record outcomes: `UNCHANGED`, `NEW`, `CHANGED`, `MISSING` (a covered canonical record with no candidate despite successful collection and parsing), `STALE`, `CONFLICT` (candidates or sources disagree), `SOURCE_UNAVAILABLE` (source could not be reached/parse failed), and `SOURCE_CHANGED` (source location/format changed). MISSING SHALL fire only for records in a collector's declared fact coverage; records merely sharing a registry domain SHALL be excluded from fact-level comparison, while dynamically discovered IDs still surface as NEW. A canonical record in scope whose supporting source was attempted and failed SHALL still be reported `SOURCE_UNAVAILABLE` even with zero candidates, resolved through canonical provenance (exact source → registry) or declared collector coverage — never requiring the collector to run. The diff SHALL generate a human-readable review report showing, per record, the old accepted value, the candidate value, the supporting sources, the outcome, and the required action.

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

#### Scenario: Narrow coverage suppresses false missing
- **WHEN** a collector covering one record succeeds on a multi-domain source
- **THEN** uncovered records in those domains produce no MISSING entries

#### Scenario: Parse failure is scoped to covered records
- **WHEN** a source is fetched but its format changed so parsing fails
- **THEN** only appropriately covered or dependent records are marked `SOURCE_CHANGED`, not the whole registry domain

### Requirement: Independent review and promotion
Acceptance of candidates into canonical data SHALL be performed by a reviewer (maintainer or agent explicitly acting in the reviewer role, distinct from the collecting agent) via a promotion command that records reviewer-owned fields (`acceptedBy`, `acceptedAt`) and updates verification status and `lastVerified`. High-risk status SHALL be decided by the centralized risk policy (record tier, domain, type) with no-downgrade semantics, never by ad-hoc per-command rules. Promotion SHALL be an explicit, reviewable action producing record history and SHALL update canonical records and `sources.json` atomically, with rollback/recovery on failure that validation can detect. High-risk data categories (emergency contacts, health contacts, elected officials, service fees/requirements, ordinances/resolutions, budgets, procurement/project status) SHALL require independent review before canonical change; automated promotion is allowed only for explicitly defined low-risk categories (e.g. news-feed items from the official page) with documented justification.

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
Each refresh SHALL be recorded as a research run under `research/runs/<run-date>/` containing a manifest (sources checked, start/end, parameters including the canonical `sources`/`domains` scope filters, per-source fact coverage), retrieved evidence, produced candidates, a source-instance candidate file linking each civic candidate to its exact evidence, found conflicts, and human-readable findings. Runs SHALL answer: when each source was checked, what changed, what failed, what evidence was retrieved, which candidates/conflicts were produced, which canonical fact IDs each collector attempted, and what was accepted or rejected. Existing topic-organized research directories SHALL remain in place and unmodified by pipeline automation.

#### Scenario: Run manifest answers audit questions
- **WHEN** a maintainer inspects a completed research run
- **THEN** the run records which sources were checked and when, each source's outcome, which candidates were produced, and which conflicts were found

#### Scenario: Existing research is preserved
- **WHEN** any pipeline command runs
- **THEN** existing topic-organized files under `research/` (outside `research/runs/`) are never modified or deleted

#### Scenario: Run links candidates to exact evidence
- **WHEN** a maintainer opens a run's source-instance file
- **THEN** each civic candidate ID maps to the evidence bytes, hash, retrieval time, and registry entry that produced it

#### Scenario: Run answers what was attempted
- **WHEN** a maintainer asks which canonical facts a collector attempted in a run
- **THEN** the run's coverage metadata names the exact record IDs, separate from the run's domain filters

### Requirement: Source-specific collectors
Data collection SHALL use source-specific collectors (one per registered source family) plus shared format parsers, rather than a single universal scraper. Collectors SHALL emit source-instance candidates (exact evidence metadata with stable IDs) alongside civic-record candidates referencing them, SHALL declare the existing canonical record IDs they attempted (fact-level coverage), and SHALL be deterministic where practical (stable output for the same input evidence). AI-assisted interpretation SHALL produce candidates with `provisional` status subject to the same review gates. Collectors SHALL tolerate source unavailability without corrupting existing data.

#### Scenario: Deterministic collection from evidence
- **WHEN** a collector runs twice against the same saved evidence
- **THEN** it produces equivalent candidate output

#### Scenario: AI-assisted extraction is marked provisional
- **WHEN** an AI-assisted interpretation produces a candidate
- **THEN** the candidate's status is `provisional` and requires independent review before promotion

#### Scenario: Coverage declaration is explicit
- **WHEN** a collector finishes a successful run
- **THEN** the run records exactly which canonical IDs were attempted, so the diff can distinguish truly missing facts from unattempted ones

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
The repository SHALL provide developer commands: `data:refresh` (collect due/selected sources into a research run), `data:diff` (diff candidates against canonical records and emit a review report), `data:validate`, `data:generate` (produce compatibility JSON from canonical records), `data:report` (summarize data health: staleness, conflicts, source coverage), and `verify` (typecheck + build + data validation). Refresh SHALL accept source or domain filters (e.g. `--source`, `--domain`) and SHALL record them in the manifest under the canonical `sources`/`domains` scope contract. Acquisition SHALL be routed per source: HTTP(S) sources through the shared polite fetcher, API-backed sources through their dedicated acquisition path under the same run contract. Only successful outcomes (`collected`, `unchanged`) SHALL satisfy a source's normal cadence; failures SHALL retry sooner per policy and skipped or unregistered sources SHALL never count as checks. Sources with non-time-based cadences (`manual`, `per-document`) SHALL NOT be eligible for `--due` scheduled collection regardless of elapsed time; they SHALL be collected only when explicitly requested via `--source`, `--domain`, or their dedicated manual path.

#### Scenario: Filtered refresh
- **WHEN** `bun run data:refresh -- --source=psa` runs
- **THEN** only the registered PSA-related sources are collected into a new research run

#### Scenario: Verify includes data validation
- **WHEN** `bun run verify` runs
- **THEN** it performs typecheck, production build prerequisites, and civic-data validation, and fails if any step fails

#### Scenario: Failed attempt does not satisfy cadence
- **WHEN** a monthly source fails and the next scheduled refresh runs days later
- **THEN** the source is eligible again per the retry policy instead of waiting out the month

#### Scenario: API source uses its acquisition path
- **WHEN** a refresh includes an API-backed source with valid credentials
- **THEN** acquisition uses that source's dedicated path (Graph JSON for Facebook), not the generic page fetcher

#### Scenario: Manual source excluded from due refresh
- **WHEN** `bun run data:refresh -- --due` runs after arbitrary elapsed time
- **THEN** no `manual`-cadence source is selected solely because time has elapsed, while due time-based sources with collectors are still selected normally

#### Scenario: Manual source runs on explicit request
- **WHEN** `bun run data:refresh -- --source=lgu-facebook-cio` runs (or its dedicated manual ingest path)
- **THEN** the manual-cadence source is collected through its registered acquisition and collector, producing evidence, source instances, and provisional candidates under the same run contract

### Requirement: Failure behavior is conservative
Pipeline failures SHALL be conservative: a failed or unreachable source SHALL mark records `SOURCE_UNAVAILABLE` without deleting or degrading existing canonical data; a parse failure SHALL be recorded in the run manifest as a failure, not silently skipped; an interrupted run SHALL leave canonical data and compatibility outputs untouched; a promotion that cannot complete SHALL leave both `records.json` and `sources.json` unchanged (validated as a transaction before any write, committed and rolled back as a pair); an interrupted promotion transaction SHALL be detected or recovered by the next validate/promote run rather than silently accepted; and no pipeline step SHALL silently resolve a conflict.

#### Scenario: Interrupted run is safe
- **WHEN** a refresh run is interrupted before completing
- **THEN** canonical records and compatibility JSON remain in their pre-run state

#### Scenario: Parse failure is visible
- **WHEN** a source responds but its content cannot be parsed as expected
- **THEN** the run manifest records the failure and affected records are marked `SOURCE_CHANGED` or `SOURCE_UNAVAILABLE` rather than treated as empty

#### Scenario: Partial promotion is impossible
- **WHEN** promotion fails after preparing a record update but before completing the sources update
- **THEN** both files remain in their pre-promotion state

#### Scenario: Torn pair is detected on next run
- **WHEN** a crash leaves the two canonical files inconsistent
- **THEN** the next validation or promotion run reports the torn state instead of treating the partial files as current

### Requirement: Security and privacy constraints
Civic data and research runs SHALL NOT contain credentials, tokens, private keys, or machine-local absolute paths. Access tokens SHALL NOT appear in evidence files, manifests, candidates, source instances, committed files, or routine logs; acquisition layers SHALL pass credentials only in memory (request headers) and redact them from errors. Downloaded evidence SHALL be stored only where legally and technically appropriate (public documents; no private personal data beyond publicly published official contact information). Collection SHALL use polite fetching (identifiable user agent, conservative rate limits, retry with backoff).

#### Scenario: Secret scan
- **WHEN** validation scans civic data and research-run files
- **THEN** no access tokens or credentials are present

#### Scenario: Personal data minimized
- **WHEN** evidence contains non-public personal data
- **THEN** it is not stored; only publicly published official information is retained

#### Scenario: Token never persists
- **WHEN** an API-backed acquisition runs with a configured token
- **THEN** no artifact, manifest, finding, or log produced by the run contains the token value

### Requirement: Agent refresh runbook
The repository SHALL include a documented runbook (AGENTS.md or data-pipeline documentation) that lets an AI agent with no prior conversation history execute a refresh correctly: which commands to run, in what order, what a research run must contain, what must never be overwritten, and how to promote accepted records.

#### Scenario: Fresh agent can refresh
- **WHEN** a new agent reads the repository instructions and source registry
- **THEN** it can run a due-source refresh, produce a research run with candidates and a diff report, and stop before promotion without rediscovering the workflow

### Requirement: Scheduled refresh opens a PR and never auto-publishes
A scheduled refresh workflow (GitHub Actions) SHALL start from the latest `main` implementation while preserving pending `research/runs/` history from the open refresh branch, SHALL refresh due sources, produce a research run and diff report, and open or update a single pull request containing the run artifacts and any proposed canonical changes. Run IDs SHALL remain collision-free across both histories. It SHALL NOT auto-merge, auto-publish, or bypass review gates, and it SHALL NOT be required for ordinary frontend builds.

#### Scenario: Scheduled refresh produces a reviewable PR
- **WHEN** the scheduled refresh completes with changes found
- **THEN** a PR exists containing the research run and proposed changes, and no civic fact has changed on `main` without review

#### Scenario: No network in ordinary builds
- **WHEN** an ordinary CI build runs
- **THEN** no scraping or network-dependent civic refresh executes

#### Scenario: Pending history counts for cadence
- **WHEN** a source was successfully collected in a run existing only on the open refresh branch
- **THEN** the next scheduled execution treats it as checked per the retry/cadence policy instead of re-collecting merely because `main` lacks that run

#### Scenario: One review PR across runs
- **WHEN** scheduled runs complete while a previous refresh PR is still open
- **THEN** new artifacts update that same PR rather than opening additional ones

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

### Requirement: Explicit collector fact coverage
Each collector SHALL declare the exact existing canonical record IDs it attempted to extract during a run (fact-level coverage), recorded in the research run. Registry domains SHALL describe broad subject relevance only and SHALL NOT imply extraction coverage.

#### Scenario: Narrow coverage excludes unrelated records
- **WHEN** a collector covering only `city-hall-trunk-line` succeeds on a source whose registry domains span government, emergency, and transparency
- **THEN** unrelated government/emergency/transparency records produce no MISSING entries

#### Scenario: Genuinely missing covered record
- **WHEN** a collector declares coverage of record X, the source is fetched and parsed successfully, but no candidate for X is emitted
- **THEN** X is reported MISSING

#### Scenario: Dynamically discovered records need no pre-listing
- **WHEN** a collector emits a candidate for a previously unknown record ID
- **THEN** the outcome is NEW even though the ID was in no coverage list

#### Scenario: Multi-collector domains stay independent
- **WHEN** source A covers record A and source B covers record B in the same domain, and only source A runs successfully
- **THEN** record B is not reported MISSING

### Requirement: Source-specific acquisition routing
Each registry source SHALL be acquired through the mechanism matching its evidence type: normal HTTP(S) sources through the shared polite text fetcher, and API-backed sources (starting with the Facebook Graph API) through their dedicated acquisition path reusing the same research-run/candidate/instance contract. A generic page fetch SHALL NOT be fed into a collector expecting a different evidence format. Access tokens and credentials SHALL NOT appear in evidence files, manifests, candidates, source instances, committed files, or routine logs.

#### Scenario: Facebook evidence is Graph JSON, never page HTML
- **WHEN** the Facebook source is collected with valid credentials
- **THEN** the stored evidence is the Graph API JSON response and the collector receives that envelope, not webpage HTML

#### Scenario: Missing credentials stay dormant without breaking the run
- **WHEN** Facebook credentials are absent
- **THEN** the Facebook source is skipped or dormant with an explicit manifest/log note, canonical data is untouched, and other sources still refresh normally

#### Scenario: Auth failure is loud and token-free
- **WHEN** the Graph API rejects expired or invalid credentials
- **THEN** the failure is visible (failed outcome, no silent skip), canonical data is untouched, and no token material is stored or logged

### Requirement: Transactional promotion persistence
Promotion SHALL persist `records.json` and `sources.json` as one transaction: stage both replacements, commit them together, and roll back to the complete previous pair if any commit step fails, leaving no stale temp/journal artifacts after success. If a crash leaves a recognizable interrupted-transaction artifact, the next `data:promote` or `data:validate` run SHALL detect it and either recover deterministically or fail loudly naming the torn state — never silently accept a half-written pair.

#### Scenario: Forced failure between replacements recovers
- **WHEN** a failure is forced after the first canonical file is replaced but before the second
- **THEN** recovery restores both original files and a subsequent validation reports the pre-existing state

#### Scenario: Interrupted transaction is detected
- **WHEN** a previous promotion was interrupted leaving transaction artifacts
- **THEN** the next validate or promote run reports the interrupted transaction instead of treating partial files as current

### Requirement: Scheduled runs see pending branch history
Scheduled due-calculation SHALL consider successful and failed checks recorded in research runs on the open scheduled-refresh branch, not only runs merged to `main`. The workflow SHALL execute the latest `main` implementation while preserving pending `research/runs/` history, keep a single review branch/PR across runs, and preserve collision-free run IDs (`YYYY-MM-DD`, `-2`, `-3`, …) across both histories.

#### Scenario: Pending success suppresses re-collection
- **WHEN** a quarterly source was successfully collected in a run that exists only on the open refresh branch
- **THEN** the next scheduled execution does not treat it as due merely because `main` lacks that run

#### Scenario: Latest main code wins
- **WHEN** `main` received newer pipeline code after the refresh branch was created
- **THEN** the scheduled run executes the new code while retaining prior pending research artifacts

### Requirement: PSA-via-PhilAtlas source has a deterministic demographics collector
The registered `psa-census-philatlas` source SHALL have a collector that extracts only the deliberately scoped demographic facts from acquired PhilAtlas page evidence and emits them as candidates through the existing research-run contract. The collector SHALL be deterministic: the same evidence bytes plus the same run metadata SHALL always produce the same parsed facts and candidates. The collector SHALL NOT perform network requests; acquisition and parsing remain separate stages.

#### Scenario: Same evidence yields same candidates
- **WHEN** the collector runs twice against the same saved PhilAtlas evidence with the same run metadata
- **THEN** both runs produce equivalent candidates, source instances, and coverage

#### Scenario: Explicit refresh collects PSA evidence
- **WHEN** `bun run data:refresh -- --source=psa-census-philatlas` runs with the source reachable
- **THEN** a normal research run is created with stored evidence, source instances, provisional candidates, and declared fact coverage, and canonical data is byte-identical

### Requirement: PSA provenance identifies the exact PSA-via-PhilAtlas evidence instance
Every candidate emitted from PhilAtlas evidence SHALL reference the exact generated source-instance IDs and the registered `psa-census-philatlas` source ID per the existing candidate contract. The source instance SHALL capture registry identity, evidence path/name, evidence content hash, run ID, collector identity, document type, source title, and source URL where available. Provenance SHALL identify the evidence as PSA data via PhilAtlas and SHALL NOT imply a direct PSA website or API response.

#### Scenario: Candidate links resolve to exact evidence
- **WHEN** a maintainer inspects a PSA run's candidates and source-instance file
- **THEN** every candidate's source-instance links resolve to a collected instance whose registry link is `psa-census-philatlas`, whose hash matches the stored evidence bytes, and whose publisher/title identifies PSA via PhilAtlas

#### Scenario: PhilAtlas is never presented as a direct PSA endpoint
- **WHEN** PSA-via-PhilAtlas candidates, instances, or registry metadata are inspected
- **THEN** no field claims the evidence was downloaded directly from a PSA website or API

### Requirement: PSA demographic collection emits provisional candidates only
Every demographic candidate produced from PhilAtlas evidence SHALL carry status `provisional` and SHALL NOT set reviewer-owned acceptance fields. The source's authoritative-secondary standing SHALL NOT confer automatic verification. Promotion SHALL follow the existing independent-review path; no auto-promotion or trusted-source bypass SHALL exist for this source.

#### Scenario: Collected demographics stay provisional
- **WHEN** the PSA collector emits candidates for covered demographic records
- **THEN** every candidate has status `provisional`, carries no `acceptedBy`/`acceptedAt`, and requires review before any canonical change

### Requirement: PSA fact coverage is explicit at canonical-record granularity
The PSA collector SHALL declare the exact existing canonical record IDs it attempted to extract (fact-level coverage), containing ONLY record IDs the collector explicitly and reliably attempts from this exact evidence. Registry domain membership (`demographics`, `barangays`) SHALL NOT imply coverage. Any canonical demographics or barangay record outside the declared coverage SHALL NOT produce `MISSING` entries when this collector runs.

#### Scenario: Uncovered records produce no false missing
- **WHEN** the PSA collector succeeds and an unrelated demographics or barangay canonical record has no candidate in the run
- **THEN** the diff produces no `MISSING` entry for that unrelated record

#### Scenario: Covered-but-absent record is reported missing
- **WHEN** the collector declares coverage of a record, the source is fetched and parsed successfully, but no candidate for that record is emitted
- **THEN** the diff reports `MISSING` for that record without modifying canonical data

### Requirement: PhilAtlas parse and layout drift fails closed
If a required source section's structure changes so the parser cannot establish that it parsed the section correctly (required table headers disappear, rows are structurally malformed, the jurisdiction marker is missing or ambiguous, or a materially different page is returned), the collector SHALL fail that parse with a `parse:`-prefixed error so the pipeline classifies it as `SOURCE_CHANGED` per existing semantics. The collector SHALL NOT emit a partial composite candidate, SHALL NOT claim `MISSING` for a parse failure, and SHALL NOT silently coerce malformed numeric values.

#### Scenario: Renamed table header becomes source-changed
- **WHEN** acquired PhilAtlas evidence is missing a required table header the collector depends on
- **THEN** collection fails with a `parse:` error, the diff reports `SOURCE_CHANGED` for covered records, and no malformed candidate is emitted

#### Scenario: Malformed population value is rejected, not coerced
- **WHEN** a covered population or household value in the evidence cannot be parsed as a valid number after deterministic normalization
- **THEN** collection fails with a `parse:` error instead of emitting a coerced value

### Requirement: Collector rejects wrong-jurisdiction evidence
Before emitting any candidate, the collector SHALL positively verify that the evidence identifies San Carlos City, Pangasinan. Evidence clearly for another locality (including San Carlos City, Negros Occidental) or without sufficient Pangasinan identity SHALL produce a `parse:` failure and no candidates.

#### Scenario: Wrong-city evidence is rejected
- **WHEN** the evidence identifies San Carlos City, Negros Occidental
- **THEN** the collector emits no candidates and fails with a `parse:` error

#### Scenario: Ambiguous jurisdiction produces no candidates
- **WHEN** the evidence lacks sufficient markers to confirm San Carlos City, Pangasinan
- **THEN** the collector emits no candidates and fails with a `parse:` error

### Requirement: Composite demographic datasets are emitted only after structural integrity checks
Before emitting a composite candidate (census history, households, barangay populations), the collector SHALL verify the structural completeness of the relevant section: unique census dates/years, parseable numeric values, no duplicate barangay identities, no blank required names, known table headers, and aggregate consistency where the source supplies a total. The collector SHALL NOT hardcode current values (such as today's totals or a fixed barangay count) as parser validity rules; legitimate future source changes SHALL surface as `CHANGED` candidates, not rejections. Barangay name matching SHALL be deterministic and non-fuzzy: only safe presentation differences (surrounding whitespace, Unicode normalization, equivalent punctuation/casing) are normalized, qualifiers such as `(Poblacion)` are preserved, and duplicate or ambiguous barangay identities fail closed.

#### Scenario: Incomplete barangay table yields no partial candidate
- **WHEN** the barangay table is structurally incomplete (missing rows, duplicate identities, or blank required names)
- **THEN** no barangay-populations candidate is emitted and collection fails with a `parse:` error

#### Scenario: Legitimate new census value is a change, not a rejection
- **WHEN** the source publishes a valid new census value differing from today's canonical fact
- **THEN** the collector emits it as a candidate so the diff reports `CHANGED`, rather than rejecting it for differing from a hardcoded expectation

### Requirement: Year-specific population records keep their semantics
The collector SHALL treat `population-total-2020` as the year-specific 2020 fact: it SHALL collect the 2020 value exactly and SHALL NOT overwrite its semantic meaning with a newer census year's population. A genuinely new census year observed in a structurally supported composite (census history) MAY surface through normal `CHANGED` review; the collector SHALL NOT invent new canonical record IDs, and unmapped new observations belong in collector notes.

#### Scenario: Newer census year does not repurpose the 2020 record
- **WHEN** the evidence contains a census year newer than 2020 alongside the 2020 figures
- **THEN** the `population-total-2020` candidate still carries the 2020 value, and no candidate redefines that record ID as a different year

### Requirement: Per-document PSA source remains explicit-trigger collection
The `psa-census-philatlas` source SHALL keep `per-document` cadence semantics: it SHALL be collected only on explicit request (source or domain filter) and SHALL NOT become eligible for `--due` scheduled collection. The scheduled refresh workflow SHALL NOT be modified to force this source into `--due` runs. No census-release monitoring or watcher behavior is part of this capability.

#### Scenario: Due refresh excludes the PSA source
- **WHEN** `bun run data:refresh -- --due` runs after arbitrary elapsed time
- **THEN** `psa-census-philatlas` is not selected solely because time has elapsed, while due time-based sources are still selected normally

### Requirement: PSA collection never directly mutates canonical or compatibility data
Collection, diffing, and candidate generation for this source SHALL write only under `research/runs/` through the existing refresh pipeline. The collector SHALL NEVER directly write `data/civic/records.json`, `data/civic/sources.json`, or any generated compatibility output (including demographics mirrors). Canonical updates remain exclusively via `data:promote`; compatibility generation remains exclusively via `data:generate`.

#### Scenario: Refresh leaves canonical and generated files untouched
- **WHEN** a PSA refresh and diff complete against changed source values
- **THEN** `data/civic/records.json`, `data/civic/sources.json`, and all generated compatibility JSON files are byte-identical to before the run

### Requirement: CENPELCO source has a deterministic public-web collector
The registered `cenpelco` source SHALL have a collector that extracts only the deliberately scoped public facts (provider presence, area-office list) from acquired CENPELCO homepage evidence and emits them as candidates through the existing research-run contract. The collector SHALL be deterministic: the same evidence bytes plus the same run metadata SHALL always produce the same parsed facts and candidates. The collector SHALL NOT perform network requests; acquisition and parsing remain separate stages. One registry source SHALL produce one bounded evidence blob (the homepage shell); the collector SHALL NOT crawl linked subpages.

#### Scenario: Same evidence yields same candidates
- **WHEN** the collector runs twice against the same saved CENPELCO evidence with the same run metadata
- **THEN** both runs produce equivalent candidates, source instances, and coverage

#### Scenario: Explicit refresh collects CENPELCO evidence
- **WHEN** `bun run data:refresh -- --source=cenpelco` runs with the source reachable
- **THEN** a normal research run is created with stored evidence, source instances, provisional candidates, and declared fact coverage, and canonical data is byte-identical

### Requirement: CENPELCO evidence has exact source-instance provenance
Every candidate emitted from CENPELCO evidence SHALL reference the exact generated source-instance IDs and the registered `cenpelco` source ID per the existing candidate contract. The source instance SHALL capture registry identity, evidence path/name, evidence content hash, run ID, collector identity, document type, source title, and source URL where available.

#### Scenario: Candidate links resolve to exact evidence
- **WHEN** a maintainer inspects a CENPELCO run's candidates and source-instance file
- **THEN** every candidate's source-instance links resolve to a collected instance whose registry link is `cenpelco` and whose hash matches the stored evidence bytes

### Requirement: CENPELCO collection emits provisional candidates only
Every CENPELCO candidate SHALL carry status `provisional` and SHALL NOT set reviewer-owned acceptance fields. CENPELCO being the official utility website SHALL mean good evidence, never automatic acceptance. Promotion SHALL follow the existing independent-review path; no auto-promotion or trusted-source bypass SHALL exist for this source.

#### Scenario: Collected utility facts stay provisional
- **WHEN** the CENPELCO collector emits candidates for covered utility records
- **THEN** every candidate has status `provisional`, carries no `acceptedBy`/`acceptedAt`, and requires review before any canonical change

### Requirement: CENPELCO fact coverage is explicit
The CENPELCO collector SHALL declare the exact canonical record IDs it attempted to extract (fact-level coverage), containing ONLY record IDs the collector explicitly and reliably attempts from this exact evidence. Registry domain membership (`utilities`) SHALL NOT imply coverage. Facts the public page does not publish (customer hotline, email, street addresses, office hours, General Manager identity, branch direct phones) SHALL have no candidates and SHALL NOT appear in coverage, so their absence SHALL NOT produce `MISSING` entries.

#### Scenario: Unpublished contacts produce nothing
- **WHEN** the CENPELCO collector succeeds while the page publishes no customer hotline
- **THEN** no hotline candidate exists, no hotline ID appears in coverage, and the diff produces no `MISSING` entry for it

#### Scenario: Uncovered utility records stay silent
- **WHEN** the CENPELCO collector succeeds and an unrelated utilities canonical record (water, telecom, cable, sewage) has no candidate in the run
- **THEN** the diff produces no `MISSING` entry for that unrelated record

### Requirement: CENPELCO branch extraction fails closed on layout drift
If the office-gallery structure changes so the parser cannot establish that it parsed the list correctly (gallery anchor or heading missing, office rows structurally malformed, duplicate office identities, or ambiguous locality context), the collector SHALL fail with a `parse:`-prefixed error so the pipeline classifies it as `SOURCE_CHANGED` per existing semantics. The collector SHALL NOT emit a partial office list, SHALL NOT claim `MISSING` for a parse failure, and SHALL NOT match municipalities fuzzily. Navigation, news, footer, and unrelated municipality mentions SHALL never become office records.

#### Scenario: Missing gallery section becomes source-changed
- **WHEN** acquired CENPELCO evidence lacks the office-gallery anchor the collector depends on
- **THEN** collection fails with a `parse:` error, the diff reports `SOURCE_CHANGED` for covered records, and no partial candidate is emitted

#### Scenario: Duplicate office identity fails closed
- **WHEN** the evidence presents the same office identity twice (including through responsive/mobile markup duplication)
- **THEN** collection fails with a `parse:` error instead of emitting duplicated entries

### Requirement: San Carlos Main office is positively identified
Before emitting any San Carlos candidate, the collector SHALL positively verify the exact `San Carlos City (Main)` office entry in CENPELCO page context identifying the cooperative serving Pangasinan. A bare `San Carlos` without sufficient page/source context, or evidence where the `(Main)` qualifier is absent or ambiguous, SHALL produce a `parse:` failure and no San Carlos candidate.

#### Scenario: Main qualifier present yields presence fact
- **WHEN** the evidence contains the exact `San Carlos City (Main)` office entry on the CENPELCO site
- **THEN** the collector emits the San Carlos presence fact with that verbatim office name

#### Scenario: Ambiguous San Carlos yields nothing
- **WHEN** the evidence mentions San Carlos without sufficient CENPELCO locality context, or the `(Main)` qualifier cannot be established
- **THEN** the collector emits no San Carlos candidate and fails with a `parse:` error

### Requirement: Branch-list ordering is normalized before comparison
Office ordering on the website SHALL be treated as presentation order, not semantic content: the collector SHALL emit the office list in a deterministic normalized order (sorted by stable office identifier) so harmless HTML reordering alone SHALL NOT produce a `CHANGED` diff. Each office SHALL carry a deterministic stable identifier derived from its gallery link slug, and official office names SHALL be preserved verbatim (no rewriting, no abbreviation guessing).

#### Scenario: Reordered gallery stays unchanged
- **WHEN** a later fetch presents the same offices in a different HTML order with identical names and slugs
- **THEN** the emitted candidate data is identical and the diff reports `UNCHANGED`

#### Scenario: Added office is a change
- **WHEN** a later fetch adds, removes, or renames an office after complete structural parsing
- **THEN** the diff reports `CHANGED` for the office-list record

### Requirement: Quarterly due refresh collects CENPELCO research automatically
The `cenpelco` source SHALL keep `quarterly` cadence semantics under the existing shared cadence policy: `bun run data:refresh -- --due` MAY select it once its quarterly window is due, producing provisional candidates and a research review artifact through the normal pipeline. Failed or unavailable collection SHALL NOT satisfy the quarterly cadence; retry follows the existing shared retry policy. Scheduled collection SHALL remain research-only and SHALL STOP before canonical promotion; scheduled review PRs SHALL never auto-promote.

#### Scenario: Due quarterly source is collected on schedule
- **WHEN** `bun run data:refresh -- --due` runs with the CENPELCO quarterly window elapsed since its last successful check
- **THEN** the source is collected into a research run with provisional candidates, and canonical data is byte-identical

#### Scenario: Failed collection does not satisfy cadence
- **WHEN** a CENPELCO collection fails or the source is unavailable
- **THEN** the failure is recorded, no review deadline advances, and the source retries per policy instead of waiting out the quarter

### Requirement: Utility compatibility output stays manual unless explicitly canonicalized
Collection, diffing, and candidate generation for this source SHALL NOT directly modify `data/utilities.json` or its mirrors. Compatibility generation for utilities remains manual until a separately scoped migration defines it; this change SHALL NOT create a hybrid where generated and hand-edited content overwrite each other.

#### Scenario: Refresh leaves utilities compatibility files untouched
- **WHEN** a CENPELCO refresh and diff complete against changed source values
- **THEN** `data/utilities.json` and its `src/data/` and `public/data/` mirrors are byte-identical to before the run

### Requirement: Province profile has a bounded deterministic collector
The registered `province-pangasinan` source SHALL have a collector bounded to the single registered San Carlos City profile page. It SHALL verify jurisdiction, validate the expected profile structure, record scoped observations in run notes, and emit an exact source instance through the existing research-run contract. The collector SHALL be deterministic: the same evidence bytes plus the same run metadata SHALL always produce the same output. The collector SHALL NOT perform network requests, SHALL NOT crawl linked pages (including `/issuances/` and attached PDFs), and SHALL NOT require browser automation, authentication, or access-control bypass.

#### Scenario: Same evidence yields same output
- **WHEN** the collector runs twice against the same saved Province evidence with the same run metadata
- **THEN** both runs produce equivalent instances, notes, and coverage

#### Scenario: Explicit refresh collects Province evidence
- **WHEN** `bun run data:refresh -- --source=province-pangasinan` runs with the source reachable
- **THEN** a normal research run is created with stored evidence, a source instance, and declared fact coverage, and canonical data is byte-identical

### Requirement: Collector positively verifies San Carlos City, Pangasinan jurisdiction
Before producing any output beyond a parse failure, the collector SHALL positively verify page identity as San Carlos City, Pangasinan, Philippines (page H1, breadcrumb, title, and Pangasinan markers — never the host alone). Evidence for another city or municipality, a generic Province page without San Carlos identity, ambiguous `San Carlos` content, or San Carlos City, Negros Occidental SHALL produce a `parse:` failure with no candidates and no observations.

#### Scenario: Profile page verifies
- **WHEN** the evidence is the Province San Carlos City profile with H1, breadcrumb, title, and Pangasinan markers intact
- **THEN** the collector proceeds to structural validation

#### Scenario: Wrong-city evidence is rejected
- **WHEN** the evidence identifies another city, lacks San Carlos identity, or concerns San Carlos City, Negros Occidental
- **THEN** the collector emits nothing and fails with a `parse:` error

### Requirement: Province collection emits provisional output only
Any candidate the Province collector emits SHALL carry status `provisional` and SHALL NOT set reviewer-owned acceptance fields. Provincial-government authorship SHALL mean good evidence, never automatic acceptance. Promotion SHALL follow the existing independent-review path; no auto-promotion or trusted-source bypass SHALL exist for this source.

#### Scenario: No verified output from collection
- **WHEN** a Province refresh completes
- **THEN** every emitted candidate (if any) has status `provisional` with no `acceptedBy`/`acceptedAt`, and canonical data is byte-identical

### Requirement: Exact source-instance provenance is retained
Every acquired Province snapshot SHALL produce an exact source instance via the existing mechanism, preserving registry ID, source URL, evidence name/path, evidence hash, run ID, collector identity, document type, title, and source state. New snapshots SHALL become new instances with their own retrieval identity; existing manually seeded Province instances (including `src-province-geo`) SHALL remain untouched, and canonical history SHALL stay append-only per existing promotion rules.

#### Scenario: New snapshot becomes a new instance
- **WHEN** a Province refresh acquires page bytes differing from the historical seed
- **THEN** the run contains a new source instance (same registry, new hash/date/run) while `src-province-geo` is byte-identical

### Requirement: Fact coverage is explicit at canonical-record granularity
The Province collector SHALL declare exactly the canonical record IDs it reliably attempts; registry domains (`city-profile`, `legislation`) SHALL NOT imply coverage. Current elected officials, tourism content, provincial issuances, and any field outside the deliberately scoped profile observations SHALL have no candidates and SHALL NOT appear in coverage, so their absence SHALL NOT produce `MISSING` entries. Keeping `legislation` on the registry (charter/cityhood context) SHALL NOT broaden coverage to any legislation record.

#### Scenario: Officials produce nothing
- **WHEN** the Province collector succeeds while the page carries an Officials section
- **THEN** no official-related candidate exists, no government ID appears in coverage, and the diff produces no `MISSING` entry for any official

#### Scenario: Out-of-scope content stays silent
- **WHEN** the collector succeeds and tourism, issuance, or unrelated records have no candidate in the run
- **THEN** the diff produces no `MISSING` entry for those records

### Requirement: Composite canonical records are never partially overwritten
The collector SHALL NOT emit a partial replacement object for a composite canonical record where promotion's whole-record replacement would drop unrelated canonical fields. Profile facts that map only partially into composites (classification, barangay count, district, cityhood sentence, distances, nicknames) SHALL be observed in run notes at most, never as candidates and never in coverage, unless a separately scoped change restructures the record.

#### Scenario: Partial mapping stays out of candidates
- **WHEN** the evidence publishes a classification the canonical admin composite also holds alongside unmapped fields (postal code, area code)
- **THEN** no candidate for that composite exists and the canonical record is byte-identical

### Requirement: Duplicate PSA-owned facts are excluded from coverage
The collector SHALL NOT watch census facts owned by the dedicated PSA/PhilAtlas collector even when the Province page repeats them. The observed Province population figure SHALL be recorded in run notes as corroborating presence at most, never as a candidate and never in coverage, so duplicate collection noise and provenance dilution cannot occur.

#### Scenario: Repeated census figure creates no duplicate
- **WHEN** the Province page publishes the same 2020 census total the PSA collector owns
- **THEN** no population candidate is emitted, coverage contains no population ID, and existing PSA provenance is untouched

### Requirement: Province land-area disagreement never silently replaces canonical land area
The observed Province land-area value (currently 17,087 hectares) SHALL be reported verbatim with units in run notes as a preserved conflict observation against the canonical PSA-backed value. It SHALL NOT become a candidate, SHALL NOT enter coverage, and SHALL NOT resolve the documented conflict. Existing conflict documentation SHALL remain authoritative until independently reconciled; no new conflict machinery SHALL be built for this source.

#### Scenario: Conflict observation without replacement
- **WHEN** evidence contains the Province hectare figure disagreeing with the canonical km² fact
- **THEN** the run notes carry the verbatim observation, no land-area candidate exists, and canonical data is byte-identical

### Requirement: Province profile layout drift fails closed
If the expected profile structure changes so the parser cannot establish correct parsing (profile heading, jurisdiction markers, or required profile labels absent; expected sentences unlocatable; a materially different page returned), the collector SHALL fail with a `parse:`-prefixed error so the pipeline classifies it as `SOURCE_CHANGED` per existing semantics. The collector SHALL NOT emit empty or default observations. Changes confined to the Officials section SHALL NOT affect profile parsing or output when the profile structure itself is intact, because parsing is bounded to the profile structures.

#### Scenario: Missing profile structure becomes source-changed
- **WHEN** acquired evidence lacks the profile anchors the collector depends on
- **THEN** collection fails with a `parse:` error, covered records (if any) report `SOURCE_CHANGED`, and no malformed output is emitted

#### Scenario: Officials-only change is invisible
- **WHEN** a later fetch changes only Officials-section content with the profile structure intact
- **THEN** the collector output is identical to the previous run

### Requirement: Annual due collection remains research-only and never auto-promotes
The `province-pangasinan` source SHALL keep `annual` cadence semantics under the existing shared cadence policy: `bun run data:refresh -- --due` MAY select it once its annual window is due, producing evidence, an exact instance, and a research review artifact through the normal pipeline. Failed or unavailable collection SHALL NOT satisfy the annual cadence; retry follows the existing shared retry policy. Scheduled collection SHALL STOP before canonical promotion; scheduled review PRs SHALL never auto-promote.

#### Scenario: Due annual source is collected on schedule
- **WHEN** `bun run data:refresh -- --due` runs with the Province annual window elapsed since its last successful check
- **THEN** the source is collected into a research run, and canonical and generated compatibility files are byte-identical

#### Scenario: Failed collection does not satisfy cadence
- **WHEN** a Province collection fails or the source is unavailable
- **THEN** the failure is recorded, no review deadline advances, and the source retries per policy instead of waiting out the year

### Requirement: Health facilities are canonical records with stable IDs
Manually verified health-facility evidence SHALL be stored as canonical civic records under `data/civic/` in the `health` domain, one record per facility with a stable kebab-case ID independent of display-name variants (existing ID conventions take precedence where they already cover a facility). Each record SHALL carry only fields directly supported by authoritative evidence: facility name, address, level/type, accredited bed count, accreditation expiry, and published contact details where verified.

#### Scenario: Six PhilHealth facilities are represented
- **WHEN** the promoted canonical records are inspected
- **THEN** each of the six PhilHealth-evidenced facilities (Pangasinan Provincial Hospital, Virgen Milagrosa Medical Center, Pangasinan Doctors Hospital, Blessed Family Doctors General Hospital, Elguira General Hospital, Christ-Bearer Infirmary) maps to exactly one stable canonical record with its verified accreditation fields

#### Scenario: Similar names are not merged without authority
- **WHEN** two facility names look similar (e.g. Pangasinan Doctors Hospital vs Elguira General Hospital on Rizal Avenue, or evacuation-plan vs PhilHealth name variants)
- **THEN** they remain separate canonical records unless authoritative evidence establishes they are the same facility

### Requirement: PhilHealth accreditation is never stored as DOH licensure
No canonical health record SHALL contain a DOH license number, LTO status, or DOH license expiry unless actual DOH evidence supports it. Unknown DOH licensing fields SHALL remain absent from the record (not null placeholders, unless a schema intentionally requires null).

#### Scenario: Accreditation fields carry no license meaning
- **WHEN** a health-facility record with PhilHealth accreditation evidence is validated
- **THEN** it contains no `dohLicenseNumber`, LTO status, or license-expiry claim, and validation rejects any record labeling accreditation as licensure

#### Scenario: Unknown license stays unknown
- **WHEN** no DOH evidence exists for a facility
- **THEN** the record exposes no license value at all rather than an inferred or placeholder value

### Requirement: SCCWD provider identity is a canonical record with historical contacts quarantined
The verified water-provider identity (San Carlos City Water District: official entity name, LWUA Conditional Certificate of Conformance July 28, 1977 / Sangguniang Panlungsod Resolution No. 42 establishment context, verified official site, and service-area facts only where verified) SHALL be stored as canonical `utilities`-domain records. Address, telephone, leadership, and service-area figures known only from 2017-vintage sources SHALL be marked historical (or omitted where the model requires it) and SHALL NOT be stored as current facts.

#### Scenario: Provider identity is canonical and current-only
- **WHEN** the water-provider records are inspected
- **THEN** the official name, establishment context, and verified site are present as current facts, and every 2017-vintage contact/leadership value is either absent or explicitly marked historical with its vintage

#### Scenario: PrimeWater role stays explicitly unresolved
- **WHEN** the water-provider records describe the 2014 PrimeWater joint venture
- **THEN** they record only what official evidence supports and explicitly mark day-to-day operator status as unresolved, never claiming PrimeWater is the current operator

### Requirement: DPWH evidence maps into the existing model with no invented fields
PR #105 DPWH project observations SHALL be integrated through the existing canonical DPWH records (`dpwh-projects-summary` and companions). Project-level records SHALL be added only where the existing model represents them cleanly; otherwise the change SHALL make the minimum schema/model extension required and no more. Every project field (title, location, amount, status, implementing office, contractor, dates, project ID) SHALL be present only where authoritative evidence directly supports it; missing project IDs, contractors, and dates remain missing.

#### Scenario: Narrative observations without IDs do not become registry entries
- **WHEN** a DPWH observation has location, office, amount, and status narrative but no stable project ID
- **THEN** it is stored without a project ID (never a synthesized one) and the DPWH output does not present the inventory as a complete project registry

#### Scenario: Tender numbers are not project IDs
- **WHEN** the only identifier for an observation is a procurement tender string (e.g. 26Aj0046-style numbers)
- **THEN** it is stored as procurement context, never as the project-status ID

### Requirement: Province budget documents are canonical document records, never SRE data
Verified Province of Pangasinan budget-review/appropriation documents SHALL be stored as canonical `transparency`-domain document records carrying document metadata only (title, year, issuing authority, document type, official URL, publication/approval date, jurisdiction, verified source provenance). They SHALL NOT populate BLGF Statement of Receipts and Expenditures fields, and the FY2017–FY2025 SRE gap SHALL remain `blocked`.

#### Scenario: Appropriation totals do not fill the SRE series
- **WHEN** the fiscal records are inspected after integration
- **THEN** Province appropriation figures appear only on document records while the SRE income/expenditure series still ends at FY2016 with the FY2017–FY2025 gap documented as blocked

#### Scenario: No budget number is modeled beyond the canonical contract
- **WHEN** a Province document contains appropriation/AIP/NTA/20%/LDRRMF figures
- **THEN** per-figure modeling occurs only where the existing canonical model explicitly requires it; otherwise the document record carries metadata and provenance, not parsed budget lines

### Requirement: Integration uses exact provenance and the reviewer promotion path
Every new canonical record SHALL reference exact `sources.json` source instances (record → `sources.json` → registry), with correct domain, risk tier, and temporal meaning preserving the verified/partial/blocked distinctions from research. Records SHALL enter canonical data only through the existing reviewer promotion/import mechanism (reviewer-owned acceptance fields, atomic `records.json` + `sources.json` transaction); direct hand-edits to `data/civic/` or generated JSON SHALL NOT occur.

#### Scenario: Research Markdown is not provenance
- **WHEN** a record cites only a research Markdown path without an exact source instance
- **THEN** validation fails naming the record until an exact instance is imported through the pipeline-compatible staging path

#### Scenario: Promotion is atomic and reviewed
- **WHEN** the new records are promoted
- **THEN** `records.json` and `sources.json` commit as one transaction with reviewer identity recorded, and high-risk records are never self-accepted

### Requirement: Blocked and manual sources gain no automation
This change SHALL NOT add collectors for FDPP, COA, BLGF, DPWH, DOH/HFSRB, or LWUA; SHALL NOT change collector dispatch for these sources; and SHALL NOT change their registry `collector: null` assignments. FDPP, COA, BLGF, DOH/HFSRB, LWUA directory, and DPWH portal access remain manual/blocked, and the drafted agency inquiries (BLGF RO1 SRE, COA RO-I AARs, DOH-HFSRB licenses, City Engineering/BAC records) are not sent by this change.

#### Scenario: Registry stays manual for difficult sources
- **WHEN** the source registry is inspected after this change
- **THEN** `dilg-fdpp`, `coa-audit`, `blgf`, `dpwh-projects`, `doh-hfsrb`, and `lwua` still declare `collector: null` and no corresponding collector module exists

#### Scenario: Blocked gaps stay documented
- **WHEN** the BLGF SRE gap, COA audit-report gap, DOH license gap, and DPWH structured-registry gap are inspected
- **THEN** each remains documented as blocked/manual with its follow-up inquiry noted, and none is presented as resolved
