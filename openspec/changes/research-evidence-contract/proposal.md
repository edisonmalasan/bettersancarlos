## Why

The 33 topic-research documents under `research/` hold the project's civic knowledge, but they evolved organically: metadata is bold prose, verification mixes status with time (`Historical/Partially Verified`), all 33 files carry product-idea sections, the README index is hand-maintained and drifted, and the 86-row barangay table is physically broken (rows displaced past `## Sources`). Agents cannot determine a document's status, shape, or sources without natural-language interpretation, and nothing validates structure — so a durable, machine-readable research-evidence contract is needed before the corpus grows further.

## What Changes

- Audit (verified against `main`): 21 category dirs, 33 files, all named `26-09-<topic>.md`, zero YAML frontmatter; metadata is `# Title` + `**Category:**` / `**Verification status:**` / `**Research date:**` prose with ~10 distinct verification wordings; universal tail `Potential Better San Carlos Features` → `Notes` → `Sources`; heads vary by subject.
- Taxonomy of observed shapes (6): `dataset` (demographics, budget, cmci-index), `directory` (barangays, officials, emergency-hotlines, schools, facilities), `profile` (geography, economy, tourism, agriculture, utilities), `timeline` (history, festivals, news-current-events), `document-index` (legislation-archive, full-disclosure), `gap-report` (water-district, doh-facilities, hazard-maps, blgf-budget).
- New contract — standard envelope + type-specific body: small YAML frontmatter (`schema: research.v2`, stable `id`, `title`, `category`, `research_type`, `verification_status`, `temporal_status`, `risk`, `researched_at`, `last_checked`, `canonical_domains`, optional `data_files`); common sections (Scope, Summary, type-shaped Findings, Verification & Uncertainty, Conflicts, Gaps, Research Attempts, Sources, Notes); no empty-boilerplate requirement.
- Closed vocabularies: verification `verified|partial|unverified|blocked` (never combined with time); temporal `current|historical|mixed|unknown`; risk `low|medium|high` (review importance only, not the canonical risk policy); research types `dataset|directory|profile|timeline|document-index|gap-report`.
- Claim/item-level verification where confidence differs within a file (e.g. emergency contacts table with per-row Verification/Temporal/As-of/Sources); narrative prose needs no per-sentence IDs; reuse canonical record IDs where an item maps to one, without making research IDs canonical.
- Local source register per document (`S1…` IDs, publisher/document/published/accessed/type/URL, small source-type vocabulary); `S-IDs` are document-local and never canonical `sources.json` IDs.
- Structured sidecars (`data/*.csv` preferred, JSON when nested) declared in frontmatter, owned (no orphans), never canonical; barangay directory is the priority migration (reassembles the 86 rows + Total deterministically).
- Stable document `id` as identity; filenames stay `26-09-*.md` in this change (deferred rename — see Impact); status never encoded in filenames.
- `research/FORMAT.md` as the permanent contract + per-type templates in `research/templates/` only if they stay in sync with validation (design decides; FORMAT.md examples may suffice).
- Deterministic offline `bun run research:validate` (structure/traceability, never truth) and `bun run research:index` (regenerates README inventory/status from frontmatter); both run in CI only after the whole corpus conforms.
- Migration in phases: contract + tooling → inventory audit → one representative file per type → barangay sidecar → remaining files (facts untouched) → product-idea relocation → README generation → optional renames deferred → CI enforcement.
- Product ideas move to a single `docs/product-ideas.md` (no new planning system exists; nothing invented beyond one file), preserved not deleted.
- Jurisdiction safety: global San Carlos City, Pangasinan default declared once in FORMAT.md; per-file override only for cross-jurisdiction material (no repetitive frontmatter).
- Explicitly out of scope: `research/runs/` untouched; no pipeline/collector/canonical/frontend changes; no fact updates during reformat; no CMS/database/knowledge-graph; no per-category templates; no CSV for small tables.

## Capabilities

### New Capabilities

- `research-evidence`: machine-readable topic-research contract — frontmatter metadata, closed verification/temporal/risk/type vocabularies, envelope + type-specific findings, item-level verification, local source registers, governed sidecars, offline validation, generated index, migration safety, and the research↔runs↔canonical boundaries.

### Modified Capabilities

- `ci-verification`: CI also runs `bun run research:validate` and verifies the generated research index is in sync — offline, deterministic, no network, alongside the existing typecheck/civic-validation/tests/build chain.
- No delta for `civic-data-pipeline` (runs schema untouched; confinement already enforced) or `civic-data-surfacing` (filenames preserved so the `26-09-` corpus reference stays true; a future rename follow-up would need one).

## Impact

- Affected: `research/**` (33 files reformatted, facts preserved), new `research/FORMAT.md`, `research/templates/` (if chosen), `research/*/data/` sidecars, generated `research/README.md`, new `scripts/research/*.ts`, `package.json` scripts (`research:validate`, `research:index`, optional `research:report`), `.github/workflows/ci.yml`, `AGENTS.md` (short pointer section), `docs/product-ideas.md`.
- Filenames deliberately unchanged in this change: user-visible `Source: research/26-09-…` labels exist across `src/app/**/page.tsx` and `src/data/*.json`, `scripts/data/generate.ts` hardcodes 8 such paths (4 asserted by tests), and the surfacing spec names the `26-09-` prefix — renaming now would churn frontend labels for zero contract gain. Stable naming becomes the rule for new files; bulk rename is a dedicated follow-up.
- Behavior: `research:validate` fails loudly on malformed/untraceable research; README index derives from metadata; CI blocks on research-contract violations only after migration is clean; pipeline, promotion, canonical data, and frontend behavior otherwise unchanged.
