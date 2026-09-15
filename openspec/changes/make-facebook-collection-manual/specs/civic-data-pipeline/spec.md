## MODIFIED Requirements

### Requirement: Refresh command surface
The repository SHALL provide developer commands: `data:refresh` (collect due/selected sources into a research run), `data:diff` (diff candidates against canonical records and emit a review report), `data:validate`, `data:generate` (produce compatibility JSON from canonical records), `data:report` (summarize data health: staleness, conflicts, source coverage), and `verify` (typecheck + build + data validation). Refresh SHALL accept source or domain filters (e.g. `--source`, `--domain`) and SHALL record them in the manifest under the canonical `sources`/`domains` scope contract. Acquisition SHALL be routed per source: HTTP(S) sources through the shared polite fetcher, API-backed sources through their dedicated acquisition path under the same run contract. Only successful outcomes (`collected`, `unchanged`) SHALL satisfy a source's normal cadence; failures SHALL retry sooner per policy and skipped or unregistered sources SHALL never count as checks. Sources with non-time-based cadences (`manual`, `per-document`) SHALL NOT be eligible for `--due` scheduled collection regardless of elapsed time; they SHALL be collected only when explicitly requested via `--source`, `--domain`, or their dedicated manual path.

#### Scenario: Filtered refresh
- **WHEN** `bun run data:refresh -- --source=psa` runs
- **THEN** only the registered PSA-related sources are collected into a new research run

#### Scenario: Verify includes data validation
- **WHEN** `bun run verify` runs
- **THEN** it performs typecheck, production build prerequisites, and civic-data validation, and fails if any step fails

#### Scenario: Failed attempt does not satisfy cadence
- **WHEN** a monthly source fails and the next scheduled refresh runs days later
- **THEN** the source is eligible again per the retry policy instead of waiting out the month

#### Scenario: API source uses its acquisition path
- **WHEN** a refresh includes an API-backed source with valid credentials
- **THEN** acquisition uses that source's dedicated path (Graph JSON for Facebook), not the generic page fetcher

#### Scenario: Manual source excluded from due refresh
- **WHEN** `bun run data:refresh -- --due` runs after arbitrary elapsed time
- **THEN** no `manual`-cadence source is selected solely because time has elapsed, while due time-based sources with collectors are still selected normally

#### Scenario: Manual source runs on explicit request
- **WHEN** `bun run data:refresh -- --source=lgu-facebook-cio` runs (or its dedicated manual ingest path)
- **THEN** the manual-cadence source is collected through its registered acquisition and collector, producing evidence, source instances, and provisional candidates under the same run contract
