# Product ideas from civic research

Ideas relocated out of research evidence documents (which answer what is known,
not what to build). Preserved verbatim in meaning, attributed per topic. These
are backlog inputs, not commitments.

## demographics

- **Demographics dashboard** — census time series charts (population by census year, age pyramid, density).
- **Barangay population choropleth map**.
- **City statistics cards** integrated into the homepage.

## emergency-hotlines

- **Emergency Hotline Directory (top feature)** — tabular card grid with call buttons; "report outdated number" feedback.
- **Emergency button** on app home linking to 911 and city DRRM.
- **Who to call for what** flow (flood, fire, crime, medical, animal rescue).

## geography

- Interactive city/barangay map (Leaflet + OpenStreetMap already used by the project) with barangay boundaries and population labels.
- Municipal LGU boundary context map (neighbors, distances to cities).
- Flood/hazard data overlay when official GIS becomes available (see `disaster-risk/26-09-disaster-preparedness.md`).

## history

- "About the City" timeline/history page.
- Heritage sites map (plaza, basilica, monument, ancestral houses).
- Cityhood anniversary content (January 1, 1966).

## legislation-archive

- **Ordinance Search** — searchable ordinance/resolution archive (needs digitization).
- **Legislation tracker** — "what's new" from the council.
- **Budget-ordinance linkage** (ordinances that approve appropriation).

## water-district

- **Water service contact page** (once verified) with hotline, office hours, and service area.
- **Water billing / inquiry info** linked to the district's online system (if any).
- **Service interruption advisories** feed.

## agriculture

- **Agriculture dashboard** (mango/bamboo production data once DA/PSA figures obtained).
- **Farmers & fisherfolk programs guide** (requirements for DA/city aid).
- **Bamboo/mango directory** for local MSMEs.

## city-profile

- **City profile / About page** with authoritative infobox facts.
- **Fact-checked stat cards** (population, area, barangays, income class).

## gis-data

- **Interactive city map** with barangay boundaries (choropleth of population).
- **Facility map** (hospitals, schools, gov offices, markets, police, fire).
- **Evacuation center map** (from `disaster-risk/26-09-disaster-preparedness.md`).
- **Hazard overlay** once MGB/DOST data obtained.
- **Address geocoding** for directory entries (geocode barangay centroids).

## cmci-index

- **Competitive Index dashboard** — time-series charts of the 5 CMCI pillars (2016–2019 historical + current when available).
- **Pillar drill-down cards** — per-indicator ranks and scores with year-over-year comparison.
- Link to the official CMCI profile page for the latest data.

## culture-heritage

- Heritage trail / landmark map with opening details.
- Basilica and plaza "Did you know?" content.
- Community folklore section (name-origin stories of barangays).

## disaster-preparedness

- **Evacuation center map** (with contact & capacity).
- **Hazard map overlay** (flood/earthquake) once official MGB/DOST/NAMRIA layers are sourced.
- **Emergency alerts/notices** board aggregated from CDRRMO Facebook/sms.
- DRRM plan document repository.

## hazard-maps

- **Hazard map viewer** (flood/landslide/earthquake) — requires authoritative static map files or an embedded interactive map widget (once sourced from MGB/NOAH).
- **Evacuation center locator** — the official convergence sites are already catalogued in research/disaster-risk/26-09-disaster-preparedness.md (from archived LGU data).
- **Early warning / alert feed** — link to PAGASA advisories and CDRRMO social media.

## local-economy

- **Business directory / MSME directory** (needs data from City Treasurer/BPLO).
- **Permit guide** (eBPLS walkthrough) + fee schedule (not yet obtained).
- **Investment profile** page (land, population, strategic location).

## schools

- **School directory** with filter (public/private, level) → powers `data/schools.json`.
- **Enrollment/resources** info page for parents.
- **DepEd materials** scatter map (school locations) — requires GPS data from DepEd/OSM.

## environmental-programs

- **Waste collection schedule** page (needs city GLOLocal data).
- **Recycling centers / e-waste drop-off** list (needs data).
- **Climate/environment news** feed and DRRM notices.
- **Tree-planting/reforestation tracker** (if the city publishes data).

## city-officials

- **Elected Officials page** (term 2025–2028) — powers the `data/officials.json` in the project.
- **Election history timeline/dashboard** (2016→2025 results).
- Verify and add contact form/office hours for each elected official.

## government-directory

- **Government Directory page** — the core of `data/services.json`/`officials.json`.
- Call-to-action "report wrong number" to keep directory accurate (crowdsourced verification).
- Map of city hall + office locations.

## lgu-structure

- Government directory (department cards with head, contact, hours) — feeds `data/officials.json` and `data/services.json`.
- Org-chart view of the LGU.
- Change-tracking of department heads across terms (historical).
