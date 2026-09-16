---
schema: research.v2
id: blgf-budget
title: BLGF Budget & Fiscal Data (FY2017–FY2025)
category: transparency
research_type: gap-report
verification_status: blocked
temporal_status: current
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-16
canonical_domains:
  - transparency
---

# San Carlos City, Pangasinan — BLGF Budget & Fiscal Data (FY2017–FY2025)

## Scope

FY2017–FY2025 fiscal data for San Carlos City, Pangasinan (regular income, sourced revenue, IRA shares, expenditures, SREs). FY2009–FY2016 figures live in `transparency/26-09-budget.md`.

## Summary

No machine-readable fiscal dataset for FY2017–FY2025 could be extracted: BLGF portals still return 403 on re-check 2026-09-16 and the repository's verified series still ends at FY2016.

## Research Question

What are San Carlos City's Annual Regular Income, sourced revenue, IRA shares, expenditures, and Statements of Receipts and Expenditures for each fiscal year FY2017–FY2025?

## Current Conclusion

BLOCKED — no FY2017–FY2025 figures verified. Do not extend the published fiscal series past FY2016.

## Current State

The repository's `data/fiscal_transparency.json` contains verified BLGF Annual Regular Income figures for **FY2009–FY2016 only** (sourced from PhilAtlas, which derives from BLGF). Figures for **FY2017 through FY2025 are missing** and must be sourced directly from BLGF.

## Province Budget-Review Resolutions (Manual-Document Path, Follow-Up 2026-09-16)

The Province of Pangasinan `/issuances/` collection publishes the Sangguniang Panlalawigan review resolutions for San Carlos City budgets as stable downloadable PDFs (verified: direct PDF download works without login, e.g. Resolution 521-2026). These yield an **annual appropriations series** — budget authorizations enacted by ordinance, distinct from BLGF Annual Regular Income and from SRE actuals. Do not conflate the three concepts.

Staging correction 2026-09-16 (canonical integration, research run 2026-09-16): the downloadable file `521-2026-RES.pdf` was byte-verified to contain a Malasiqui ordinance review, not the San Carlos City FY2026 appropriation review — FY2026 (and FY2020–FY2022, not locatable via the WP media API) have no exact staged instance and stay research-only. Byte-verified San Carlos PDFs staged as canonical provenance are Res 287-2023, 375-2024, and 304-2025 only.

| Fiscal year | Annual appropriation (₱) | Provincial resolution | Appropriation ordinance | Sources |
|---|---|---|---|---|
| 2020 | 905,962,511.23 | 404-2020 | 19-24 (Dec 16, 2019) | S5 |
| 2021 | 942,844,638.79 | 330-2021 | 20-16 (Dec 7, 2020) | S5 |
| 2022 | 1,258,607,859.10 | 444-2022 | 21-14 (Nov 22, 2021) | S5 |
| 2023 | 1,112,163,651.40 | 287-2023 | (Mar 20, 2023 review) | S5 |
| 2024 | 1,190,522,190.38 | 375-2024 | 23-49 (Oct 31, 2023) | S5 |
| 2025 | 1,402,314,513.16 | 304-2025 | (Mar 3, 2025 review) | S5 |
| 2026 | 1,598,731,092.27 | 521-2026 | 25(A)-13 (Nov 17, 2025) | S5 |

Supplemental and program figures established from the same collection: CY2022 AIP total ₱1,883,607,859.10; CY2023 Supplemental Budget No. 4 ₱199,953,746.00 (Land Bank loan proceeds — matches the LandBank-financing bucket in `infrastructure/26-09-city-projects.md`); CY2026 AIP total ₱3,225,651,092.27 (LGU ₱1,598,731,092.27 + external ₱1,626,920,000.00), CY2026 NTA share ₱1,365,897,825.00, 20% development fund ₱273,179,565.00, LDRRMF ₱79,943,406.25 (QRF ₱20,510,641.47). FY2017–FY2019 resolutions were not located in this pass.

## Recommended Inquiry: BLGF SRE Series

Agency: Bureau of Local Government Finance

Office: BLGF Regional Office I (Ilocos Region); Pangasinan Field Office, Capitol Complex, Lingayen

Subject: Statements of Receipts and Expenditures (SRE) and Annual Regular Income series, City of San Carlos, Pangasinan, FY2017–FY2025

Requested records: Annual Regular Income (total); Locally Sourced Revenue (RPT, business taxes, other taxes, regulatory fees, service/user charges, enterprise receipts); IRA/NTA shares; other national-tax shares; total expenditures; functional breakdown (GPS, education, health, social, economic, debt service); yearly SRE documents

Jurisdiction: San Carlos City, Pangasinan

Period: FY2017–FY2025

Preferred response format: CSV/XLS/PDF where applicable

Reason: public civic-data verification (repository verified series ends FY2016)

Contact/request channel (directory-grade, confirm on use): BLGF RO I, Government Center, Sevilla, City of San Fernando, La Union; (072) 888-2419; ro1@blgf.gov.ph; Mon–Fri 8AM–5PM. Regional Director per directory: Ms. Melcy M. Baluyan. e-SRE submission runs electronically through this office (per 2025-02-09 BLGF notice). | `S6`

## COA Manual Discovery (Follow-Up 2026-09-16)

- No San Carlos City annual audit report was located: direct `coa.gov.ph` paths (root, report indexes) return HTTP 403, and the COA Region 1 site (`region1.coa.gov.ph`) also returns 403. Search-indexed COA PDFs prove the URL pattern `coa.gov.ph/download/<id>/<province>/<docid>/<city>-executive-summary-<year>.pdf` exists (e.g., Dagupan City 2022), but no San Carlos City document ID is known.
- COA report index paths observed (all unreachable from the probe network): `/index.php/reports/audit-agencies`, `/index.php/reports/archive/annual-audit-reports-archive`.

## Recommended Inquiry: COA Audit Reports

Agency: Commission on Audit

Office: COA Regional Office No. I (Ilocos Region)

Subject: Annual Audit Reports (including Executive Summaries and audited financial statements), City of San Carlos, Pangasinan, CY2022–CY2024

Requested records: Annual Audit Report PDFs per year (revenue, expenditure, assets, liabilities, findings)

Jurisdiction: San Carlos City, Pangasinan

Period: CY2022–CY2024

Preferred response format: PDF where applicable

Reason: public civic-data verification (no San Carlos audit report publicly retrievable; direct COA paths return 403)

Contact/request channel: official COA Region I channels only (to be confirmed at request time; do not send automatically)

## Target Information

For each fiscal year FY2017–FY2025, the following should be collected:

| Field | Status | Notes |
|---|---|---|
| Annual Regular Income (total) | unverified | — |
| Locally Sourced Revenue (RPT, business taxes, other taxes, regulatory fees, service/user charges, enterprise receipts) | unverified | — |
| Internal Revenue Allotment (IRA) / National Tax Allotment | unverified | — |
| Other Shares from National Tax Collection | unverified | — |
| Total Expenditures (current + capital) | unverified | — |
| By function (General Public Services, Education, Health, Social Services, Economic Services, Debt Service) | unverified | — |
| Statement of Receipts and Expenditures (SRE) if published | unverified | — |

## Research Attempts

| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-04 | BLGF official site (`S1`) | failed | HTTP 403 Forbidden |
| 2026-09-04 | BLGF web tools / data portals | failed | no public parameterized LGU-level SRE search without login |
| 2026-09-04 | Full Disclosure Policy Portal (`S2`) | failed | aggregates LGU transparency documents; city FY2017–FY2025 submissions not retrievable |
| 2026-09-04 | Wayback Machine BLGF captures (2024–2025) | failed | page shells loaded; financial tables not captured in searchable form |
| 2026-09-16 | BLGF official site re-check (`S1`) | failed | HTTP 403 Forbidden again; no SRE extraction path |
| 2026-09-16 | FDPP re-check (`S2`) | failed | portal unreachable; no city submissions retrievable |
| 2026-09-16 | COA audit-report path re-check (`S3`) | failed | HTTP 403 Forbidden; no San Carlos City annual audit report retrieved |
| 2026-09-16 | Live LGU Transparency Seal page (`S4`) | failed | symbolism quote only; no compliance budget PDFs downloadable |
| 2026-09-16 | FDPP deep probe: old `fdpp.gov.ph` DNS + successor `fdpp.dilg.gov.ph` | failed | old domain does not resolve (decommissioned); successor is a sign-in SPA landing page — `/reports` 403, `/login|documents|portal|guest|public|home` 404; no public San Carlos retrieval path; SPA-internal APIs out of bounds |
| 2026-09-16 | COA deep probe: https + http roots | failed | HTTP 403 Forbidden on both schemes; no audit index reachable |
| 2026-09-16 | BLGF deep probe: TLS + http + data.gov.ph | failed | TLS handshake fails (https and http); national open-data portal is now a JS SPA with no CKAN API — no official downloadable SRE dataset located |
| 2026-09-16 | Province `/issuances/` budget-review resolutions | partial | annual appropriations series CY2020–CY2026 + AIP/NTA/20%/LDRRMF figures established (provincial review acts, NOT SREs); FY2017–FY2019 not located |
| 2026-09-16 | BLGF Regional Office I channel discovery | partial | RO1 address/phone/email/hours + Pangasinan Field Office + e-SRE-via-RO procedure found (directory-grade, confirm on use); rpis portal unreachable from probe network |
| 2026-09-16 | COA manual discovery (report pattern + Region 1 site) | partial | `download/<id>/<province>/<docid>/` URL pattern proven via Dagupan example; no San Carlos City document ID found; Region 1 site also 403 |

## Gaps

- All FY2017–FY2025 fields in Target Information.
- Retrievable FDPP submissions for the city.
- FY2017–FY2019 provincial budget-review resolutions (CY2020–CY2026 appropriations now covered via `S5`).
- SRE actuals and regular-income composition remain the missing core; appropriation totals must not be substituted for them.

## Recommended Next Actions

1. **BLGF Direct Request** — contact the BLGF Regional Office 1 (Ilocos Region) for the San Carlos City SRE and Annual Regular Income series, FY2017–FY2025.
2. **Full Disclosure Policy Portal (successor)** — the old `fdpp.gov.ph` domain is decommissioned (DNS-dead); the official successor at `https://fdpp.dilg.gov.ph/` currently exposes no public report-retrieval path, so FDP documents still require manual inquiry until a documented public path appears.
3. **City Budget Office** — request the published Executive Budget, SRE, and AIP directly from San Carlos City's Budget Officer / City Accountant.
4. **COA Audit Reports** — the Commission on Audit publishes annual audit reports for each LGU containing audited financial statements (revenue, expenditure, assets, liabilities). | `S3`

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | BLGF | Official site (returned 403; re-checked 2026-09-16) | — | 2026-09-16 | government-dataset | https://blgf.gov.ph/ |
| S2 | DILG | Full Disclosure Policy Portal (not retrieved; re-checked 2026-09-16) | — | 2026-09-16 | government-dataset | http://www.fdpp.gov.ph/ |
| S3 | COA | LGU audit reports (not retrieved; re-checked 2026-09-16) | — | 2026-09-16 | government-dataset | https://www.coa.gov.ph/ |
| S4 | City Government of San Carlos | Transparency Seal (live; symbolism only, no PDFs) | — | 2026-09-16 | official | https://www.sancarlospangasinan.gov.ph/transparency-seal |
| S5 | Province of Pangasinan | Sangguniang Panlalawigan budget-review resolutions for San Carlos City (annual appropriations CY2020–CY2026, AIPs, supplementals; stable PDFs) | 2020–2026 | 2026-09-16 | official | https://www.pangasinan.gov.ph/issuances/ |
| S6 | BLGF | Regional Office I directory + e-SRE procedure (directory-grade, confirm on use) | — | 2026-09-16 | official | https://rpis.blgf.gov.ph/regional-offices/region-1 |
