# Better San Carlos City — Research Repository

Research foundation for the **Better San Carlos City** civic-technology website (part of the `lgu.bettergov.ph` initiative by BetterGov).

**Latest research/update date:** 2026-09-05

## Research Purpose

To build a reliable, traceable public-information foundation about **San Carlos City, Pangasinan, Philippines** — covering government, barangays, emergency services, health, education, economy, tourism, legislation, transparency, infrastructure, disaster risk, utilities, demographics, geography, and official online presence — that can power actual civic-tech features (directories, maps, dashboards, archives) on the Better San Carlos City website.

## Rules Under Which This Research Was Conducted

- Every important claim is traceable to a source **inside the same Markdown file**.
- **Verified** information uses filenames like `26-09-<topic>.md`.
- **Unverified** information uses filenames like `26-09-unverified-<topic>.md`.
- No global `research/sources/` directory is used; sources live inside each research file.
- Conflicting information is documented, not silently resolved.
- Official/authoritative sources are prioritized over directories and social media.
- Research/access dates are recorded (primary access date for all sources: **2026-09-04**).

## Category Structure

| Category | Description |
|---|---|
| `city-profile/` | General city information, geography, maps, GIS |
| `government/` | Officials, LGU structure, department directory |
| `barangays/` | Barangay directory (captains, populations) |
| `demographics/` | Census and statistical data |
| `emergency/` | Emergency hotlines and public safety |
| `health/` | Hospitals, health offices, facilities |
| `education/` | Schools and educational institutions |
| `economy/` | Local economy, business, employment |
| `agriculture/` | Agriculture and fisheries |
| `tourism/` | Tourist attractions, festivals, accommodation |
| `transportation/` | Public transport and mobility |
| `legislation/` | Ordinances, resolutions, executive orders |
| `transparency/` | Budget, full disclosure, public documents |
| `infrastructure/` | City projects and infrastructure |
| `disaster-risk/` | Disaster preparedness, hazards, evacuation |
| `environment/` | Environmental programs and waste management |
| `utilities/` | Water, power, telecommunications |
| `competitiveness/` | CMCI competitiveness index and rankings |
| `culture-history/` | History, culture, heritage |
| `news/` | Significant current and historical developments |
| `official-presence/` | Official websites, social media, online services |
## Research Files

### city-profile/
| File | Description |
|---|---|
| `26-09-city-profile.md` | Official name, classification, income class, coordinates, area, symbols, vision/mission, contact summary |
| `26-09-geography.md` | Boundaries, terrain, rivers, climate, distances |
| `26-09-gis-data.md` | Maps/GIS availability, spatial sources, facility-map and hazard-map notes |

### government/
| File | Description |
|---|---|
| `26-09-city-officials.md` | Elected officials 2025–2028 (Mayor, Vice Mayor, Councilors, District Rep) + historical terms |
| `26-09-lgu-structure.md` | Departments, offices, department heads (from archived official LGU directory) |
| `26-09-government-directory.md` | City government contacts (phones, email, addresses) |

### barangays/
| File | Description |
|---|---|
| `26-09-barangay-directory.md` | All 86 barangays: Barangay Captains + mobile contacts (official LGU list) + 2020/2015 census populations |

### demographics/
| File | Description |
|---|---|
| `26-09-demographics.md` | Population census history, age–sex structure, households, language, density |

### emergency/
| File | Description |
|---|---|
| `26-09-emergency-hotlines.md` | National emergency numbers + city emergency contacts (CDRRMO, police, fire) |

### health/
| File | Description |
|---|---|
| `26-09-health-facilities.md` | Hospitals and health facilities (names from LGU sources; DOH license data unverified) |
| `26-09-doh-facilities.md` | DOH-licensed health facilities — license/bed data gaps; facility names corroborated by official LGU evacuation plan |

### education/
| File | Description |
|---|---|
| `26-09-schools.md` | Elementary, secondary, tertiary and vocational institutions |

### economy/
| File | Description |
## Important Research Status

- **New categories created beyond the original prompt structure:** `city-profile/` (consolidates general info + geography + GIS), `news/` (CURRENT vs HISTORICAL developments), and `official-presence/` (official vs community online channels). These were created where the research revealed meaningful topics deserving their own organization.

- **Official LGU website (sancarlospangasinan.gov.ph):** As of the research date it is a thin single-page site built on Hostinger/Zyro (Astro). Deeper pages share the homepage shell. Historic/official content was recovered from the Internet Archive (2024–2025 snapshots) and from the city's **original WordPress site (`sancarloscitypangasinan.gov.ph`, archived 2017–2020)**.
- **Population figures:** 2020 Census of Population (PSA) = **205,424**; 2015 = **188,571**; per-barangay populations confirmed via PhilAtlas (sourced from PSA).
- **Elected officials:** 2025–2028 term data from Comelec-based unofficial tallies (Rappler) and the city CIO Facebook proclamation; treat vote counts as partial/unofficial until Comelec final canvass.
- Several directories (health facilities, school coordinates, complete ordinance texts) remain **partial** and are explicitly marked for manual verification.

## Major Known Information Gaps

### Resolved in this update (research/expand-tier1-data)
- **CMCI competitiveness:** Historical pillar rankings (2016–2019) captured from DTI CMCI portal via Wayback Machine; added to `competitiveness/26-09-cmci-index.md`. Current (2024/2025) scores still pending live portal access.
- **CENPELCO:** Branch list (including San Carlos City Main) confirmed from cenpelco.com; specific hotlines/email/GM remain unverified → `utilities/26-09-cenpelco-contacts.md`.
- **BLGF budget FY2017–2025:** Portals returned 403; data gap and extraction path documented → `transparency/26-09-blgf-budget.md`.
- **Water district:** Identity unverified (LWUA directory returned 403) → `utilities/26-09-water-district.md`.
- **DOH facilities:** License/bed data unobtained (HFSRB list returned 404; OLRS login-only); facility names corroborated by LGU evacuation plan → `health/26-09-doh-facilities.md`.
- **Hazard maps:** Authoritative static map files unobtained (NOAH unreachable, GeoRiskPH cert error, MGB interactive-only) → `disaster-risk/26-09-hazard-maps.md`.

### Still open
1. **Health:** DOH license numbers, bed capacities, accreditation status for city hospitals (requires DOH HFSRB direct request).
2. **Education:** DepEd official school masterlist IDs and coordinates; university program lists.
3. **Legislation:** Full ordinance/resolution texts (SP subdomain unreachable); `26-09-legislation-archive.md` flags status.
4. **Water utility:** Water district name/contacts unverified — needs LWUA or City Hall direct inquiry.
5. **Barangay officials:** Contact list from 2024 LGU publication; validate against 2023 BSKE and upcoming BSKE.
6. **Land area conflict:** PSA/PhilAtlas = 169.03 km² vs Province site = 17,087 ha. Needs official reconciliation.
7. **Cityhood law citation:** RA 4487 (signed 19 June 1965; effective 1 Jan 1966) — Official Gazette page returned 403; verify exact text.
8. **CMCI current scores:** 2024/2025 pillar scores pending live DTI CMCI portal access.
9. **CENPELCO contacts:** Hotlines, email, GM name, office hours unverified.
10. **BLGF FY2017–2025:** Budget/revenue/expenditure data pending BLGF/COA direct extraction.
11. **Hazard maps:** Static authoritative map files for flood/landslide/earthquake pending MGB/NOAH access.
12. **Elected officials:** 2025–2028 vote counts are partial/unofficial until Comelec final canvass.

## Civic-Tech Feature Ideas From This Research

- **Emergency Hotline Directory** — national + city contacts (emergency/)
- **Barangay Directory** — 86 barangays with captains, contacts, populations (barangays/)
- **CMCI competitiveness dashboard** — historical pillar rankings (2016–2019) time series (competitiveness/)
- **BLGF budget trend charts** — once FY2017–2025 data is extracted (transparency/)
- **Power-outage reporting card** — CENPELCO hotlines once verified (utilities/)
- **Hazard-map viewer widget** — embedded interactive flood/landslide/earthquake maps once authoritative files are sourced (disaster-risk/)

---
*Access date for all web sources unless otherwise noted: 2026-09-04.*
*Latest research/update date: 2026-09-04*
- **Government Directory** — officials + department contacts (government/)
- **Ordinance/Legislation archive** — needs digitization (legislation/)
- **Mango-Bamboo Festival calendar + attractions map** (tourism/)
- **Demographics dashboard** — census time series + barangay populations (demographics/)
- **Transparency/budget dashboard** — BLGF income data (transparency/)
- **Evacuation/safe-area map** — official convergence areas from old LGU site (disaster-risk/)
- **Transportation guide** — bus carriers and routes (transportation/)

### economy/
| File | Description |
|---|---|
| `26-09-local-economy.md` | Industries, income, competitiveness index, business context |

### competitiveness/
| File | Description |
|---|---|
| `26-09-cmci-index.md` | CMCI competitiveness index — historical pillar rankings (2016–2019) from DTI CMCI portal (archived); current scores unverified |

### agriculture/
| File | Description |
|---|---|
| `26-09-agriculture.md` | Mango, bamboo, crops, livestock, agriculture office |

### tourism/
| File | Description |
|---|---|
| `26-09-tourist-attractions.md` | Attractions, landmarks, shopping, food |
| `26-09-festivals.md` | Mango-Bamboo Festival and other celebrations |

### transportation/
| File | Description |
|---|---|
| `26-09-public-transport.md` | Getting here, bus carriers, intra-city transport, PNR site |

### legislation/
| File | Description |
|---|---|
| `26-09-legislation-archive.md` | City charter, known ordinances/resolutions/EOs, archive status |

### transparency/
| File | Description |
|---|---|
| `26-09-budget.md` | Annual regular income, fiscal data (FY2009–FY2016 verified; FY2017–FY2025 gap noted) |
| `26-09-blgf-budget.md` | BLGF budget FY2017–FY2025 data gap — portals returned 403; extraction steps documented |
| `26-09-full-disclosure.md` | Transparency Seal, Citizen's Charter, Full Disclosure Policy, SGLG award |

### infrastructure/
| File | Description |
|---|---|
| `26-09-city-projects.md` | Known infrastructure projects and programs |

### disaster-risk/
| File | Description |
|---|---|
| `26-09-disaster-preparedness.md` | DRRM office, evacuation routes/safe areas, risk context |
| `26-09-hazard-maps.md` | Hazard maps (flood/landslide/earthquake) — authoritative map files unobtained; sources documented |

### environment/
| File | Description |
|---|---|
| `26-09-environmental-programs.md` | Environmental initiatives and programs |

### utilities/
| File | Description |
|---|---|
| `26-09-public-utilities.md` | Electricity (CENPELCO), water, telecommunications |
| `26-09-cenpelco-contacts.md` | CENPELCO (Central Pangasinan Electric Cooperative) — branch list confirmed; phone/email/GM unverified |
| `26-09-water-district.md` | Water district serving San Carlos — identity unverified (LWUA directory returned 403) |

### culture-history/
| File | Description |
|---|---|
| `26-09-history.md` | Name origin, Spanish-era history, revolts, cityhood, historical evolution |
| `26-09-culture-heritage.md` | Seal symbolism, legends, heritage markers |

### news/
| File | Description |
|---|---|
| `26-09-news-current-events.md` | 2024 public market fire, SGLG award, CENPELCO disconnection, other developments |

### official-presence/
| File | Description |
|---|---|
| `26-09-official-online-presence.md` | Official website (current + historical domains), Facebook, eBPLS, discovery of "old city site" |