# design-polish — Worker Completion Report

Branch: `chore/design-polish` (from `main`, pushed to origin)
Commits (in order):
1. `7a5959c` chore: design tokens, font system, and shell fixes (Phase 1)
2. `4a5ee80` chore: homepage design polish pass (Phase 2)
3. `e981bb4` chore: site-wide token, radius, and timing alignment (Phase 3)
4. `ed4c027` fix: render budget sections gated by a reveal observer that no longer exists
5. `9564e40` chore: check off design-polish tasks (incl. openspec change folder, all boxes checked)

## Verification gates — ALL PASS

1. `tsc --noEmit` — PASS (run after every phase).
2. `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` — PASS, 139 static pages, 2 runs (initial + after budget fix). `git status` clean after builds; no generated files committed; tsbuildinfo not dirtied.
3. rg gates (task 4.9), final counts on `src/`:
   - `text-[#2f3e46]` / `text-[#5c6b73]` / `border-[#e2e8e0]` → **0**
   - `transition-all` → **1** — `src/components/ui/button.tsx` (intentional straggler: shared shadcn/ui primitive, outside task scope; its `transition-all` covers the focus-ring color/shadow set; no task item lists it)
   - `rounded-[10px]` / `rounded-[12px]` / `rounded-[14px]` → **0**
   - `OfficialLGUSolano` → **0**; `sitemap-page` → **0**; `dotlottie` → **0** (`src/dotlottie.d.ts` deleted — it declared a `dotlottie-player` JSX element with zero consumers after the script removal; AnimatedIcon uses `@lordicon/react`, not dotlottie; tsc passes)
4. Visual smoke pass (headless Chrome screenshots at 1440/768/375): homepage, statistics, budget, news, health (`/services/health`), contact, government — banners/hero/primary buttons keep brand gradients, cards uniform (`border-line`, `rounded-xl`, `-translate-y-0.5`, `0_8px_24px` hover shadow), no broken layouts. Budget required the fix below to render at all.

## Gaps / decisions recorded

- **Pre-existing defect fixed (budget)**: all 3 budget sections carried `animate-on-scroll … opacity-0` gating, but no JS anywhere toggles `.visible` on that page (only statistics has an IntersectionObserver hook) — the budget body rendered permanently invisible on `main` too (headless screenshot of the pre-fix build confirmed blank body). Since task 4.2 owns these reveals, the dead gating was removed so content renders; hover/timing behavior untouched.
- **D8 font consolidation**: lower-churn option chosen — `--font-main` kept as an alias (`var(--font-sans)`), so the single consumer chain now resolves through `next/font`'s `--font-inter`.
- **Footer social block**: removed per D9; noted as a gap (re-add as visible content with real hrefs if wanted).
- **OfficialLGUSolano FB embed**: removed entirely per D9 (wrong city); noted as a gap (correct San Carlos embed is a future content task). Replaced section keeps the existing "Visit the Official LGU San Carlos Facebook Page" outbound link + CTA.
- **Kept (intentional)**: brand gradients on PageHeader/hero/primary buttons, homepage leadership badge, budget KPI panels, Office Hours card header, "View all services" card (not in D2's GOES list; house-style primary surfaces); Chart.js canvas fills; semantic status colors (`#dc2626`, `#16a34a`, badge pastel pairs) per spec allowance; small-row hover shadows `0_2px_12px`/`0_4px_16px` as subtle variants for list-row tiles.
- **~offline `text-5xl`** heading kept per D8 (standalone error band).
- One intentional deviation to flag: legislative icon boxes were not in D2's GOES list but were converted to the shared `bg-primary/10 text-primary` treatment for site-wide icon-box consistency (D6/D7 spirit).

## Files touched (60 total)

globals.css (+2 line tokens, font chain), layout.tsx (next/font Inter 300–700 display:swap, Google Fonts link + preconnects removed, dotlottie Script removed, Bootstrap Icons CDN kept), Footer, InfoBar (rateFadeIn replay removed, bg-primary-deep), PageHeader, Header, homepage, statistics, budget, news, health, contact, government, officials, barangays/[slug], legislative ×3, services + 4 subpages + 21 service-details stubs (22 dirs present; all updated where they had violations), faq, sitemap, privacy, terms, accessibility, ~offline (no violations found — untouched), admin/news-editor, SearchAutocomplete, WeatherWidget, PWAManager, dotlottie.d.ts (deleted), openspec change folder (committed with checked-off tasks).
