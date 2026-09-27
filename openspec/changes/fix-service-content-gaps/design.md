# Design

## Context

The four `/services/*` category pages and 22 `/service-details/*` pages were bulk-generated during the legacy-site migration (`scripts/generate-service-pages.mjs`). The generator only ever created detail pages for office-level services plus the civil-registrar certificates, but category cards were emitted linking to `/service-details/<categoryId>` regardless. `services.json` (the 57-service hand directory) already publishes each service's office, fee, and processing time, and `SearchAutocomplete`'s `resolveRoute` already sends services without detail pages to their category page. Data flow constraints: pages statically import from `src/data/`; the pipeline mirrors generated files to `data/` + `public/data/` (+ `src/data/` only for statically imported files); `transparency-docs.json` is a manual (non-generated) file per the producer map in `docs/data-pipeline.md`.

## Goals / Non-Goals

**Goals:**
- Zero broken internal links in `src/` and in JSON rendered as links.
- Homepage news driven by the same file the `/news` page and news curation workflow maintain.
- The two already-verified-but-unused datasets visible on `/budget` with honest status labeling.

**Non-Goals:**
- Creating the four missing category-level detail pages (would duplicate the category pages as new stubs).
- Fleshing out the remaining one-paragraph service-detail pages (needs official per-service verification; separate future work).
- Collector roadmap implementation, resolutions data acquisition, README/version housekeeping.
- Touching `scripts/data/generate.ts` (no canonical record or emitter changes needed).

## Decisions

1. **Repoint links; do not create missing detail pages.** The cards already carry description/fee/time; a generated category-level detail page would restate them. Each repointed target is the page that actually holds the next bit of information: MSWDO services for social-welfare/education-assistance cards, `/government` for barangay-issued documents, `/contact` for PNP/emergency contacts, `/disaster-preparedness` for MDRRMO services. Alternative considered — creating 4 detail pages — rejected as stub duplication.
2. **Add an "Office" line to repointed cards**, sourced verbatim from `services.json` (already published to search). This satisfies the new `internal-link-integrity` requirement that the destination be self-explanatory. Alternative — leaving cards unchanged — rejected: "Barangay Clearance → /government" would be confusing without it.
3. **Homepage news: client-side fetch, mirroring `/news`.** The homepage is already `'use client'`; `public/data/news.json` is the runtime fetch source. Latest 3 = items with `recency !== 'historical'` sorted by ISO `date` descending. Dates are rendered via a fixed month-name map over the ISO string (deterministic, avoids SSR/client locale hydration mismatches). Cards link to `item.url` when present (external, like `/news`), otherwise `/news`. While loading, render skeleton cards; on empty/failure render nothing in the grid (header + "View all" remain). The now-unused `news-*` i18n keys stay in the locale files (cleanup is out of scope).
4. **DPWH block on `/budget` City Projects section.** `/budget` is already the projects home (the infrastructure page cross-links to it). Render the file's `summary` + per-project rows (title, location, ₱ amount, funding, status note) with the `_status: unverified` caveat as a visible badge, matching the page's existing caveat-chip pattern. Requires a `src/data/dpwh-projects.json` byte-identical mirror for the static import — same precedent as `health-facilities.json` when it became statically imported; the generator's post-write self-check continues to pass because it only validates files it writes.
5. **Province budget reviews hand-curated into `transparency-docs.json`.** That file is manual per the producer map, so no emitter/pipeline change is needed; entries carry the canonical record IDs (`transparency-doc-province-appropriation-2023/2024/2025`) in a provenance note and link the verified pangasinan.gov.ph PDFs. Rendered directly below the "FY2017–2025 pending verification" card with the "budget authorization review, not BLGF SRE actuals" distinction kept verbatim from the records. Alternative — new canonical emitter + generated JSON — rejected: three documents don't justify pipeline surface; the canonical records remain the source of truth and are referenced.

## Risks / Trade-offs

- [Repointed links are a judgment call, not the "real" detail pages] → Documented in proposal as accepted state; adding real detail pages later is additive and can repoint again.
- [DPWH data is `_status: unverified` reported observations] → Rendered with the file's own caveat text and badge, consistent with `civic-data-surfacing` unverified-labeling rules.
- [transparency-docs.json edited by hand] → It is the designated manual producer; canonical record IDs cited in `_source` keep traceability; `data:generate` untouched so no drift risk.
- [Homepage news titles are English-only while the rest of the homepage is bilingual] → Same behavior as the `/news` page today; acceptable consistency.

## Migration Plan

Single PR; no data migration. Rollback = revert the merge commit. After merge, regenerate check (`bun run data:generate` then `git diff --exit-code data src/data public/data`) proves no pipeline drift.

## Open Questions

None.
