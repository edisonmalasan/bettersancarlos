## 1. Workflow & Config Files

- [x] 1.1 Create `.github/workflows/ci.yml` per design D1: triggers `pull_request → main`, `push → main`, `workflow_dispatch`; concurrency group `ci-${{ github.ref }}` with `cancel-in-progress`; single `verify` job on `ubuntu-latest` with steps: `actions/checkout@v4`, `oven-sh/setup-bun@v2` (`bun-version: 1.4.0`), `actions/setup-node@v4` (`node-version: 22`), `bun install --frozen-lockfile`, `./node_modules/.bin/tsc --noEmit`, `bun run build` — verify YAML parses (e.g. `bun x yaml-lint` or careful review) and job name is `verify`
- [x] 1.2 Create `.github/dependabot.yml` per design D4: `npm` ecosystem weekly with `dev-minor-patch` group (development, minor+patch) and `open-pull-requests-limit: 5`; `github-actions` ecosystem weekly — verify file is valid per Dependabot config reference
- [x] 1.3 Add `"packageManager": "bun@1.4.0"` to `package.json` (field only, no script/dependency changes) — verify `git diff package.json` touches only that line and `bun install --frozen-lockfile` still succeeds locally

## 2. Repository Hygiene

- [x] 2.1 Untrack generated build metadata: `git rm --cached tsconfig.tsbuildinfo` and append `tsconfig.tsbuildinfo` to `.gitignore` — verify the file remains on disk, `git ls-files tsconfig.tsbuildinfo` returns nothing, and running the production build no longer produces a dirty diff
- [x] 2.2 Run `./node_modules/.bin/tsc --noEmit` and production build (`NODE_ENV=production next build` equivalent, `bun run build`) — verify both pass before pushing (CI will re-run these)

## 3. Push, Merge, Bootstrap Protection

- [x] 3.1 Commit on `ci/ci-cd-pipeline`, push, open PR to `main` — verify the new `verify` check appears and passes on the PR (dogfooding the workflow), alongside the existing Vercel check (PR #7; verify PASSED 52s; check names confirmed: `verify` + `Vercel`)
- [x] 3.2 After approval, merge the PR (merge commit per repo convention) — verify CI re-runs on `main` via the `push` trigger and passes (PR #7 merged f39bd64; push-triggered run on main: success)
- [x] 3.3 Trigger `workflow_dispatch` run on `main` to establish the `verify` check name history — verify the run is green (run 33993498192: success)
- [x] 3.4 Enable branch protection on `main` requiring the `verify` check and the Vercel check (confirm exact Vercel check name from PR checks first) per design D5 — verify a fresh PR with a deliberate failure (e.g. temp branch) is blocked, then delete the temp branch (required contexts: `verify` + `Vercel` — the deployment check, confirmed by deployment URL, not `Vercel Preview Comments`; enforce_admins on; force-push/deletion off; PROOF: temp PR #15 with deliberate tsc error → `verify` failed → merge refused `BLOCKED`; closed and deleted. Also blocked a direct push to main — protection active)
- [x] 3.5 Wait for / verify the first Dependabot PRs arrive (npm + github-actions) and run CI green with `--frozen-lockfile` — if a lockfile mismatch appears, report and fall back to manual Bun updates per design D4 (VERIFIED WITH FINDING: 7 Dependabot PRs arrived; PR #11 confirmed the flagged risk — `package.json` edited without `bun.lock` regeneration, `--frozen-lockfile` fails. Resolved by approved pivot to Renovate; see new tasks 4.x)

## 4. Dependency Bot Migration (Dependabot -> Renovate)

- [x] 4.1 Verify Renovate end-to-end on a disposable private test repo (Step 0): PR updates `package.json` + `bun.lock` together, `bun install --frozen-lockfile` passes, CI `verify` check passes (test repo `bettersancarlos-renovate-test`, self-hosted Renovate 42.99; PR#9 = package.json + bun.lock in one diff, frozen install passed locally, CI `verify` pass 1m02s)
- [x] 4.2 Close the 7 Dependabot PRs unmerged (user closed them during migration)
- [x] 4.3 Delete `.github/dependabot.yml` and add production `renovate.json` (design D4: bun + github-actions managers, Asia/Manila weekday-night schedule, dev minor/patch group, bun-pin update rule disabled) via PR — verify CI green and merge (PR #17, verify + Vercel both pass, merged)
- [x] 4.4 User installs the Mend Renovate GitHub app on this repository (dashboard action; link provided) (installed 2026-09-06; confirmed by first real Renovate PRs appearing)
- [x] 4.5 Verify Renovate opens its onboarding PR, then the first real update PR: both files together, frozen-lockfile install passes, verify check green - no auto-merge of any dependency PR (onboarding PR skipped by design: renovate.json exists so Renovate went straight to updates. PR #21 fix(deps) update next to ^15.5.25: diff = package.json + bun.lock together, frozen-lockfile install verified on branch, verify 43s pass + Vercel pass. PR #22 = node-version bump in ci.yml via the github-actions manager uses-with support. Schedule restored to weekday-night window after verification. NO PRs merged - awaiting user review)
