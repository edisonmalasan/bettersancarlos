# San Carlos City, Pangasinan — Maps and GIS Data

**Category:** city-profile
**Verification status:** Unverified/Partially Verified — no official GIS datasets (shapefiles/GeoJSON) were located through reliable public sources in this research; official hazard maps remain to be sourced from MGB/DOST-NAMRIA.
**Research date:** 2026-09-04

## What We Know (spatial facts, verified)

- City center coordinates: **15.9277° N, 120.3478° E** (approx.).
- Land area: **169.03 km²** (PSA 2013 dimension) — see land-area conflict in `city-profile/26-09-city-profile.md`.
- The city is **landlocked** on the Agno River lowland plain.
- Barangay boundaries: not yet digitized.

## Data Sources Identified (for next-phase GIS work)

| Source | Type | Status |
|---|---|---|
| OpenStreetMap | Street/POI basemap | ✅ Accessible; the project already uses Leaflet+OSM |
| PhilAtlas | Profiles, distances, barangay population tables | ✅ Accessible (HTML scraped); no shapefiles |
| PSA | Census geography codes, barangay boundaries (via PSA/PSGC) | ⚠️ PSGC pages blocked (403) during research |
| NAMRIA / DENR | Administrative boundary shapefiles | 🔑 Request official data |
| MGB Region 1 / DOST GeoRiskPh | Hazard maps (flood, earthquake, landslide) | 🔑 Not yet retrieved |
| DILG | Barangay boundary/Census codes | 🔑 Manual follow-up |
| PNP/DICT | Digital address maps | 🔑 Manual follow-up |

## Potential Better San Carlos Features

- **Interactive city map** with barangay boundaries (choropleth of population).
- **Facility map** (hospitals, schools, gov offices, markets, police, fire).
- **Evacuation center map** (from `disaster-risk/26-09-disaster-preparedness.md`).
- **Hazard overlay** once MGB/DOST data obtained.
- **Address geocoding** for directory entries (geocode barangay centroids).

## Notes / Gaps

- No official barangay boundary GeoJSON was found publicly; recommend sourcing from **PSA/NAMRIA** or building from DILG barangay codes + OSM.
- Do not publish precise field-verified coordinates unless each point is independently verified.

## Sources

1. PhilAtlas — *San Carlos City Profile*: https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html
2. OpenStreetMap: https://www.openstreetmap.org/
3. Geoportal/NAMRIA: https://www.geoportal.gov.ph/
4. GeoRiskPh (DOST): https://georisk.gov.ph/