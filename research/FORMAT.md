# Research evidence format (research.v2)

This document is the single authority for topic research under `research/<category>/`. A future researcher creates a valid file by following it alone, then runs `bun run research:validate` and `bun run research:index`.

Not governed here: `research/runs/` (immutable pipeline snapshots — never rewrite as topic files), this file, `research/README.md` (generated regions inside it), and `docs/product-ideas.md`.

## Frontmatter

Every governed document opens with YAML frontmatter:

```yaml
---
schema: research.v2
id: emergency-hotlines
title: Emergency Hotlines and Public Safety
category: emergency
research_type: directory
verification_status: partial
temporal_status: mixed
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - emergency
# Only include data_files when a sidecar exists.
data_files:
  - data/contacts.csv
# Omit jurisdiction entirely when the default applies.
jurisdiction:
  country: PH
  province: Pangasinan
  locality: San Carlos City
---
```

- `id` is the stable identity (kebab-case, unique tree-wide). It survives retitles, refreshes, renames, and status changes. Never derive identity from the filename.
- The frontmatter parser accepts only a small YAML subset: quote any scalar containing `,`, `[`, `]`, `{`, or `}` with single quotes, doubling internal single quotes (`title: 'Full Disclosure, Transparency Seal & Citizen''s Charter'`).
- `category` matches the containing directory.
- `last_checked` is descriptive only: it records when a human last evaluated the file and MUST NOT feed any staleness computation. Old check dates are information, not failure.
- `jurisdiction`: omit for the default (San Carlos City, Pangasinan, PH). When present, all three fields are required; a non-default `locality` MUST also be named in `## Scope` (wrong-city protection: district, provincial, and national context stays explicit).
- New files use stable topic names (`emergency-hotlines.md`); existing `26-09-*.md` names are retained until a dedicated rename follow-up. Never encode verification status in a filename.
- Every ```yaml block in this file is a complete valid frontmatter example (enforced by test): the parser accepts full-line comments only, never trailing inline comments.

## Vocabularies

- `verification_status`: `verified` (core claims backed by sufficiently authoritative evidence) · `partial` (some meaningful claims verified, important ones outstanding) · `unverified` (no authoritative basis established) · `blocked` (required evidence currently inaccessible). Never combine with time.
- `temporal_status`: `current` · `historical` · `mixed` · `unknown` — independent of verification (`verified` + `historical` is valid).
- `risk`: `low` · `medium` · `high` — review importance only. Emergency contacts, health, officials, fees, legislation, finance, and procurement default high; deviations are declared visibly in frontmatter. Research risk never alters canonical civic-data risk decisions.
- `research_type`: `dataset` · `directory` · `profile` · `timeline` · `document-index` · `gap-report` — the shape of the evidence, not the subject domain.
- Source `type`: `official` (published by the responsible government body itself) · `archived-official` (official material preserved in web archives) · `government-dataset` (structured government data portals and files) · `authoritative-secondary` (reputable non-government publishers of official data) · `secondary` (press, encyclopedias, general references) · `community` (crowdsourced or community channels, used sparingly and labeled) · `other` (none of the above).

## Envelope

```text
# <Title>
## Scope          — what is covered, what is not, geography/period
## Summary        — short, decision-useful
## Findings       — TYPE-SPECIFIC (below); gap-report uses Current Conclusion instead
## Verification & Uncertainty — claim/item-level status that matters
## Conflicts      — disagreements (`None identified.` acceptable)
## Gaps           — unknowns (`None identified.` acceptable)
## Research Attempts — required for partial/unverified/blocked/gap-report
## Sources        — local register (below)
## Notes          — optional research notes only
```

Omit sections that add no value unless required above. Product and UI ideas do not belong here — they live in `docs/product-ideas.md`.

Envelope and type-minimum heading names are exact case-sensitive strings (`## Scope`, `### Directory`, `### Missing documents`, …): the validator matches them literally and names the expected string on failure.

## Type minima (Findings)

- `dataset`: `### Summary`, `### Dataset` (table or declared sidecar), `### Methodology` notes where values are derived.
- `directory`: `### Directory` table with ID, Entity, Status, and Sources columns (inline, or a declared sidecar CSV carrying those columns instead — never duplicated); optional Historical/superseded entries.
- `profile`: at least one thematic `###` subsection.
- `timeline`: `### Timeline` table with Date/period, Event, Verification, and Sources columns; context prose may follow.
- `document-index`: `### Document inventory` table with Document ID, Title, Date, Availability, Verification, and Sources columns, plus Missing documents.
- `gap-report`: `## Research Question`, `## Current Conclusion` (e.g. `BLOCKED — …`), target-information table, `## Research Attempts` (`| Date | Source | Result | Notes |`), blockers, and recommended next actions. No Findings section. If Current Conclusion opens with the canonical `BLOCKED` marker, `verification_status` must be `blocked` (enforced by the validator).

Nothing beyond these minima is required.

## Item-level verification

When items differ in confidence or freshness, each item carries Verification, Temporal, As-of, and Sources (e.g. directory rows). Narrative prose needs no per-sentence status. When an item clearly maps to a canonical civic record, prefer that record's stable ID (e.g. `city-hall-trunk-line`) — naming only; research never auto-promotes.

## Source register

```markdown
## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Official website | — | 2026-09-04 | official | https://… |
| S2 | City Government of San Carlos | Contact Us (archive) | 2017-03-22 | 2026-09-04 | archived-official | https://… |
```

- IDs are exactly `S1`, `S2`, … (1-based, no leading zeros, unique per document). They are document-local — never canonical `sources.json` IDs.
- Reference IDs only in (1) table cells under a column headed exactly `Sources` (`S1`, or lists as `S1, S3`), and (2) prose inline code spans (`` `S1` ``). Bare IDs in plain prose are not parsed and need no registration.
- A `Sources` cell with no source stays empty or `—`, but its row must still carry an honest Verification status (e.g. an unconfirmed number is `unverified`, never blank-by-omission).

## Sidecars

Large structured datasets MAY live in `<category>/data/*.csv` (flat tables) or `.json` (nested only). Declare them in `data_files`; undeclared sidecars fail validation. The document replaces — never duplicates — a migrated table. Sidecars are research evidence, never canonical truth: promotion accepts only source instances.

## Boundaries

- `research/runs/` is immutable automation output; topic files are living knowledge. Neither rewrites the other.
- No research document, whatever its status, publishes canonical facts. Facts change only via civic-data promotion (independent review for high-risk).
- Migration reformats structure only: values, sources, gaps, conflicts, failed attempts, uncertainty notes, and wrong-city warnings are preserved verbatim in meaning.

## Examples

Dataset frontmatter + findings:

```markdown
## Findings

### Summary
2020 census population 205,424, up 16,853 since 2015. | `S1`

### Dataset
| Census | Population | Change | Sources |
|---|---|---|---|
| 2020 | 205,424 | +8.94% | `S1` |

### Methodology
Growth rate computed as (205424 − 188571) / 188571 over 5 years. | `S1`
```

Gap-report skeleton:

```markdown
# Water Service Provider

## Scope
Determine the authoritative potable-water provider for San Carlos City, Pangasinan.

## Summary
No authoritative public source confirms the provider identity.

## Research Question
…

## Current Conclusion
BLOCKED — do not publish a provider identity as verified.

## Target Information
| Field | Status | Notes |
|---|---|---|
| Provider name | unverified | authoritative source unavailable |

## Research Attempts
| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-04 | LWUA directory | failed | HTTP 403 |

## Gaps
…

## Recommended Next Actions
…

## Sources
…
```
