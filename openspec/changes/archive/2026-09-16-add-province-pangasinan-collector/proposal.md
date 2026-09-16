## Why

The `province-pangasinan` source is the official Province profile of San Carlos City and the only registry source scoped to city-profile/legislation context, yet it has no collector while its facts (classification, district, cityhood, land area) are hand-maintained across three canonical records that already cite its 2026-09-04 evidence instance. Proposal-stage probing (2026-09-16) confirms the page fetches over plain HTTP 200 (~240KB WordPress/Elementor shell) with a labeled, single-occurrence profile block — H1, `3rd Class City`, `Number of Barangay: 86`, RA 4487/4866 sentences, district, Lingayen distance, land area, census population — plus an Officials section and Mango-Bamboo content that must be ignored. A narrow collector that verifies jurisdiction, validates that structure every annual cycle, and preserves the known land-area conflict as evidence (instead of letting it rot unobserved) closes the last uncollected roadmap profile source without touching canonical truth.

## What Changes

- Add a deterministic `province-pangasinan` collector (`scripts/data/collectors/province-pangasinan.ts`) implementing the existing `Collector` contract over one evidence blob: the registered profile page. It verifies San Carlos City, Pangasinan jurisdiction, validates the expected profile structure, records scoped observations (classification, barangay count, district, cityhood/RA refs, distance, land-area verbatim, census-population presence) in `notes`/`findings`, and emits an exact `buildSourceInstance` — with deliberately empty fact coverage.
- The empty coverage is the design, not a gap: the record-mapping audit (design matrix) proves every mappable page fact sits inside a composite canonical record (`city-profile-admin`, `city-profile-identity`, `city-profile-history`, `city-profile-geo-detail`, `city-geo-core`) that promotion replaces wholesale, so any partial candidate would drop unrelated fields. PSA owns the population fact; officials are high-risk government-domain; Mango-Bamboo is unregistered tourism; `/issuances/` is a separate source. v1 therefore emits zero candidates and can never produce `MISSING`.
- Handle the 17,087 ha vs 169.03 km² land-area conflict as notes-only evidence: the parser reports the verbatim observation with units every run; it never becomes a candidate, never enters coverage, and never resolves the conflict (existing research conflict documentation stays authoritative; the candidate schema has no `blocked` status, and no new conflict machinery is invented).
- Register `province-pangasinan` in `COLLECTORS` and assign it in the registry; preserve annual cadence, medium tier, city-profile + legislation domains (legislation stays: RA 4487/4866 sentences are charter context, but coverage stays fact-level empty), and URL; rewrite `accessNotes` to state structure-monitoring scope, the unresolved conflict, excluded officials, and single-page bounds.

## Capabilities

### New Capabilities

- None. This change implements the already-specified source-specific collector behavior for one registered source; it introduces no new architectural capability.

### Modified Capabilities

- `civic-data-pipeline`: extend source-specific collection, provenance, coverage, failure-semantics, and cadence requirements to the Province profile page (bounded single-page collector, positive jurisdiction guard, provisional-only output, explicitly empty fact coverage with named exclusions, composite-safe no-partial-candidate rule, duplicate-PSA-fact exclusion, notes-only land-area conflict preservation, fail-closed drift, annual research-only collection).

## Impact

- Code: one new collector module + dispatcher entry; minimal registry YAML edit; one sanitized HTML fixture; test additions under existing `scripts/data/` conventions; docs roadmap update. No `generate.ts`, frontend, research-rewrite, canonical-data, or conflict-architecture changes.
- Pipeline behavior: `bun run data:refresh -- --source=province-pangasinan` starts producing real runs (0 candidates, exact instance, conflict observation in notes); annual `--due` may select it when due (intended, research-only, stops before promotion). First runs diff to no entries — by explicit design, not by omission.
- Non-goals (explicit): no officials ingestion and no `government` domain addition; no tourism domain; no `/issuances/` crawl or PDFs; no land-area resolution; no PSA population duplication; no canonical-record split/restructure; no partial composite candidates; no auto-promotion; no browser automation; no live-network tests.
