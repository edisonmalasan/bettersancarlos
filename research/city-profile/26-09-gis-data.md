---
schema: research.v2
id: gis-data
title: Maps and GIS Data
category: city-profile
research_type: gap-report
verification_status: partial
temporal_status: mixed
risk: low
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - city-profile
---

# San Carlos City, Pangasinan — Maps and GIS Data

## Scope

Availability of maps and GIS datasets (shapefiles/GeoJSON, basemaps, hazard layers) for San Carlos City, Pangasinan.

## Summary

No official GIS datasets (shapefiles/GeoJSON) were located through reliable public sources; verified spatial facts (coordinates, area, landlocked position) stand, while boundary digitization and hazard layers remain next-phase work.

## Research Question

Which authoritative, publicly accessible GIS datasets cover San Carlos City, and where do facility and hazard maps come from?

## Current Conclusion

Partially answered: street/POI basemaps (OSM) and profile tables (PhilAtlas) are accessible (`S2`, `S1`); official boundary shapefiles and hazard layers are not yet retrieved.

## Verified Spatial Facts

- City center coordinates: **15.9277° N, 120.3478° E** (approx.).
- Land area: **169.03 km²** (PSA 2013 dimension) — see land-area conflict in `city-profile/26-09-city-profile.md`.
- The city is **landlocked** on the Agno River lowland plain.
- Barangay boundaries: not yet digitized. | `S1`

## Data Sources Identified

| Source | Type | Status | Sources |
|---|---|---|---|
| OpenStreetMap | Street/POI basemap | Accessible; the project already uses Leaflet+OSM | S2 |
| PhilAtlas | Profiles, distances, barangay population tables | Accessible (HTML scraped); no shapefiles | S1 |
| PSA | Census geography codes, barangay boundaries (via PSA/PSGC) | PSGC pages blocked (403) during research | S1 |
| NAMRIA / DENR | Administrative boundary shapefiles | Request official data | S3 |
| MGB Region 1 / DOST GeoRiskPh | Hazard maps (flood, earthquake, landslide) | Not yet retrieved | S4 |
| DILG | Barangay boundary/Census codes | Manual follow-up | S1 |
| PNP/DICT | Digital address maps | Manual follow-up | S1 |

## Research Attempts

- Checked OSM, PhilAtlas, PSGC (blocked 403), NAMRIA Geoportal, GeoRiskPH (certificate error), and MGB (interactive-only) on 2026-09-04. | `S1`, `S2`, `S3`, `S4`

## Gaps

- No official barangay boundary GeoJSON found publicly; recommend sourcing from **PSA/NAMRIA** or building from DILG barangay codes + OSM.
- Do not publish precise field-verified coordinates unless each point is independently verified.
- Official hazard maps still to source from MGB/DOST-NAMRIA.

## Recommended Next Actions

- Request boundary shapefiles from PSA/NAMRIA; digitize barangay boundaries from DILG codes + OSM as fallback.
- Retrieve hazard layers from MGB/GeoRiskPH once accessible.

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | PSA via PhilAtlas | San Carlos City Profile | — | 2026-09-04 | authoritative-secondary | https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html |
| S2 | OpenStreetMap | Map data | — | 2026-09-04 | community | https://www.openstreetmap.org/ |
| S3 | NAMRIA | Geoportal Philippines | — | 2026-09-04 | government-dataset | https://www.geoportal.gov.ph/ |
| S4 | DOST | GeoRisk Philippines | — | 2026-09-04 | government-dataset | https://georisk.gov.ph/ |
