# Tasks

## 1. Fix broken internal links

- [x] 1.1 Repoint `/services/social-services` cards (5) to `/service-details/mswdo-services` and add Office lines from `services.json` (MSWDO / OSCA, MSWDO). Verify: grep finds no `/service-details/social-services` in `src/`.
- [x] 1.2 Repoint `/services/certificates` cards: Barangay Clearance + Barangay ID → `/government`, Police Clearance → `/contact`; add Office lines (Barangay Hall, PNP San Carlos). Verify: grep finds no `/service-details/certificates` in `src/`.
- [x] 1.3 Repoint `/services/education` card to `/service-details/mswdo-services` with Office line (MSWDO). Verify: grep finds no `/service-details/education` in `src/`.
- [x] 1.4 Repoint `/services/public-safety` cards: Emergency Response → `/contact`, Disaster Preparedness → `/disaster-preparedness`; add Office lines (MDRRMO). Verify: grep finds no `/service-details/public-safety` in `src/`.
- [x] 1.5 Fix `/service-details/general-services` breadcrumb + back-link to `/government`. Verify: grep finds no `/services/government` in `src/`.
- [x] 1.6 Fix `/services/services` back-links to `/services` in `human-resource-management`, `mswdo`, `municipal-civil-registrar`, `municipal-general-services`. Verify: grep finds no `/services/services` in `src/`.

## 2. Fill filler stub pages

- [x] 2.1 `human-resource-management`: set PageHeader description + body paragraph to the published services-directory description ("Employment, personnel records, and HR services") and Office line to "Human Resource Management Office". Verify: page renders no "Service details for" filler and no empty description.
- [x] 2.2 `municipal-civil-registrar`: same treatment ("Birth, marriage, death certificates and civil registry services", office "Local Civil Registrar"). Verify: page renders no filler text.

## 3. Homepage Latest Updates from news.json

- [x] 3.1 Fetch `public/data/news.json` on the homepage, render latest 3 current items with category badge, deterministic-formatted date, summary, and external link when present; skeleton while loading; render nothing on empty/failure. Verify: `next build` passes; dev-render shows current items.

## 4. Surface DPWH projects on /budget

- [x] 4.1 Add byte-identical `src/data/dpwh-projects.json` mirror of the generated `data/dpwh-projects.json`. Verify: `git diff --no-index` shows identical bytes.
- [x] 4.2 Add "DPWH national infrastructure projects (reported)" block to the City Projects section on `/budget`: summary line, 4 project rows (title, location, amount, funding, status note), `_status: unverified` caveat badge. Verify: rendered in `out/budget/index.html`.

## 5. Surface province budget reviews on /budget

- [x] 5.1 Add `province_budget_reviews` (Resolutions 287-2023, 375-2024, 304-2025 with official PDF URLs, review dates, issuing authority, and the "not BLGF SRE actuals" note) to `data/transparency-docs.json` + `public/data/` mirror, with `_source`/`_updated` refreshed and canonical record IDs cited. Verify: JSON parses; keys match page usage.
- [x] 5.2 Render "Recent annual budget documents (Province of Pangasinan)" below the FY2017–2025 withheld card on `/budget`. Verify: rendered in `out/budget/index.html`.

## 6. Verification

- [x] 6.1 Run `./node_modules/.bin/tsc --noEmit` and production `next build`; both pass.
- [x] 6.2 Run `bun run data:generate` then `git diff --exit-code data src/data public/data` — regeneration leaves committed outputs unchanged (except the intentional transparency-docs edit, which predates the run).
- [x] 6.3 Re-run the internal link audit (extract hrefs from `src/` + data JSON, check against routes): zero broken targets.
- [x] 6.4 Review final diff; open PR into `main`; merge with a merge commit after checks pass.
