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
- [ ] 3.5 Wait for / verify the first Dependabot PRs arrive (npm + github-actions) and run CI green with `--frozen-lockfile` — if a lockfile mismatch appears, report and fall back to manual Bun updates per design D4
