# Proposal: CI/CD Pipeline — GitHub Actions Verification, Vercel Deployments, Renovate

## Why

The repository has no CI at all (no `.github/` directory): type errors and broken builds can only be caught by hand-running `tsc --noEmit` and `next build` locally, and dependency updates never arrive. Vercel already deploys via Git integration but nothing independently verifies that a change compiles and type-checks before it reaches `main`. This change adds GitHub Actions verification and automated dependency updates while leaving the working Vercel deployment path untouched. The dependency bot was originally Dependabot; its npm ecosystem failed frozen-lockfile on the first real batch (package.json edited without bun.lock regeneration), and it was replaced by Renovate after end-to-end verification on a disposable private repo.

## What Changes

- Add `.github/workflows/ci.yml` — verification-only CI (no deploy steps): Bun 1.4.0 (pinned) install with `--frozen-lockfile`, Node 22, `./node_modules/.bin/tsc --noEmit`, production `next build`
- Add automated dependency updates for the `bun` and `github-actions` managers (ultimately via `renovate.json` — see design D4 — after Dependabot failed the frozen-lockfile requirement in practice); dev-dependency minor/patch grouped to reduce PR noise
- Untrack `tsconfig.tsbuildinfo` (generated output, observed dirtied by every build this session) and add it to `.gitignore`
- Add `"packageManager": "bun@1.4.0"` to `package.json` for clarity (informational; Corepack does not manage Bun)
- Branch protection on `main`: require the `ci` check and Vercel check to pass before merge (configured in GitHub settings, not files)
- Explicitly out of scope: any Vercel deploy from Actions, `vercel.json`, test jobs (no test suite exists — CI runs only the two real verification commands), changes to `build.sh`/cPanel lane

## Capabilities

### New Capabilities

- `ci-verification`: The contract for automated verification on this repository — what CI runs, on what triggers, with which toolchain (Bun 1.4.0, Node 22, frozen lockfile), and that CI never deploys.

### Modified Capabilities

- (none — Vercel deployment behavior and build scripts are unchanged; no existing spec covers CI)

## Impact

- **Files created**: `.github/workflows/ci.yml`, `renovate.json` (`.github/dependabot.yml` was created, then removed during the Renovate pivot)
- **Files changed**: `package.json` (+`packageManager` field only), `.gitignore` (+1 line)
- **Files untracked**: `tsconfig.tsbuildinfo` (removed from index, stays on disk where present)
- **GitHub settings** (outside repo files): branch protection on `main` requiring `ci` + Vercel checks — user configures or approves configuration via gh CLI during apply
- **Systems**: GitHub Actions (public repo — unlimited minutes); Vercel Git integration continues owning Preview + Production deployments; Renovate PRs run the same CI workflow
- **Risk**: `bun install --frozen-lockfile` requires `bun.lock` to stay in sync with `package.json` — any manual dependency edit without `bun install` will fail CI (this is the intended guard)
