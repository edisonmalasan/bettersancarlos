---
schema: research.v2
id: doh-facilities
title: Health Facilities (DOH-Licensed)
category: health
research_type: gap-report
verification_status: partial
temporal_status: current
risk: high
researched_at: 2026-09-04
last_checked: 2026-09-16
canonical_domains:
  - health
---

# San Carlos City, Pangasinan — Health Facilities (DOH-Licensed)

## Scope

Whether San Carlos City health facilities carry verifiable DOH licenses, bed capacities, and accreditation — and which facility names are corroborated to operate in the city.

## Summary

Facility names are corroborated by the official LGU evacuation plan and gallery; VMUF existence in the city is additionally corroborated by its official university site (`S8`). Beds, level, contacts, addresses, and accreditation expiry for six facilities are established from the PhilHealth accredited-hospitals list (`S9`). DOH license-to-operate numbers remain unverified: the HFSRB list is unreachable and OLRS has no public path on re-check 2026-09-16.

## Research Question

Which health facilities in San Carlos City are DOH-licensed, with what bed capacities, classifications, and accreditation?

## Current Conclusion

Partially answered: six facility names are corroborated as operating in the city, with beds, level, contacts, addresses, and accreditation expiry from the PhilHealth list (`S9`); no DOH license-to-operate numbers are verified. Do not publish license numbers. Re-checked 2026-09-16: HFSRB host 403s; OLRS 403s; PhilHealth old accredited-provider path 404 but per-package accreditation PDFs (incl. hospitals) are publicly downloadable.

## Corroborated Facility Names

The following facilities are named in the City Government of San Carlos's official evacuation-plan page (archived 2017-05-09) as high-rise buildings / safe shelters, confirming they operate in the city:

| Facility | Type | Evidence | Sources |
|---|---|---|---|
| Pangasinan Provincial Hospital (San Carlos) | Government / Provincial Hospital | Named in official LGU evacuation plan + Wikipedia city gallery; operated by the Province of Pangasinan. Province city page confirms San Carlos City, Pangasinan context (86 barangays, 2020 census 205,424) but publishes no hospital contacts. | S1, S6 |
| Virgen Milagrosa University Foundation (VMUF) Medical Center | Private / University Hospital | Named in official LGU evacuation plan; VMUF official university site confirms the university operates in San Carlos City context (official site active 2026; hospital license/contact not published there) | S1, S8 |
| Blessed Family Hospital | Private Hospital | Named in official LGU evacuation plan | S1 |
| San Carlos Doctors Hospital | Private Hospital | Named in Wikivoyage / general references as a high-rise building in the city | S7 |
| Elguira General Hospital | Private Hospital (PhilHealth: 30 beds, Level 2, exp 12/31/2026) | PhilHealth accredited-hospitals list, Region I, SAN CARLOS CITY row (259 Rizal Ave.) — not previously in the evacuation-plan names | S9 |
| Christ-Bearer Infirmary | Private Infirmary/Dispensary (PhilHealth: 18 beds, INF/DISP, exp 12/31/2026) | PhilHealth accredited-hospitals list, Region I, SAN CARLOS CITY row (Binoalan, Pagal) — not previously in the evacuation-plan names | S9 |

### PhilHealth Accreditation Rows (2026-09-16)

The PhilHealth accredited Hospitals and Infirmaries list for CY 2026 (updated July 31, 2026, `S9`) carries Region I rows with municipality SAN CARLOS CITY for six facilities: Pangasinan Provincial Hospital (250 beds, Level 2, government), Virgen Milagrosa Medical Center (50 beds, Level 2), Pangasinan Doctors Hospital (37 beds, Level 2, 307 Rizal Avenue), Blessed Family Doctors General Hospital (75 beds, Level 2, Ilang), Elguira General Hospital (30 beds, Level 2, 259 Rizal Ave.), and Christ-Bearer Infirmary (18 beds, INF/DISP, Binoalan/Pagal) — each with phone, email, street, and accreditation expiry 12/31/2026. These establish **accreditation status, bed capacity, level, contacts, and addresses**; they do NOT establish DOH license-to-operate numbers, which remain unverified. Region scoping (Region I section) distinguishes these rows from any same-named Negros entries.

### City Health Office

The **City Health Office (CHO)** operates under the San Carlos City government (confirmed in the 2024 archived LGU Departments/Offices directory). Contact number from the 2017 archived directory: **(075) 955-5917** — marked historical, re-verify. | `S3`, `S2`

## Target Information

| Field | Status | Notes |
|---|---|---|
| DOH License to Operate numbers | unknown | HFSRB unreachable; OLRS has no public path |
| Bed capacity / authorized bed count | partial | PhilHealth HOSP list rows for six city facilities — `S9` |
| Facility classification / level (Level 1 / 2 / 3) | partial | PhilHealth HOSP list rows — `S9` |
| Accreditation status | partial | PhilHealth accreditation expiry 12/31/2026 for the six rows — `S9` |
| Services offered (e.g., PhilHealth accreditation, emergency services) | unknown | — |
| License validity / expiration dates | unknown | — |

## Research Attempts

| Date | Source | Result | Notes |
|---|---|---|---|
| 2026-09-04 | DOH HFSRB List of Regulated Health Facilities (`S4`) | failed | HTTP 404 |
| 2026-09-04 | DOH OLRS portal (`S5`) | failed | login-only; no public facility search; Region I implementation deferred per Department Circular 2023-0375 |
| 2026-09-04 | HFSRB search by city | failed | no public parameterized search endpoint found |
| 2026-09-04 | Direct web searches for facility license numbers | failed | no authoritative source returned results |
| 2026-09-16 | DOH HFSRB list re-check (`S4`) | failed | HTTP 404 again; no public list |
| 2026-09-16 | DOH OLRS portal re-check (`S5`) | failed | login-only applicant portal; no public facility search; deferment notice still displayed |
| 2026-09-16 | PhilHealth accredited-provider path | failed | HTTP 404; no San Carlos facility accreditation evidence retrieved |
| 2026-09-16 | VMUF official site (`S8`) | partial | confirms university operates in city context; publishes no hospital license, bed, or accreditation data |
| 2026-09-16 | Province of Pangasinan city page | partial | confirms San Carlos City, Pangasinan jurisdiction context; publishes no hospital licensing data |
| 2026-09-16 | PhilHealth accredited-hospitals list CY 2026 (`S9`) | partial | six SAN CARLOS CITY rows in Region I with beds, level, contacts, addresses, expiry 12/31/2026; no DOH license numbers |

## Gaps

- DOH license numbers, bed capacities, classifications, accreditation, services, and validity dates.
- RHU / Barangay Health Station per-barangay names and locations (see `health/26-09-health-facilities.md`).

## Recommended Next Actions

1. **File a request with DOH HFSRB** (Health Facilities and Services Regulatory Bureau) for the licensed facility list in San Carlos City, Pangasinan.
2. **Check PhilHealth's accredited facility list** — PhilHealth publishes lists of accredited hospitals and infirmaries that may include San Carlos facilities.
3. **Contact the Pangasinan Provincial Health Office** — for the Pangasinan Provincial Hospital license details.
4. **Verify directly with each facility** — request current license-to-operate and bed-capacity data from VMUF Medical Center, Blessed Family Hospital, and San Carlos Doctors Hospital.

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Evacuation routes and safe areas (archived, old site) | 2017-05-09 | 2026-09-04 | archived-official | http://sancarloscitypangasinan.gov.ph/index.php/evacuation-routes-and-safe-areas-for-san-carlos-city/ |
| S2 | City Government of San Carlos | Contact Us (archived, old site; CHO phone) | 2017-03-22 | 2026-09-04 | archived-official | http://sancarloscitypangasinan.gov.ph/index.php/contact-us/ |
| S3 | City Government of San Carlos | Departments/Offices (archived) | 2024-06-03 | 2026-09-04 | archived-official | https://web.archive.org/web/20240603225001/https://www.sancarlospangasinan.gov.ph/departmentsoffices |
| S4 | DOH HFSRB | List of Regulated Health Facilities (returned 404) | — | 2026-09-04 | government-dataset | https://hfsrb.doh.gov.ph/list-of-regulated-health-facilities/ |
| S5 | DOH OLRS | Online Licensing and Regulatory System (login-only) | — | 2026-09-04 | government-dataset | https://olrs.doh.gov.ph/ |
| S6 | Wikipedia | San Carlos, Pangasinan (gallery) | — | 2026-09-04 | secondary | https://en.wikipedia.org/wiki/San_Carlos,_Pangasinan |
| S7 | Wikivoyage | San Carlos (Pangasinan) | — | 2026-09-04 | secondary | https://en.wikivoyage.org/wiki/San_Carlos_(Pangasinan) |
| S8 | Virgen Milagrosa University Foundation | Official university site (existence context; no hospital licensing data) | — | 2026-09-16 | official | https://vmuf.edu.ph/ |
| S9 | PhilHealth | Accredited Hospitals and Infirmaries CY 2026 (beds, level, contacts, expiry; no license numbers) | 2026-07-31 | 2026-09-16 | government-dataset | https://www.philhealth.gov.ph/partners/providers/facilities/accredited/ |
