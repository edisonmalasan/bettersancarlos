## 1. Audit current canonical records and output ownership

- [ ] 1.1 Audit `data/civic/records.json`, `sources.json`, `source-registry.yaml`, `schemas/`, `scripts/data/generate.ts` emitters, and `data/` + `src/data/` + `public/data/` mirrors for the four areas; freeze the stable-ID, registry-entry, and generator-ownership plan from design.md and verify no ID collides with an existing canonical record.
- [ ] 1.2 Confirm the minimum DPWH/transparency model decision (existing `entries[]`/document shape suffices vs additive schema extension) and verify `openspec validate` still passes with no edits applied.

## 2. Health-facility records

- [ ] 2.1 Author provisional candidates for the six `health-facility-*` records (PhilHealth S9 fields only, no DOH license fields) plus the CHO record (GUINTO officer resolution, 2017 phone historical) in a staging run and verify each candidate links an exact source instance, not a bare registry ID or research path.
- [ ] 2.2 Verify conservative naming (no merged look-alike facilities) and that unknown DOH licensing fields are absent, per specs/civic-data-pipeline/spec.md.

## 3. SCCWD and water records

- [ ] 3.1 Author the `utility-water-provider-sccwd` candidate (official name, LWUA CCC 1977-07-28 / SP Res. 42 context, verified site with vintage note, 2014 JV with operator status unresolved) and verify 2017-vintage address/phones/leadership and 2015 service-area figures are absent or explicitly historical.
- [ ] 3.2 Verify existing CENPELCO electricity records and collector coverage are untouched by the water addition (diff shows no CENPELCO record modified).

## 4. DPWH project evidence

- [ ] 4.1 Map the four S5 narrative works into `dpwh-projects-summary` `entries[]` (verified fields only, no invented IDs/dates/contractors) and verify tender strings are stored as procurement context only, Gemma Road is excluded, and secondary tender notices stay research-only unless exact PhilGEPS instances are staged.
- [ ] 4.2 If `entries[]` is insufficient, apply the minimum additive schema/model extension and verify closed vocabularies and existing DPWH validation still pass.

## 5. Province transparency documents

- [ ] 5.1 Author `transparency-doc-province-appropriation-<FY>` metadata-only candidates (FY2020–FY2026 where exactly instanced, Province jurisdiction explicit) and verify no appropriation/AIP/NTA figure populates any SRE field and the FY2017–FY2025 gap stays blocked.
- [ ] 5.2 Verify `fiscal-annual-income` still ends at FY2016 and `fiscal-publication-note` still declares the newer-period gap.

## 6. Source instances and registry

- [ ] 6.1 Add `philhealth-accredited-facilities` and `sccwd-official` registry entries (`collector: null`, manual/per-document) and verify `dilg-fdpp`, `coa-audit`, `blgf`, `dpwh-projects`, `doh-hfsrb`, `lwua` still declare `collector: null` with no new collector modules or dispatch changes.
- [ ] 6.2 Author the staging run(s) under `research/runs/<date>/` (manifest, evidence + hashes, `source-instances.json` with `src-<registry>-<date>-<hash8>` IDs, all-`provisional` candidates, findings, conflicts) and verify `bun run data:diff` reports the expected NEW/CHANGED outcomes and `bun run data:validate` passes on the proposed state.

## 7. Promotion

- [ ] 7.1 Promote reviewed records via `bun run data:promote -- --run=<id> --reviewer=<name>` (never self-accepting high-risk) as one atomic `records.json` + `sources.json` transaction and verify reviewer fields, `nextReviewOn` policy dates, append-only history, and exact instance provenance on every record.

## 8. Compatibility generation

- [ ] 8.1 Extend `data:generate` for health (new `health` emitter, shape-preserving) and for the safe water slice only where the slice-separability check passes; leave transparency without a generated mirror unless a compatibility contract exists, and verify unmigrated sections are byte-identical to before.
- [ ] 8.2 Verify generation fails loudly naming any record whose `sourceIds` do not resolve, and that `_source`/`_updated` derive from canonical provenance.

## 9. Frontend compatibility

- [ ] 9.1 Make only the minimal frontend changes required to render new statuses/fields (reusing existing pending/historical labeling; no redesign) and verify all existing pages render unchanged for unchanged facts.

## 10. Tests

- [ ] 10.1 Add provenance/generation/status tests covering accreditation≠license, historical≠current contacts, appropriation≠SRE (SRE ends FY2016, gap blocked), PrimeWater unresolved, narratives≠registry, CENPELCO intact, and no difficult-source collectors; verify the new tests fail on the pre-change fixtures where applicable and pass on the new state.

## 11. Mirrors and docs

- [ ] 11.1 Verify every migrated output is byte-identical across `data/`, `public/data/`, and `src/data/` where present, with atomic writes and no partial files.
- [ ] 11.2 Update the `docs/data-pipeline.md` producer map for migrated outputs and verify it names the single designated producer per file; touch research Markdown only for a concrete representation/provenance issue found above, if any.

## 12. Full verification

- [ ] 12.1 Run the full gate (`tsc --noEmit`, production `next build`, data validation, research validation/index) and verify all pass; confirm acceptance criteria A–R from the proposal basis hold and no collector files (`fdpp`, `coa`, `blgf`, `dpwh`, `doh`, `lwua`) were added.
