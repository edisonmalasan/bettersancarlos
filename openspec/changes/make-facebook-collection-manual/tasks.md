## 1. Registry and schedule behavior

- [ ] 1.1 Set `lgu-facebook-cio` to `updateCadence: manual` with revised `accessNotes` (Page-authorized access unavailable, manual/dormant by default, Graph collector kept for fixtures/future authorized use); keep `collector: facebook` and `acquisition: facebook-graph`, and verify `bun run data:validate` passes and the registry diff shows only that entry.
- [ ] 1.2 Confirm `--due` excludes the manual Facebook source while other due sources still select normally and explicit `--source=lgu-facebook-cio` still routes to the Graph path, and verify with a refresh-level check (existing `refresh.test.ts` coverage or an offline `--due` vs `--source` run showing Facebook absent from `--due` and present on explicit request).
- [ ] 1.3 Update fixture-local `updateCadence: weekly` values for the Facebook entry in `scripts/data/lib/acquire.test.ts` and `scripts/data/promote.test.ts` to `manual` if they assert scheduling behavior, and verify `bun run data:test` passes.

## 2. Documentation and workflow wording

- [ ] 2.1 Reframe `docs/facebook-sync.md` as optional/manual (independent-project disclaimer, no Page admin or token expected in normal setup, scheduled refreshes need no Facebook credentials, activation steps kept as future/optional), and verify the file contains the manual-by-default wording and no required-setup instruction to obtain Page roles.
- [ ] 2.2 Make surgical `docs/data-pipeline.md` updates only (collector-roadmap "already automated" wording for `lgu-facebook-cio`, capability-vs-schedule rule `time-based → --due` / `manual → explicit only`), and verify no policy duplication and the news `--auto-news` section still correctly describes the low-risk path.
- [ ] 2.3 Inspect `.github/workflows/refresh.yml` comments and AGENTS.md for wording implying Facebook credentials are expected, adjust workflow comments only if misleading (implementation already omits `FB_ACCESS_TOKEN`), leave AGENTS.md untouched if clean, and verify the scheduled workflow defines no Facebook secrets requirement.

## 3. Tests and final verification

- [ ] 3.1 Add focused locks only for uncovered behavior (registry manual assertion, `--due` exclusion, explicit invocation, dormant skip without credentials failing nothing else, fixture collection producing evidence/instances/provisional candidates), reusing existing `acquire`/`collectors`/`refresh` coverage where present, and verify `bun run data:test` passes.
- [ ] 3.2 Run `bun run data:validate`, `bun run data:test`, and `bun run verify`, confirm `data/civic/records.json` and `data/civic/sources.json` are byte-identical and no scraper/auth-bypass code was introduced, and verify all three commands exit green.
