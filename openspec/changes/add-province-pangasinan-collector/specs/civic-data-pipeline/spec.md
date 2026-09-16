## ADDED Requirements

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
