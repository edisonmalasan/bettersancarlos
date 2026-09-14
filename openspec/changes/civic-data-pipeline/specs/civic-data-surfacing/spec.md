## ADDED Requirements

### Requirement: Record-level verification traceability on the site
Every civic fact displayed on the site SHALL be traceable to canonical civic record provenance: published facts in migrated domains SHALL originate from canonical records whose status and sources are known, and the site SHALL NOT present a record with status `blocked`, `needs-reverification`, or `provisional` as unquestionably current fact. Where the frontend already renders verification labeling (pending notices, historical markers), generated compatibility data SHALL provide the status information needed to render those labels.

#### Scenario: Blocked contact is visibly not current
- **WHEN** a high-risk record (e.g. an emergency contact) is `blocked` or `needs-reverification` in canonical data
- **THEN** the site renders it with its historical/pending labeling rather than as a verified current contact

#### Scenario: Published fact traces to canonical record
- **WHEN** a displayed fact in a migrated domain is audited
- **THEN** it maps to a canonical record ID whose source references and acceptance history can be inspected

## MODIFIED Requirements

### Requirement: One canonical data source per fact
Each civic fact SHALL have exactly one canonical source under `data/` that pages import or fetch; duplicated hardcoded values in page files SHALL be removed where a JSON source exists. For domains migrated to the civic-data pipeline, the single canonical source of truth SHALL be the canonical civic record (stable ID, record-level provenance), and the `data/*.json` file consumed by pages SHALL be a generated compatibility output of that record rather than an independently editable fact store. Every `data/*.json` file SHALL be mirrored byte-identical to `public/data/` so runtime fetches succeed.

#### Scenario: No duplicated hardcoded series
- **WHEN** a page renders a data series that exists in a `data/*.json` file
- **THEN** it reads from that file (static import or fetch) rather than duplicating the values in JSX

#### Scenario: Runtime fetches resolve
- **WHEN** a page fetches a `data/` JSON at runtime
- **THEN** the identical file exists under `public/data/` and the fetch succeeds in the static build

#### Scenario: Migrated fact edits go through canonical promotion
- **WHEN** a contributor changes a civic fact in a migrated domain
- **THEN** the change is accepted into the canonical civic record and regenerated, not hand-edited into the compatibility JSON
