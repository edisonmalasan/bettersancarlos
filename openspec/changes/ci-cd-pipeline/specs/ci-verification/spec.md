## Purpose

Defines the repository's automated verification contract: GitHub Actions CI runs the project's real verification steps (typecheck, production build) with a pinned toolchain on every PR and push to `main`, Dependabot keeps dependencies and workflow actions current, and `main` cannot receive unverified changes.

## ADDED Requirements

### Requirement: CI verifies every pull request and push to main
The system SHALL run a CI workflow on every pull request targeting `main` and on every push to `main`, and the workflow SHALL run the project's verification commands: `./node_modules/.bin/tsc --noEmit` and a production Next.js build equivalent to `next build`.

#### Scenario: Pull request opened
- **WHEN** a pull request targeting `main` is opened or updated
- **THEN** the CI workflow runs and reports pass/fail status on the PR

#### Scenario: Direct push to main
- **WHEN** a commit is pushed directly to `main`
- **THEN** the CI workflow runs on that commit

### Requirement: CI uses the Bun toolchain exclusively
The system SHALL perform dependency installation and script execution in CI using Bun only, with a pinned Bun version matching the local development environment (1.4.0) and `--frozen-lockfile` installation against the committed `bun.lock`, and SHALL NOT invoke npm for installation.

#### Scenario: Lockfile out of sync
- **WHEN** `package.json` is changed without a corresponding `bun.lock` update
- **THEN** CI fails at the install step (`--frozen-lockfile` mismatch)

#### Scenario: Deterministic toolchain
- **WHEN** CI runs
- **THEN** Bun is version 1.4.0 and Node is version 22, regardless of runner image defaults

### Requirement: CI performs verification only and never deploys
The CI workflow SHALL NOT contain deployment steps, SHALL NOT interact with Vercel (no deploy, no required secrets), and SHALL NOT run the cPanel `build.sh` script (which bumps `version.json`).

#### Scenario: Vercel remains the sole deployer
- **WHEN** CI passes on a merged PR or push to `main`
- **THEN** Vercel's Git integration independently produces the Production deployment, and CI runs no deployment step

#### Scenario: Version file untouched by CI
- **WHEN** CI runs
- **THEN** `version.json` and the `package.json` version field are not modified

### Requirement: Unverified changes cannot reach main
Branch protection on `main` SHALL require the CI status check and the Vercel check to pass before a pull request can be merged.

#### Scenario: Failing CI blocks merge
- **WHEN** a pull request has a failing CI check
- **THEN** the merge is blocked until CI passes

#### Scenario: Passing checks allow merge
- **WHEN** both the CI check and the Vercel check pass on a pull request
- **THEN** the merge is permitted

### Requirement: Generated build metadata is not tracked
The repository SHALL NOT track generated TypeScript build metadata (`tsconfig.tsbuildinfo`) — it SHALL be untracked and gitignored, so builds cannot dirty the working diff.

#### Scenario: Build does not dirty the diff
- **WHEN** a developer runs the production build locally
- **THEN** `git status` reports no change for `tsconfig.tsbuildinfo`

### Requirement: Dependabot maintains dependencies and workflow actions
The system SHALL configure Dependabot to open weekly update PRs for the `npm` ecosystem (covering `package.json` and `bun.lock`) and the `github-actions` ecosystem, with dev-dependency minor/patch updates grouped into a single PR, and each Dependabot PR SHALL be verified by the same CI workflow.

#### Scenario: Outdated dependency
- **WHEN** a dependency release is available and the weekly schedule fires
- **THEN** Dependabot opens a PR updating the dependency, and CI verifies it with the frozen lockfile install

#### Scenario: Grouped dev updates
- **WHEN** multiple dev-dependency minor/patch updates are available
- **THEN** they arrive as one grouped PR rather than individual PRs
