## Context

See `proposal.md` (Why) for motivation. Current state (verified on `main`, 2026-09-16):

- Registry `cenpelco` (CENPELCO, `https://cenpelco.com/`, website, `collector: null`, quarterly, medium, utilities domain) cites `research/utilities/26-09-cenpelco-contacts.md`, whose 15-row directory (branch gallery, incl. `branch-san-carlos-main`) is verified/current while phones, emails, GM, hours, and addresses are explicitly unverified gaps.
- Zero canonical records carry the `utilities` domain; `generate.ts` has no utilities emitter and `data/utilities.json` (manual, `_status: partially-verified`, five sections) is the hand-maintained surfacing file.
- The `Collector` contract, `COLLECTORS` dispatch, shared HTTP acquisition (single blob per source), `buildSourceInstance` provenance, provisional candidates, fact coverage, and `parse:` → `SOURCE_CHANGED` semantics are established (see archived `2026-09-16-add-psa-demographics-collector`, reused as the architectural pattern).
- Proposal-stage probe: homepage shell fetches over plain HTTP 200 (~9.4KB) with the `CENPELCO Gallery of Branches` block — 15 `branches/<slug>/<slug>.jsp` links (`target="frame1"`), texts Mangaldan…`San Carlos City (Main)` — all in server-returned HTML (the `<iframe src="../home/home.jsp">` main content is never needed). Exactly one `San Carlos` mention in the shell. Related pages (`area/ListOfArea.jsp`, `contactUs/contactUs.jsp`, `board/GeneralManager.jsp`) also fetch 200 but are NOT v1 evidence.

## Goals / Non-Goals

**Goals:**

- A narrow deterministic CENPELCO collector reusing every existing pipeline contract, watching provider presence + office list only.
- Explicit evaluate-and-defer record for newly observed contact/GM content.
- Offline fixture tests proving evidence → instance → candidate → diff → (test-only) promotion without touching production canonical data.

**Non-Goals:**

- No contact/GM/hours/address modeling; no rates, outages, billing, or Facebook work; no water/telecom/cable/sewage records; no `utilities.json` generation; no second fetch or crawler.

## Decisions

### 1. Single evidence blob: the homepage shell

Fetch `https://cenpelco.com/` only (the registry URL; existing acquisition unchanged). The gallery, title identity, and nav context all arrive in one GET. Alternatives rejected: `area/ListOfArea.jsp` uses a different grouping (Areas I–XI, San Carlos split North/South) that contradicts the research-backed 15-office gallery — adopting it would need a second fetch (acquisition-contract change) and a representation decision the research does not support; contact/GM pages are out of scope by the deferral decision.

### 2. Parser anchors: gallery heading + `branches/` href pattern

Locate the `CENPELCO Gallery of Branches` block, then extract `<a href="../branches/<slug>/<slug>.jsp">Name</a>` links in order. Slug (lowercase href segment) is the stable office id; link text is the verbatim office name. Anything outside the gallery block (nav, news, footer, announcements) is never an office record. Missing heading, zero links, or a link outside the `branches/<slug>/<slug>.jsp` shape throws `parse:`.

### 3. Parser location: inside `scripts/data/collectors/cenpelco.ts`

Follows the `psa-philatlas.ts` precedent (source-specific parsing co-located with the collector, exported pure functions for unit tests). A separate `parsers/cenpelco.ts` adds no value for one source; no shared-parser refactor.

### 4. Candidate mapping (final v1 matrix)

| Concept | Existing canonical ID? | Public evidence? | Candidate? | Coverage? |
|---|---|---|---:|---:|
| Provider identity/presence | none (zero utilities records) | title `CENPELCO Central Pangasinan Electric Cooperative` + San Carlos office | yes (`utility-electricity-provider`, NEW) | yes |
| Area-office list (15) | none | gallery block | yes (`cenpelco-area-offices`, NEW) | yes |
| San Carlos City (Main) presence | none | exact gallery entry | yes (field inside both candidates) | via above |
| Main trunk 532-2222, extensions, sub-area numbers | none | `contactUs.jsp` (first seen 2026-09-16) | no (deferred follow-up) | no |
| GM Engr. Rodrigo F. Corpuz | none | `GeneralManager.jsp` (first seen 2026-09-16) | no (deferred follow-up) | no |
| Email / hours / addresses | none | not published | no | no |
| Water / telecom / cable / sewage | none | not this source | no | no |

`utility-electricity-provider` data: `{provider_short: 'CENPELCO', provider_full: 'Central Pangasinan Electric Cooperative', serves_san_carlos_city: true, san_carlos_office: 'San Carlos City (Main)'}` — every string source-observed (title tokens + verbatim office entry; no `Inc.` suffix invented). `cenpelco-area-offices` data: `{offices: [{id: slug, name: verbatim}]}` sorted by `id`. Claim sources mirror the facebook-collector pattern (each data leaf → registry ID). Diagnostics and unmapped observations (rates links, ListOfArea discrepancy, page typos `Binnaley`/`Aquilar` on the contact page) go in `notes`, never in `data`.

### 5. Canonicalization: collector-only (Option A); surfacing stays manual (Option A)

With zero canonical utilities records, the collector emits well-shaped `NEW` candidates; canonical records come into existence only through later normal review/promotion (which the pipeline already supports for dynamic IDs). This change writes no `records.json`, adds no `generate.ts` emitter, and leaves `data/utilities.json` manual — avoiding exactly the fragile generated-plus-hand-edited hybrid the requirements forbid. A future change may migrate the electricity slice once canonical records exist.

### 6. Ordering normalized; duplicates fail closed

Gallery order is presentation order: sort offices by slug before emitting, so reorder-only fetches diff `UNCHANGED` while add/remove/rename diffs `CHANGED`. Duplicate slugs (including responsive-markup duplication) throw `parse:` — chosen over silent dedupe for consistency with the PSA precedent and simpler review semantics.

### 7. San Carlos identity guard

Require the exact string `San Carlos City (Main)` inside the gallery block plus cooperative identity (`CENPELCO` + `Pangasinan` markers from title/nav). Bare `San Carlos`, a missing `(Main)` qualifier, or insufficient context throws `parse:` with no San Carlos output.

### 8. Source instance and diff behavior

One `buildSourceInstance` per blob (`documentType: 'webpage'`, registry publisher/URL carried through). First production runs diff `NEW` + `NEW` (no canonical counterparts → `MISSING` impossible); later runs diff `UNCHANGED`/`CHANGED` by `stableStringify` equality. `STALE`/`CONFLICT`/`SOURCE_UNAVAILABLE` follow existing semantics untouched.

### 9. Quarterly interaction

No cadence change: `--due` selects the source when its quarterly window lapses (intended, research-only); failures retry per shared policy without satisfying cadence; scheduled runs stop before promotion per existing invariants. The collector's fail-closed standard is what makes unattended collection safe — layout drift becomes a `SOURCE_CHANGED` research PR, never silent data.

### 10. Fixture

Committed `scripts/data/fixtures/cenpelco-<purpose>-<capture-date>.html`: real shell structure (title, gallery heading, all 15 links with slugs/texts/targets, minimal nav context, the single San Carlos marker), sanitized of scripts/styles/iframes/ads/trackers, with source + capture date documented. Variant fixtures by minimal edits (reordered gallery, added office, missing heading, duplicate slug, ambiguous San Carlos).

## Risks / Trade-offs

- [Risk] CENPELCO redesigns the JSP shell → `parse:` + `SOURCE_CHANGED` research PR until the parser is updated. Mitigation: narrow anchors, fixture pins last-known-good structure.
- [Risk] Gallery vs `ListOfArea.jsp` representations diverge further (today: 15 offices vs Areas I–XI with North/South split). Mitigation: v1 watches the research-backed gallery only; adopting the area grouping is a new design decision, never an automatic fallback.
- [Risk] Contact/GM pages change while v1 ignores them. Mitigation: by design — the parser reads title + gallery only, so contact-page volatility cannot corrupt office candidates; the deferral is documented with first-seen dates.
- [Risk] Quarterly unattended runs produce `SOURCE_CHANGED` noise after a redesign. Mitigation: intended behavior (research PR for a human), strictly better than silent corruption.
- [Risk] New stable IDs (`utility-electricity-provider`, `cenpelco-area-offices`) commit to a naming scheme before canonical records exist. Mitigation: IDs follow repo fact-first kebab-case conventions; they surface as `NEW` for review, which is the checkpoint that ratifies or corrects them.

## Migration Plan

None (additive collector + registry field flip). Rollback is reverting those commits; produced runs remain valid immutable history. No canonical, generated, or frontend files change in this change.

## Open Questions

None blocking. The contact/GM follow-up (research update + expanded coverage) is a separately scoped future change, deliberately left open rather than decided here.
