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
A refresh SHALL produce candidate records and compare them against currently accepted canonical records, yielding per-record outcomes: `UNCHANGED`, `NEW`, `CHANGED`, `MISSING` (canonical record not covered by any candidate), `STALE`, `CONFLICT` (candidates or sources disagree), `SOURCE_UNAVAILABLE` (source could not be reached/parse failed), and `SOURCE_CHANGED` (source location/format changed). The diff SHALL generate a human-readable review report showing, per record, the old accepted value, the candidate value, the supporting sources, the outcome, and the required action.

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

### Requirement: Independent review and promotion
Acceptance of candidates into canonical data SHALL be performed by a reviewer (maintainer or agent explicitly acting in the reviewer role, distinct from the collecting agent) via a promotion command that records reviewer-owned fields (`acceptedBy`, `acceptedAt`) and updates verification status and `lastVerified`. Promotion SHALL be an explicit, reviewable action producing record history. High-risk data categories (emergency contacts, health contacts, elected officials, service fees/requirements, ordinances/resolutions, budgets, procurement/project status) SHALL require independent review before canonical change; automated promotion is allowed only for explicitly defined low-risk categories (e.g. news-feed items from the official page) with documented justification.

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
Each refresh SHALL be recorded as a research run under `research/runs/<run-date>/` containing a manifest (sources checked, start/end, parameters), retrieved evidence, produced candidates, found conflicts, and human-readable findings. Runs SHALL answer: when each source was checked, what changed, what failed, what evidence was retrieved, which candidates/conflicts were produced, and what was accepted or rejected. Existing topic-organized research directories SHALL remain in place and unmodified by pipeline automation.

#### Scenario: Run manifest answers audit questions
- **WHEN** a maintainer inspects a completed research run
- **THEN** the run records which sources were checked and when, each source's outcome, which candidates were produced, and which conflicts were found

#### Scenario: Existing research is preserved
- **WHEN** any pipeline command runs
- **THEN** existing topic-organized files under `research/` (outside `research/runs/`) are never modified or deleted

### Requirement: Source-specific collectors
Data collection SHALL use source-specific collectors (one per registered source family) plus shared format parsers, rather than a single universal scraper. Collectors SHALL be deterministic where practical (stable output for the same input evidence), and AI-assisted interpretation SHALL produce candidates with `provisional` status subject to the same review gates. Collectors SHALL tolerate source unavailability without corrupting existing data.

#### Scenario: Deterministic collection from evidence
- **WHEN** a collector runs twice against the same saved evidence
- **THEN** it produces equivalent candidate output

#### Scenario: AI-assisted extraction is marked provisional
- **WHEN** an AI-assisted interpretation produces a candidate
- **THEN** the candidate's status is `provisional` and requires independent review before promotion

### Requirement: Civic data validation command
The repository SHALL provide `bun run data:validate` which validates repository state deterministically, without network access: unique record IDs; valid status values from the closed vocabulary; source references resolve to the source registry; claim-source references point to fields that exist; dates are valid and not in an impossible order; published changing records are not past `nextReviewOn`; `updateCadence` is consistent with `nextReviewOn`; evidence hashes match; no machine-local absolute paths or secrets exist in civic data; no duplicate civic records; and published records do not depend on blocked or non-publishable evidence. Validation failure SHALL exit non-zero with record-identifying errors.

#### Scenario: Validation catches a broken reference
- **WHEN** a record references a source ID absent from the registry
- **THEN** `data:validate` fails, naming the record and the missing source ID

#### Scenario: Validation is offline and deterministic
- **WHEN** `data:validate` runs twice on unchanged repository state
- **THEN** it produces the same result and performs no network requests

### Requirement: Refresh command surface
The repository SHALL provide developer commands: `data:refresh` (collect due/selected sources into a new research run), `data:diff` (diff candidates against canonical records and emit a review report), `data:validate`, `data:generate` (produce compatibility JSON from canonical records), `data:report` (summarize data health: staleness, conflicts, source coverage), and `verify` (typecheck + build + data validation). Refresh SHALL accept source or domain filters (e.g. `--source`, `--domain`).

#### Scenario: Filtered refresh
- **WHEN** `bun run data:refresh -- --source=psa` runs
- **THEN** only the registered PSA-related sources are collected into a new research run

#### Scenario: Verify includes data validation
- **WHEN** `bun run verify` runs
- **THEN** it performs typecheck, production build prerequisites, and civic-data validation, and fails if any step fails

### Requirement: Failure behavior is conservative
Pipeline failures SHALL be conservative: a failed or unreachable source SHALL mark records `SOURCE_UNAVAILABLE` without deleting or degrading existing canonical data; a parse failure SHALL be recorded in the run manifest as a failure, not silently skipped; an interrupted run SHALL leave canonical data and compatibility outputs untouched; and no pipeline step SHALL silently resolve a conflict.

#### Scenario: Interrupted run is safe
- **WHEN** a refresh run is interrupted before completing
- **THEN** canonical records and compatibility JSON remain in their pre-run state

#### Scenario: Parse failure is visible
- **WHEN** a source responds but its content cannot be parsed as expected
- **THEN** the run manifest records the failure and affected records are marked `SOURCE_CHANGED` or `SOURCE_UNAVAILABLE` rather than treated as empty

### Requirement: Security and privacy constraints
Civic data and research runs SHALL NOT contain credentials, tokens, private keys, or machine-local absolute paths. Downloaded evidence SHALL be stored only where legally and technically appropriate (public documents; no private personal data beyond publicly published official contact information). Collection SHALL use polite fetching (identifiable user agent, conservative rate limits, retry with backoff).

#### Scenario: Secret scan
- **WHEN** validation scans civic data and research-run files
- **THEN** no access tokens or credentials are present

#### Scenario: Personal data minimized
- **WHEN** evidence contains non-public personal data
- **THEN** it is not stored; only publicly published official information is retained

### Requirement: Agent refresh runbook
The repository SHALL include a documented runbook (AGENTS.md or data-pipeline documentation) that lets an AI agent with no prior conversation history execute a refresh correctly: which commands to run, in what order, what a research run must contain, what must never be overwritten, and how to promote accepted records.

#### Scenario: Fresh agent can refresh
- **WHEN** a new agent reads the repository instructions and source registry
- **THEN** it can run a due-source refresh, produce a research run with candidates and a diff report, and stop before promotion without rediscovering the workflow

### Requirement: Scheduled refresh opens a PR and never auto-publishes
A scheduled refresh workflow (GitHub Actions, added in a later phase) SHALL: refresh due sources, produce a research run and diff report, and open or update a pull request containing the run artifacts and any proposed canonical changes. It SHALL NOT auto-merge, auto-publish, or bypass review gates, and it SHALL NOT be required for ordinary frontend builds.

#### Scenario: Scheduled refresh produces a reviewable PR
- **WHEN** the scheduled refresh completes with changes found
- **THEN** a PR exists containing the research run and proposed changes, and no civic fact has changed on `main` without review

#### Scenario: No network in ordinary builds
- **WHEN** an ordinary CI build runs
- **THEN** no scraping or network-dependent civic refresh executes
