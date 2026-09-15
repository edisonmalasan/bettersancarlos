# Better San Carlos City — Research Repository

Research foundation for the **Better San Carlos City** civic-technology website (part of the `lgu.bettergov.ph` initiative by BetterGov).

**Research contract:** topic documents follow `research/FORMAT.md` (machine-readable frontmatter, closed vocabularies, type-specific findings, local source registers). Validate with `bun run research:validate`; regenerate the index below with `bun run research:index`. Do not hand-edit the generated regions.

## Research Purpose

To build a reliable, traceable public-information foundation about **San Carlos City, Pangasinan, Philippines** — covering government, barangays, emergency services, health, education, economy, tourism, legislation, transparency, infrastructure, disaster risk, utilities, demographics, geography, and official online presence — that can power actual civic-tech features (directories, maps, dashboards, archives) on the Better San Carlos City website.

## Research Principles

- Every important claim is traceable to a source **inside the same Markdown file**, via the file's local source register.
- Verification and temporal applicability are separate judgments; conflicts are documented, not silently resolved.
- Official/authoritative sources are prioritized over directories and social media.
- San Carlos City, Pangasinan is the default jurisdiction; cross-jurisdiction material says so explicitly (a different San Carlos City must never leak in silently).
- Research dates are recorded per file (`researched_at`, `last_checked`); the primary access date for most sources is **2026-09-04**.
- Topic research is living knowledge — never production truth. Facts reach the site only through civic-data promotion.

## Research Index

The table below is generated from document frontmatter (`bun run research:index`).

<!-- research:index:start:inventory -->
| Category | Topic | Type | Verification | Temporal | Risk | Last checked |
|---|---|---|---|---|---|---|
| agriculture | Agriculture and Fisheries | profile | partial | mixed | medium | 2026-09-04 |
| barangays | Barangay Directory | directory | partial | mixed | high | 2026-09-04 |
| city-profile | City Profile | profile | verified | mixed | medium | 2026-09-04 |
| city-profile | Geography | profile | verified | current | low | 2026-09-04 |
| city-profile | Maps and GIS Data | gap-report | partial | mixed | low | 2026-09-04 |
| competitiveness | CMCI Competitive Index | dataset | partial | historical | medium | 2026-09-04 |
| culture-history | Culture and Heritage | profile | partial | mixed | low | 2026-09-04 |
| culture-history | History | timeline | partial | historical | low | 2026-09-04 |
| demographics | Demographics and Statistics | dataset | verified | mixed | medium | 2026-09-04 |
| disaster-risk | Disaster Risk Reduction and Preparedness | profile | partial | mixed | high | 2026-09-04 |
| disaster-risk | Hazard Maps & Disaster Risk | gap-report | unverified | current | medium | 2026-09-04 |
| economy | Local Economy | profile | partial | mixed | medium | 2026-09-04 |
| education | Schools and Education | directory | partial | current | medium | 2026-09-04 |
| emergency | Emergency Hotlines and Public Safety | directory | partial | mixed | high | 2026-09-04 |
| environment | Environmental Programs and Waste Management | profile | partial | historical | low | 2026-09-04 |
| government | Elected Officials (2025–2028) | directory | partial | mixed | high | 2026-09-04 |
| government | Government Contact Directory | directory | partial | mixed | high | 2026-09-04 |
| government | LGU Structure and Department Heads | directory | partial | historical | high | 2026-09-04 |
| health | Health Facilities (DOH-Licensed) | gap-report | partial | current | high | 2026-09-04 |
| health | Health Facilities | directory | partial | mixed | high | 2026-09-04 |
| infrastructure | City Projects and Infrastructure | profile | partial | historical | high | 2026-09-04 |
| legislation | Legislation Archive (Ordinances & Resolutions) | document-index | unverified | historical | high | 2026-09-04 |
| news | News and Current Events | timeline | partial | mixed | low | 2026-09-04 |
| official-presence | Official Online Presence | directory | verified | current | low | 2026-09-04 |
| tourism | Festivals | timeline | verified | mixed | low | 2026-09-04 |
| tourism | Tourist Attractions and Accommodation | directory | partial | mixed | low | 2026-09-04 |
| transparency | BLGF Budget & Fiscal Data (FY2017–FY2025) | gap-report | unverified | current | high | 2026-09-04 |
| transparency | Budget and Fiscal Data | dataset | partial | mixed | high | 2026-09-04 |
| transparency | Full Disclosure, Transparency Seal & Citizen's Charter | document-index | partial | mixed | high | 2026-09-04 |
| transportation | Public Transport and Mobility | profile | partial | historical | low | 2026-09-04 |
| utilities | CENPELCO (Electric Cooperative) Contacts | directory | partial | current | medium | 2026-09-04 |
| utilities | Public Utilities | profile | partial | mixed | medium | 2026-09-04 |
| utilities | Water District | gap-report | unverified | unknown | medium | 2026-09-04 |
<!-- research:index:end:inventory -->

## Status Summary

<!-- research:index:start:summary -->
- Research documents: 33
- Verified: 5 · Partial: 24 · Unverified: 4 · Blocked: 0
- High-risk: 13
- Last research update: 2026-09-04
<!-- research:index:end:summary -->

## Cross-Cutting Notes

- **Archive context:** the live official LGU site is a thin single-page site; historic/official content was recovered from the Internet Archive (2024–2025 snapshots) and from the city's **original WordPress site (`sancarloscitypangasinan.gov.ph`, archived 2017–2020)**.
- **Land-area conflict:** PSA/PhilAtlas = 169.03 km² vs Province site = 17,087 ha — needs official reconciliation (see `city-profile/26-09-city-profile.md`).
- **Wrong-city caution:** a different San Carlos City exists (Negros Occidental); its material is excluded on sight (see `legislation/26-09-legislation-archive.md`).

## Product Ideas

Research-derived product ideas live in `docs/product-ideas.md`, not in evidence documents.
