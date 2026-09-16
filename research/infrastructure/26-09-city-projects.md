---
schema: research.v2
id: city-projects
title: City Projects and Infrastructure
category: infrastructure
research_type: profile
verification_status: partial
temporal_status: historical
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-16
canonical_domains:
  - infrastructure
---

# San Carlos City, Pangasinan — City Projects and Infrastructure

## Scope

Known infrastructure projects and programs of San Carlos City, Pangasinan: program buckets from official menus plus project notes. Project-level budgets, contractors, and completion dates were not retrievable.

## Summary

Program titles come from archived official LGU/old-site pages; no project-level budget, contractor, or completion data is verified — collect from the City Engineering Office / BAC.

## Findings

### Program Buckets

Official LGU site Projects/Programs menu. | `S1`

| Program bucket | Notes | Sources |
|---|---|---|
| Accomplished/Ongoing Infrastructure Projects | Appears in official site menu | S1 |
| Programs/Projects in Supplemental Investment Program | Appears in official site menu | S1 |
| Projects for Implementation Under Land Bank Loan | Appears in official site menu (city used LandBank financing) | S1 |
| Proposed Projects & Activities | Appears in official site menu | S1 |
| GAD (Gender and Development) Plan | Appears in official site menu | S1 |
| DRRM Plan | See `disaster-risk/26-09-disaster-preparedness.md` | S1 |
| List of PPAS (Programs, Projects, Activities, Services) | Appears in official site menu | S1 |

### Project Notes

- The old official site documented **specific project news** (e.g., construction of slope protection works; BUB project child development centers — 2016 news). See `news/26-09-news-current-events.md`. | `S4`
- The archived official site menu items like *"construction of slope protection works"* (archived 2025) and *"bid invites"* list concrete project tracks but their bodies are JS-only. | `S2`, `S3`
- **PNR Station Site barangay** indicates the historical Manila–Dagupan rail right-of-way passed through the city (now defunct).
- The **Don Federico Mandapat Sports Dome** and **City Gymnasium** (Palaris St) are public sports infrastructure (from Wikipedia caption and evacuation plan).

### DPWH Project Data (Probe 2026-09-16)

- **Responsible office: DPWH Pangasinan 4th District Engineering Office**, confirmed by official DPWH news narratives for city works (e.g., Bogaoan/Guelew slope protection, Coliling asphalt overlay). | `S5`
- **No public structured project registry exists for plain-HTTP access**: `https://www.dpwh.gov.ph/` (root and `/dpwh/news/…` article paths) returns a bot-manager stub to normal requests — project listings cannot be browsed or filtered without executing its challenge. Do not work around it.
- **Documented city works (narratives only, via search-indexed official articles):** 355.47 m Bogaoan + 287 m Guelew slope protection along the Agno River (₱48.99M + ₱47.78M, GAA 2024); 703 m Villasis–Malasiqui–San Carlos Road asphalt overlay at Coliling (₱9.9M); ₱41.2M Coliling drainage/road-widening (1.03 km, completed Aug 15). These carry no stable project IDs and cannot seed a collector. | `S5`
- **Adjacent manual route — PhilGEPS Bulletin Board** (`S6`): the public bid-notice search UI (title/agency/date filters) lists DPWH Region I / Pangasinan 4th DEO tenders (e.g., San Carlos bypass road, local roads), but San Carlos filterability requires executing its JS search flow (untested) and it covers procurements, not project status. Manual BAC follow-up only; not a project-status collector path.

## Verification & Uncertainty

- Specific project budgets, contractors, and completion dates were not retrievable online.

## Conflicts

None identified.

## Gaps

- Project-level budget/contractor data (City Engineering Office / BAC).
- Road/bridge inventory (names, lengths, condition).

## Research Attempts

- Official menus and 2016–2018 archived news compiled on 2026-09-04; Engineering/BAC records not pulled. | `S1`, `S4`
- 2026-09-16: dpwh.gov.ph root and news-article paths return a bot-manager stub to plain HTTP (no bypass attempted); responsible office confirmed as Pangasinan 4th DEO via official narratives; PhilGEPS Bulletin Board search UI confirmed public but San Carlos filterability untested (JS flow). | `S5`, `S6`

| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-16 | dpwh.gov.ph root + news paths | failed | bot-manager stub (JS challenge); no content without executing it — do not circumvent |
| 2026-09-16 | Official DPWH news narratives (via search) | partial | Bogaoan/Guelew/Coliling works with costs confirmed; no stable project IDs |
| 2026-09-16 | PhilGEPS Bulletin Board (`S6`) | partial | public bid-search UI exists; locality filtering untested; procurements only, not project status |

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Projects/Programs menus | — | 2026-09-04 | official | https://sancarlospangasinan.gov.ph/ |
| S2 | City Government of San Carlos | Construction of Slope Protection Works (archived) | 2025-07-08 | 2026-09-04 | archived-official | https://web.archive.org/web/20250708073503/https://www.sancarlospangasinan.gov.ph/construction-of-slope-protection-works |
| S3 | City Government of San Carlos | Bid invitations (archived; e.g., classroom/backhoe) | 2025-12-08 | 2026-09-04 | archived-official | https://web.archive.org/web/20251208103032/https://www.sancarlospangasinan.gov.ph/bidinvitechildplayground |
| S4 | City Government of San Carlos | News (archived, old site; 2016–2018) | 2016 | 2026-09-04 | archived-official | http://sancarloscitypangasinan.gov.ph/ |
| S5 | DPWH | Flood-control narratives (Bogaoan/Guelew slope protection, Pangasinan 4th DEO) | 2024 | 2026-09-16 | official | https://www.dpwh.gov.ph/dpwh/news/35148 |
| S6 | PhilGEPS | Electronic Bulletin Board (public bid-notice search UI; locality filtering untested) | — | 2026-09-16 | government-dataset | https://philgeps.gov.ph/Indexes/index |
