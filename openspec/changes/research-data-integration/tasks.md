## 1. Setup (Phase A)

- [x] 1.1 Create branch `feat/research-data-integration` from `main`, push with `-u origin` — verify clean tree
- [x] 1.2 Read ALL change artifacts + research files listed for your phase; verify the explore-report claims with spot checks (e.g. homepage stats values, statistics barangayData names, contact phone) — record drift in report

## 2. Phase A — Wrong-city data correction

- [x] 2.1 Homepage Quick Stats: replace 52,746/44/1st Class/180.95 km² with 205,424 (2020 census)/86/3rd class city/169.03 km² sourced from `data/city-profile.json` + `data/demographics.json` (static import; keep existing card layout + labels with source years) — verify section renders correct values
- [x] 2.2 `/statistics`: rebuild wrong sections — replace hardcoded population/area/class with verified values; replace `barangayData[]` (~50 fake barangays + wrong series) with the 86 real barangay 2020/2015 populations from `data/demographics.json`; replace unsourced CMCI numbers with `data/competitive-index.json` populated from `research/competitiveness/26-09-cmci-index.md` (2016–2019, incl. 2019 sub-indicators; keep Chart.js configs); fix economy section (mango/bamboo, verified household/income figures; remove coconut) — verify all charts still render and page has zero remaining wrong-city strings
- [x] 2.3 `/contact`: phone (062) 331-2067 → (075) 600-1432 (verified); remove unverified mobiles presented as official; wire emergency/medical hotlines section to `data/emergency-hotlines.json` (911/117/143/8888 + city lines with verification status labels) — verify section renders with statuses
- [x] 2.4 `/government` + `/government/officials`: "Municipal Mayor/Vice Mayor" → "City Mayor/Vice Mayor"; remove display/href mismatch (only (075) 600-1432 verified); align with research — verify cards render correctly
- [x] 2.5 `/budget`: remove hardcoded FY2025 quarterly SRE figures (unverified per research) and the Magat River DPWH card + dead dpwh container; render the verified FY2009–2016 series from `data/fiscal_transparency.json` (chart) + explicit "FY2017–2025 pending verification" notice — verify page renders with verified data only
- [x] 2.6 Verify: `./node_modules/.bin/tsc --noEmit` PASS; production build (`$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack`) PASS; visual smoke at 1440/768/375 (homepage, statistics, budget, contact, government); commit `fix: replace wrong-city data with verified research data` and push
- [x] 2.7 Send `worker_done` for this phase (coordinator merges before Phase B starts)

## 3. Phase B — Barangay + officials enrichment

- [x] 3.1 Extend `src/data/barangay-officials.json`: join `population_2020`, `population_2015`, `urban_rural` from `research/barangays/26-09-barangay-directory.md` onto all 86 entries by canonical name; run a join-verification script — ZERO unmatched required; fix mojibake `source` field ("â€”" → "—") — verify join report 86/86
- [x] 3.2 Extend `src/data/officials.json` (+ `data/officials.json` mirror): add councilor `party`/`votes`, `registered_voters`, `history` (2016–2019, 2019–2022, 2022–2025 terms) from `research/government/26-09-city-officials.md`; keep shape editor/consumer compatible — verify tsc + pages render
- [x] 3.3 `/government/barangays/[slug]`: display populations (+ urban/rural) and captain from joined data; `/government`: historical terms block or link; handle duplicated mobile numbers per research caution (flag "shared line" rather than inventing) — verify a sample of 6 barangay pages against research (incl. Turac 6,919)
- [x] 3.4 Verify gates (tsc, build, visual smoke) + commit `feat: enrich barangay and officials data with verified research` + push + `worker_done`

## 4. Phase C — New pages I (about, health, education)

- [x] 4.1 Create `data/city-profile.json` extensions (geography/boundaries/distances/seal/languages/history-timeline/heritage per design.md D3) + build `/about` route with PageHeader + sections; include 1718 event, 1578/1587 conflict footnote, 2011 mango pie — verify page renders
- [x] 4.2 Create `data/health-facilities.json` + `/health` route (name-only verification badges, DOH-gap notice) — verify page renders
- [x] 4.3 Create `data/schools.json` + `/education` route (HEI/secondary/elementary/library, DepEd-gap notice) — verify page renders
- [x] 4.4 All new pages follow visual-design-system spec (PageHeader, tokens, radius/timing locks, rhythm); add routes to `/sitemap` page + cross-links (about↔homepage history section, health↔services/health, education↔services/education) — verify discoverability
- [x] 4.5 Verify gates + commit `feat: add about, health, and education pages from verified research` + push + `worker_done`

## 5. Phase D — New pages II (tourism, agriculture, transportation, disaster-preparedness, utilities)

- [x] 5.1 `data/tourism.json` + `/tourism` (attractions with source badges, festival block, mango pie record, food/stay, dates-pending notice) — verify
- [x] 5.2 `data/agriculture.json` + `/agriculture` (mango/bamboo identity, 2008 trees stat, offices, volumes-pending) — verify
- [x] 5.3 `data/transportation.json` + `/transportation` (getting-here, carriers, distances, fares-pending, rail history) — verify
- [x] 5.4 `data/evacuation-centers.json` + `/disaster-preparedness` (CDRRMO card, 5 convergence areas, 10 high-rise shelters with 2017-data badge, hotline cross-link) — verify
- [x] 5.5 `data/utilities.json` + `/utilities` (CENPELCO verified + branches, water unverified card, telecom not-researched, outage guidance) — verify
- [x] 5.6 Sitemap + cross-links for all five (tourism↔about, utilities↔contact, disaster↔services/public-safety, transportation↔about, agriculture↔services/agriculture) — verify
- [x] 5.7 Verify gates + commit `feat: add tourism, agriculture, transportation, disaster, and utilities pages` + push + `worker_done`

## 6. Phase E — Cross-cutting completion

- [x] 6.1 `data/transparency-docs.json` + `/budget` transparency section (Citizen's Charter offices, FDP reports, SGLG, eBPLS/forms); `data/city-projects.json` + `/budget` projects section (buckets + known projects, budgets-pending note) — verify
- [x] 6.2 `data/government-directory.json` (offices with phone_status/department heads with confidence flags) + `/contact` directory section (verified vs historical labels) — verify
- [x] 6.3 `data/news.json`: add 8 historical items (keep editor-compatible shape, optional `recency` field) + `/news` CURRENT/HISTORIAL grouping — verify editor still works with new file
- [x] 6.4 Create `openspec/changes/research-data-integration/checklist.md`: all 21 categories → status + files (EXCLUDED entries with reasons for gis-data, hazard-maps, blgf-budget, water-district, legislation-archive, official-presence-provenance) — verify 21/21
- [x] 6.5 Final gates: tsc PASS; build PASS (all new routes prerender); `rg -n "52,746|52,746|180.95|062) 331|Magat|coconut" src/` → zero; link check on new internal links; full visual smoke (new pages at 1440/768/375); commit `feat: complete research data integration with transparency, directory, and news data` + push + `worker_done` with checklist summary
