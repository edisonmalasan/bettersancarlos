# internal-link-integrity Specification

## Purpose
Guarantees that navigation inside the statically exported site never dead-ends: any internal link a visitor can click — whether hardcoded in a page or rendered from data-driven cards — resolves to a route that exists in the build, so the service section cannot regress into 404s when detail pages are added or removed independently of the category pages that link to them.

## Requirements

### Requirement: Internal links resolve to existing routes
Every internal link target published by the site (href attributes in `src/` pages and components, and route fields rendered from `data/*.json` into links) SHALL resolve to a route that exists in the production export. When a linked page does not exist, the link SHALL be repointed to the closest existing page (parent category, administering office, or site section) rather than left pointing at a missing route.

#### Scenario: Service category cards link to real destinations
- **WHEN** a `/services/*` category page renders its service cards
- **THEN** each card link resolves to an existing detail page, the administering office page, or a related site section — never to a route with no `page.tsx`

#### Scenario: Broken link audit is clean
- **WHEN** internal link targets are extracted from `src/**/*.{ts,tsx}` and the JSON files rendered into links, and each target is checked against the exported routes
- **THEN** every target resolves to a route that exists (allowing `/`-terminated and query/hash variants)

### Requirement: Repointed service cards identify their administering office
When a service card links to an office or section page instead of a dedicated detail page, the card SHALL display the administering office name sourced from the published services directory so the destination is self-explanatory.

#### Scenario: Barangay-issued service card shows its office
- **WHEN** the certificates category page renders the Barangay Clearance card
- **THEN** the card displays its administering office (e.g. Barangay Hall) as published in the services directory
