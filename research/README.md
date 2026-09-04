# Better San Carlos City — Research Repository

Research foundation for the **Better San Carlos City** civic-technology website (part of the `lgu.bettergov.ph` initiative by BetterGov).

**Latest research/update date:** 2026-09-04

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
| `26-09-health-facilities.md` | Hospitals and health facilities |

### education/
| File | Description |
|---|---|
| `26-09-schools.md` | Elementary, secondary, tertiary and vocational institutions |

### economy/
| File | Description |
## Important Research Status

- **Official LGU website (sancarlospangasinan.gov.ph):** As of the research date it is a thin single-page site built on Hostinger/Zyro (Astro). Deeper pages share the homepage shell. Historic/official content was recovered from the Internet Archive (2024–2025 snapshots) and from the city's **original WordPress site (`sancarloscitypangasinan.gov.ph`, archived 2017–2020)**.
- **Population figures:** 2020 Census of Population (PSA) = **205,424**; 2015 = **188,571**; per-barangay populations confirmed via PhilAtlas (sourced from PSA).
- **Elected officials:** 2025–2028 term data from Comelec-based unofficial tallies (Rappler) and the city CIO Facebook proclamation; treat vote counts as partial/unofficial until Comelec final canvass.
- Several directories (health facilities, school coordinates, complete ordinance texts) remain **partial** and are explicitly marked for manual verification.

## Major Known Information Gaps

1. **Health:** Complete list of hospitals/clinics with DOH accreditation status; City Health Office contact confirmation.
2. **Education:** DepEd official school masterlist IDs and coordinates; university program lists.
3. **Legislation:** No accessible digital archive of full ordinance/resolution texts found; the `sangguniangbayan.sancarlospangasinan.gov.ph` subdomain was unreachable during research.
4. **Water utility:** The water district serving the city could not be authoritatively confirmed; marked unverified.
5. **Barangay officials:** Contact list is from the 2024 LGU publication; validate against the 2023 BSKE results and upcoming BSKE.
6. **Land area conflict:** PSA/PhilAtlas/official city data = 169.03 km² (16,903 ha); Province of Pangasinan site = 17,087 ha. Needs official reconciliation.
7. **Cityhood law citation:** Sources consistently cite RA 4487 (signed 19 June 1965; effective 1 Jan 1966); the Official Gazette page could not be fetched directly (403) — verify the exact law text.

## Civic-Tech Feature Ideas From This Research

- **Emergency Hotline Directory** — national + city contacts (emergency/)
- **Barangay Directory** — 86 barangays with captains, contacts, populations (barangays/)
- **Government Directory** — officials + department contacts (government/)
- **Ordinance/Legislation archive** — needs digitization (legislation/)
- **Mango-Bamboo Festival calendar + attractions map** (tourism/)
- **Demographics dashboard** — census time series + barangay populations (demographics/)
- **Transparency/budget dashboard** — BLGF income data (transparency/)
- **Evacuation/safe-area map** — official convergence areas from old LGU site (disaster-risk/)
- **Transportation guide** — bus carriers and routes (transportation/)

---
*Access date for all web sources unless otherwise noted: 2026-09-04.*
|---|---|
| `26-09-local-economy.md` | Industries, income, competitiveness index, business context |

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
| `26-09-budget.md` | Annual regular income, fiscal data |
| `26-09-full-disclosure.md` | Transparency Seal, Citizen's Charter, Full Disclosure Policy, SGLG award |

### infrastructure/
| File | Description |
|---|---|
| `26-09-city-projects.md` | Known infrastructure projects and programs |

### disaster-risk/
| File | Description |
|---|---|
| `26-09-disaster-preparedness.md` | DRRM office, evacuation routes/safe areas, risk context |

### environment/
| File | Description |
|---|---|
| `26-09-environmental-programs.md` | Environmental initiatives and programs |

### utilities/
| File | Description |
|---|---|
| `26-09-public-utilities.md` | Electricity (CENPELCO), water, telecommunications |

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