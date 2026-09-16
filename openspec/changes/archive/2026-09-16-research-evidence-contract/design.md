## Context

See proposal.md (Why) for motivation. Verified current state on `main`:

- `research/`: 21 category dirs, 33 files, all `26-09-<topic>.md`, zero frontmatter; metadata is H1 + bold prose with ~10 verification wordings; universal tail (product ideas → notes → sources); 6 natural body shapes; barangay table physically split (rows 40–45 displaced past `## Sources`).
- `research/README.md`: hand-maintained inventory + status + gaps + feature ideas, already drifted (header date 2026-09-05 vs footer 2026-09-04; file list interleaved with feature bullets).
- Consumers of research paths: `scripts/data/generate.ts` hardcodes 8 `26-09-*.md` provenance strings (4 asserted by `generate.test.ts`); `src/app/**/page.tsx` and `src/data/*.json` render ~20 user-visible `Source: research/26-09-…` labels; `civic-data-surfacing` names the `26-09-` prefix; archives reference paths (never rewritten).
- Pipeline guards: `validate.ts` `validateResearchConfinement` flags only `evidence/` dirs and `manifest/candidates/review-report/findings/conflicts` filenames outside `research/runs/` — `data/*.csv` sidecars and new doc files pass through unaffected.
- Toolchain: `package.json` has `data:*` scripts, no YAML/CSV/frontmatter libraries; CI (`ci.yml`) runs typecheck → `data:validate` → `data:test` → build, offline, Bun 1.4.0 pinned. No `docs/product/` exists; no `scripts/research/` exists.

## Goals / Non-Goals

**Goals:**

- Make every planning decision needed for a faithful implementation: exact contract location, zero-dependency tooling approach, validator/index architecture, template verdict, rename deferral, and reference inventory.
- Keep the migration reviewable in phases with facts provably preserved.

**Non-Goals:**

- No pipeline, promotion, canonical-schema, or frontend changes — the contract is additive alongside them.
- No new dependencies, no CMS/database, no per-category types beyond the six observed shapes.

## Decisions

- **Contract lives at `research/FORMAT.md` (not `docs/`).** Rationale: the governed files live under `research/`; agents editing them look there first, and AGENTS.md can point one link at it. Alternative (`docs/research-format.md`) rejected: separates rules from the tree they govern.
- **Zero new dependencies: hand-rolled frontmatter + CSV handling in `scripts/research/`.** Rationale: frontmatter needs only `---` splitting plus `key: value` and small-list parsing; CSV needs only RFC-4180-lite parsing the validator itself defines; matches the repo's dependency-free reliability stance and avoids `bun.lock`/Renovate churn. Alternative (gray-matter/csv-parse) rejected: heavyweight for a closed, self-defined format.
- **Two commands, one shared reader: `research:validate` and `research:index` over `scripts/research/lib/`.** Rationale: both need identical frontmatter parsing, file discovery (governed = `research/<category>/*.md` excluding `runs/`, `README.md`, `FORMAT.md`, `templates/`, `product-ideas.md` if local), and deterministic ordering (category, then stable id). `research:report` only if validate+index leave a console gap — decide during implementation, default to omitting it. Alternative (single command) rejected: validation (failing) and generation (writing) have different CI roles.
- **README generation rewrites only marked index regions.** Rationale: README also carries purpose/principles prose that must stay hand-written; `research:index` regenerates delimited tables/summary between markers and fails otherwise. Alternative (fully generated README) rejected: destroys curated guidance; alternative (separate INDEX.md) rejected: leaves the drifted README as the landing page.
- **Templates: FORMAT.md examples only, no `research/templates/` files.** Rationale: six templates that must stay in sync with validator rules are a second source of truth; the request itself permits FORMAT.md examples as sufficient. Revisit only if agents repeatedly misshape new files.
- **Defer renames (option B): keep `26-09-*.md` in this change.** Rationale: renames would stale ~20 user-visible frontend labels, 8 generate.ts provenance strings (+4 test asserts), and the surfacing spec's prefix reference, for zero contract gain since `id` is identity. New files use stable names; bulk rename is a dedicated follow-up (which will then need a surfacing delta + label updates).
- **Product ideas → single `docs/product-ideas.md`.** Rationale: no product-planning system exists, so one flat file preserves all 33 sections' ideas with zero new infrastructure; it sits outside validator/index scope.
- **Jurisdiction default global, override local.** Rationale: FORMAT.md declares San Carlos City, Pangasinan once; only cross-jurisdiction material (district/province/national context) declares otherwise — compact and directly addresses the past wrong-city incidents.
- **Source-reference syntax finalized: `S<n>` in exactly two parsed contexts.** Table cells under a column headed exactly `Sources` (`S1`, `S1, S3`) and prose inline code spans; bare IDs in plain prose are never parsed. Rationale: eliminates the false-positive class by construction instead of mitigating it, with one memorizable rule. Alternative (fuzzy prose matching) rejected: unfixable false positives.
- **Source-type vocabulary closed at seven with FORMAT.md meanings.** Rationale: covers the observed evidence (official site, archives, PSA/BLGF datasets, PhilAtlas/Rappler mirrors, press/Wikipedia, community channels) with `other` as the escape hatch; small enough to memorize, strict enough to validate.
- **Jurisdiction override is data plus one Scope sentence.** Rationale: validator-enforceable via completeness plus substring presence — no NLP; absent field means default, so migrating the 33 existing files needs no jurisdiction edits. Alternative (closed locality list) rejected: cannot enumerate every legitimate context in advance.
- **Type minima pinned per type; optionals never required.** Rationale: gives the validator an exact required-section list (dataset Summary/Dataset/Methodology-if-derived; directory ID/Entity/Status/Sources table; profile ≥1 subsection; timeline table; inventory + Missing documents; gap-report Current Conclusion instead of Findings) while honoring no-boilerplate; conditional items (Methodology-if-derived) stay reviewer-owned. Alternative (validator infers intent) rejected: unimplementable deterministically.
- **Durable principles, not advice: `last_checked` is read-only metadata; canonical-ID reuse is naming-only.** Rationale: stating them in the spec (metadata requirement scenario; item-level SHOULD + non-promotion scenario) makes the no-second-cadence-engine and no-auto-promotion guarantees structural instead of advisory. Alternative (FORMAT.md guidance only) rejected: guidance drifts, validated requirements do not.
- **No `research.v1` legacy mode: migrate atomically before CI enforcement.** Rationale: 33 files is small enough to convert in one change; a dual-mode validator doubles rule complexity and invites permanent mixed format. CI gating lands last (phase 8) when the tree is clean.

## Risks / Trade-offs

- [Risk] 33-file migration introduces accidental fact edits → Mitigation: phase 3 proves the contract on 6 representative files first; phase 5 diffs rendered facts pre/post migration; validator never judges truth so review owns meaning
- [Risk] Strict source-reference parsing false-positives on prose (e.g. "see S1" vs bare "S1") → Mitigation: decided — only Sources-column cells and inline code spans are parsed, bare prose never is; FORMAT.md states the rule once
- [Risk] Barangay CSV becomes the de-facto edited copy while the .md drifts → Mitigation: document owns the sidecar via `data_files`; validator checks row-count/total consistency declarations; .md directory table is replaced by the CSV, not duplicated
- [Risk] Generated README regions edited by hand → Mitigation: markers + index-sync CI check fail loudly; regeneration is one command
- [Risk] research:validate slows CI → Mitigation: 33 small Markdown files + a few CSVs parse in milliseconds; no network by construction

## Migration Plan

- Phases 1–2 (contract, FORMAT.md, validator, index, audit inventory) land first and are independently reviewable; phases 3–5 migrate content; phase 6 relocates ideas; phase 7 wires README generation; phase 8 enables CI gating; each phase keeps `data:validate`, `data:test`, and `verify` green with canonical data byte-identical.
- Rollback: content migration is git-revertible per phase; contract tooling is additive (new files + scripts + package.json entries) so removal is a clean revert; no canonical or generated frontend data changes at any point.

## Open Questions

- None that change specs, approach, or tasks. Deferred implementation details (exact marker syntax for README regions, whether `research:report` earns its keep) are settled during Phase 1–2 with the validator as the executable answer.
