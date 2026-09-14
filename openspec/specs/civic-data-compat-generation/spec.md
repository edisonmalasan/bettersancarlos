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
