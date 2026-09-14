## MODIFIED Requirements

### Requirement: CI verifies every pull request and push to main
The system SHALL run a CI workflow on every pull request targeting `main` and on every push to `main`, and the workflow SHALL run the project's verification commands: `./node_modules/.bin/tsc --noEmit`, civic-data validation equivalent to `bun run data:validate`, and a production Next.js build equivalent to `next build`. Civic-data validation SHALL operate deterministically on repository state without network access, and the CI workflow SHALL NOT perform scraping or source fetching.

#### Scenario: Pull request opened
- **WHEN** a pull request targeting `main` is opened or updated
- **THEN** the CI workflow runs and reports pass/fail status on the PR

#### Scenario: Direct push to main
- **WHEN** a commit is pushed directly to `main`
- **THEN** the CI workflow runs on that commit

#### Scenario: Invalid civic data fails CI
- **WHEN** a PR introduces civic data that fails `data:validate` (broken source reference, stale published record, unknown status value)
- **THEN** CI fails with an error identifying the offending record, and the PR cannot merge

#### Scenario: CI never scrapes
- **WHEN** the CI verification workflow runs
- **THEN** no step performs network-dependent civic collection; validation succeeds or fails purely on repository state
