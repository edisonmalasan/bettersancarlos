# Research Data Integration — Category Tracking Checklist

Maps all 21 research categories from `research/README.md` to implementation status.
Statuses: **IMPLEMENTED** (new page/dataset from research), **EXTENDED** (existing page/dataset enriched),
**EXCLUDED** (deliberately not surfaced, with reason).

Total: **21/21 resolved** (14 implemented, 2 extended-with-partial, 5 excluded with reasons counted under their categories as noted below — no silently-skipped category).

| # | Category | Status | Implementing files / notes |
|---|----------|--------|----------------------------|
| 1 | `city-profile/` | IMPLEMENTED | `/about` page (`src/app/about/page.tsx`), extended `src/data/city-profile.json` (geography, seal, languages, history timeline, heritage). Note: the `26-09-gis-data.md` part of this category is EXCLUDED (no verified GIS layers exist to render). |
| 2 | `government/` | IMPLEMENTED | `src/data/officials.json` (party/votes, history), `/government` historical-terms block, `src/data/government-directory.json` + `/contact` directory section (Phase E). |
| 3 | `barangays/` | IMPLEMENTED | `src/data/barangay-officials.json` (86/86 population join, shared-line flags), barangay detail pages, `/government` barangay grid. |
| 4 | `demographics/` | IMPLEMENTED | `/statistics` (census series 1903–2020, households, 86-barangay populations), homepage Quick Stats. |
| 5 | `emergency/` | IMPLEMENTED | `/contact` national + city hotline sections from `src/data/emergency-hotlines.json` (verified/historical labels). |
| 6 | `health/` | IMPLEMENTED (partial) | `src/data/health-facilities.json` + `/health` page + `/services/health` rebuild. DOH license/bed data is EXCLUDED (do-not-publish per research — facility names only). |
| 7 | `education/` | IMPLEMENTED (partial) | `src/data/schools.json` + `/education` page (9 HEIs, vocational, 24 secondary, 67 elementary, library). DepEd school IDs not yet obtained — directory carries a pending-verification notice. |
| 8 | `economy/` | IMPLEMENTED (partial) | `/statistics` economy section (mango/bamboo identity, verified households) and `/agriculture`. Production volumes and sector shares are pending-verification notices, not published numbers. |
| 9 | `agriculture/` | IMPLEMENTED | `src/data/agriculture.json` + `/agriculture` page (mango 127,000-trees 2008 stat with re-verify badge, bamboo products, offices). Volumes pending. |
| 10 | `tourism/` | IMPLEMENTED | `src/data/tourism.json` + `/tourism` page (source-badged attractions, Mango-Bamboo Festival, mango pie record, food/drink). Festival dates pending. |
| 11 | `transportation/` | IMPLEMENTED | `src/data/transportation.json` + `/transportation` page (travel times, entry routes, 3 carriers — all labeled historical). Intra-city fares pending. |
| 12 | `legislation/` | EXCLUDED | Reason: `research/legislation/26-09-legislation-archive.md` documents that ordinances/executive orders were not retrievable (JS-only official site); no verified legislative texts exist to publish. Existing `/legislative` pages keep their framework content. |
| 13 | `transparency/` | IMPLEMENTED (partial) | `src/data/fiscal_transparency.json` (FY2009–2016 on `/budget`), `src/data/transparency-docs.json` + `/budget` transparency section (Phase E). FY2017–2025 figures and FDP PDF files are EXCLUDED (unverified / not retrievable — pending notices rendered). |
| 14 | `infrastructure/` | IMPLEMENTED (partial) | `src/data/city-projects.json` + `/budget` projects section (7 program buckets, known projects reference-only). Project budgets/contractors excluded (not verifiable online — pending note). |
| 15 | `disaster-risk/` | IMPLEMENTED (partial) | `src/data/evacuation-centers.json` + `/disaster-preparedness` page (CDRRMO, 5 convergence areas, 10 high-rise shelters, 2017-data badge). Hazard maps EXCLUDED (not obtained from MGB/DOST/NAMRIA — see gis-data). |
| 16 | `environment/` | IMPLEMENTED (partial) | Surfaced via `/disaster-preparedness` hazard context, `/tourism` (tree planting), and the GAD/PPAS program buckets on `/budget`. Waste-management collection schedules are pending (not verified in research). |
| 17 | `utilities/` | IMPLEMENTED | `src/data/utilities.json` + `/utilities` page (CENPELCO verified + 15 branches, Magna Carta 48-h note). Water/telecom identities unverified — rendered as pending, never invented. |
| 18 | `competitiveness/` | IMPLEMENTED | `src/data/competitive-index.json` (CMCI 2016–2019 from the archived DTI capture) + `/statistics` CMCI section. |
| 19 | `culture-history/` | IMPLEMENTED | `/about` history timeline + heritage/basilica blocks; homepage history section. |
| 20 | `news/` | IMPLEMENTED | `data/news.json` (+ public/data mirror): 5 current + 8 historical items with `recency` field; `/news` CURRENT vs HISTORICAL grouping. |
| 21 | `official-presence/` | EXCLUDED (by design) | Reason: provenance-only category (documents *where* official content came from — website shells, archives, social media). Its useful output — official channels (site, Facebook, eBPLS) — is surfaced on `/contact` and throughout data `_source` metadata. |

## Excluded-with-reason summary (subset of the categories above)

- **gis-data** (within `city-profile`): no verified GIS/boundary layers exist; map overlays would be invented data.
- **hazard-maps** (within `disaster-risk`): MGB/DOST/NAMRIA layers not obtained; hazard *context* is published instead.
- **blgf-budget FY2017–2025 gap** (within `transparency`): figures not confirmed against BLGF/COA; withheld with a pending notice.
- **water-district** (within `utilities`): provider identity unconfirmed with LWUA; rendered as an unverified card, no contact published.
- **legislation-archive**: legislative texts not retrievable; `/legislative` framework pages unchanged.
- **official-presence**: provenance-only; official channels surfaced on `/contact` instead of a standalone page.
