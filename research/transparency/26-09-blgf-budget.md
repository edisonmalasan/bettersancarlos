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

## Gaps

- All FY2017–FY2025 fields in Target Information.
- Retrievable FDPP submissions for the city.

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
