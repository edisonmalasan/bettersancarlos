## 1. Audit and contract

- [ ] 1.1 Produce the migration inventory (every topic file: path, category, proposed stable id, research_type, verification/temporal/risk, sidecar candidate, rename candidate, product-idea section, active path references) and verify it covers all 33 files across the 21 category dirs.
- [ ] 1.2 Write `research/FORMAT.md` (frontmatter, vocabularies, six research types, envelope sections, item-level verification, source register + syntax, sidecar rules, filename rules, jurisdiction default, runs/canonical boundaries, agent rules, dataset + gap-report examples) and verify a fresh agent can author a valid file from it alone.
- [ ] 1.3 Record the reference inventory (generate.ts provenance strings, generate.test.ts asserts, src/ user-visible labels, surfacing-spec prefix reference, archive references) and verify filenames stay `26-09-*.md` in this change with renames deferred to a follow-up.

## 2. Tooling

- [ ] 2.1 Implement the shared frontmatter reader (`scripts/research/lib/`: discovery of governed files, `---` split, scalar/list parsing, deterministic category-then-id ordering, zero new dependencies) and verify unit tests cover malformed frontmatter, unknown schema, and ordering.
- [ ] 2.2 Implement `bun run research:validate` (all §10 spec checks: schema/id uniqueness, closed vocabularies, ISO dates, sidecar existence/parse/ownership, source uniqueness/resolvability, secrets/local-path rejection, required type sections, duplicate entity IDs; runs/ excluded; offline) and verify each suggested test 4–17 passes.
- [ ] 2.3 Implement `bun run research:index` (regenerates marked README regions: per-category table plus status summary; byte-identical reruns) and verify determinism tests 18–19 pass, deferring `research:report` unless a gap is demonstrated.

## 3. Representative migrations

- [ ] 3.1 Migrate one file per type (dataset: demographics; directory: emergency-hotlines; profile: geography; timeline: history; document-index: legislation-archive; gap-report: water-district) preserving all facts/gaps/conflicts, and verify `research:validate` passes and rendered facts diff clean against pre-migration versions.
- [ ] 3.2 Refine FORMAT.md and the validator from phase 3 lessons, and verify the six migrated files still pass without per-file exceptions.

## 4. Structured dataset migration

- [ ] 4.1 Migrate the barangay directory to `barangay-directory.md` + `data/barangays.csv` (all 86 rows + Total reassembled, stable IDs, sources resolvable, prose no longer interleaved) and verify tests 21–22 pass.
- [ ] 4.2 Add sidecars only where justified (demographics series and other large tables per inventory), and verify each parses and is declared owned with no orphans.

## 5. Remaining research migration

- [ ] 5.1 Convert all remaining governed topic files to the contract without altering factual meaning, and verify `research:validate` passes on the whole tree and fact diffs show structure-only changes (test 23).

## 6. Product-idea separation

- [ ] 6.1 Relocate all 33 `Potential Better San Carlos Features` sections to `docs/product-ideas.md` (preserved, attributed per topic) and verify no evidence document retains product-planning content.

## 7. README generation

- [ ] 7.1 Convert `research/README.md` to purpose/principles + generated index/summary regions, regenerate via `research:index`, and verify the derived tables match frontmatter state and stale hand-maintained listings are gone.

## 8. Filenames and AGENTS.md

- [ ] 8.1 Confirm all files keep existing names, document the stable-name rule for new files in FORMAT.md, and verify no active reference broke.
- [ ] 8.2 Add the concise AGENTS.md research pointer (read FORMAT.md, choose research_type, keep verification/temporal separate, trace sources, sidecars for large datasets, run validate+index, never publish canonical from research, leave runs/ alone) and verify it links rather than duplicates.

## 9. CI

- [ ] 9.1 Add `research:validate` plus the index-sync check to `.github/workflows/ci.yml` after civic validation, and verify the pipeline fails on invalid research and on a stale generated index while staying offline.

## 10. Full verification

- [ ] 10.1 Run `bun run research:validate`, `bun run research:index` (determinism re-check), `bun run data:validate`, `bun run data:test`, and `bun run verify`, and verify all green with canonical records, generated frontend JSON, and `research/runs/` byte-identical and no network use.
