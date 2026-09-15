---
schema: research.v2
id: hazard-maps
title: Hazard Maps & Disaster Risk
category: disaster-risk
research_type: gap-report
verification_status: unverified
temporal_status: current
risk: medium
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - emergency
---

# San Carlos City, Pangasinan — Hazard Maps & Disaster Risk

## Scope

Whether authoritative, downloadable hazard-map datasets exist for San Carlos City, Pangasinan (flood, earthquake, landslide, storm surge, climate projections).

## Summary

No authoritative hazard-map dataset could be downloaded or directly linked: portals returned certificate errors or expose only interactive maps without stable per-LGU download URLs.

## Research Question

Where are the authoritative flood, earthquake, landslide, and climate datasets for San Carlos City, and can they be downloaded or stably linked?

## Current Conclusion

BLOCKED — no stable, citable dataset obtained. Do not present hazard layers as sourced until an authoritative file or stable URL is in hand.

## Context

San Carlos City sits on the **Agno River** lowland plain at ~10.8 m elevation, making **flooding** the primary natural hazard. The city's exposure includes:

- **River flooding** (Agno River system)
- **Monsoon / typhoon rainfall flooding** (May–October wet season; Jul–Aug peak precipitation ~680–733 mm/month per World Weather Online data in Wikipedia) | `S1`
- **Earthquake risk** (proximity to regional fault systems; the city has conducted earthquake drills per archived LGU news, 2023)
- **Landslide risk** generally low given the flat terrain, but possible in peripheral upland barangays

## Target Information

| Dataset | Status | Notes |
|---|---|---|
| Flood hazard maps (MGB / Project NOAH / DENR) | unobtained | portals use interactive web-map interfaces (ArcGIS / GeoNode) without permanent feature URLs for San Carlos |
| Earthquake / ground-shaking maps | unobtained | PHIVOLCS publishes regional hazard maps, not city-specific static files |
| Landslide susceptibility maps | unobtained | MGB maps are regional, not city-specific |
| Storm surge / coastal inundation | not applicable | San Carlos is landlocked |
| Climate / weather projections | unobtained | PAGASA climate data requires interactive query |

## Research Attempts

| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-04 | Project NOAH / NOAH Center (`S4`) | failed | site could not be reached |
| 2026-09-04 | GeoRisk Philippines / hazardhub.ph (`S5`) | failed | SSL certificate errors during fetch attempts |
| 2026-09-04 | MGB hazard maps geoportal | failed | interactive mapping only; no static San Carlos City download URL found |
| 2026-09-04 | DOST-PAGASA | failed | climate data requires interactive query; no static city dataset |
| 2026-09-04 | DILG / NDRRMC | failed | no public per-LGU hazard map repository found |

## Authoritative Sources to Consult

| Agency | Resource | Status | Sources |
|---|---|---|---|
| **Project NOAH / UP NOAH Center** | noah.up.edu.ph — flood/landslide hazard maps | Not reachable during research | S4 |
| **MGB Geoportal** | Hazard maps (flood, landslide, earthquake) | Interactive only; no static URLs | — |
| **PHIVOLCS** | Earthquake hazard / fault maps | Regional, not city-specific | — |
| **DOST-PAGASA** | Climate / rainfall projections | Interactive query required | — |
| **MGB / GeoRiskPH** | georisk.gov.ph | Certificate error during fetch | S5 |
| **OpenStreetMap + flood overlays** | Community hazard data | Not authoritative | S6 |

## Gaps

- Stable flood, earthquake, and landslide datasets for the city.
- City-specific static download URLs or citable interactive views.

## Recommended Next Actions

1. **Request from the City CDRRMO** — the authoritative local source for hazard maps used in the city's evacuation planning (the official evacuation plan lists ~10 convergence sites and high-rise buildings).
2. **DILG Region 1 / OCD Region 1** — the Office of Civil Defense may hold city-level hazard assessments.
3. **LGU-published DRRM Plan** — the city's DRRM Plan (referenced in the official LGU site menu) should contain hazard identification and maps; request a copy from CDRRMO. | `S3`

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | Wikipedia | San Carlos, Pangasinan (climate, World Weather Online data) | — | 2026-09-04 | secondary | https://en.wikipedia.org/wiki/San_Carlos,_Pangasinan |
| S2 | City Government of San Carlos | Evacuation routes and safe areas (archived, old site) | 2017-05-09 | 2026-09-04 | archived-official | https://web.archive.org/web/20170509201719/http://sancarloscitypangasinan.gov.ph/index.php/evacuation-routes-and-safe-areas-for-san-carlos-city/ |
| S3 | City Government of San Carlos | DRRM Plan menu | — | 2026-09-04 | official | https://www.sancarlospangasinan.gov.ph/disaster-risk-reduction-management-plan |
| S4 | Project NOAH | NOAH Center portal (unreachable during research) | — | 2026-09-04 | government-dataset | https://noah.up.edu.ph/ |
| S5 | DOST | GeoRisk Philippines (certificate error during fetch) | — | 2026-09-04 | government-dataset | https://www.georisk.gov.ph/ |
| S6 | OpenStreetMap | Map data | — | 2026-09-04 | community | https://www.openstreetmap.org/ |
