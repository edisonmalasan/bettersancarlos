# Design: fix-civic-collection-runtime-gaps

## Context

See `proposal.md` (Why) for motivation. Current state, verified against `main`:

- `diff.ts` gates MISSING on run/domain scope only: any in-scope canonical record without a candidate and without a failed-source match is MISSING. `lgu-website` spans 5 registry domains while `collectors/city-website.ts` `WATCHED_CONTACTS` covers exactly `city-hall-trunk-line`.
- `refresh.ts` fetches every URL source with the shared text fetcher (`fetchText`), including `lgu-facebook-cio`, whose page URL returns HTML the Graph-JSON collector rejects. `scripts/data/ingest-facebook.ts` already implements correct Graph acquisition (fields, version, retry/backoff, auth-code taxonomy, fixture mode, dormant-without-token, token never persisted) plus run generation, but the generic refresh path never calls it.
- `promote.ts` validates the proposed state in memory, then performs two sequential `writeJsonAtomic` calls with no interlock between the renames.
- `refresh.yml` checks out `main`, so `lastCheckTimes` never sees runs pending on `chore/scheduled-refresh`; the PR-step `checkout -B` + rebase can additionally resurrect stale code and collide on same-date run dirs.

Constraints: Bun/Node stdlib only; static export untouched; fail-closed throughout; no new collectors in this change.

## Goals / Non-Goals

**Goals:** fact-precise MISSING; one acquisition model with credential safety; torn-pair-proof promotion; branch-aware scheduling that always runs latest `main` code.

**Non-Goals:** new collectors; frontend changes; database or external queue; changing the canonical record/source/instance data model beyond additive run/metadata fields; auto-promotion of anything new.

## Decisions

### D1. Coverage lives on the collector result and in the manifest
`CollectorResult` gains `coverage: { expectedRecordIds: string[] }` — the exact canonical IDs the extractor attempted this run. Refresh persists it per source in `manifest.json` (`coverage: { "<source-id>": [...] }`, optional for backwards compatibility). Alternatives: a separate coverage file (extra artifact for data that is naturally per-source manifest metadata — rejected); deriving coverage from candidate IDs (conflates observed with attempted — precisely the bug — rejected).

### D2. MISSING requires an explicit coverage claim
New diff rule: a record is MISSING only if (a) its ID is in some attempted source's coverage list for this run, (b) the source outcome was successful (`collected`/`unchanged`), and (c) no candidate covers it. Records merely sharing a registry domain are excluded from fact-level comparison. Runs predating coverage metadata (absent field) behave as coverage-empty: no MISSING from them, only UNCHANGED/CHANGED/NEW/CONFLICT plus failure-derived outcomes — conservative by construction, and it makes the old false-MISSING shape impossible going forward. Alternative (infer coverage from registry domains) is the status quo bug — rejected.

### D3. SOURCE_UNAVAILABLE/SOURCE_CHANGED resolve through provenance, not collectors
Failed-source dependent mapping stays collector-independent: canonical exact source → `registryId` (+ declared collector coverage where it narrows the set). Zero candidates required. Parse-class failures map the same way with the `parse:` error convention. This preserves current correct behavior while the coverage model only tightens MISSING.

### D4. Acquisition is a dispatched strategy; Facebook keeps one implementation
New small module (e.g. `lib/acquire.ts`): `acquireEvidence(entry, { offline, evidenceDir, fetch })` dispatches on registry `acquisition` field (`http` default; `facebook-graph` for `lgu-facebook-cio`; schema + docs gain the optional field). The Graph fetcher moves out of `ingest-facebook.ts` into the shared module with its retry/auth taxonomy intact; `ingest-facebook.ts` becomes a thin manual wrapper (same CLI/env contract) over acquire + `runRefresh`, eliminating the two-pipeline divergence. Alternatives: collector-owned acquisition (splits fetch policy per collector — rejected); workflow-level special-casing (leaves the `data:refresh` hole open — rejected). Credential rule: tokens travel in memory only, URLs are redacted before any log/error/manifest write, and the existing secret-scan validation covers the new paths.

### D5. Dormant-by-default Facebook in scheduled runs
No token/page ID → the Facebook source records an explicit dormant/skip outcome with a manifest note; the job continues with other sources and never fails the whole refresh for missing optional credentials. With credentials → full Graph acquisition into the same run format, then review PR as usual. No auto-promotion inside refresh (unchanged).

### D6. Two-file commit with backup-based rollback and idempotent recovery
Promotion stages both replacements as temp files, snapshots the live pair to versioned backup names, renames staged→live (records, then sources), verifies readability, and cleans up on success. Any failure before commit completion restores both backups; crash leftovers (staged temps or backups present in `data/civic/`) are detected by the next `data:validate` (loud error naming them) and recovered deterministically by the next `data:promote` start (complete-if-both-staged-valid else restore-from-backup), with git as the final backstop. Alternatives: journal file (equivalent complexity, less transparent than visible backups — rejected); database (explicit non-goal — rejected); git-only recovery (requires human notice — rejected as the primary mechanism, kept as backstop).

### D7. Scheduled flow never checks out stale code
Reworked job: checkout latest `main` (full history) → fetch the refresh branch if it exists → import ONLY its `research/runs/` paths into the worktree (never checkout the branch, so `main` code wins by construction) → compute run IDs unique across local + imported + remote listings → refresh/diff/validate/guard unchanged → commit → fast-forward-push if the remote tip still matches the imported snapshot, else merge remote first (additive runs merge cleanly; any conflict fails loudly for a human) → single PR update as today. Alternatives: rebasing the refresh branch onto main (rewrites pushed history and reintroduces stale-code races — rejected); per-run branches (violates one-PR invariant — rejected).

### D8. Schemas stay additive
Manifest gains optional per-source `coverage`; registry gains optional `acquisition`; run-ID/date rules, source-instance contract, and candidate format are unchanged. Old runs validate as before; absent coverage simply yields no MISSING (D2).

## Risks / Trade-offs

- [Coverage lists go stale when canonical IDs rename] → Mitigation: unknown coverage IDs are ignored with a findings note; validation warns on coverage IDs matching no canonical record.
- [Backup files visible in data/civic after a crash] → Mitigation: next validate/promote detects and reports or recovers them deterministically; success path always cleans up (tested).
- [Graph token in request URL] → Mitigation: redaction helper applied to every log/error/manifest write path; secret-scan test asserts no token-shaped material in run artifacts.
- [Scheduled merge conflicts on concurrent runs] → Mitigation: concurrency group already serializes runs; residual conflicts fail loudly instead of force-pushing.
- [Two registry knobs (`collector`, `acquisition`) could confuse] → Mitigation: `collector` keeps meaning "parser"; `acquisition` means "fetcher", defaulting to `http`; docs table documents both with the Facebook row as the worked example.

## Migration Plan

Additive only: new optional fields, new helper modules, workflow step edits. No canonical data migration (records/sources untouched). Old research runs remain readable; their absent coverage metadata conservatively suppresses MISSING. Rollback per phase is `git revert`. The `data:ingest-facebook` CLI contract is preserved as a wrapper, so existing docs/commands keep working.

## Open Questions

None — the spec deltas and this design resolve the four issues fully; remaining detail (exact helper names, test placement) is implementation-level and covered by tasks.
