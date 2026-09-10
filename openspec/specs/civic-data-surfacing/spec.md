# civic-data-surfacing Specification

## Purpose
Governs how verified civic research data appears on the Better San Carlos site so that every published city fact is traceable to the research corpus, verification status is visible, and no wrong-city or unsourced data ships.

## Requirements

### Requirement: City facts are correct and traceable
Every population, area, barangay count, classification, phone number, official name, and statistic displayed on the site SHALL match the verified research corpus (files prefixed `26-09-` under `research/`, excluding `unverified-` files). Where research documents a conflict (e.g. land area 169.03 vs 170.87 km²), the site SHALL use the research-documented primary value and MAY note the conflict.

#### Scenario: Homepage stats match research
- **WHEN** the homepage Quick Stats section renders
- **THEN** population is 205,424 (2020 census), barangay count is 86, income class is 3rd-class city, and land area is 169.03 km², each labeled with its source year

#### Scenario: Contact phone matches research
- **WHEN** any page displays the city hall phone number
- **THEN** it shows the verified (075) 600-1432 and no unverified mobile numbers are presented as official

### Requirement: Unverified data is labeled, never presented as fact
Data the research marks as unverified, historical, or pending (e.g. FY2017–2025 budget, DOH license data, water district identity, intra-city fares, 2025/2026 festival dates) SHALL NOT be rendered as established fact. Such sections SHALL either be omitted or rendered with an explicit pending/verification notice.

#### Scenario: Budget page labels its data
- **WHEN** the budget page renders fiscal data
- **THEN** only the verified FY2009–2016 series is presented as fact and any other period or projection is labeled pending verification

#### Scenario: DOH facility data shows name-only status
- **WHEN** a health facility renders with no license/bed data
- **THEN** it displays only its name/type with a visible "verification pending" indicator, not placeholder license or bed numbers

### Requirement: One canonical data source per fact
Each civic fact SHALL have exactly one canonical JSON source under `data/` that pages import or fetch; duplicated hardcoded values in page files SHALL be removed where a JSON source exists. Every `data/*.json` file SHALL be mirrored byte-identical to `public/data/` so runtime fetches succeed.

#### Scenario: No duplicated hardcoded series
- **WHEN** a page renders a data series that exists in a `data/*.json` file
- **THEN** it reads from that file (static import or fetch) rather than duplicating the values in JSX

#### Scenario: Runtime fetches resolve
- **WHEN** a page fetches a `data/` JSON at runtime
- **THEN** the identical file exists under `public/data/` and the fetch succeeds in the static build

### Requirement: New directory pages follow existing patterns
Each new directory page (about, health, education, tourism, agriculture, transportation, disaster-preparedness, utilities) SHALL use the shared `PageHeader` component, static JSON data sources, canonical section rhythm and card system from the visual-design-system spec, and be reachable from the sitemap page and at least one related existing page. No new page SHALL break the existing 404/nav behavior.

#### Scenario: New page is discoverable
- **WHEN** a new directory page is added
- **THEN** it is linked from `/sitemap` and from at least one related page or section, and renders with the shared page header

#### Scenario: New page passes build gates
- **WHEN** the site builds for production
- **THEN** the new route prerenders as static HTML with no TypeScript errors

### Requirement: Barangay data joins by one canonical scheme
Barangay populations, classifications, and contacts SHALL join to the existing 86-barangay slug scheme (including name variants like "(Poblacion)" entries) using one canonical name/slug mapping; a barangay page SHALL NOT display data belonging to a different barangay.

#### Scenario: Barangay page shows its own population
- **WHEN** a barangay detail page renders
- **THEN** the displayed 2020/2015 populations equal that barangay's values in the barangay directory research (e.g. Turac 6,919/2020)

### Requirement: All verified research categories are surfaced
Each of the 21 research categories from `research/README.md` SHALL have a surfaced implementation (page section, page, or dataset consumed by a page) or an explicit tracked exclusion with reason. Documentation-only research files (gap logs, extraction roadmaps, GIS plans) MAY be tracked as excluded-with-reason.

#### Scenario: Category checklist is complete
- **WHEN** the tracking checklist for this change is reviewed
- **THEN** all 21 categories map to an implementation or a documented exclusion, with zero silently-skipped categories
