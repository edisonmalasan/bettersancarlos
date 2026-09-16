## ADDED Requirements

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
