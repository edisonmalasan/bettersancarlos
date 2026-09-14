## Design Read

Data-integration change, not a redesign. All new UI follows the just-locked `visual-design-system` spec (token utilities, `rounded-xl` cards, `duration-200` transitions, canonical rhythm, PageHeader). Dials unchanged: VARIANCE 3 / MOTION 2 / DENSITY 5. New pages are additive routes; IA stays.

## Audit basis (explore-stage findings)

Full mapping in the explore report; key facts driving these decisions:
- Wrong-city data: homepage stats (52,746/44/1st/180.95), `/statistics` incl. ~50 fake barangay names + unsourced CMCI, `/contact` (062) phone, `/government` "Municipal Mayor" labels + display/href mismatch, `/budget` FY2025 + Magat River DPWH card.
- Unconsumed verified packs: `data/city-profile.json`, `data/demographics.json`, `data/emergency-hotlines.json`, `data/fiscal_transparency.json`.
- Conventions: snake_case keys, `_status`/`_source`/`_note` metadata, top-level entity arrays; `data/` mirrored to `public/data/` byte-identical (Serwist excludes `/data/` from precache); 2-space hand-written JSON preferred.

## Decisions

### D1 — Phasing (5 sequential worker dispatches, each its own PR)
Ordered by civic value and contradiction-risk:
- **Phase A — Wrong-city correction** (homepage stats, `/statistics` full rebuild from verified packs, `/contact` phone, `/government` labels/contacts, `/budget` FY2025/DPWH removal + fiscal series wiring). Highest urgency: publishing wrong municipal data is the worst defect.
- **Phase B — Barangay + officials enrichment** (`barangay-officials.json` + populations/urban_rural/second numbers; `officials.json` + party/votes/history; barangay page + government pages consume).
- **Phase C — New directory pages I**: `/about` (profile+geography+seal+history timeline+heritage), `/health`, `/education`.
- **Phase D — New directory pages II**: `/tourism`, `/agriculture`, `/transportation`, `/disaster-preparedness`, `/utilities`.
- **Phase E — Cross-cutting**: `transparency-docs.json` on `/budget`, `government-directory.json` on `/contact`, `/news` historical items, sitemap links, cross-page linking, tracking checklist completion.

### D2 — Data flow conventions
- Static imports from `src/data/` where the page is fully static (matches officials/barangays pattern); runtime fetch from `/data/` where news-editor/legislative parity exists. Prefer static imports for all new pages (simpler, no mirror needed at build time — but keep the mirror for any file fetched at runtime).
- Every new/changed JSON carries `_source` (research file path) and `_status` (`verified` | `partially-verified` | `historical`).
- Verification UI: a small `bg-[rgba(232,153,10,0.08)] text-[#8a5a00]`-family badge (mango family per brand spec) reading "2017 data — re-verify" / "Name verified — DOH data pending" etc. Exact styles per visual-design-system tokens.
- Numbers: populations formatted with thousands separators, years labeled ("2020 census").

### D3 — Page contracts (per new route)
- `/about`: PageHeader (About San Carlos City) → infobox stat cards (from city-profile.json) → geography/boundaries/distances → seal symbolism → vision/mission → history timeline (include 1718 poblacion move; 1578/1587 conflict footnote; replace wrong 2010 event with 2011 mango pie) → heritage landmarks + basilica.
- `/health`: PageHeader → CHO card → hospital cards (name/type only + pending badge) → DOH-gap notice.
- `/education`: PageHeader → HEI cards → secondary list (2-col) → elementary (grouped public/private) → library card → DepEd-gap notice.
- `/tourism`: PageHeader → attractions grid (official/community source badges) → Mango-Bamboo Festival block (2001, last week of April) → mango pie record card → food & stay directory → dates-pending notice.
- `/agriculture`: PageHeader → mango/bamboo identity → 127,000 trees stat (2008) → products/activities → offices → volumes-pending notice.
- `/transportation`: PageHeader → getting-here (travel times, entry routes) → bus carriers → distances → intra-city pending notice → rail history note.
- `/disaster-preparedness`: PageHeader → CDRRMO card → 5 convergence areas + 10 high-rise shelters (2017-data badge) → hazard context → hotline cross-link to `/contact` emergency section.
- `/utilities`: PageHeader → CENPELCO card (verified, branch list) → water unverified card → telecom not-researched notice → outage guidance (Magna Carta 48-h note).
- Existing-page changes: `/statistics` rebuilt sections from `city-profile.json` + `demographics.json` + `competitive-index.json` (CMCI 2016–2019 charts replace unsourced ones; Chart.js config stays); `/budget` shows fiscal_transparency series + transparency-docs + city-projects, removes hardcoded FY2025 quarterly SRE (replaced with verified series + pending notice for FY2017–2025); `/contact` phone fix + emergency-hotlines section from `emergency-hotlines.json` (911/117/143/8888 + city lines with status) + official-channels cards; `/government` "Municipal"→"City" labels, verified phone only; `/news` + 8 historical items with CURRENT/HISTORICAL separation.

### D4 — Compatibility guardrails
- `/admin/news-editor` reads/writes `data/news.json` shape {id,title,date,category,badge,summary,url} — historical items MUST keep this shape; add `recency` as an OPTIONAL new field the editor ignores.
- Barangay slugs: keep the existing slug scheme byte-identical (86 slugs already prerendered); join populations via name matching against `barangay-officials.json` `barangay` field; worker MUST verify all 86 join (script check) before committing — zero unmatched.
- Do-not-publish items (license numbers, water district identity, unverified mobiles, Wikidata unlabeled series) never appear.
- `services.json` (search) untouched; `dpwh-projects.json` file stays (unused legacy) but the dead container div is removed.

### D5 — Tracking checklist
`openspec/changes/research-data-integration/checklist.md` maps all 21 categories → status (IMPLEMENTED / EXTENDED / EXCLUDED(reason)) → files. Committed with Phase E and must show 21/21 resolved.

## Risks / Trade-offs

- [86-slug join mismatches from name variants] → script verification gate, zero-tolerance; fallback: manual mapping table in the JSON.
- [Phase A statistics rebuild changes chart appearance] → Chart.js configs kept; data sources swap only; visual smoke per phase.
- [New pages multiply maintenance] → all follow one pattern; future data updates are JSON edits.
- [Wrong-city content cached by search engines] → static export; Vercel redeploys fresh; acceptable.

## Migration Plan

Phases A–E, each: implement → tsc → build → visual smoke → commit → push → coordinator verify+merge. Phase order fixed; within a phase, page order per D3.

## Resilience Expectations

- If a research file contradicts another (found: none blocking), use the one with explicit verification and note the conflict in `_note`.
- If any join leaves unmatched barangays, STOP that sub-task and report — do not guess.
- If a phase's build breaks and the fix is not mechanical, revert the phase's commits and report; coordinator re-plans.
