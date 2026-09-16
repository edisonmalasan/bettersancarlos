## ADDED Requirements

### Requirement: Health facilities are canonical records with stable IDs

Manually verified health-facility evidence SHALL be stored as canonical civic records under `data/civic/` in the `health` domain, one record per facility with a stable kebab-case ID independent of display-name variants (existing ID conventions take precedence where they already cover a facility). Each record SHALL carry only fields directly supported by authoritative evidence: facility name, address, level/type, accredited bed count, accreditation expiry, and published contact details where verified.

#### Scenario: Six PhilHealth facilities are represented
- **WHEN** the promoted canonical records are inspected
- **THEN** each of the six PhilHealth-evidenced facilities (Pangasinan Provincial Hospital, Virgen Milagrosa Medical Center, Pangasinan Doctors Hospital, Blessed Family Doctors General Hospital, Elguira General Hospital, Christ-Bearer Infirmary) maps to exactly one stable canonical record with its verified accreditation fields

#### Scenario: Similar names are not merged without authority
- **WHEN** two facility names look similar (e.g. Pangasinan Doctors Hospital vs Elguira General Hospital on Rizal Avenue, or evacuation-plan vs PhilHealth name variants)
- **THEN** they remain separate canonical records unless authoritative evidence establishes they are the same facility

### Requirement: PhilHealth accreditation is never stored as DOH licensure

No canonical health record SHALL contain a DOH license number, LTO status, or DOH license expiry unless actual DOH evidence supports it. Unknown DOH licensing fields SHALL remain absent from the record (not null placeholders, unless a schema intentionally requires null).

#### Scenario: Accreditation fields carry no license meaning
- **WHEN** a health-facility record with PhilHealth accreditation evidence is validated
- **THEN** it contains no `dohLicenseNumber`, LTO status, or license-expiry claim, and validation rejects any record labeling accreditation as licensure

#### Scenario: Unknown license stays unknown
- **WHEN** no DOH evidence exists for a facility
- **THEN** the record exposes no license value at all rather than an inferred or placeholder value

### Requirement: SCCWD provider identity is a canonical record with historical contacts quarantined

The verified water-provider identity (San Carlos City Water District: official entity name, LWUA Conditional Certificate of Conformance July 28, 1977 / Sangguniang Panlungsod Resolution No. 42 establishment context, verified official site, and service-area facts only where verified) SHALL be stored as canonical `utilities`-domain records. Address, telephone, leadership, and service-area figures known only from 2017-vintage sources SHALL be marked historical (or omitted where the model requires it) and SHALL NOT be stored as current facts.

#### Scenario: Provider identity is canonical and current-only
- **WHEN** the water-provider records are inspected
- **THEN** the official name, establishment context, and verified site are present as current facts, and every 2017-vintage contact/leadership value is either absent or explicitly marked historical with its vintage

#### Scenario: PrimeWater role stays explicitly unresolved
- **WHEN** the water-provider records describe the 2014 PrimeWater joint venture
- **THEN** they record only what official evidence supports and explicitly mark day-to-day operator status as unresolved, never claiming PrimeWater is the current operator

### Requirement: DPWH evidence maps into the existing model with no invented fields

PR #105 DPWH project observations SHALL be integrated through the existing canonical DPWH records (`dpwh-projects-summary` and companions). Project-level records SHALL be added only where the existing model represents them cleanly; otherwise the change SHALL make the minimum schema/model extension required and no more. Every project field (title, location, amount, status, implementing office, contractor, dates, project ID) SHALL be present only where authoritative evidence directly supports it; missing project IDs, contractors, and dates remain missing.

#### Scenario: Narrative observations without IDs do not become registry entries
- **WHEN** a DPWH observation has location, office, amount, and status narrative but no stable project ID
- **THEN** it is stored without a project ID (never a synthesized one) and the DPWH output does not present the inventory as a complete project registry

#### Scenario: Tender numbers are not project IDs
- **WHEN** the only identifier for an observation is a procurement tender string (e.g. 26Aj0046-style numbers)
- **THEN** it is stored as procurement context, never as the project-status ID

### Requirement: Province budget documents are canonical document records, never SRE data

Verified Province of Pangasinan budget-review/appropriation documents SHALL be stored as canonical `transparency`-domain document records carrying document metadata only (title, year, issuing authority, document type, official URL, publication/approval date, jurisdiction, verified source provenance). They SHALL NOT populate BLGF Statement of Receipts and Expenditures fields, and the FY2017–FY2025 SRE gap SHALL remain `blocked`.

#### Scenario: Appropriation totals do not fill the SRE series
- **WHEN** the fiscal records are inspected after integration
- **THEN** Province appropriation figures appear only on document records while the SRE income/expenditure series still ends at FY2016 with the FY2017–FY2025 gap documented as blocked

#### Scenario: No budget number is modeled beyond the canonical contract
- **WHEN** a Province document contains appropriation/AIP/NTA/20%/LDRRMF figures
- **THEN** per-figure modeling occurs only where the existing canonical model explicitly requires it; otherwise the document record carries metadata and provenance, not parsed budget lines

### Requirement: Integration uses exact provenance and the reviewer promotion path

Every new canonical record SHALL reference exact `sources.json` source instances (record → `sources.json` → registry), with correct domain, risk tier, and temporal meaning preserving the verified/partial/blocked distinctions from research. Records SHALL enter canonical data only through the existing reviewer promotion/import mechanism (reviewer-owned acceptance fields, atomic `records.json` + `sources.json` transaction); direct hand-edits to `data/civic/` or generated JSON SHALL NOT occur.

#### Scenario: Research Markdown is not provenance
- **WHEN** a record cites only a research Markdown path without an exact source instance
- **THEN** validation fails naming the record until an exact instance is imported through the pipeline-compatible staging path

#### Scenario: Promotion is atomic and reviewed
- **WHEN** the new records are promoted
- **THEN** `records.json` and `sources.json` commit as one transaction with reviewer identity recorded, and high-risk records are never self-accepted

### Requirement: Blocked and manual sources gain no automation

This change SHALL NOT add collectors for FDPP, COA, BLGF, DPWH, DOH/HFSRB, or LWUA; SHALL NOT change collector dispatch for these sources; and SHALL NOT change their registry `collector: null` assignments. FDPP, COA, BLGF, DOH/HFSRB, LWUA directory, and DPWH portal access remain manual/blocked, and the drafted agency inquiries (BLGF RO1 SRE, COA RO-I AARs, DOH-HFSRB licenses, City Engineering/BAC records) are not sent by this change.

#### Scenario: Registry stays manual for difficult sources
- **WHEN** the source registry is inspected after this change
- **THEN** `dilg-fdpp`, `coa-audit`, `blgf`, `dpwh-projects`, `doh-hfsrb`, and `lwua` still declare `collector: null` and no corresponding collector module exists

#### Scenario: Blocked gaps stay documented
- **WHEN** the BLGF SRE gap, COA audit-report gap, DOH license gap, and DPWH structured-registry gap are inspected
- **THEN** each remains documented as blocked/manual with its follow-up inquiry noted, and none is presented as resolved
