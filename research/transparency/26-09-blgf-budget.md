# San Carlos City, Pangasinan — BLGF Budget & Fiscal Data (FY2017–FY2025)

**Category:** transparency
**Verification status:** Unverified — the Bureau of Local Government Finance (BLGF) public portals returned HTTP 403 (Forbidden) during research (2026-09-04), and no machine-readable fiscal dataset for San Carlos City covering FY2017–FY2025 could be extracted. The data in data/fiscal_transparency.json currently ends at FY2016.
**Research date:** 2026-09-04

## Current State

The repository's `data/fiscal_transparency.json` contains verified BLGF Annual Regular Income figures for **FY2009–FY2016 only** (sourced from PhilAtlas, which derives from BLGF). Figures for **FY2017 through FY2025 are missing** and must be sourced directly from BLGF.

## What Is Needed

For each fiscal year FY2017–FY2025, the following should be collected:
- **Annual Regular Income** (total)
- **Locally Sourced Revenue** (real property tax, business taxes, other taxes, regulatory fees, service/user charges, economic enterprise receipts)
- **Internal Revenue Allotment (IRA)** / National Tax Allotment
- **Other Shares from National Tax Collection**
- **Total Expenditures** (current + capital)
- **By function**: General Public Services, Education, Health, Social Services, Economic Services, Debt Service
- **Statement of Receipts and Expenditures (SRE)** if published

## Research Attempts

1. **BLGF official site** (https://blgf.gov.ph/) — returned HTTP 403 Forbidden during research.
2. **BLGF web tools / data portals** — no public parameterized search for LGU-level SRE data was found without login.
3. **Full Disclosure Policy Portal** (http://www.fdpp.gov.ph/) — the portal aggregates LGU-published transparency documents; San Carlos City's submissions for FY2017–FY2025 may be available here but were not retrievable during research.
4. **Wayback Machine** BLGF captures (2024–2025) — page shells loaded but underlying financial tables/data were not captured in searchable form.

## Recommended Next Steps

1. **BLGF Direct Request** — contact the BLGF Regional Office 1 (Ilocos Region) for the San Carlos City SRE and Annual Regular Income series, FY2017–FY2025.
2. **Full Disclosure Policy Portal** — manually browse http://www.fdpp.gov.ph/ for San Carlos City's annually posted budget documents, SRE, and Annual Investment Program (AIP).
3. **City Budget Office** — request the published Executive Budget, SRE, and AIP directly from San Carlos City's Budget Officer / City Accountant.
4. **COA Audit Reports** — the Commission on Audit publishes annual audit reports for each LGU containing audited financial statements (revenue, expenditure, assets, liabilities).

## Potential Better San Carlos Features

- **Budget dashboard** with time-series charts of revenue vs. expenditure (FY2017–FY2025 once sourced).
- **Revenue breakdown pie chart** (locally sourced vs. IRA vs. other shares).
- **Downloadable SRE / AIP documents** linked from the Transparency page.

## Sources

1. BLGF official site: https://blgf.gov.ph/ (returned HTTP 403 on 2026-09-04)
2. Full Disclosure Policy Portal: http://www.fdpp.gov.ph/ (not retrieved during research)
3. COA LGU audit reports: https://www.coa.gov.ph/ (not retrieved during research)
4. Existing repository data: data/fiscal_transparency.json (FY2009–FY2016, verified via PhilAtlas)