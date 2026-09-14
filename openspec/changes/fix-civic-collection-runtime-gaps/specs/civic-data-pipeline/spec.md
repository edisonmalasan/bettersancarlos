## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Candidate diff workflow
A refresh SHALL produce candidate records and compare them against currently accepted canonical records, yielding per-record outcomes: `UNCHANGED`, `NEW`, `CHANGED`, `MISSING` (a covered canonical record with no candidate despite successful collection and parsing), `STALE`, `CONFLICT` (candidates or sources disagree), `SOURCE_UNAVAILABLE` (source could not be reached/parse failed), and `SOURCE_CHANGED` (source location/format changed). MISSING SHALL fire only for records in a collector's declared fact coverage; records merely sharing a registry domain SHALL be excluded from fact-level comparison. A canonical record in scope whose supporting source was attempted and failed SHALL still be reported `SOURCE_UNAVAILABLE` even with zero candidates, resolved through canonical provenance (exact source → registry) or declared collector coverage — never requiring the collector to run. The diff SHALL generate a human-readable review report showing, per record, the old accepted value, the candidate value, the supporting sources, the outcome, and the required action.

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

### Requirement: Research runs capture refresh evidence
Each refresh SHALL be recorded as a research run under `research/runs/<run-date>/` containing a manifest (sources checked, start/end, parameters including the canonical `sources`/`domains` scope filters), retrieved evidence, produced candidates, a source-instance candidate file linking each civic candidate to its exact evidence, per-source fact-coverage metadata, found conflicts, and human-readable findings. Runs SHALL answer: when each source was checked, what changed, what failed, what evidence was retrieved, which candidates/conflicts were produced, which canonical fact IDs each collector attempted, and what was accepted or rejected. Existing topic-organized research directories SHALL remain in place and unmodified by pipeline automation.

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

### Requirement: Independent review and promotion
Acceptance of candidates into canonical data SHALL be performed by a reviewer (maintainer or agent explicitly acting in the reviewer role, distinct from the collecting agent) via a promotion command that records reviewer-owned fields (`acceptedBy`, `acceptedAt`) and updates verification status and `lastVerified`. High-risk status SHALL be decided by the centralized risk policy (record tier, domain, type) with no-downgrade semantics, never by ad-hoc per-command rules. Promotion SHALL be an explicit, reviewable action producing record history and SHALL update canonical records and `sources.json` atomically, with rollback/recovery on failure. High-risk data categories (emergency contacts, health contacts, elected officials, service fees/requirements, ordinances/resolutions, budgets, procurement/project status) SHALL require independent review before canonical change; automated promotion is allowed only for explicitly defined low-risk categories (e.g. news-feed items from the official page) with documented justification.

#### Scenario: Promotion records the reviewer
- **WHEN** a reviewer accepts a changed candidate
- **THEN** the canonical record's new revision carries `acceptedBy` and `acceptedAt` set by the promotion command, plus the candidate's evidence provenance

#### Scenario: High-risk change without review
- **WHEN** a high-risk record's candidate is promoted by the same automated process that collected it, without independent review
- **THEN** the promotion is refused

#### Scenario: Superseded evidence preserved
- **WHEN** new evidence replaces an outdated source for a record
- **THEN** the previous source reference and record revision remain in history rather than being erased

### Requirement: Scheduled refresh opens a PR and never auto-publishes
A scheduled refresh workflow (GitHub Actions) SHALL start from the latest `main` implementation while preserving pending `research/runs/` history from the open refresh branch, SHALL refresh due sources, produce a research run and diff report, and open or update a single pull request containing the run artifacts and any proposed canonical changes. Run IDs SHALL remain collision-free across both histories (`YYYY-MM-DD`, `-2`, `-3`, …). It SHALL NOT auto-merge, auto-publish, or bypass review gates, and it SHALL NOT be required for ordinary frontend builds.

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
