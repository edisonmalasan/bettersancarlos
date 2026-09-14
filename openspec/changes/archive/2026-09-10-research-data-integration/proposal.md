## Why

The `./research/` directory contains 21 categories of verified civic data (33 verified files, filenames prefixed `26-09-`) that the site does not surface. Worse, the explore-stage audit found the site currently displays **wrong-city data** on the homepage and `/statistics` (population 52,746, 44 barangays, 1st-class municipality, 180.95 km², coconut economy, Magat River DPWH project, ~50 non-existent barangay names, (062) phone on `/contact`) — leftovers matching a Zamboanga del Sur LGU. Verified data packs already exist unconsumed in `data/` (`city-profile.json`, `demographics.json`, `emergency-hotlines.json`, `fiscal_transparency.json`), and `competitive-index.json` was emptied as unverified while `/statistics` hardcodes unsourced CMCI numbers. Publishing wrong municipal data on a civic portal is a credibility failure; this change corrects it and surfaces every verified research category.

## What Changes

- **Data correction (wrong-city fix)**: homepage Quick Stats, `/statistics`, `/contact` phone, `/government` official cards, `/budget` FY2025/DPWH content — all replaced with verified research data or explicitly-labeled pending states.
- **Consume existing verified packs**: wire `city-profile.json`, `demographics.json`, `emergency-hotlines.json`, `fiscal_transparency.json` into pages; replace the emptied `competitive-index.json` placeholder with verified 2016–2019 CMCI data from research.
- **Extend existing data**: `officials.json` (party/votes/historical terms), `barangay-officials.json` (+ population_2020/2015, urban_rural), `demographics.json` (+ age-sex structure, voters), `news.json` (+ 8 historical items), `city-profile.json` (+ geography/distances/seal).
- **New data files + new routes** (following PageHeader + static-JSON patterns): `/about` (profile+geography+history+heritage), `/health`, `/education`, `/tourism`, `/agriculture`, `/transportation`, `/disaster-preparedness` (evacuation centers), `/utilities`; plus `government-directory.json` (LGU offices/heads with confidence flags) and `transparency-docs.json` (Citizen's Charter/FDP/SGLG) surfaced on `/contact` and `/budget`.
- **Verification labeling**: every number/fact carries its verification status; unverified fields render explicit pending notices (research do-not-publish flags respected — no invented data).
- **Tracking checklist** mapping all 21 research categories to implementation status.
- **Preserved**: existing routes/IA (new pages are additive), nav labels (Header untouched; discoverability via `/sitemap` + cross-links), hero-media/hero-logo behavior, news-editor compatibility with `news.json`.

## Capabilities

### New Capabilities

- `civic-data-surfacing`: contract for how verified civic research data appears on the site — every city fact traces to the research corpus, verification status is visible to users, unverified/pending data is labeled as such, new directory pages follow existing patterns, and `data/*.json` is mirrored byte-identical to `public/data/`.

### Modified Capabilities

(none — existing specs' requirements are unchanged; visual-design-system/brand rules apply to all new pages)

## Impact

- ~10 new routes + ~12 JSON files (new/extended) in `data/` + `src/data/` (mirrored to `public/data/`), homepage/statistics/budget/contact/government/news page rewrites of data sections.
- `/admin/news-editor` must keep working with the extended `news.json` shape.
- No dependency changes; all content static. Build must pass; new pages must be linked from `/sitemap` and related sections.
