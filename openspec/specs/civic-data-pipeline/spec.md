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
The repository SHALL provide developer commands: `data:refresh` (collect due/selected sources into a research run), `data:diff` (diff candidates against canonical records and emit a review report), `data:validate`, `data:generate` (produce compatibility JSON from canonical records), `data:report` (summarize data health: staleness, conflicts, source coverage), and `verify` (typecheck + build + data validation). Refresh SHALL accept source or domain filters (e.g. `--source`, `--domain`) and SHALL record them in the manifest under the canonical `sources`/`domains` scope contract. Acquisition SHALL be routed per source: HTTP(S) sources through the shared polite fetcher, API-backed sources through their dedicated acquisition path under the same run contract. Only successful outcomes (`collected`, `unchanged`) SHALL satisfy a source's normal cadence; failures SHALL retry sooner per policy and skipped or unregistered sources SHALL never count as checks.

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
