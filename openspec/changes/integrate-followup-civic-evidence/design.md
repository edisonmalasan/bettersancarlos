## Context

See proposal.md (Why) for motivation. Current state on `main` after PR #105:

- Canonical records (`data/civic/records.json`) contain `dpwh-projects-summary` + `dpwh-projects-note` (both `blocked`, empty entries), `fiscal-annual-income` / `fiscal-core` / `fiscal-publication-note` (FY2009–FY2016, `verified`), and **no** `health-*`, `utility-*`, `water-*`, `sccwd-*`, or Province-document record IDs.
- `scripts/data/generate.ts` has 12 emitters including `dpwh` and `fiscal`; it does **not** generate `health-facilities.json`, `utilities.json`, `transparency-docs.json`, or `city-projects.json` (all manual).
- `data/dpwh-projects.json` is an empty manual placeholder (`totalProjects: 0`); `data/health-facilities.json` holds 4 name-only facilities (missing Elguira + Christ-Bearer and all PhilHealth fields); `data/utilities.json` marks water `unverified` ("may or may not exist" — superseded by the SCCWD confirmation); `data/fiscal_transparency.json` is canonical-generated, series ends FY2016.
- Registry (`data/civic/source-registry.yaml`) has 21 entries; `dilg-fdpp`, `coa-audit`, `blgf`, `dpwh-projects`, `doh-hfsrb`, `lwua` are `collector: null`. There is **no** PhilHealth or SCCWD-official-site registry entry; `province-pangasinan` exists (annual, collector bounded to the profile page, explicitly forbidden from crawling `/issuances/`).
- Closed vocabularies already cover what this change needs: domains include `health`, `utilities`, `transparency`, `infrastructure`; types include `facility`, `project`, `document`, `statistic`.
- Constraint: no new collectors, no collector-dispatch changes, no hand-edits to `data/civic/` or generated JSON, atomic `records.json` + `sources.json` promotion, byte-identical mirrors.

## Goals / Non-Goals

**Goals:**

- Give every piece of PR #105 verified evidence a canonical home (or a documented reason it stays research-only).
- Keep all five safety boundaries load-bearing in data, generation, and UI (see specs).
- Migrate generation ownership only where a safe, shape-preserving transform exists.

**Non-Goals:**

- No registry `collector` changes for the six blocked/manual sources; any new registry entries are `collector: null` manual/per-document sources (design-level boundary: registry additions are provenance labels, not automation).
- No schema redesign: no new domains, types, statuses, or cadences; at most a minimum extension to represent DPWH project-level entries if the audit proves `entries[]` insufficient.
- No changes to `city-projects.json` (program buckets stay manual; DPWH integration lives in the canonical DPWH model, not the manual city-projects file).

## Decisions

### Decision: one record per facility, `health-facility-<slug>`, PhilHealth fields only

Proposed stable IDs (audit task confirms no collision with `records.json` before use): `health-facility-pangasinan-provincial`, `health-facility-virgen-milagrosa`, `health-facility-pangasinan-doctors`, `health-facility-blessed-family`, `health-facility-elguira`, `health-facility-christ-bearer`. Each record carries only S9-supported fields (name, address, level/type, accredited beds, accreditation expiry 12/31/2026, published contacts); DOH license fields absent. CHO (officer GUINTO per 2026-09-16 LGU-directory resolution, historical 2017 phone) is a separate record, not a facility.
Alternative considered: reusing `research/health/26-09-health-facilities.md` directory IDs (`facility-provincial-hospital`, …) — rejected: research-local IDs are not canonical IDs and two collide conceptually with the broader naming scheme; canonical IDs follow the `records.json` kebab-case convention with a domain prefix.

### Decision: single SCCWD identity record, vintage facts quarantined

Proposed ID: `utility-water-provider-sccwd` (domain `utilities`, type per schema — provider identity; audit confirms type choice). Current facts: official name, LWUA CCC July 28 1977 / SP Resolution No. 42 context, verified site URL (marked 2017-vintage content), 2014 PrimeWater JV fact with operator status `unresolved`. The 2017 address/phones/leadership and 2015 connection/zone/pumping-station figures are either omitted or stored with explicit historical vintage — never as current values.
Alternative considered: separate records for service area / leadership — rejected: leadership currency is unconfirmed and service-area figures are 2015-vintage; one identity record with quarantined history minimizes surface for stale-data leakage.

### Decision: DPWH narrative works into `entries[]`, procurements stay out unless exactly instanced

The four S5-evidenced works (Bogaoan slope ₱48.99M, Guelew revetment ₱47.78M, Coliling overlay ₱9.9M, Coliling drainage/widening ₱41.2M; all DPWH 4th DEO / Region I, reported complete 2024) map into `dpwh-projects-summary.data.entries[]` with only verified fields and no project ID. The three tender notices (26Aj0046, 26A00037, 26AJ0050) come from a secondary aggregator unconfirmed vs PhilGEPS/BAC: they enter canonical data **only** if exact PhilGEPS instances can be staged; otherwise they stay research-only with a City Engineering/BAC follow-up note in `dpwh-projects-note`. Gemma Road (Provincial Government, not DPWH) is excluded from DPWH records entirely.
Alternative considered: new `dpwh-project-<slug>` records per work — rejected unless the audit proves `entries[]` cannot hold them; the minimum-extension rule governs.

### Decision: Province documents as `transparency-doc-*` metadata records, no figure parsing

Proposed IDs: `transparency-doc-province-appropriation-<FY>` for FY2020–FY2026 budget-review resolutions (plus AIP/supplemental docs only where exactly instanced), each carrying title, year, Sangguniang Panlalawigan authority, document type, official `/issuances/` URL, review/ordinance dates, jurisdiction (Province of Pangasinan — explicitly not San Carlos City), and provenance. No appropriation/AIP/NTA/20%/LDRRMF figure is modeled beyond metadata. The BLGF SRE series and `fiscal-publication-note` keep the FY2017–FY2025 blocked gap.
Alternative considered: extending `fiscal-annual-income` with appropriation figures — rejected: appropriations are authorizations by ordinance, not SRE actuals; conflation is the central hazard.

### Decision: two new `collector: null` registry entries; Province PDFs reuse `province-pangasinan`

- New `philhealth-accredited-facilities` (manual/per-document, `collector: null`) for the S9 dataset: DOH/HFSRB must not vouch for PhilHealth provenance.
- New `sccwd-official` (manual/per-document, `collector: null`) for `sccwd.gov.ph` pages: LWUA (blocked directory) must not vouch for district-site facts.
- DPWH official narratives stage as manual per-document instances of the existing `dpwh-projects` registry (its `discovery: inquiry only` already covers manually acquired official material).
- Province `/issuances/` PDFs stage as manual per-document instances of the existing `province-pangasinan` registry (publisher match; the profile-page collector is never invoked for them and stays uncrawled).
Alternative considered: zero registry changes, attaching everything to the nearest existing entry — rejected: PhilHealth≠DOH and SCCWD-site≠LWUA; wrong-registry provenance is worse than a minimal manual entry.

### Decision: manual-evidence staging run, then reviewer promotion, then generate

Staging follows the existing run contract without a collector: an agent-authored run under `research/runs/<date>/` (manifest with explicit source scope, downloaded public PDFs/pages + hashes where legally storable, `source-instances.json` with `src-<registry>-<date>-<hash8>` IDs, `candidates.json` all `provisional`, `findings.md`, `conflicts.md`), then `data:diff`, then reviewer `data:promote -- --run=<id> --reviewer=<name>` (never self-accepted for high-risk), then `data:generate`, then `verify`. This reuses promotion validation (exact-instance provenance, no-downgrade risk, atomic commit) unchanged.

### Decision: generator migration order — health, then water slice, transparency only on contract

- Health: add a `health` emitter producing `health-facilities.json` from `health-facility-*` (+ CHO record), shape-preserving (existing `facilities[]`, `city_health_office`, `gap_note` keys retained; accreditation fields added; `_source` from canonical provenance). Proceed only if the audit shows the transform is total over the file's current content.
- Water: migrate only if the identity record maps cleanly onto the file's `water` section without touching `electricity`/`telecom`/others; otherwise the water section keeps its existing manual path and the design documents the remainder. CENPELCO output is byte-identical either way.
- DPWH: existing emitter untouched; it reads the same records.
- Transparency: no new emitter unless a compatibility contract for the target file already exists; otherwise document records ship without a generated mirror.

## Mapping table

| Area | Research evidence | Existing canonical model | Required change | Generated output |
|---|---|---|---|---|
| Health | PhilHealth S9 six-facility rows (beds, level, expiry 12/31/2026, contacts, addresses); no DOH licenses | No health records; manual `health-facilities.json` (4 name-only) | Six `health-facility-*` records + CHO record; new `philhealth-accredited-facilities` registry entry (`collector: null`); staging run + reviewer promotion | `health-facilities.json` via new `health` emitter if shape-preserving transform is total |
| Water | SCCWD identity (LWUA CCC 1977-07-28, SP Res. 42, official site, 2014 PrimeWater JV); 2017 contacts/leadership vintage; 2015 service-area vintage | No water records; manual `utilities.json` (water `unverified`); CENPELCO collector + coverage intact | One `utility-water-provider-sccwd` record; new `sccwd-official` registry entry (`collector: null`); vintage facts quarantined; PrimeWater unresolved | Safe water slice of `utilities.json` only; CENPELCO sections byte-identical; remainder stays manual and documented |
| DPWH | 4 S5 narrative works (location/office/amount/status verified, no stable IDs); 3 secondary tender notices; Gemma Road excluded (Provincial Gov) | `dpwh-projects-summary` + `dpwh-projects-note` (`blocked`, empty `entries[]`); existing `dpwh` emitter; empty placeholder output | Narrative works into `entries[]` (verified fields only, no IDs); tenders canonical only with exact PhilGEPS instances, else BAC follow-up note; minimum schema extension only if `entries[]` insufficient | `dpwh-projects.json` via existing emitter, unchanged architecture |
| Transparency | Province `/issuances/` budget-review resolutions FY2020–FY2026 (+ AIP/supplemental docs); BLGF SRE FY2017–FY2025 blocked | `fiscal-annual-income` (FY2009–FY2016) + notes; generated `fiscal_transparency.json`; no document records | `transparency-doc-province-appropriation-<FY>` metadata records as manual per-document instances of `province-pangasinan`; SRE gap stays blocked | New transparency output only with a clear compatibility contract; otherwise records ship without a generated mirror |

Generator ownership after this change: `health` emitter owns `health-facilities.json` (if migrated); `dpwh` emitter still owns `dpwh-projects.json`; `fiscal` emitter still owns `fiscal_transparency.json`; water slice ownership decided by the safety check; everything else keeps its current producer. `docs/data-pipeline.md` producer map is updated to match.

## Risks / Trade-offs

- [Risk] Tender aggregator (secondary) mistaken for authoritative PhilGEPS data → Mitigation: tenders enter canonical data only with exact PhilGEPS instances; otherwise research-only + BAC follow-up.
- [Risk] 2017-vintage SCCWD/CHO contacts leak into current-contact UI → Mitigation: quarantine at record level (absent or historical-marked) plus surfacing-level historical labeling; add a generation/provenance test asserting no `current` contact claim derives from a 2017 instance.
- [Risk] Province appropriation figures drift into SRE series or charts → Mitigation: document-type records carry no SRE fields; test asserts the SRE series still ends FY2016 and `fiscal-publication-note` still declares the gap blocked.
- [Risk] `entries[]` proves insufficient and tempts a domain remodel → Mitigation: minimum-extension rule; any schema change is additive/optional and validated against the closed vocabularies.
- [Risk] Partial utilities migration creates a generated/manual hybrid overwriting the same fields → Mitigation: single-producer-per-section rule; if the slice is not cleanly separable, the whole file stays manual.
- [Risk] New registry entries perceived as automation scope creep → Mitigation: both are `collector: null` manual/per-document; dispatch and `--due` behavior unchanged (manual/per-document sources are never `--due`-eligible).

## Migration Plan

1. Audit (records, registry, schemas, emitters, mirrors) and freeze the ID/provenance plan.
2. Add the two registry entries (no dispatch changes) and author the staging run(s) with exact instances + provisional candidates.
3. `data:diff` review; reviewer promotion as one atomic transaction; `data:generate`; `verify`.
4. Extend/keep emitters per the safety checks; assert byte-identical mirrors.
5. Update the producer map; run full verification (`tsc`, production build, data + research validation).
6. Rollback: promotion's atomic commit/rollback covers canonical data; regenerated outputs are reproducible from canonical records, and no frontend consumption path changes, so reverting the promotion and regenerating restores the prior state.
