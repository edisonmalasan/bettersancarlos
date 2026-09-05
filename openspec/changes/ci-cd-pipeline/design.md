# Design: CI/CD Pipeline

## Context

Verified repo facts: no `.github/` exists; `bun.lock` is text-format (Bun 1.4.0); `npm install` fails (`EOVERRIDE` postcss conflict — AGENTS.md, verified previously); local Node v22.17.1 / Bun 1.4.0; `package.json` has no `packageManager`/`engines`; `tsconfig.tsbuildinfo` is tracked and is dirtied by every build; public repo (free Actions minutes); `main` is unprotected; Vercel runs as zero-config Git integration (no `vercel.json`, no `.vercel/` in repo); `build.sh` is the separate cPanel lane and bumps `version.json`. `next.config.mjs` calls `git rev-parse HEAD` (available on runners after checkout — safe).

## Goals / Non-Goals

**Goals:**
- Verification-only CI: `tsc --noEmit` + production `next build`, reproducible toolchain (Bun 1.4.0 + Node 22), frozen-lockfile installs
- Dependabot for `npm` + `github-actions`, weekly, dev minor/patch grouped
- Branch protection requiring `ci` + Vercel checks on `main`
- Stop tracking generated `tsconfig.tsbuildinfo`

**Non-Goals:**
- No deploy steps in Actions; no Vercel integration tokens/secrets in GitHub
- No `vercel.json` (would alter Vercel's zero-config Git integration behavior for no benefit)
- No test jobs, no lint job (no test suite exists; no lint script exists — nothing to run)
- No changes to `build.sh`, `scripts/bump-version.js`, `version.json`, or the cPanel lane
- No npm usage anywhere in CI

## Decisions

### D1 — Workflow shape (single job, shallow checkout)

```yaml
name: CI
on:
  pull_request:            # default: all branches → targets all; kept simple
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4        # shallow by default (depth 1)
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.4.0             # pinned per user decision 3
      - uses: actions/setup-node@v4      # explicit per user decision 4
        with:
          node-version: 22
      - run: bun install --frozen-lockfile
      - run: ./node_modules/.bin/tsc --noEmit
      - run: bun run build               # "build" script = NODE_ENV=production next build
```

Rationale: single job — the two verification commands are cheap (observed ~70s build locally) and sequenced (typecheck fails fast before the build). `bun run build` uses the existing `package.json` script whose `NODE_ENV=production` inline prefix works on Linux runners. Shallow checkout keeps the 83 MB video history out of CI fetches. Concurrency cancels superseded PR pushes.

**Alternatives rejected:** matrix testing (nothing to matrix — one Bun, one Node); `vercel deploy` steps (Vercel Git integration already does it; double deploys race); calling `build.sh` (bumps version, cPanel-specific).

### D2 — `packageManager: "bun@1.4.0"` field

Informational (Corepack doesn't manage Bun) but documents the toolchain in-repo and makes `bun` invocations self-documenting. Added as a field-only change; no behavior impact.

### D3 — Untracking `tsconfig.tsbuildinfo`

`git rm --cached tsconfig.tsbuildinfo` + `.gitignore` line. Local copy stays on disk (tsc continues incremental caching). After this, builds never dirty the diff — permanent fix for the repeated `git checkout -- tsconfig.tsbuildinfo` dance performed throughout development sessions.

### D4 — Dependabot configuration

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      dev-minor-patch:
        dependency-type: "development"
        update-types: ["minor", "patch"]
    open-pull-requests-limit: 5
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

Rationale: Dependabot supports the `npm` ecosystem against `bun.lock` text format (verified capability claim: Dependabot added Bun lockfile support; if a specific release fails to parse `bun.lock`, the visible symptom is no Dependabot PRs — check the "Dependency graph" settings page for errors and fall back to manual updates). Major updates for dependencies stay individual (deliberate review); dev minor/patch grouped per user decision 6; `open-pull-requests-limit` prevents backlog pileup.

### D5 — Branch protection (settings-side, not file-side)

Required checks on `main`: `verify` (the CI job) + Vercel check (name as it appears on PRs, typically `Vercel`). Configured during apply via `gh api` (or dashboard by the user). Also allow Dependabot PRs to run CI normally — no exceptions needed since the repo is public (Actions run free on public repos, including `pull_request` from Dependabot branches).

**Alternative rejected:** required check by exact Vercel check-run name guessed in advance — verify the actual check name from an existing PR's checks before configuring, otherwise protection can lock merges out.

### D6 — First-run bootstrap ordering

CI must run green once on `main` (workflow_dispatch after merge) before protection can require the `verify` check by name — a required check that has never reported leaves PRs permanently blocked. Order: merge workflow → trigger manual run → confirm check name → enable protection. The Vercel check already exists on past PRs, so it's safe to require immediately.

## Risks / Trade-offs

- [`--frozen-lockfile` fails on Dependabot PRs if it edits `package.json` without regenerating `bun.lock`] → Dependabot's npm ecosystem updates `bun.lock` for Bun projects; verified on first Dependabot PR — if mismatch occurs, Dependabot version-bump PRs get closed and Bun updates move to manual
- [`next build` memory/time on runner exceeds local] → observed build ~70s local; ubuntu-latest runners have ≥4GB RAM for Next 15 static export — adequate; if OOM occurs, add `NODE_OPTIONS=--max-old-space-size` to the build step only
- [`git rev-parse HEAD` in next.config yields shallow-hash ambiguity] → shallow checkout still has HEAD; revision is used for SW precache only — cosmetic if truncated
- [Required-check name mismatch locks merges] → D6 bootstrap ordering + verify exact check names on PR #6's checks before enabling protection
- [`actions/checkout@v4` on a repo with large blobs] → shallow fetch avoids history; 83 MB video is in the tip tree (one-time download per run, cached runner-to-runner reasonably)

## Migration Plan

1. Create workflow + dependabot + `packageManager` + gitignore/untrack on the CI branch; verify CI green on the PR itself (dogfood)
2. Merge → run `workflow_dispatch` on `main` to establish the `verify` check
3. Enable branch protection requiring `verify` + Vercel checks (D6 order)
4. First weekly Dependabot PRs exercise the full loop; verify lockfile sync behavior
5. Rollback: delete the two `.github` files, revert `package.json`/`.gitignore`, disable protection — nothing else was touched

## Open Questions

None — all seven decisions approved by the user (branch protection yes; untrack yes; Bun 1.4.0 pinned; Node 22 explicit; `packageManager` field yes; dev grouping yes; PR + push-to-main triggers yes).
