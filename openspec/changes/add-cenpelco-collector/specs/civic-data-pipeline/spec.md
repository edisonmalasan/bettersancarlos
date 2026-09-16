## ADDED Requirements

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
