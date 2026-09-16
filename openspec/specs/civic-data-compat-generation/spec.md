# civic-data-compat-generation Specification

## Purpose

Defines how canonical civic records are transformed into the existing `data/*.json` frontend formats (and their `src/data/` and `public/data/` mirrors) so the current Next.js frontend keeps working unchanged during migration, and how generator scripts stop being independent factual sources of truth.

## Requirements

### Requirement: Compatibility JSON generated from canonical records
For migrated domains, the existing `data/*.json` files (e.g. `officials.json`, `emergency-hotlines.json`) SHALL be generated outputs of `bun run data:generate`, transformed from canonical civic records rather than hand-edited or script-hardcoded facts. Generation SHALL preserve each output file's existing shape (field names, nesting) so current frontend imports and runtime fetches continue to work without modification.

#### Scenario: Generated file is drop-in compatible
- **WHEN** `data:generate` regenerates a migrated compatibility file
- **THEN** the file keeps its existing schema and field names, and the pages importing it render identically for unchanged facts

#### Scenario: Canonical remains the single source of truth
- **WHEN** a civic fact needs changing in a migrated domain
- **THEN** the change is made by promoting a canonical record, then regenerating — never by editing the compatibility file directly

### Requirement: Existing metadata conventions preserved in outputs
Generated compatibility files SHALL retain the existing underscore-metadata conventions where the frontend or tooling relies on them (e.g. `_status`, `_updated`, `_source`), with `_source` values derived from canonical provenance (registry source IDs/titles) rather than free-form strings, and `_updated` reflecting the last accepted canonical revision of the file's domain. High-risk stale records SHALL NOT be emitted as unquestionably current.

#### Scenario: Source field references canonical provenance
- **WHEN** a generated file includes `_source`
- **THEN** it references stable source IDs or their registered titles resolvable via the source registry

#### Scenario: Stale high-risk fact is degraded
- **WHEN** a canonical record for a high-risk domain is `needs-reverification` or `blocked`
- **THEN** the generated output carries a visible status/notice reflecting that state rather than presenting it as verified current fact

### Requirement: Byte-identical mirror invariant
Generated compatibility JSON SHALL continue to satisfy the existing mirror invariant: every `data/*.json` file SHALL be mirrored byte-identical to `public/data/` (and `src/data/` where present), and generation SHALL write all mirrors atomically so runtime fetches and static imports never observe partial or divergent files.

#### Scenario: Mirrors stay identical
- **WHEN** `data:generate` writes updated compatibility files
- **THEN** `data/`, `src/data/` (where the file exists there), and `public/data/` copies are byte-identical

#### Scenario: Generation is atomic
- **WHEN** generation is interrupted
- **THEN** no mirror location contains a partially written JSON file

### Requirement: Generator scripts stop being factual sources
Legacy generator scripts (`scripts/gen-*.ps1`) SHALL be migrated so they no longer embed civic facts; their factual content moves into canonical civic records and any retained generation logic becomes a pure transform of canonical data. Working scripts SHALL NOT be deleted until their replacement responsibility is verified; when a script's output is fully covered by `data:generate`, the script is retired with a note rather than left as a competing source of truth.

#### Scenario: Fact change does not require editing a script
- **WHEN** a civic fact covered by a legacy script changes
- **THEN** the accepted change flows from the canonical record through generation, and no script body contains the old hardcoded fact

#### Scenario: No competing truth during migration
- **WHEN** both a legacy script and `data:generate` can produce the same file
- **THEN** exactly one is the designated producer documented in the migration map, and the other is retired or explicitly disabled

### Requirement: Incremental migration by domain
Compatibility generation SHALL be adopted domain by domain (starting with elected officials and emergency contacts), with an explicit mapping of each `data/*.json` file to its producer state: canonical-generated, legacy-script-generated, or manually maintained. The frontend SHALL NOT be required to change consumption paths during migration.

#### Scenario: Migration map is authoritative
- **WHEN** a contributor needs to know how a given data file is produced
- **THEN** the documented migration map states its producer and current migration state

#### Scenario: Unmigrated files keep working
- **WHEN** a domain has not yet migrated to canonical generation
- **THEN** its existing production path (manual or legacy script) continues to work unchanged

### Requirement: Generation fails loudly on unresolvable source references
Generation SHALL resolve every source label from exact `sources.json` records. A canonical record whose `sourceIds` do not resolve SHALL fail generation with an error naming the record, instead of rendering a raw unresolved ID into a shipped file.

#### Scenario: Dangling source reference stops generation
- **WHEN** `data:generate` encounters a canonical record citing an unknown source ID
- **THEN** it exits non-zero naming the record, and no mirror location is left partially written

### Requirement: health-facilities.json becomes canonical-generated where safe
Where the design determines the migration is safe, `health-facilities.json` SHALL be a generated output of `bun run data:generate`, transformed from the canonical health-facility records rather than hand-edited. Generation SHALL preserve the file's existing shape (field names, nesting) so current frontend imports and runtime fetches continue to work without modification, and the `docs/data-pipeline.md` producer map SHALL list it as canonical-generated with a single designated producer.

#### Scenario: Regenerated file is drop-in compatible
- **WHEN** `data:generate` regenerates `health-facilities.json` from unchanged canonical records
- **THEN** the file keeps its existing schema and field names and pages render identically

#### Scenario: Fact edits flow through canonical promotion
- **WHEN** a health-facility fact needs changing after migration
- **THEN** the change is promoted into the canonical record and regenerated, never hand-edited into the JSON

### Requirement: Water-utility generation migrates only a safe slice and preserves CENPELCO records
If any part of `utilities.json` migrates to canonical generation, only the safely modelable water-provider slice SHALL migrate; existing CENPELCO electricity records and their collector coverage SHALL remain intact with no regression. Where full migration would require unrelated telecom/water/sewage modeling, the remainder SHALL stay on its existing production path and the design SHALL document what was left manual and why. There SHALL never be a hybrid where generated and hand-edited content overwrite each other for the same fields.

#### Scenario: CENPELCO electricity facts are untouched
- **WHEN** generation runs after the water-slice migration
- **THEN** every existing CENPELCO electricity record still validates and its generated or manual output is byte-identical in content to before, except where an independently reviewed promotion changed it

#### Scenario: Unmigrated utility sections keep working
- **WHEN** a utilities domain section has not migrated to canonical generation
- **THEN** its existing production path continues unchanged and generation does not emit or overwrite that section

### Requirement: DPWH generation stays on its existing architecture
`dpwh-projects.json` SHALL remain generated from the existing canonical DPWH records by the existing DPWH emitter. Project-level integration SHALL flow through those records so the current `_status` gap-notice behavior degrades or clears exactly according to canonical record status, with no parallel manual editing path.

#### Scenario: DPWH output reflects canonical status only
- **WHEN** DPWH canonical records are `blocked` with no verified projects
- **THEN** the generated file carries the unverified gap notice and an empty project list rather than narrative-derived placeholder entries

### Requirement: Transparency outputs migrate only with a clear compatibility contract
Transparency or fiscal outputs SHALL migrate to canonical generation only where the repository already defines a clear compatibility contract for that file; otherwise the verified Province documents SHALL live in canonical records without a generated mirror, and no manual JSON file SHALL be force-migrated by this change.

#### Scenario: Document records without a contract have no generated file
- **WHEN** canonical Province document records exist but no transparency-docs compatibility contract is defined
- **THEN** no generated transparency file is produced and existing manual files are byte-identical to before

### Requirement: Newly migrated outputs satisfy the mirror invariant
Every newly migrated compatibility file SHALL be mirrored byte-identical to `public/data/` (and `src/data/` where the file already exists there), written atomically, with `_source` derived from canonical provenance and `_updated` reflecting the last accepted canonical revision of its domain. A record whose `sourceIds` do not resolve SHALL fail generation naming the record.

#### Scenario: Mirrors are byte-identical after migration
- **WHEN** `data:generate` writes a newly migrated file
- **THEN** the `data/`, `public/data/`, and applicable `src/data/` copies are byte-identical and no location holds a partially written file
