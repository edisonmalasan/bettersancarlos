## 1. Policy and schemas

- [x] 1.1 Create `scripts/data/lib/policy.ts` with the shared cadence table (days + time-based flags per D6), `nextReviewDate()`, `isTimeBasedCadence()`, `isHighRisk()`, `isPublishedStatus()`, `isSuccessfulCollectionOutcome()`, and the retry table; verify with `bun test` unit cases for every cadence and the high-risk domain/type matrix
- [x] 1.2 Add JSON Schemas for `source-instances.json` and extend the manifest/candidate/record schemas with versioned, backwards-compatible instance-link fields; verify each schema loads and the existing fixtures still validate against them
- [x] 1.3 Delete the duplicated `CADENCE_DAYS` / `CADENCE_INTERVAL_DAYS` maps and rewire `refresh.ts` + `promote.ts` to the policy module with no behavior change; verify `bun test` passes unchanged and `data:validate` output is identical

## 2. Exact provenance

- [x] 2.1 Implement the source-instance read/write helpers (stable `src-<registry>-<date>-<hash8>` IDs, evidence saving with SHA-256) and `source-instances.json` run-artifact I/O; verify a fixture round-trip plus byte-identical re-collection reusing the same content key
- [x] 2.2 Extend collectors to emit source-instance candidates alongside civic candidates referencing instance IDs; verify with recorded Graph/HTML fixtures that output is deterministic and civic candidates no longer need bare registry IDs
- [x] 2.3 Rework `promote.ts` to accept source instances atomically with records (validate-then-write-twice, history preserves old source refs, dedupe on registry+hash); verify Test 3 (forced mid-promotion error leaves both files byte-identical) and Test 2 (supersession history)
- [ ] 2.4 Migrate the two registry-only note records to exact source instances and tighten `validate.ts` to reject bare registry IDs in canonical records (candidates exempt); verify `data:validate` passes on the migrated corpus and fails on a deliberately registry-cited copy
- [ ] 2.5 Make `generate.ts` resolve source labels strictly from `sources.json` and fail loudly on unresolvable references; verify the failure names the record and mirrors are untouched, then verify full parity output on the migrated corpus
- [ ] 2.6 Add Test 1 end-to-end (refresh → evidence → candidate → independent promotion → instance in `sources.json` → exact reference → generate succeeds); verify it passes offline

## 3. Diff scope fix

- [ ] 3.1 Define the canonical manifest scope contract (`sources`/`domains` arrays) and derive diff scope as requested ∪ attempted-source registry domains ∪ candidate domains (passing registry data into `diffRun`); verify the old singular-`domain` fixture style is gone from tests
- [ ] 3.2 Implement `SOURCE_UNAVAILABLE`-with-zero-candidates and `MISSING`-on-successful-gap plus out-of-scope exclusion; verify Tests 4 and 5 using real `runRefresh()` output fed into `diffRun()` (no hand-built manifests): domain-scoped refresh + unavailable source, and domain-scoped success + missing candidate

## 4. Cadence and retry hardening

- [ ] 4.1 Switch due computation to last-successful-check semantics (`collected`/`unchanged` only; `skipped`/`unregistered` never count); verify Test 6 (monthly failure stays eligible at the next scheduled refresh) and that untouched-source runs are unchanged
- [ ] 4.2 Enforce cadence windows plus the non-time-based sentinel rule in `validate.ts` via the shared policy; verify Test 7 (quarterly + 2099 fails) and update the existing valid fixture to a window-legal date
- [ ] 4.3 Recompute promotion `nextReviewOn` from the shared policy and assert policy/validator agreement in tests; verify a promotion for every cadence yields a validation-clean record

## 5. Risk hardening

- [ ] 5.1 Replace the scattered domain list + tier default with centralized `isHighRisk()` (tier, domain, type) and make `riskTier` required on canonical records with a backfill audit; verify no current record silently changes class and new official-type facts default high-risk
- [ ] 5.2 Enforce no-downgrade on promotion (existing high stays high regardless of candidate content); verify Test 8 (same-identity refusal, independent-identity success) for a high-risk record

## 6. Freshness semantics

- [ ] 6.1 Pin `manual`/`per-document`/`event-driven` behavior (sentinel rule, no new fields) across validate/promote/report; verify Test 9 (legitimate per-document record passes with no fake horizon) and that all 41 existing non-scheduled records still validate
- [ ] 6.2 Group `data:report` output by review class (scheduled, event-driven, manual, document-triggered); verify each class appears correctly on a mixed fixture and `bun run data:report` stays offline

## 7. CI and runbook

- [ ] 7.1 Add the `data:test` script running the offline pipeline suite and insert it into `.github/workflows/ci.yml` between validation and build; verify CI config by running the same command sequence locally
- [ ] 7.2 Update the scheduled `refresh.yml` only as required by the hardened run schema (new artifact rides along in run PRs; guard still refuses non-run changes); verify with a manual dispatch producing a reviewable run PR with no canonical changes
- [ ] 7.3 Update `AGENTS.md` + `docs/data-pipeline.md` (instance lifecycle, scope model, retry policy, risk rules, sentinel semantics, Test-10 unchanged-data guarantee); verify a fresh-agent Scenario-H dry run following only the runbook
- [ ] 7.4 Run Test 10 (identical evidence + identical fact → UNCHANGED with no new history revision) plus the full suite, `tsc --noEmit`, `data:validate`, and production `next build`; verify the frontend spot-check renders identically

## 8. Collector roadmap only

- [ ] 8.1 Document the prioritized collector roadmap (PSA, FDPP, DPWH, Comelec, DOH/DepEd, CENPELCO, others; PSGC/CMCI parked) with value/volatility/stability rationale per source; verify every registry source appears exactly once with either a priority or a parked reason. No collectors implemented in this change
