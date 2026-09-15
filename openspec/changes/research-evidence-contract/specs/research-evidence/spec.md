## Purpose

Defines the durable contract for human-readable topic research under research/ so civic knowledge stays traceable, honestly statused, and machine-checkable without becoming production truth.

## ADDED Requirements

### Requirement: Topic research carries machine-readable metadata
Every governed topic-research document SHALL open with YAML frontmatter carrying a schema marker (e.g. `schema: research.v2`), a stable document `id`, `title`, `category`, `research_type`, `verification_status`, `temporal_status`, `risk`, `researched_at`, `last_checked`, and the canonical domains it informs. Document identity SHALL be the frontmatter `id`, never the filename.

#### Scenario: New research is machine-readable on creation
- **WHEN** an agent creates a topic-research document following `research/FORMAT.md`
- **THEN** `research:validate` accepts its frontmatter without human interpretation of prose status lines

#### Scenario: Identity survives retitling
- **WHEN** a document's title changes but its `id` is unchanged
- **THEN** the research index still maps it to the same topic entry

### Requirement: Verification uses a closed vocabulary
`verification_status` SHALL use only `verified` (core claims backed by sufficiently authoritative evidence), `partial` (some meaningful claims verified, important claims outstanding), `unverified` (no authoritative basis established), or `blocked` (authoritative evidence currently inaccessible). Combined or novel values SHALL fail validation.

#### Scenario: Combined status is rejected
- **WHEN** a document declares a value such as `Historical/Partially Verified`
- **THEN** validation fails naming the document and the offending value

### Requirement: Temporal applicability is separate from verification
`temporal_status` SHALL use only `current`, `historical`, `mixed`, or `unknown`, independently of `verification_status`, so verified-historical and unverified-current combinations are expressible.

#### Scenario: Verified history is expressible
- **WHEN** a document records `verification_status: verified` with `temporal_status: historical`
- **THEN** validation passes and the index shows both values distinctly

### Requirement: Research declares review importance
Each document SHALL declare `risk: low|medium|high` as research-review importance (emergency contacts, health, officials, fees, legislation, finance, procurement defaulting high unless justified). Research risk SHALL NOT alter canonical civic-data risk decisions.

#### Scenario: High-risk research is visible
- **WHEN** the generated index is reviewed
- **THEN** high-risk topics are distinguishable from low-risk ones without reading each file

### Requirement: Research declares its information shape
Each document SHALL declare `research_type` from `dataset|directory|profile|timeline|document-index|gap-report`, and its Findings section SHALL follow that type's shape (tabular dataset, entity directory, thematic subsections, timeline table, document inventory, or blocked-research report) rather than a single universal body.

#### Scenario: Gap research is first-class
- **WHEN** a `gap-report` documents its question, conclusion, attempts, blockers, and next actions without establishing the answer
- **THEN** validation passes instead of treating the absence of findings as malformed research

### Requirement: Documents share a common evidence envelope
Every governed document SHALL carry the envelope sections Scope, Summary, type-shaped Findings, Verification & Uncertainty, Conflicts, Gaps, Sources, and Research Attempts where meaningful for its status (required for `partial`, `unverified`, `blocked`, and `gap-report`); sections that add no value MAY be omitted except where required, and `None identified.` SHALL be an acceptable Conflicts value.

#### Scenario: Missing required attempts fail
- **WHEN** a `blocked` document omits Research Attempts
- **THEN** validation fails naming the document

### Requirement: Mixed-confidence findings support item-level verification
Where items in one document differ materially in confidence or freshness, those items SHALL carry their own verification, temporal status, as-of date, and source references (e.g. directory rows with Verification/Temporal/As-of/Sources columns). Narrative prose SHALL NOT require per-sentence status.

#### Scenario: Row-level status is precise
- **WHEN** an emergency-contacts directory mixes a current verified line with historical unverified ones
- **THEN** each row's status is individually stated instead of relying on one document-level label

### Requirement: Sources are locally traceable
Each document SHALL keep a local source register with document-unique IDs (e.g. `S1`), publisher, document, published/accessed dates, source type, and URL, and its claims SHALL reference those IDs in a deterministic syntax. Local source IDs SHALL NOT be confused with canonical `sources.json` instance IDs.

#### Scenario: Dangling source reference fails
- **WHEN** a claim cites a source ID with no register entry
- **THEN** validation fails naming the document and the unresolved reference

### Requirement: Large structured datasets may use governed sidecars
A document MAY declare structured sidecars (`data_files`, CSV preferred, JSON when nested) for datasets where tables improve integrity, sorting, validation, or extraction. Declared sidecars SHALL exist and parse; sidecar files without a declaring owner document SHALL fail validation. Sidecars SHALL remain research evidence and SHALL NOT be treated as canonical production data.

#### Scenario: Orphan sidecar fails
- **WHEN** a CSV exists under `research/<category>/data/` with no document declaring it
- **THEN** validation fails naming the orphan file

#### Scenario: Sidecar is never canonical truth
- **WHEN** civic-data promotion runs
- **THEN** no sidecar path is accepted as canonical provenance; only promoted source instances satisfy it

### Requirement: Research validates deterministically offline
`bun run research:validate` SHALL check governed topic documents for frontmatter presence and schema, unique IDs, closed vocabularies, valid ISO dates (`last_checked` not earlier than `researched_at` without justification), declared-sidecar existence and parseability, source-ID uniqueness and resolvability, absence of secrets and machine-local absolute paths, required type sections, and duplicate entity IDs — without network access and with identical results on repeated runs. It SHALL NOT judge factual truth and SHALL NOT cover `research/runs/`.

#### Scenario: Secret in research fails
- **WHEN** a research file contains token-like content
- **THEN** validation fails naming the file, without printing the secret

#### Scenario: Runs are out of scope
- **WHEN** validation runs over a tree containing `research/runs/` artifacts
- **THEN** those artifacts are ignored by the topic-format rules

### Requirement: Research index is generated from metadata
`bun run research:index` SHALL deterministically regenerate the category/topic/status inventory (ordered by category, then stable ID) from frontmatter and sidecar metadata, so the README index is derived rather than hand-maintained. Repeated runs over an unchanged tree SHALL produce byte-identical output.

#### Scenario: Index reflects metadata edits
- **WHEN** a document's verification status changes and the index is regenerated
- **THEN** the README status tables and summary counts reflect the new value

### Requirement: Research, runs, and canonical data stay distinct
Topic research SHALL remain living knowledge; `research/runs/` SHALL remain immutable automated snapshots that pipeline automation never rewrites as topic files; and no research document — regardless of status — SHALL directly publish canonical civic facts, which change only through civic-data promotion with independent review for high-risk facts.

#### Scenario: Research edit never publishes
- **WHEN** a `verified` research document is edited
- **THEN** canonical records and generated frontend JSON remain byte-identical until an explicit promotion occurs

### Requirement: Migrations preserve factual meaning
Reformatting research into this contract SHALL NOT change names, values, counts, sources, conflicts, gaps, or verification judgments; uncertainty notes, failed attempts, and wrong-city warnings SHALL be preserved, and product-idea sections SHALL be relocated (not silently deleted) outside the evidence documents.

#### Scenario: Content-preserving migration
- **WHEN** a document is migrated and its rendered facts are diffed against the pre-migration version
- **THEN** every factual value, source, gap, and conflict is preserved, with only structure and metadata changed
