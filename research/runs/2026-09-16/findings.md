# Staging findings — run 2026-09-16 (change integrate-followup-civic-evidence)

Staged by followup-evidence-staging from PR #105-verified facts; byte evidence downloaded where the repo scan allows it.

## What was staged (14 candidates: 12 NEW + 2 CHANGED)
- 6 health-facility records: PhilHealth CY2026 accreditation fields only (name, address, level, beds, expiry 12/31/2026). No phone/email (not transcribed in research; not pulled fresh). No DOH license fields anywhere.
- city-health-office: GUINTO (CHO) / CAYABYAB (Population) mapping from the live LGU directory; phone (075) 955-5917 historical from the 2017 archive.
- utility-water-provider-sccwd: identity core only (name, SP Res. 42 + LWUA CCC 1977-07-28, site, 2014 JV with operator unresolved). Vintage contacts/leadership/service-area omitted (research-only).
- dpwh-projects-summary + dpwh-projects-note: 4 narrative works in entries[] (verified fields only, no IDs). Tenders (secondary aggregator) and Gemma Road (Provincial Gov) excluded.
- 3 Province appropriation-review document records (metadata only): Res 287-2023, 375-2024, 304-2025.

## Deliberate exclusions and follow-ups
- 521-2026-RES.pdf downloads cleanly but contains a Malasiqui ordinance review, NOT the San Carlos FY2026 appropriation review: FY2026 has no exact instance (research example corrected; see research/transparency/26-09-blgf-budget.md note). FY2020-2022 PDFs not locatable via the WP media API.
- Coliling DPWH narratives: direct article URLs not transcribed in research; discovery-based instance used, exact-URL recovery via City Engineering/BAC.
- SCCWD/archive/DPWH page bytes not stored: embedded JSON-LD/CMS paths trip the repo local-path scan; URL+retrieval instances used with disclosure. Facts rest on PR #105 verification plus HTTP-200 re-verification at staging.
- Manual follow-ups (not sent): BLGF RO1 SRE FY2017-2025, COA RO-I AARs, DOH-HFSRB licenses, City Engineering/BAC project records.

## Corrective note (post-promotion, same branch)

Staging-authored URL-only instances used a YYYYMMDD date segment, violating the source-instances schema pattern (YYYY-MM-DD). All five IDs were renamed content-preservingly across source-instances.json, candidates.json, sources.json, and records.json (sourceIds + claimSources); data:validate passes with 0 errors and no old-style ID remains. No facts changed.

