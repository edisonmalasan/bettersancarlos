## Context

See proposal.md (Why) for motivation. Current state, verified read-only:

- `data/civic/source-registry.yaml`: `lgu-facebook-cio` has `collector: facebook`, `acquisition: facebook-graph`, `updateCadence: weekly`.
- `scripts/data/refresh.ts`: `cadenceDueDays()` returns null for non-time-based cadences (manual/per-document/per-term) so `isDue()` is false; `--due`/default selection also skips collector-less sources. Explicit `--source`/`--domain` bypasses due filtering. No code change needed for the cadence rule itself.
- `scripts/data/lib/acquire.ts` + `ingest-facebook.ts` + `collectors/facebook.ts`: Graph acquisition with fixture mode, dormant-without-token skip, auth-code taxonomy, token-in-memory-only with redaction. Correct; keep as-is.
- `.github/workflows/refresh.yml`: runs `data:refresh -- --due`, already omits `FB_ACCESS_TOKEN` and documents the dormant Facebook path in its header comment.
- `docs/facebook-sync.md`: frames Facebook as "Automated Facebook → News Ingestion" with an activation gate instructing the maintainer to get an Editor role and configure `FB_PAGE_ID`/`FB_ACCESS_TOKEN` secrets — the wording this change must reframe.
- `docs/data-pipeline.md`: collector roadmap lists `lgu-facebook-cio` under "Already automated"; news auto-promotion section (`--auto-news`) stays valid but needs the manual-collection context.
- Spec `civic-data-pipeline`: defines manual as non-time-based with the `nextReviewOn == acceptedAt` sentinel but never states the `--due` exclusion explicitly — the one delta this change adds.

## Goals / Non-Goals

**Goals:**

- Make the registry reflect the real access model (Facebook = manual/dormant) while keeping the Graph capability invocable.
- Reframe docs so normal setup never implies Page admin or tokens.
- Lock behavior with minimal focused tests; leave canonical data byte-identical.

**Non-Goals:**

- No pipeline, schema, policy, collector, promotion, diff, generation, frontend, or CI redesign — reuse existing `manual` semantics and dormant-skip behavior.
- No new cadence values, metadata fields, scrapers, collectors, or manual-import systems.

## Decisions

- **Cadence value: existing `manual`, not a new `restricted`/`optional` type.** Rationale: `manual` already means "never automatically due, explicit invocation only" in code (`cadenceDueDays` → null), policy (sentinel), and reports (review-on-demand class). Alternative (new cadence) rejected: adds schema/policy/validation churn for zero behavior gain.
- **Keep `collector: facebook` + `acquisition: facebook-graph` on the registry entry.** Rationale: preserves explicit invocation (`--source=lgu-facebook-cio` routes to the Graph path) and fixture testing; "collector exists ≠ automatically scheduled" is the core model. Alternative (null the collector) rejected: would break the manual path and fixture coverage.
- **Docs-first reframing of `facebook-sync.md`; surgical touch to `data-pipeline.md` and workflow comments.** Rationale: behavior change is one registry field; most risk is misleading wording implying maintainers must obtain Page roles. Keep the technical activation steps but demote them to optional/future. Alternative (rewrite pipeline docs) rejected: duplicates policy and creates drift.
- **One narrow spec delta on "Refresh command surface".** Rationale: the only unspecified behavior is the `--due` exclusion for non-time-based cadences; everything else (sentinel, dormant skip, explicit filters) is already specified and implemented. Alternative (no delta) rejected: leaves the scheduling rule implicit; alternative (broad delta) rejected: spec churn.
- **Tests: reuse existing suites, add only missing locks.** Rationale: `acquire.test.ts` already covers dormant-skip, fixture evidence, auth failure redaction, retry; `collectors.test.ts` covers transform/instances; `promote.test.ts` covers `--auto-news` gating. Add only: registry manual assertion, `--due` exclusion vs. explicit inclusion (refresh-level), and scheduled-without-credentials safety if not already covered. Alternative (large new suite) rejected: redundant.

## Risks / Trade-offs

- [Risk] Weekly→manual changes news freshness expectations → Mitigation: docs state news flow continues from canonical records; Facebook items resume only on explicit authorized runs.
- [Risk] Fixture in `promote.test.ts`/`acquire.test.ts` hardcodes `updateCadence: weekly` for the FB entry → Mitigation: tasks call out updating those fixtures to `manual` (fixture-local, not canonical).
- [Risk] Over-editing `data-pipeline.md` duplicates policy → Mitigation: one-line rule reference ("time-based → `--due`; manual → explicit only"), link to policy, no restatement.
- [Risk] Workflow comment drift (future editor re-adds FB secrets as required) → Mitigation: keep the existing "intentionally NOT configured" header; adjust only misleading lines.
- [Risk] `news-fb-*` provenance confusion (registry stays, schedule goes) → Mitigation: no change to `generate.ts` news detection or `--auto-news` gating; docs clarify capability vs. schedule eligibility.

## Migration Plan

- Config-only change: one registry field + notes; no data migration.
- Rollout: land registry + docs + tests together; verify `data:validate`, `data:test`, `verify`, plus `--due` vs. `--source` behavior checks.
- Rollback: revert the single `updateCadence` line (and notes) — no canonical or generated files change, so rollback is trivial.
- No deployment steps; scheduled workflow needs no secret changes (it already runs without Facebook credentials).
