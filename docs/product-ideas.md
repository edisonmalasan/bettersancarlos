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

## doh-facilities

- **Health facility finder** with DOH license status, bed capacity, PhilHealth accreditation, and services (once verified).
- **Emergency room / hospital locator map**.
- **City Health Office contact card** with current phone and hours.

## health-facilities

- **Health facility finder** with DOH accreditation status (needs DOH facility list enrichment).
- **Emergency room wait/call** info (needs facility cooperation).
- **PhilHealth-accredited facilities** list for the city (needs DOH/PhilHealth data).

## city-projects

- **Project Tracker** — status board (proposed → ongoing → completed) per project with budget and contractor.
- **Infrastructure map** — roads, bridges, flood control, health building projects.
- **Bids & awards feed** — invite → results (from RA 9184 pages).

## news-current-events

- **News & announcements board** (curated from official LGU site + PNA + provincial).
- **City events calendar**.
- **Project/announcement archive** (old news is valuable historical data).

## official-online-presence

- **Official source registry** — track official LGU channels vs community/unofficial pages (important for data provenance).
- **Watchdog/archive** — "official site changed" notifications.
- **Scraper target list** (Facebook, sitemap, eBPLS) for automated sync (see `docs/facebook-sync.md` in the project).

## tourist-attractions

- **Discover San Carlos** — attractions page with map, hours, fees, photos.
- **Food & accommodation directory**.
- **Festival event calendar**.

## full-disclosure

- **Transparency dashboard** — consolidated FDP reports, budgets, SGLG status.
- **Citizen's Charter service cards** (requirements, fees, processing times) — currently only office names, not step-by-step procedures.
- **Procurement tracker** — bid invitations/results (the current site has a "BIDS and AWARDS" section).

## blgf-budget

- **Budget dashboard** with time-series charts of revenue vs. expenditure (FY2017–FY2025 once sourced).
- **Revenue breakdown pie chart** (locally sourced vs. IRA vs. other shares).
- **Downloadable SRE / AIP documents** linked from the Transparency page.

## budget

- **Budget dashboard** — annual income/expenditure charts from BLGF/COA data.
- **Transparency center** — Citizen's Charter, GAD plan, DRRM plan, PPAS repository.
- **Procurement tracker** — Invitation to Bid → Bid Results timeline (feeds `data/procurement`).

## public-transport

- **Mobility guide** (routes, terminals, fares) — requires field research.
- **Intercity bus info** — carriers and terminals with schedules.
- **Parking & jeepney route map** — needs official collectible data.

## public-utilities

- **Utilities contact page** (power/water/ISP) with outage hotlines — requires verified provider contacts.
- **Power outage reporting + status** (needs CENPELCO cooperation / their API).
- **Water billing/appointment info** — needs water district official data.

## cenpelco-contacts

- **Power Outage Reporting** page with CENPELCO hotlines (once verified).
- **Rate calculator** linked to CENPELCO rate archives.
- **Area office locator map** with addresses and hours.

## festivals

- **Events calendar** with Mango-Bamboo Festival countdown and schedule.
- **Festival gallery** (crowdsourced or CC-licensed photos).
- "Know before you go" (dates, road closures, where to stay).

## barangay-directory

- **Barangay Directory** — searchable/sortable list with captains, contacts, and populations (powers potential `barangays.json`).
- **Barangay map** with population choropleth.
- **Find my barangay** lookup by address.
