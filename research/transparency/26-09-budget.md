---
schema: research.v2
id: budget
title: Budget and Fiscal Data
category: transparency
research_type: dataset
verification_status: partial
temporal_status: mixed
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - transparency
---

# San Carlos City, Pangasinan — Budget and Fiscal Data

## Scope

Fiscal data for San Carlos City, Pangasinan: BLGF regular-income series, Wikidata fiscal records, and LGU budget-document menus. FY2017–FY2025 extraction is tracked in `transparency/26-09-blgf-budget.md`.

## Summary

Annual Regular Income FY2009–FY2016 is documented from BLGF via PhilAtlas; Wikidata carries additional BLGF-derived revenue records without year labels (do not publish unmatched); detailed budgets and expenditures still need BLGF/COA extraction.

## Findings

### Summary

Latest verified series endpoint: FY2016 at ₱606,804,968.75 annual regular income. Composition (per PhilAtlas note): locally sourced revenue + IRA (current) + other shares from national tax collection. | `S1`

### Dataset

| Fiscal year | Annual regular income (₱) | Change | Sources |
|---|---|---|---|
| 2009 | 381,525,864.87 | – | S1 |
| 2010 | 416,990,053.15 | +9.30% | S1 |
| 2011 | 450,082,316.84 | +7.94% | S1 |
| 2012 | 405,855,329.44 | −9.83% | S1 |
| 2013 | 437,343,132.12 | +7.76% | S1 |
| 2014 | 488,728,759.18 | +11.75% | S1 |
| 2015 | 556,986,655.39 | +13.97% | S1 |
| 2016 | 606,804,968.75 | +8.94% | S1 |

Locally sourced revenue = Real Property Tax (general fund) + tax on business + other taxes + regulatory fees + service/user charges + receipts from economic enterprises. | `S1`

### Wikidata Fiscal Records (BLGF-Derived, Years Unlabeled)

Wikidata Q43165 carries fiscal/tax revenue records (BLGF) including:

- ₱1,329,373,844.64 and ₱1,209,424,474.82 (two recent high-year records — years not shown in this export; verify point-in-time)
- ₱941,440,557.59
- ₱844,213,043.94
- ₱754,587,417.25
- ₱705,067,388.32
- ₱617,773,699.76
- ₱575,813,629.02
- ₱498,043,959.16
- ₱444,676,273.76
- ₱416,891,897.30 (older years) | `S2`

⚠️ These values lack year labels in the raw export; **do not publish** until matched to fiscal years. Prefer the BLGF Statement of Receipts & Expenditures per year.

### Budget Documents on the Official LGU Site

The current official site's "PROJECTS/PROGRAMS" and "TRANSPARENCY" menus reference:

- Transparency Seal, Citizen's Charter
- Accomplished/Ongoing Infrastructure Projects
- Programs/Projects in Supplemental Investment Program
- Projects for Implementation Under Land Bank Loan
- Proposed Projects & Activities
- Gender And Development (GAD) Plan
- DRRM Plan
- List of PPAS (Projects, Programs, Activities, Services)
- Bids and Awards (Invitation to Bid, Notice to Proceed, Bid Results) under RA 9184

These pages exist as menu entries but the live site serves a single-page shell (see `official-presence/26-09-official-online-presence.md`); archived snapshots of project pages were partially captured (see `infrastructure/26-09-city-projects.md`). | `S4`

### Methodology

Series transcribed as published by PhilAtlas (BLGF); Wikidata records transcribed without year inference. | `S1`, `S2`

## Verification & Uncertainty

- Wikidata revenue records lack year labels; matching them to fiscal years is unverified work.

## Conflicts

None identified.

## Gaps

- 2017–2025 annual income/expenditure not yet assembled from BLGF; pull BLGF Statements 2020–2024.
- No COA audit findings page review done in this session.
- IRA share percentages for 2025 not obtained.

## Research Attempts

- Income series, Wikidata export, and LGU menus compiled on 2026-09-04; BLGF/COA deep extraction not done. | `S1`, `S2`, `S4`

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | BLGF via PhilAtlas | San Carlos City Profile (BLGF income) | — | 2026-09-04 | authoritative-secondary | https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html |
| S2 | Wikidata | Item Q43165 (fiscal/tax revenue) | — | 2026-09-04 | secondary | https://www.wikidata.org/wiki/Q43165 |
| S3 | BLGF | Official site | — | 2026-09-04 | government-dataset | https://blgf.gov.ph/ |
| S4 | City Government of San Carlos | Transparency/Projects menus | — | 2026-09-04 | official | https://sancarlospangasinan.gov.ph/ |
