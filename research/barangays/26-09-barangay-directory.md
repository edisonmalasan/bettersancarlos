---
schema: research.v2
id: barangay-directory
title: Barangay Directory
category: barangays
research_type: directory
verification_status: partial
temporal_status: mixed
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - barangays
  - demographics
data_files:
  - data/barangays.csv
---

# San Carlos City, Pangasinan — Barangay Directory

## Scope

All 86 barangays of San Carlos City, Pangasinan: captains and contacts from the official LGU list plus 2020/2015 census populations. The full table lives in the declared sidecar and is not duplicated here.

## Summary

86 barangays (30 urban, 56 rural per the LGU demography page). Most populous (2020): **Turac** (6,919). Least populous: **Mabini** (425). Captains reflect the post-2023-BSKE term; populations are PSA census via PhilAtlas.

## Findings

### Directory

The directory is `data/barangays.csv` (87 records: 86 barangays in numeric order plus a `total` row), owned by this document via `data_files`:

| Column | Meaning |
|---|---|
| `id` | Stable row ID: barangay name lowercased, dots and parentheses dropped, spaces collapsed to hyphens (e.g. `bugallon-posadas-st-poblacion`); `total` for the sums row |
| `entity` | Barangay name as published |
| `captain` | Barangay Captain (2024 LGU list) |
| `contact` | Mobile contact(s) as published |
| `pop_2020` / `pop_2015` | Census populations (integers, no thousands separators) |
| `verification` | `partial` per row (2024 list, term-limited); `verified` for the totals row (PSA sums) |
| `temporal` | `mixed` per row; `current` for the totals row |
| `as_of` | `2024-06-03` per row; `2020-05-01` for the totals row |
| `sources` | `S1, S2` per row (captains/contacts `S1`, populations `S2`); `S2` for the totals row |

CSV totals check: pop_2020 sums to 205,424 and pop_2015 sums to 188,571, matching the published totals.

## Verification & Uncertainty

- **Captain/contact data** is the official LGU list archived 2024-06-03; it reflects the term following the Oct 2023 Barangay and Sangguniang Kabataan Elections (BSKE). The next BSKE will change holders — re-verify. | `S1`
- Population figures: PSA 2020 (and 2015) Census of Population via PhilAtlas. Municipal barangay-level 2020 CPH official publication should be cross-checked with the PSA per-barangay tables. | `S2`
- The "Malacañang" barangay contact is RYAN PAGSOLINGAN (the official LGU list); note the barangay shares its name with the national palace — confirm to avoid confusion in any GIS/UI labels. | `S1`
- **Liga ng mga Barangay** (city chapter) telephone (2017 archive): (075) 955-5332 — see `government/26-09-government-directory.md`.

## Conflicts

None identified.

## Gaps

- Re-validation of captains after the next BSKE.
- Municipal per-barangay 2020 CPH cross-check against PSA tables.

## Research Attempts

- Captains and contacts taken from the 2024 LGU Barangay Officials list; populations from PhilAtlas PSA tables; urban/rural split from the LGU demography page, all on 2026-09-04. | `S1`, `S2`, `S3`

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Barangay Officials (archived) | 2024-06-03 | 2026-09-04 | archived-official | https://web.archive.org/web/20240603225000/https://www.sancarlospangasinan.gov.ph/barangay-officials |
| S2 | PSA via PhilAtlas | Barangay demographic table for San Carlos | — | 2026-09-04 | authoritative-secondary | https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html |
| S3 | City Government of San Carlos | Demography (archived) | 2024-06-03 | 2026-09-04 | archived-official | https://web.archive.org/web/20240603225002/https://www.sancarlospangasinan.gov.ph/demography |
