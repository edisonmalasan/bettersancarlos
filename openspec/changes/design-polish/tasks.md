## 1. Setup

- [x] 1.1 Create branch `chore/design-polish` from `main` and push it (`git push -u origin chore/design-polish`) — verify `git status` is clean before branching
- [x] 1.2 Read the change artifacts (`proposal.md`, `specs/visual-design-system/spec.md`, `design.md`) and confirm the audit numbers still hold on current `main` with quick `rg` spot checks (e.g. `transition-all` count, `text-[#2f3e46]` count) — record any drift in the completion report

## 2. Foundation (Phase 1 commit: `chore: design tokens, font system, and shell fixes`)

- [x] 2.1 `src/app/globals.css`: add `--color-line: #e2e8e0;` and `--color-line-soft: #eaece8;` to the `@theme` block; consolidate the duplicated font variable per design.md D8 (lower-churn option); verify no existing class relying on removed vars breaks
- [x] 2.2 `src/app/layout.tsx`: migrate Inter to `next/font/google` (weights 300;400;500;600;700, `display: swap`), wire the variable into the font token chain, remove the Google Fonts `<link>` and its preconnects; keep Bootstrap Icons CDN link + preconnect; remove the dotlottie `<Script>` — verify the page still renders with Inter in dev and the console has no font/dotlottie errors
- [x] 2.3 `src/components/layout/Footer.tsx`: fix `/sitemap-page` → `/sitemap`; remove the `hidden` social-links block; replace the `#2f3e46→#111111` gradient with solid `bg-[#2f3e46]` — verify footer renders unchanged otherwise
- [x] 2.4 `src/components/layout/InfoBar.tsx`: remove the `rateFadeIn` animation replay on data refresh (values update without animation) — verify by observing two consecutive refreshes
- [x] 2.5 `src/components/layout/PageHeader.tsx` + `src/components/layout/Header.tsx`: apply token migration, `duration-200` explicit-property transitions, and radius lock where applicable — verify nav renders on one line at desktop and mobile menu still opens/closes
- [x] 2.6 Run `./node_modules/.bin/tsc --noEmit` — must pass; then commit Phase 1 files only and push

## 3. Homepage (Phase 2 commit: `chore: homepage design polish pass`)

- [x] 3.1 `src/app/page.tsx` full pass per design.md: hex→token migration (D1 map), replace all decorative gradient icon-box fills with `bg-primary/10 text-primary` treatment (D2), radius lock (D3), transition timing + lift lock (D4: `hover:-translate-y-0.5`, explicit properties, `duration-200`, gap nudges, `active:scale-[0.97]` on hero submit button, no lift on the non-interactive map card), section rhythm (D5: Quick Stats to canonical), headings `text-xl`→`text-2xl` (D8), `<AnimatedIcon name="dollar">` → Bootstrap `bi-cash-coin` glyph matching siblings (D7), timeline max stagger delay 700→400ms (D4) — verify homepage renders correctly at 1440/768/375 in dev
- [x] 3.2 Run `./node_modules/.bin/tsc --noEmit` — must pass; then commit Phase 2 files only and push

## 4. Site-wide mechanical pass (Phase 3 commit: `chore: site-wide token, radius, and timing alignment`)

- [x] 4.1 Statistics page: hex→token, radius lock, duration outliers 600/800/1200ms→500ms (reveals) per D4, blue-green mixed gradient bars → solid token bars (D2), decorative icon-box gradients → shared treatment (D2), section rhythm to canonical ×6 (D5), eyebrow tracking 0.3px→0.5px (D8) — verify charts still render and animate ≤800ms
- [x] 4.2 Budget page: unify 4 gradient icon-box variants → shared treatment (D2), radius lock (`rounded-[20px]` panels→`rounded-2xl`, others→scale), transitions `duration-*` + explicit properties, `opacity-0!`/`translate-y-[30px]!` important-modifier reveals → `duration-500` equivalents without `!` where possible (D4), section rhythm (D5), eyebrow consistency — verify Q1/Q2 tabs and charts still function
- [x] 4.3 News page: card pattern converged to `rounded-xl border-line bg-white p-6` + uniform lift (D6); replace fake "Loading news..." article card with an `animate-pulse` skeleton (`aria-busy="true"`) (D9); REMOVE the `OfficialLGUSolano` Facebook page-plugin iframe entirely (D9, wrong city) — verify grid renders and loading state shows skeleton
- [x] 4.4 Health page: replace hand-rolled hero with shared `PageHeader` (same title/subtitle content) (D9); remove polka-dot radial background (D9); directory cards adopt homepage service-card radius/shadow (D6); fix inverted `py-6 max-[1024px]:py-8` padding (D5); token/timing migration — verify page header matches other interior pages
- [x] 4.5 Contact page: green→Facebook-blue gradient → brand treatment (D2); gradient channel-card strips → shared icon-box treatment or solid `bg-primary` (D2); radius lock on strips (D3); rhythm fix for Office Hours band (D5); token/timing migration — verify mango badge text still dark-slate (contrast)
- [x] 4.6 Government pages (government, government/officials): inline-style gradients via `SectionBadge` props → shared treatment (D2); `borderRadius: 50px` inline → class-based pill (D3); `border-[#faf9f6]` typo-border → `border-line` (D6); token/timing migration — verify official cards and councilor chips render correctly
- [x] 4.7 Legislative pages (legislative, ordinance-framework, resolution-framework): token/timing migration, radius lock, lift unification (`hover:-translate-y-2`→`-0.5`), eyebrow tracking, `text-4xl` h1s → `text-[2rem]` (D8), section rhythm (D5) — verify tabs/accordion states intact
- [x] 4.8 Remaining pages (services + subpages incl. 26 service-details stubs, faq, sitemap, privacy, terms, accessibility, ~offline, barangays/[slug]): token/timing/radius/rhythm migration per D1/D3/D4/D5; sitemap icon squares → shared treatment (D2); eyebrow tracking outliers (accessibility 1px→0.5px) — verify no layout breaks on the stubs' shared template
- [x] 4.9 `rg` gates: `rg -n "text-\[#2f3e46\]|text-\[#5c6b73\]|border-\[#e2e8e0\]" src/` → only gradient-literal or documented-exception matches remain; `rg -n "transition-all" src/` → zero in modified files (report any intentional stragglers with justification); `rg -n "rounded-\[10px\]|rounded-\[12px\]|rounded-\[14px\]" src/` → zero on cards (hero-logo canvas exceptions excepted); `rg -n "OfficialLGUSolano|sitemap-page|dotlottie" src/` → zero
- [x] 4.10 Run `./node_modules/.bin/tsc --noEmit` — must pass; then commit Phase 3 files only and push

## 5. Verification & delivery (coordinator gates)

- [x] 5.1 Run `$env:NODE_ENV="production"; ./node_modules/.bin/next build --webpack` — must succeed (139+ static pages); revert `tsconfig.tsbuildinfo`/`next-env.d.ts` if dirtied; never touch `.next/`, `out/`, `dist/`, `public/sw.js*`, `version.json`, `package.json` version field
- [x] 5.2 Visual smoke pass via headless-CDP screenshots at 1440/768/375: homepage, statistics, budget, news, health, contact, government — confirm banners/buttons still carry the brand gradients, cards are uniform, no broken layouts; stop dev server after
- [x] 5.3 Check off all completed task boxes in this file, commit (`chore: check off design-polish tasks`), push the branch
- [x] 5.4 Send `worker_done` via `orca orchestration send --type worker_done --task-id <task_id> --dispatch-id <dispatch_id> --outcome succeeded --files-modified "<list>"` with a summary of: rg-gate results, any intentional stragglers/gaps (e.g. files reverted), and confirmation of all 5 gates. Do NOT create a PR or archive the change — coordinator owns those
