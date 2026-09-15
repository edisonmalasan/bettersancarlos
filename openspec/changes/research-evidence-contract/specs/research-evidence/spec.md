## Purpose

Defines the durable contract for human-readable topic research under research/ so civic knowledge stays traceable, honestly statused, and machine-checkable without becoming production truth.

## ADDED Requirements

### Requirement: Topic research carries machine-readable metadata
Every governed topic-research document SHALL open with YAML frontmatter carrying a schema marker (e.g. `schema: research.v2`), a stable document `id`, `title`, `category`, `research_type`, `verification_status`, `temporal_status`, `risk`, `researched_at`, `last_checked`, and the canonical domains it informs. An optional `jurisdiction` mapping (`country`, `province`, `locality`) overrides the repository default for legitimately cross-jurisdiction material. Document identity SHALL be the frontmatter `id`, never the filename. `last_checked` is descriptive research metadata only and SHALL NOT feed any scheduled staleness computation.

#### Scenario: New research is machine-readable on creation
- **WHEN** an agent creates a topic-research document following `research/FORMAT.md`
- **THEN** `research:validate` accepts its frontmatter without human interpretation of prose status lines

#### Scenario: Identity survives retitling
- **WHEN** a document's title changes but its `id` is unchanged
- **THEN** the research index still maps it to the same topic entry

#### Scenario: Check dates never drive staleness
- **WHEN** a document's `last_checked` grows old
- **THEN** no validator, index, or report marks it stale on elapsed time alone; freshness judgments stay with reviewers and the canonical pipeline

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
Each document SHALL declare `risk: low|medium|high` as research-review importance (emergency contacts, health, officials, fees, legislation, finance, procurement default high; any deviation is declared visibly in frontmatter for reviewers, with no hidden exception). Research risk SHALL NOT alter canonical civic-data risk decisions.

#### Scenario: High-risk research is visible
- **WHEN** the generated index is reviewed
- **THEN** high-risk topics are distinguishable from low-risk ones without reading each file

### Requirement: Research declares its information shape
Each document SHALL declare `research_type` from `dataset|directory|profile|timeline|document-index|gap-report`, and its Findings section SHALL follow that type's shape rather than a single universal body. Minimum Findings per type: `dataset` — Summary, Dataset (table or declared sidecar), and Methodology notes where values are derived; `directory` — Directory table with ID, Entity, Status, and Sources columns; `profile` — at least one thematic subsection; `timeline` — Timeline table with Date/period, Event, Verification, and Sources columns; `document-index` — Document inventory table with Document ID, Title, Date, Availability, Verification, and Sources columns, plus Missing documents (`None identified.` acceptable); `gap-report` — no Findings section: Current Conclusion stands in its place. Optional subsections SHALL NOT be required.

#### Scenario: Gap research is first-class
- **WHEN** a `gap-report` documents its question, conclusion, attempts, blockers, and next actions without establishing the answer
- **THEN** validation passes instead of treating the absence of findings as malformed research

#### Scenario: Missing type minimum fails
- **WHEN** a `directory` document omits its Directory table
- **THEN** validation fails naming the document

#### Scenario: Lean profile passes
- **WHEN** a `profile` document carries one thematic subsection and no optional subsections
- **THEN** validation passes

### Requirement: Documents share a common evidence envelope
Every governed document SHALL carry the envelope sections Scope, Summary, type-shaped Findings, Verification & Uncertainty, Conflicts, Gaps, Sources, and Research Attempts where meaningful for its status (required for `partial`, `unverified`, `blocked`, and `gap-report`); a `gap-report` SHALL carry Current Conclusion instead of a Findings section; sections that add no value MAY be omitted except where required, and `None identified.` SHALL be an acceptable Conflicts or Gaps value.

#### Scenario: Missing required attempts fail
- **WHEN** a `blocked` document omits Research Attempts
- **THEN** validation fails naming the document

### Requirement: Mixed-confidence findings support item-level verification
Where items in one document differ materially in confidence or freshness, those items SHALL carry their own verification, temporal status, as-of date, and source references (e.g. directory rows with Verification/Temporal/As-of/Sources columns). Narrative prose SHALL NOT require per-sentence status. When a structured item clearly corresponds to an existing canonical civic record, it SHOULD reuse that record's stable semantic ID (e.g. `city-hall-trunk-line`); reuse is a naming preference only and SHALL NOT promote the item to canonical status.

#### Scenario: Row-level status is precise
- **WHEN** an emergency-contacts directory mixes a current verified line with historical unverified ones
- **THEN** each row's status is individually stated instead of relying on one document-level label

#### Scenario: Canonical ID reuse stays non-promoting
- **WHEN** a directory row reuses the `city-hall-trunk-line` record ID
- **THEN** the row remains research evidence requiring normal candidacy and review before any canonical change

### Requirement: Sources are locally traceable
Each document SHALL keep a local source register with document-unique IDs of the exact form `S` followed by a 1-based integer with no leading zeros (`S1`, `S2`, `S3`), plus publisher, document, published/accessed dates, source type from the closed source-type vocabulary, and URL. Claims SHALL reference IDs only in two parsed contexts: (1) Markdown table cells under a column headed exactly `Sources`, as a single ID (`S1`) or comma-separated list (`S1, S3`); (2) prose inline code spans (`` `S1` ``, lists as `` `S1, S3` ``). Bare IDs in plain prose SHALL NOT be parsed. Local source IDs SHALL NOT be confused with canonical `sources.json` instance IDs.

#### Scenario: Dangling source reference fails
- **WHEN** a claim cites a source ID with no register entry
- **THEN** validation fails naming the document and the unresolved reference

#### Scenario: Multi-source cell resolves
- **WHEN** a Sources cell contains `S1, S3` and both IDs are registered
- **THEN** validation passes

#### Scenario: Bare prose mention is not parsed
- **WHEN** plain prose mentions S9 without code formatting and no S9 is registered
- **THEN** validation still passes

### Requirement: Source types use a closed vocabulary
`type` in the source register SHALL use only `official` (published by the responsible government body itself), `archived-official` (official material preserved in web archives), `government-dataset` (structured government data portals and files), `authoritative-secondary` (reputable non-government publishers of official data), `secondary` (press, encyclopedias, general references), `community` (crowdsourced or community channels, used sparingly and labeled), or `other` (none of the above). Unknown values SHALL fail validation.

#### Scenario: Unknown source type fails
- **WHEN** a register entry declares `type: blog`
- **THEN** validation fails naming the document and the entry

### Requirement: Jurisdiction defaults safely with explicit overrides
Absent a `jurisdiction` mapping, a document SHALL be read as covering the repository default (San Carlos City, Pangasinan, PH). A present `jurisdiction` SHALL carry non-empty `country`, `province`, and `locality`; when its locality differs from the default, the document's Scope section SHALL name that external locality, so district, provincial, and national context stays explicit and is never confused with another San Carlos City.

#### Scenario: Default jurisdiction needs no declaration
- **WHEN** a document omits `jurisdiction`
- **THEN** validation passes and the index treats it as San Carlos City, Pangasinan

#### Scenario: Override without Scope naming fails
- **WHEN** a document declares a non-default locality but its Scope never names it
- **THEN** validation fails naming the document

### Requirement: Large structured datasets may use governed sidecars
A document MAY declare structured sidecars (`data_files`, CSV preferred, JSON when nested) for datasets where tables improve integrity, sorting, validation, or extraction. Declared sidecars SHALL exist and parse; sidecar files without a declaring owner document SHALL fail validation. Sidecars SHALL remain research evidence and SHALL NOT be treated as canonical production data.

#### Scenario: Orphan sidecar fails
- **WHEN** a CSV exists under `research/<category>/data/` with no document declaring it
- **THEN** validation fails naming the orphan file

#### Scenario: Sidecar is never canonical truth
- **WHEN** civic-data promotion runs
- **THEN** no sidecar path is accepted as canonical provenance; only promoted source instances satisfy it

### Requirement: Research validates deterministically offline
`bun run research:validate` SHALL check governed topic documents for frontmatter presence and schema, unique IDs, closed vocabularies (verification, temporal, risk, research type, source type), valid ISO dates (`last_checked` never earlier than `researched_at`, with no exceptions), jurisdiction completeness with Scope naming for non-default localities, source-reference syntax in the two parsed contexts, declared-sidecar existence and parseability, source-ID uniqueness and resolvability, absence of secrets and machine-local absolute paths, required type-section minima, and duplicate entity IDs — without network access and with identical results on repeated runs. It SHALL NOT judge factual truth and SHALL NOT cover `research/runs/`.

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
