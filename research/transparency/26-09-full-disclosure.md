---
schema: research.v2
id: full-disclosure
title: 'Full Disclosure, Transparency Seal & Citizen''s Charter'
category: transparency
research_type: document-index
verification_status: partial
temporal_status: mixed
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-16
canonical_domains:
  - transparency
---

# San Carlos City, Pangasinan — Full Disclosure, Transparency Seal & Citizen's Charter

## Scope

Transparency artifacts of San Carlos City, Pangasinan: Transparency Seal, Citizen's Charter, Full Disclosure Policy Board, SGLG award, and e-services. Actual PDF documents were not retrievable.

## Summary

Participation in FDP/Transparency Seal and the SGLG award is documented from archived official pages, but the underlying document files (PDFs) were not retrievable on the live one-page site. Re-checked 2026-09-16 (`S8`): the live Transparency Seal page still carries only the national symbolism quote; no compliance documents are downloadable. SGLG award year remains unconfirmed (SGLG portal unreachable on re-check).

## Findings

### Document inventory

| Document ID | Title | Date | Availability | Verification | Sources |
|---|---|---|---|---|---|
| doc-transparency-seal | Transparency Seal | 2024 (archived page) | menu/national-symbolism quote only; compliance documents not downloadable | partial | S1 |
| doc-citizens-charter | Citizen's Charter | 2017 page; current menu item | office list only; service tables not extracted | partial | S2, S5 |
| doc-fdp-board | Full Disclosure Policy Board | 2017 page | report list only; files not captured (likely unpreserved PDF links) | partial | S3 |
| doc-sglg-award | Seal of Good Local Governance (SGLG) award | 2024/2025 (year unconfirmed) | award article only | partial | S4 |
| doc-ebpls | eBPLS + downloadable forms | 2017 forms; current portal live | portal live; 2017 forms historical | partial | S5, S6 |

### Missing documents

- Charter tables, FDP reports, and seal compliance PDFs (collect from city hall / provincial portal / BLGF).
- Per-service processing times, fees, and eligibility requirements.
- SGLG award year confirmation (DILG).

### Transparency Seal

- The official site maintains a **Transparency Seal** page (menu item "TRANSPARENCY → Transparency Seal").
- The seal's national symbolism quote (from the DBM directive) appears on the archived page: *"Government information is a pearl, meant to be shared with the public in order to maximize its inherent value..."*
- Actual seal compliance documents (budget files, reports, procurement monitor) were not downloadable during research. | `S1`

### Citizen's Charter

- The old official site (WordPress, archived 2017) had a **Citizen's Charter** page listing service offices: City Mayor's Office (Business One-Stop Shop), City Assessor's Office, City Treasurer's Office, City Health Office, City Engineer's Office, City Civil Registry Office, City Planning & Development Office, City Social Welfare Development Office, City Population Office.
- The current official site has a **Citizens Charter** menu item (page is one-page shell; actual service tables not extracted). | `S2`, `S5`, `S7`

### Full Disclosure Policy Board (FDP)

- The old official site had a **Full Disclosure Policy Board** page listing the standard FDP financial reports: Statement of Cash Flows, Statement of Receipts and Expenditures, Local DRRM Fund Utilization, Special Education Fund (SEF) Utilization Report, Statement of Financial Operations, 20% IRA Utilization.
- Files themselves were not captured (likely linked as PDFs that were not preserved). | `S3`

### FDP Portal Migration (2026-09-16)

- The legacy portal host is decommissioned: `fdpp.gov.ph` (and `www`) no longer resolves in DNS.
- The official successor is **`https://fdpp.dilg.gov.ph/`** (linked as the Full Disclosure Policy Portal from the DILG homepage): a sign-in application landing page advertising public financial-report browsing and compliance tracking, but no public San Carlos City retrieval path — `/reports` returns 403 and `/login`, `/documents`, `/portal`, `/guest`, `/public`, `/home` return 404. SPA-internal data endpoints were not touched (undocumented private APIs are out of bounds). | `S9`
- Until the successor exposes a documented public reports path, FDP submissions for the city remain retrievable only by manual inquiry.

### Seal of Good Local Governance (SGLG)

- The city was recognized with the **Seal of Good Local Governance (SGLG)** — an archived article on the official LGU site titled *"San Carlos City, Pangasinan: A Beacon of Excellence in Governance – Securing the Seal of Good Local Governance (SGLG) Award"* (archived 2025-12-07).
- The exact year of the SGLG award was not captured from the article body (page is JS-rendered); **verify award year** (likely 2024 or 2025) with DILG. | `S4`

### e-Services / Online Transactions

- **eBPLS** (electronic Business Permit & Licensing System): https://prod4.ebpls.com/sancarlospangasinan/index.php — online permit processing.
- **Downloadable forms** (2017 archive): business permit application/termination, electrical/sanitary/occupancy permits, peddler's permit, assessor's forms (FAAS building/land/machinery), building depreciation/floors-area worksheets. | `S5`, `S6`

## Verification & Uncertainty

- SGLG award year unconfirmed (likely 2024/2025).

## Conflicts

None identified.

## Gaps

- Actual PDF documents (charter tables, FDP reports, seal docs).
- Processing times, fees, and eligibility requirements per service.

## Research Attempts

- Checked the live and archived seal, charter, and FDP pages on 2026-09-04; PDFs not downloadable from the one-page shell. | `S1`, `S2`, `S3`
- 2026-09-16 re-check: live Transparency Seal page (`S8`) still symbolism-only; Citizens Charter path serves the single-page shell with no service tables; live DRRM Plan page is a menu shell with no plan document; SGLG portal unreachable for award-year confirmation. | `S8`

| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-16 | Live Transparency Seal page (`S8`) | failed | no compliance PDFs downloadable |
| 2026-09-16 | Live Citizens Charter path | failed | single-page shell; no service tables extracted |
| 2026-09-16 | Live DRRM Plan page | failed | menu shell; no plan document published |
| 2026-09-16 | SGLG portal | failed | unreachable; award year still unconfirmed |
| 2026-09-16 | Legacy FDPP host (`fdpp.gov.ph`) | failed | DNS does not resolve; host decommissioned |
| 2026-09-16 | Successor FDP portal (`S9`) | failed | sign-in landing only; no public report retrieval path |

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Transparency Seal (archived) | 2024-06-03 | 2026-09-04 | archived-official | https://web.archive.org/web/20240603225003/https://www.sancarlospangasinan.gov.ph/transparency-seal |
| S2 | City Government of San Carlos | Citizen's Charter (archived, old site) | 2017 | 2026-09-04 | archived-official | https://web.archive.org/web/20170708091942/http://sancarloscitypangasinan.gov.ph/index.php/citizens-charter/ |
| S3 | City Government of San Carlos | Full Disclosure Policy Board (archived, old site) | 2017 | 2026-09-04 | archived-official | https://web.archive.org/web/20170326024515/http://sancarloscitypangasinan.gov.ph/index.php/full-disclosure-policy-board/ |
| S4 | City Government of San Carlos | SGLG article (archived) | 2025-12-07 | 2026-09-04 | archived-official | https://web.archive.org/web/20251207010329/https://www.sancarlospangasinan.gov.ph/san-carlos-city-pangasinan-a-beacon-of-excellence-in-governance-securing-the-seal-of-good-local-governance-sglg-award |
| S5 | City Government of San Carlos | Official website | — | 2026-09-04 | official | https://sancarlospangasinan.gov.ph/ |
| S6 | City Government of San Carlos | E-services (archived, old site) | 2017-03-22 | 2026-09-04 | archived-official | https://web.archive.org/web/20170322021550/http://sancarloscitypangasinan.gov.ph/index.php/e-services/ |
| S7 | City Government of San Carlos | Citizens Charter page (live menu reference) | — | 2026-09-04 | official | https://sancarlospangasinan.gov.ph/citizens-charter |
| S8 | City Government of San Carlos | Transparency Seal (live; symbolism only, no PDFs; re-checked 2026-09-16) | — | 2026-09-16 | official | https://www.sancarlospangasinan.gov.ph/transparency-seal |
| S9 | DILG | Full Disclosure Policy Portal, successor host (sign-in landing; no public report path) | — | 2026-09-16 | official | https://fdpp.dilg.gov.ph/ |
