# Migration inventory — research-evidence-contract

Source of truth for Phase 3–5 migration. Status mappings are faithful prose→vocabulary translations (no upgrades/downgrades): `Verified*` → verified, `Partially*` → partial, `Historical/Partially` → partial + historical/mixed, `Unverified*` → unverified, `Unverified/Partially` → partial. All 33 files retain existing filenames in this change (rename: deferred for all).

| Path | ID | Type | Verif | Temp | Risk | Sidecar | Product ideas |
|---|---|---|---|---|---|---|---|
| agriculture/26-09-agriculture.md | agriculture | profile | partial | mixed | medium | no | yes |
| barangays/26-09-barangay-directory.md | barangay-directory | directory | partial | mixed | high | **yes → data/barangays.csv** | yes |
| city-profile/26-09-city-profile.md | city-profile | profile | verified | mixed | medium | no | yes |
| city-profile/26-09-geography.md | geography | profile | verified | current | low | no | yes |
| city-profile/26-09-gis-data.md | gis-data | gap-report | partial | mixed | low | no | yes |
| competitiveness/26-09-cmci-index.md | cmci-index | dataset | partial | historical | medium | no | yes |
| culture-history/26-09-culture-heritage.md | culture-heritage | profile | partial | mixed | low | no | yes |
| culture-history/26-09-history.md | history | timeline | partial | historical | low | no | yes |
| demographics/26-09-demographics.md | demographics | dataset | verified | mixed | medium | candidate (census-history series) | yes |
| disaster-risk/26-09-disaster-preparedness.md | disaster-preparedness | profile | partial | mixed | high | no | yes |
| disaster-risk/26-09-hazard-maps.md | hazard-maps | gap-report | unverified | current | medium | no | yes |
| economy/26-09-local-economy.md | local-economy | profile | partial | mixed | medium | no | yes |
| education/26-09-schools.md | schools | directory | partial | current | medium | candidate (level lists if large) | yes |
| emergency/26-09-emergency-hotlines.md | emergency-hotlines | directory | partial | mixed | high | no | yes |
| environment/26-09-environmental-programs.md | environmental-programs | profile | partial | historical | low | no | yes |
| government/26-09-city-officials.md | city-officials | directory | partial | mixed | high | no | yes |
| government/26-09-government-directory.md | government-directory | directory | partial | mixed | high | no | yes |
| government/26-09-lgu-structure.md | lgu-structure | directory | partial | historical | high | no | yes |
| health/26-09-doh-facilities.md | doh-facilities | gap-report | partial | current | high | no | yes |
| health/26-09-health-facilities.md | health-facilities | directory | partial | mixed | high | no | yes |
| infrastructure/26-09-city-projects.md | city-projects | profile | partial | historical | high | no | yes |
| legislation/26-09-legislation-archive.md | legislation-archive | document-index | unverified | historical | high | no | yes |
| news/26-09-news-current-events.md | news-current-events | timeline | partial | mixed | low | no | yes |
| official-presence/26-09-official-online-presence.md | official-online-presence | directory | verified | current | low | no | yes |
| tourism/26-09-festivals.md | festivals | timeline | verified | mixed | low | no | yes |
| tourism/26-09-tourist-attractions.md | tourist-attractions | directory | partial | mixed | low | no | yes |
| transparency/26-09-blgf-budget.md | blgf-budget | gap-report | unverified | current | high | no | yes |
| transparency/26-09-budget.md | budget | dataset | partial | mixed | high | no (8-row series stays inline) | yes |
| transparency/26-09-full-disclosure.md | full-disclosure | document-index | partial | mixed | high | no | yes |
| transportation/26-09-public-transport.md | public-transport | profile | partial | historical | low | no | yes |
| utilities/26-09-cenpelco-contacts.md | cenpelco-contacts | directory | partial | current | medium | no | yes |
| utilities/26-09-public-utilities.md | public-utilities | profile | partial | mixed | medium | no | yes |
| utilities/26-09-water-district.md | water-district | gap-report | unverified | unknown | medium | no | yes |

Notes:
- Cross-file links (`see <category>/26-09-*.md`) exist in several files (agriculture, gis-data, culture-heritage, others); all targets unchanged, so links hold verbatim through migration.
- canonical_domains per file: category-matched registry domains (economy→economy, environment→city-profile, disaster-risk→emergency, culture-history→city-profile, news→news, official-presence→government, transportation→infrastructure, agriculture→economy); finalized during migration.
- No file declares `jurisdiction` (all default San Carlos City, Pangasinan, PH); none needs an override on current evidence.

## Reference inventory (task 1.3)

Active references to `26-09-*.md` paths that constrain the deferred rename:
- `scripts/data/generate.ts`: 8 hardcoded provenance strings (city-officials, emergency-hotlines, budget, cmci-index, barangay-directory, news-current-events, demographics, city-profile/geography/history/culture-heritage).
- `scripts/data/generate.test.ts`: asserts 4 of those strings (news, demographics, city-profile, budget).
- `src/app/**/page.tsx`: ~10 user-visible `Source: research/26-09-…` labels (utilities, transportation, health, environment, disaster-preparedness, budget, education, agriculture, about ×3).
- `src/data/*.json` (+ `public/data/`, `data/` mirrors): ~20 `_source` provenance notes citing research paths.
- `openspec/specs/civic-data-surfacing/spec.md`: corpus defined as files prefixed `26-09-`.
- `openspec/changes/archive/**`: historical references (never rewritten).
- Verdict: filenames stay `26-09-*.md` in this change; bulk rename is a dedicated follow-up (needs surfacing delta + label/provenance updates).
