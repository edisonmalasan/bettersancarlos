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
Each civic fact SHALL have exactly one canonical source under `data/` that pages import or fetch; duplicated hardcoded values in page files SHALL be removed where a JSON source exists. For domains migrated to the civic-data pipeline, the single canonical source of truth SHALL be the canonical civic record (stable ID, record-level provenance), and the `data/*.json` file consumed by pages SHALL be a generated compatibility output of that record rather than an independently editable fact store. Every `data/*.json` file SHALL be mirrored byte-identical to `public/data/` so runtime fetches succeed.

#### Scenario: No duplicated hardcoded series
- **WHEN** a page renders a data series that exists in a `data/*.json` file
- **THEN** it reads from that file (static import or fetch) rather than duplicating the values in JSX

#### Scenario: Runtime fetches resolve
- **WHEN** a page fetches a `data/` JSON at runtime
- **THEN** the identical file exists under `public/data/` and the fetch succeeds in the static build

#### Scenario: Migrated fact edits go through canonical promotion
- **WHEN** a contributor changes a civic fact in a migrated domain
- **THEN** the change is accepted into the canonical civic record and regenerated, not hand-edited into the compatibility JSON

### Requirement: Record-level verification traceability on the site
Every civic fact displayed on the site SHALL be traceable to canonical civic record provenance: published facts in migrated domains SHALL originate from canonical records whose status and sources are known, and the site SHALL NOT present a record with status `blocked`, `needs-reverification`, or `provisional` as unquestionably current fact. Where the frontend already renders verification labeling (pending notices, historical markers), generated compatibility data SHALL provide the status information needed to render those labels.

#### Scenario: Blocked contact is visibly not current
- **WHEN** a high-risk record (e.g. an emergency contact) is `blocked` or `needs-reverification` in canonical data
- **THEN** the site renders it with its historical/pending labeling rather than as a verified current contact

#### Scenario: Published fact traces to canonical record
- **WHEN** a displayed fact in a migrated domain is audited
- **THEN** it maps to a canonical record ID whose source references and acceptance history can be inspected

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

### Requirement: Accreditation is labeled accreditation, never licensure
Any surfaced health-facility accreditation fact (beds, level/type, accreditation expiry, accredited status) SHALL be labeled as PhilHealth accreditation. The site SHALL NOT display a DOH license number, LTO status, or license expiry for a facility unless canonical DOH evidence exists, and facilities without license data SHALL render name/type with a visible verification-pending indicator.

#### Scenario: Accredited facility shows no license claim
- **WHEN** a health page renders a facility backed only by PhilHealth accreditation evidence
- **THEN** beds, level, and accreditation expiry appear under an accreditation label with a pending-license indicator, and no license number or license-expiry value is shown

### Requirement: Historical contacts are labeled historical, never current
SCCWD contact, address, and leadership values known only from 2017-vintage sources (and the City Health Office phone known only from the 2017 archive) SHALL either be omitted or rendered with an explicit historical marker; they SHALL NOT be presented as current contact information.

#### Scenario: Vintage SCCWD phone is not a current hotline
- **WHEN** a utilities page has only 2017-vintage SCCWD telephone values
- **THEN** it omits them or shows them under a historical label, never as the current district hotline

### Requirement: Province appropriations are never presented as SRE data
Surfaced Province of Pangasinan budget-review/appropriation documents SHALL be labeled as appropriation/authorisation documents of the Province (with year, issuing authority, and document type visible). They SHALL NOT appear in the BLGF SRE income/expenditure series, and the FY2017–FY2025 SRE gap SHALL remain labeled pending/blocked.

#### Scenario: Budget page keeps the SRE boundary
- **WHEN** the budget or transparency surface renders after integration
- **THEN** the SRE series still ends at FY2016 with the FY2017–FY2025 gap labeled pending, while Province documents appear in a separate appropriation-documents context

### Requirement: PrimeWater operator status is shown as unresolved
Any surface mentioning the SCCWD–PrimeWater relationship SHALL present day-to-day operator status as unresolved unless canonical evidence establishes it, and SHALL NOT claim PrimeWater is the current operator.

#### Scenario: Joint-venture mention carries no operator claim
- **WHEN** a utilities page mentions the 2014 joint venture
- **THEN** the text records the venture as context and marks current operations unresolved, with no operator assertion

### Requirement: DPWH narratives are not presented as a complete registry
Surfaced DPWH project information SHALL distinguish reported project observations (with their verified fields and missing IDs noted) from a complete project registry, and SHALL NOT present narrative-derived inventory as the authoritative DPWH project list.

#### Scenario: Project inventory shows its limits
- **WHEN** a projects surface renders DPWH observations lacking stable project IDs
- **THEN** each item shows only its verified fields with its status source noted, alongside a notice that the list is reported observations, not a complete registry
