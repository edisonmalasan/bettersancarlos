## Design Read

Redesign–Preserve of a trust-first public-sector civic portal (San Carlos City, Pangasinan). Dials: `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 2`, `VISUAL_DENSITY: 5`. Uniform card grids are correct for civic scanability (GOV.UK-style task grids) and are NOT restructured. Inter is retained as the typeface (acceptable for public-sector per the taste-skill override). De-slopping means consistency, restraint, and correctness — not artistic reinvention.

## Audit Findings (basis for every decision)

Full audit facts are recorded in the change proposal. Headline numbers: raw token-duplicate hexes `#2f3e46` ×528, `#5c6b73` ×301, `#e2e8e0` ×153, `#faf9f6` ×74; `transition-all` ×306; radii in use `lg/xl/2xl/10px/12px/14px/20px/50px`; hover lifts `-0.5/-1/-[2px]/-[3px]/-2/px`; durations 150/200/300/600/800/1000/1200ms; three stat-card systems; two news-card systems; two page-hero systems; icon mixing in one grid row; orphan dotlottie script; broken footer route; wrong-city FB embed; fake loading card.

## Decisions

### D1 — Token exclusivity, mechanical migration
Add to `@theme`:
```css
--color-line: #e2e8e0;      /* card borders */
--color-line-soft: #eaece8; /* dividers/skeletons */
```
Migration map (class-attribute replacements only; never touch `linear-gradient()` literals or `style={{}}` values unless listed):
| From (raw class fragment) | To |
|---|---|
| `text-[#2f3e46]` | `text-foreground` |
| `text-[#5c6b73]` | `text-muted-foreground` |
| `border-[#e2e8e0]` | `border-line` |
| `bg-[#faf9f6]` / `bg-[#f8fafc]` (news alt bg) | `bg-muted` |
| flat `bg-[#3a7d44]` / `bg-[#275230]` / `bg-[#2f6136]` | `bg-primary` / `bg-primary-deep` / `bg-primary-dark` |
| flat `text-[#3a7d44]` | `text-primary` |
| `border-[#eaece8]` | `border-line-soft` |

Rules: check each occurrence's context — text sitting on a colored surface (mango badge, green banner) keeps explicit dark-slate or uses the matching `*-foreground` token; dark-affecting swaps (`text-foreground`) are correct because `.dark` mode is token-aware. `text-[#2f3e46]` on dark-green surfaces (InfoBar, Footer) becomes `text-[#eaf3ea]`-family only if already visually light — otherwise leave (worker verifies visually). Gradients keep raw hex inside `linear-gradient()` (brand spec permits).

### D2 — Gradient discipline (what stays, what goes)
STAYS (brand-spec-mandated): PageHeader banner gradient, hero gradient/scrims, primary-button gradients (house style for primary actions), the mandated "Page header gradient" requirement.
GOES (gratuitous): all decorative gradient fills on icon boxes (homepage stat cards ×4, contact ×3, budget ×4 variants, statistics metric/CMCI icon boxes, sitemap icon squares, government SectionBadge inline gradients, history sidebar cards, officials badges) → single treatment `bg-primary/10 text-primary` (or `bg-[rgba(58,125,68,0.08)]` equivalent); statistics blue-green mixed bars (`#3a7d44→#0077BE`) → solid `bg-info` or `bg-primary` per metric; contact page green→Facebook-blue gradient → brand treatment; Footer `#2f3e46→#111111` gradient → solid `bg-[#2f3e46]` (= `--color-text`); timeline rail gradient → solid `bg-primary/30` or token equivalent.
Gradients in charts (Chart.js canvas fill) stay (data visualization).

### D3 — Radius scale (Shape Consistency Lock)
Locked scale: `rounded-full` = interactive pills/badges; `rounded-xl` = cards, panels, banners, modals; `rounded-lg` = inputs, small icon boxes, chips, buttons (matches existing shadcn button). Mapping: `rounded-[10px]`→`rounded-lg`, `rounded-[12px]`/`rounded-[14px]`→`rounded-xl`, `rounded-[20px]`→`rounded-2xl` where it's a large panel (budget chart panels) else `rounded-xl`, government inline `borderRadius: 50px`→`rounded-full`. The `rounded-[12px]` full-height gradient strips on contact become `rounded-xl`. Exception: the Hero3DLogo container keeps its own aspect/size system (hero-logo spec domain).

### D4 — Motion timing lock
- Replace `transition-all` with explicit property lists; standard mapping for card/link hovers: `transition-[background-color,border-color,box-shadow,transform] duration-200` (or Tailwind shorthand `transition` + `duration-200` where the default property set already covers it — prefer shorthand `transition` for brevity, it never includes `gap`).
- Gap-nudge links: `transition-[gap] duration-200` (already used in budget/legislative; extend to `sectionLinkCls` homepage).
- Hover lift: all interactive cards `hover:-translate-y-0.5` (from -1, -[2px], -[3px], -2, -px variants). Non-interactive elements (OSM map card) lose the hover lift entirely.
- Press feedback: primary buttons get `active:scale-[0.97]` (hero submit, privacy/terms CTA, shadcn button already has none — add to hand-rolled primary buttons).
- `duration-[600ms]`/`[800ms]`/`[1200ms]` reveal transitions in statistics/budget → `duration-500` (reveal is state-transition, not hover; still ≤500ms per Emil's ceiling for modals+).
- Chart.js `animation: 2000` → `800`.
- InfoBar `rateFadeIn` re-trigger on each fetch → remove the animation class, keep values updating.
- Timeline `fadeInUp` stagger (100–700ms delays) STAYS (storytelling reveal, reduced-motion-gated globally); reduce max delay 700→400ms for snappiness.
- Timeline dot `group-hover:scale-125` and legislative icon `group-hover:scale-110` stay (subtle, motivated feedback).
- `swBannerIn`/`swBannerSlideUp`/`skeleton-shimmer`/`searchSpin` keyframes stay (functional states).

### D5 — Section rhythm alignment
Canonical: `py-16 max-[1024px]:py-8 max-[767px]:py-6` (existing `sectionCls` in page.tsx). Apply to: homepage Quick Stats (`py-12` no-responsive), statistics ×6 (`py-20 ... max-[575px]:py-12`), legislative (`py-20`/`py-[60px]`), budget (`pt-12 pb-16` and `max-[575px]` variants), privacy/terms (`pt-[60px] pb-[80px]`), health inverted `py-6 max-[1024px]:py-8 max-[767px]:py-6` → correct order, contact Office Hours `py-8` band. Hero (`py-24 max-[767px]:py-20`) and PageHeader (`py-12` banner + `py-4` breadcrumb) are documented band exceptions (hero-media/infobar specs).

### D6 — Card system unification
- White card base: `rounded-xl border border-line bg-white` + hover shadow `hover:shadow-[0_8px_24px_rgba(58,125,68,0.12)]` for interactive cards; `shadow-[0_1px_3px_rgba(0,0,0,0.06)]` resting shadow optional for elevated panels (budget/statistics). Border variants `border-black/[0.06]`, `border-[rgba(0,0,0,0.04)]`, `border-[rgba(0,0,0,0.06)]`, `border-[#faf9f6]` (officials typo-border) → `border-line`.
- News cards: homepage pattern and news-page pattern converge on the news-page card shape (`rounded-xl border-line bg-white p-6`, lift `-translate-y-0.5`).
- Service cards: homepage `serviceCardCls` is canonical; services/health directory cards adopt `rounded-xl` (from `rounded-[10px]`) and identical shadow alpha.
- Stat cards: three implementations remain functionally distinct (homepage row, statistics metrics, budget KPIs) but adopt the same border/radius/shadow system; their internal layout differences (centered vs left) are content-driven and stay.

### D7 — Icon consistency
- Homepage services row: `<AnimatedIcon name="dollar" ...>` → `<i className="bi bi-cash-coin" />` styled like its 5 siblings (12×12 icon box, primary color). AnimatedIcon component file and lordicon dependency stay (used by WeatherWidget's dynamic condition icon).
- WeatherWidget's AnimatedIcon stays (animated state = meaningful weather display).
- Remove layout.tsx dotlottie `<Script>` (zero consumers; also removes a console SyntaxError noted in archived hero work).

### D8 — Typography
- layout.tsx: replace Google Fonts `<link>` + preconnects with `next/font/google` Inter (weights 300–700, `display: swap`, variable `--font-inter`), wire to `--font-sans`. Keep Bootstrap Icons CDN link and its preconnect as-is.
- globals.css: `--font-main` collapses to reference Inter stack (`--font-main` kept as alias pointing at the same family to avoid touching legacy var consumers — or migrate body to `var(--font-sans)` and delete the duplicate; worker picks the lower-churn option and documents it).
- Eyebrow/label tracking: standardize to `tracking-[0.5px]` (statistics `0.3px`, accessibility `1px` outliers).
- Heading scale: homepage `text-xl` section h2s (Quick Stats, Weather, History) → `text-2xl` to match sibling sections; ordinance/resolution-framework `text-4xl` h1 → `text-[2rem]` to match PageHeader h1. ~offline `text-5xl` stays (standalone error band).

### D9 — Correctness fixes bundled (audit-found bugs)
- Footer `/sitemap-page` → `/sitemap`.
- Footer `hidden` social-links block: remove the dead markup (decision: dead weight; if social links are wanted later they should be visible content with real hrefs — noted as gap).
- News page: wrong-city Facebook page-plugin iframe (`OfficialLGUSolano`) — REMOVE entirely (San Carlos Pangasinan ≠ Solano; no verified replacement page is documented in research/official-presence; re-adding the correct embed is a future content task, noted as gap).
- News loading state: replace the fake article card ("Loading news...") with a muted skeleton block (`animate-pulse`, `aria-busy="true"`, no fake title/badge).
- health page: replace hand-rolled hero block with the shared `PageHeader` component (same title/subtitle/breadcrumb content); remove the polka-dot `bg-[radial-gradient(...)]` decorative background.

### D10 — Verification approach
1. `rg` gates: zero remaining `text-[#2f3e46]`/`text-[#5c6b73]`/`border-[#e2e8e0]` in src (outside gradient literals/var definitions); zero `transition-all` in modified files (note: the sweep targets all src files; report any intentional remaining occurrence with justification); zero `rounded-[10px]`/`[12px]`/`[14px]` on cards.
2. `tsc --noEmit` + production `next build --webpack`.
3. Visual smoke pass (headless CDP screenshots at 1440/768/375): homepage, statistics, budget, news, health, contact, government — confirm no broken layout, gradients still on banners/buttons, cards consistent.
4. Dark-mode and high-contrast spot check unchanged (globals untouched except additive tokens + font var consolidation).

## Risks / Trade-offs

- [Large mechanical sweep breaks subtle styling] → mapping table is exact; visual smoke pass at 3 viewports gates the change; commits grouped by phase so a bad phase can be reverted independently.
- [`text-foreground` swaps alter dark-mode rendering where dark mode was previously broken-looking] → this is the intended fix (brand spec dark-mode requirement); spot-check confirms.
- [Removing FB embed removes a real feature] → it shows the wrong city; wrong content is worse than no content. Gap recorded.
- [worker misses a token context case (text on mango)] → design.md rule D1 requires per-occurrence context check; visual pass on contact/faq (mango badges) covers it.

## Migration Plan

1. Phase 1 commit: globals.css tokens + font vars; layout.tsx next/font + dotlottie removal; shell (Header/Footer/InfoBar/PageHeader) fixes.
2. Phase 2 commit: homepage page.tsx full pass (cards, hovers, icons, rhythm, headings).
3. Phase 3 commit: site-wide mechanical passes (hex→token, radii, durations) + targeted page fixes (statistics, budget, news, health, contact, government, legislative, faq, sitemap, services, officials, privacy, terms, accessibility, ~offline).
4. Verification gate (tsc, build, visual, rg-gates) → PR → merge (merge commit).

## Resilience Expectations

- If a replacement produces a visual regression the worker cannot resolve confidently, revert that single file to `git checkout <file>` and record it as a gap in the completion report rather than forcing it.
- If `next/font` conflicts with the static export, fall back to keeping the CDN link and only consolidating the font variables (record in report).
