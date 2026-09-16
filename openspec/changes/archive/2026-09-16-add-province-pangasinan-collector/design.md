## Context

See `proposal.md` (Why) for motivation. Current state (verified on `main`, 2026-09-16):

- Registry `province-pangasinan` (Province of Pangasinan, profile URL, website, `collector: null`, annually, medium, city-profile + legislation) cites city-profile geography research; one canonical instance `src-province-geo` (2026-09-04) backs `city-geo-core`, `city-profile-admin`, and `city-profile-geo-detail`.
- The `Collector` contract, `COLLECTORS` dispatch, shared single-blob HTTP acquisition, `buildSourceInstance` provenance, provisional candidates, fact coverage, and `parse:` → `SOURCE_CHANGED` semantics are established (archived PSA + CENPELCO changes are the pattern references).
- Proposal-stage probe: profile page fetches HTTP 200 (~240KB WordPress/Elementor, 61 script tags, content server-rendered). Profile block: H1 `San Carlos City`, breadcrumb, `3rd Class City`, `Number of Barangay: 86`, Binalatongan narrative with RA 4866/4487 sentences, `third congressional district`, `19 kilometers` from Lingayen, `17,087 hectares`, `205,424` census figure, Mango-Bamboo paragraph, then an `Officials` section (Mayor/Vice/Councilors). Promotion replaces candidate `data` wholesale (verified in `promote.ts`), so partial composite candidates are forbidden.
- Research (`26-09-geography.md`, `26-09-city-profile.md`) documents the 16,903 ha (PSA) vs 17,087 ha (Province) conflict as authoritative; the collector must preserve, never resolve it.

## Goals / Non-Goals

**Goals:**

- A bounded deterministic Province collector reusing every existing pipeline contract, watching structure + conflict evidence with empty fact coverage.
- Explicit record-mapping matrix with A–G classification for every page field.
- Offline fixture tests proving evidence → instance → notes → diff → (test-only) promotion plumbing without touching production data.

**Non-Goals:**

- No candidates, no coverage IDs, no canonical writes, no generator changes; no officials/tourism/issuances ingestion; no conflict resolution; no record restructuring.

## Decisions

### 1. One-page acquisition: the registered profile URL only

Existing `acquireEvidence` fetches the registry URL in one bounded GET (~240KB verified). No second page, no `/issuances/` crawl, no PDFs, no browser automation. If the page later requires JS rendering, that is a new design decision, not a silent fallback.

### 2. Anchors: text-labeled Elementor structure, not widget ids

Widget `data-id` hashes are opaque; anchors are stable visible labels instead: H1 text, breadcrumb trail, `<title>`, `3rd Class City`, `Number of Barangay:`, and the district/land-area/population/RA sentence patterns inside the profile text region (which ends where the `Officials` heading begins). Missing anchors throw `parse:`.

### 3. Parser location: inside `scripts/data/collectors/province-pangasinan.ts`

Follows the PSA/CENPELCO precedent (co-located source-specific parsing, exported pure functions for tests). No shared-framework changes.

### 4. Record-mapping matrix (final v1)

| Source observation | Existing canonical record | Exact field(s) | Candidate? | Coverage? | Reason |
|---|---|---|---:|---:|---|
| H1 / breadcrumb / title identity | — (structural) | — | no | no | Guard anchors, not facts |
| `3rd Class City` | `city-profile-admin` | `income_class` (+5 unmapped) | no | no | B: composite would drop postal/area codes |
| `Number of Barangay: 86` | `city-geo-core` | `barangay_count` (+4 unmapped) | no | no | B: composite would drop coordinates/elevation/area |
| `third congressional district` / H2 | `city-profile-admin` | `legislative_district` (+5 unmapped) | no | no | B: corroborates only; composite-blocked |
| RA 4487 cityhood sentence | `city-profile-history` | `cityhood` (+timeline unmapped) | no | no | B/F: partial; no effective date on page |
| RA 4866 Basista sentence | none | — | no | no | F: historical context, no canonical field |
| Binalatongan narrative | none modeled | — | no | no | F: narrative, not facts |
| Lingayen 19 km | `city-profile-geo-detail` | `distances[]` (already identical) | no | no | B: no new information |
| Land area 17,087 ha | `city-geo-core` | `land_area_km2` | no (notes-only) | no | C: live conflict; preserved, never replaced |
| Population 205,424 | `population-total-2020` | `total` | no | no | B: PSA-owned; duplicate noise refused |
| Mango-Bamboo / northern title | none in scope | — | no | no | D: tourism domain unregistered |
| Officials section | `city-mayor-current`, etc. | — | NO | NO | E: high-risk government facts; dedicated records exist |
| `/issuances/` + PDFs | none in scope | — | no | no | D: separate future source |
| Former names / languages / motto / seal | various / none | — | no | no | Not on page or unmapped; out of scope |

Classes: A in-scope (none in v1 — stated openly), B better-covered/duplicative, C conflicting, D outside domains, E politically sensitive, F context-only, G future expansion (none proposed).

### 5. Empty coverage is explicit

`coverage: {expectedRecordIds: []}` — every run declares it attempted zero canonical IDs. With no candidates, diff yields no entries; `MISSING` is structurally impossible. This is reviewed deliberate narrowness, matching the spec's "unsupported or conflicting facts stay outside coverage".

### 6. Land-area observation without candidacy

Parser extracts the hectare sentence deterministically (`([\d,]+)\s*hectares`, strict integer grammar, units preserved verbatim) and records e.g. `Province observes land area 17,087 hectares` in notes every run. No comparison against canonical values inside the parser (no hardcoded 169.03, no canonical reads — output stays a pure function of evidence). Conflict interpretation remains with reviewers and existing research docs.

### 7. Bounded parsing excludes Officials by construction

The parser operates only on the profile text region (H1 through the narrative end, stopping at the `Officials` heading). Official names are never scanned for facts, so officials-section edits cannot alter output — proven by variant tests, not by blocklists.

### 8. Duplicates and normalization

Identical repeated observations (title/H1 echo, responsive duplication) are recorded once; two DIFFERENT values for one observed fact (e.g., two barangay counts) throw `parse:` as ambiguous structure. Normalization is trim/collapse/entities/Unicode plus strict labeled-integer parsing; no fuzzy matching, no unit inference, no narrative rewriting.

### 9. Source instance and cadence

One `buildSourceInstance` per blob (`documentType: 'webpage'`, registry publisher/URL). New bytes → new instance id via the existing content key (promotion dedupe handles reuse); `src-province-geo` is never mutated. Annual cadence unchanged: `--due` selects when the yearly window lapses; failures retry per shared policy; scheduled runs stop before promotion.

### 10. Fixture

Committed `scripts/data/fixtures/province-pangasinan-san-carlos-<date>.html`: real H1/breadcrumb/title, labeled profile facts, full narrative sentences (RA/district/distance/land-area/population/Mango), `Officials` heading with a minimal redacted row sample (public-official names are retained only as much as the ignore-guard needs; bulk rows stripped), sanitized of scripts/styles/nav/ads/trackers, with source + capture date documented. Variant fixtures by minimal edits (missing H1, missing label, Dagupan page, officials-only change, hectare change).

## Risks / Trade-offs

- [Risk] Elementor redesign moves/removes labels → `parse:` + `SOURCE_CHANGED` research PR until parser updated. Mitigation: text-label anchors (not widget ids), fixture pins last-known-good.
- [Risk] An always-zero-candidate collector looks valueless in review. Mitigation: its value is stated plainly — annual structure proof + conflict-evidence accumulation + tested harness for future scoped additions; the alternative (no collector) leaves the conflict unobserved.
- [Risk] Future editors "complete" the collector by adding candidates without a scoping change. Mitigation: spec forbids candidates beyond explicit coverage; coverage is `[]` until a new change justifies otherwise.
- [Risk] The hectare sentence could be reworded while the conflict persists. Mitigation: strict sentence-pattern matching fails closed rather than silently dropping the observation.
- [Risk] Officials heading renamed, moving the region boundary. Mitigation: region end falls back to narrative-structure expectations; ambiguity fails closed.

## Migration Plan

None (additive collector + registry field flip). Rollback is reverting those commits; produced runs remain valid immutable history. No canonical, generated, research, or frontend files change in this change.

## Open Questions

None blocking. Whether any profile fact ever justifies a canonical-record split (e.g., atomic district record) is explicitly deferred — the matrix shows the cost, and no split is proposed here.
