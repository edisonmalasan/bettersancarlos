## Why

PR #105 (follow-up of difficult government sources) produced manually verified, trustworthy evidence that has nowhere to live canonically yet: PhilHealth accreditation evidence for six San Carlos City facilities, SCCWD provider-identity evidence, a manually verified DPWH project inventory, and Province of Pangasinan budget-review documents. No probed source (FDPP, COA, BLGF, DPWH, DOH/HFSRB, LWUA) qualifies as a new automation candidate, so the value of PR #105 can only ship by modeling the verified evidence as canonical civic records and generating the compatible outputs — without adding any collectors.

## What Changes

- Canonicalize the six PhilHealth-accredited facilities (name, address, level/type, accredited beds, accreditation expiry 12/31/2026, published contacts) as stable `health-facility-*` records; accreditation fields SHALL never be labeled as DOH licensure, and unknown DOH license fields stay absent.
- Canonicalize the verified SCCWD provider identity (official name, LWUA CCC July 28, 1977 / SP Resolution No. 42 context, verified site, service-area facts where supported); 2017-vintage address/phones/leadership stay historical and are never published as current; PrimeWater's day-to-day role stays explicitly unresolved.
- Map the PR #105 DPWH project inventory into the existing canonical DPWH model (`dpwh-projects-summary` + project-level records only where the model supports them with a minimum extension); narrative-only observations without stable project IDs, contractors, or dates are never invented.
- Model verified Province of Pangasinan budget-review/appropriation documents (title, year, issuing authority, type, official URL, dates, jurisdiction, provenance) as transparency document records; they SHALL never be presented as BLGF Statement of Receipts and Expenditures data, and the FY2017–FY2025 SRE gap stays blocked.
- Import exact source instances through the existing provenance rules (record → `sources.json` → registry) and promote reviewed records through the existing reviewer promotion path; no hand-edits to `data/civic/` or generated JSON.
- Extend `data:generate` only where the design finds it safe (health first, water slice second, transparency only with a clear compatibility contract); preserve the existing DPWH generator and byte-identical `data/` + `public/data/` (+ `src/data/` where present) mirrors.
- Keep FDPP, COA, BLGF, DOH/HFSRB, LWUA directory, and DPWH portal access as manual/blocked; the drafted agency inquiries (BLGF RO1 SRE, COA RO-I AARs, DOH-HFSRB licenses, City Engineering/BAC records) remain manual follow-up and are not sent by this change.
- Update the `docs/data-pipeline.md` producer map for any output that migrates to canonical generation.

Explicit non-goals: no new collectors (`fdpp`, `coa`, `blgf`, `dpwh`, `doh`, `lwua` collector files, dispatch, or registry `collector` changes); no BLGF SRE gapfill; no COA audit-report gapfill; no fabricated DOH license numbers/status/expiry; no historical contacts published as current; no PrimeWater operator inference; no Province-appropriation-as-SRE conflation; no complete DPWH registry claim; no frontend redesign; no civic-data architecture redesign; no new database; no broad re-probe; no automated agency inquiries.

## Capabilities

### New Capabilities

None. This change models verified evidence inside the existing canonical architecture; it introduces no new spec-level capability.

### Modified Capabilities

- `civic-data-pipeline`: new stable record families (health facilities, water provider identity, DPWH project-level evidence where representable, Province transparency documents) with exact instance provenance, correct domains/risk tiers/temporal meaning, and the existing promotion/import path; blocked/manual sources stay manual with no new collectors.
- `civic-data-compat-generation`: ownership migration for `health-facilities.json` (if safe) and a safe water-utility slice of `utilities.json`, DPWH output preserved on its existing generator, transparency outputs migrated only with a clear compatibility contract; byte-identical mirrors preserved.
- `civic-data-surfacing`: newly canonicalized facts surface only with their verified statuses intact (accreditation ≠ license, historical ≠ current, appropriation ≠ SRE, PrimeWater unresolved, narratives ≠ registry); unverified/historical/pending values keep pending/historical labeling.

## Impact

- `data/civic/records.json` + `data/civic/sources.json` (one atomic promotion transaction), `data/civic/schemas/` only if the minimum DPWH/transparency extension requires it.
- `scripts/data/generate.ts` (+ validation/promotion touch-ups only as needed), `scripts/data/*.test.ts` provenance/generation coverage.
- Generated `data/*.json` and byte-identical `src/data/` + `public/data/` mirrors for migrated outputs only.
- `docs/data-pipeline.md` producer map; research Markdown touched only to clarify a concrete representation/provenance issue found during implementation.
- Frontend: no redesign; only minimal changes required to safely render new statuses/fields, reusing existing pending/historical labeling.
