## ADDED Requirements

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
