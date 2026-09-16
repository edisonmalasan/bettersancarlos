## ADDED Requirements

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
