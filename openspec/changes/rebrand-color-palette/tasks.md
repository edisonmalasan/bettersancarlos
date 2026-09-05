## 1. Token Foundation (globals.css)

- [x] 1.1 Update `@theme` block in `src/app/globals.css`: primary `#3A7D44`, primary-dark `#2F6136`, add primary-deep `#275230`, accent `#E8990A`, bg-alt `#FAF9F6`, text `#2F3E46`, text-light `#5C6B73`, success `#3A7D44`, danger `#B02E2E`, info `#0077BE`; update shadcn mappings (primary/accent/destructive/ring/border) to match — verify `tsc --noEmit` still passes
- [x] 1.2 Update `:root` block legacy vars + shadcn vars (`--primary`, `--accent`, `--muted`, `--border`, `--ring`, `--chart-1..5` per design D1) and `--sidebar` family — verify no references to removed vars remain in globals.css
- [x] 1.3 Rebase `.dark` block to green-slate family: bg `#141D17`, card/popover/secondary/muted `#1B2A1F`, foreground `#EAF3EA`, primary `#7FB069`, accent `#F2A900`, destructive `#E05B5B`, ring `#7FB069`, dark chart ramp, sidebar family — verify dark values differ from light values only where design D1 specifies
- [x] 1.4 Update global base styles: `a { color }`, `h1/h4 { color }`, `:focus-visible` outline, `a:focus-visible` background tint → bamboo/slate values; keep `body.high-contrast` yellow-on-black scheme untouched — verify focus ring is bamboo green by tabbing through nav in dev server

## 2. Brand Hex Sweep (Phase 1 — the 19 brand files)

- [x] 2.1 Replace all 62 blue gradients per design D3 mapping (135deg/90deg/180deg variants → `#3A7D44 → #275230`; `#0077be`-pair variants → bamboo-to-info; `#0044cc` variant → nearest ramp pair) across all files listed by `rg -l "0032a0|003d82|002170" src` — verify `rg -c "0032a0" src` returns no matches
- [x] 2.2 Replace orange accent hardcodes `#f77f00` (9×) with `#E8990A` (light contexts) or `#F2A900` (dark/on-dark contexts per D1); replace `rgba(247,127,0,...)` focus tint in globals.css with mango `rgba(232,153,10,0.1)` — verify `rg -ci "f77f00|247, ?127" src` returns nothing
- [x] 2.3 Swap indigo tint `#eef2ff` (26×) → bamboo tint `#EAF3EA`; swap legacy success `#06a77d` (18×) → appropriate bamboo ramp step (`#3A7D44` light / `#7FB069` dark contexts); verify `rg -ci "eef2ff|06a77d" src` returns nothing
- [x] 2.4 Update remaining one-off brand hexes: `#0077be`/`#0077BE` gradients, `#0099cc`, `#ff2e51`, `#1d4ed8`/`#1e293b`-adjacent blues used as brand accents → info/primary/neutral equivalents per D1 — verify `rg -ci "0099cc|ff2e51|1d4ed8" src` returns nothing
- [x] 2.5 Update PWA chrome: `manifest.ts` theme/background colors → `#3A7D44`/`#FAF9F6`; `theme-color` meta in `layout.tsx` → `#3A7D44` — verify manifest output via build or inspection

## 3. Neutral Hex Sweep (Phase 2 — site-wide)

- [ ] 3.1 Sweep text/ink `#1a1a1a` (524×) → `#2F3E46` across `src/` — verify `rg -ci "1a1a1a" src` returns 0 (exception: `body.high-contrast` black `#000000` and `#1a1a1a` bg-alt inside high-contrast block stay)
- [ ] 3.2 Sweep surface hexes: `#f8f9fa` (74×) → `#FAF9F6`, `#f0f0f0` (46×) → `#EAECE8`, `#e5e7eb` (153×) → `#E2E8E0`, `#666666` (103×) → `#5C6B73` — verify `rg -ci "f8f9fa|f0f0f0|e5e7eb|666666" src` returns 0 outside globals.css high-contrast/commented contexts
- [ ] 3.3 Spot-check Tailwind neutral utility classes (`gray-*`, `slate-*`) are intentionally left as-is per design D4; record any that sit directly next to swapped hexes and look mismatched, adjust case-by-case — verify no visual seam between `#2F3E46` text and adjacent `gray-800` text in the same section

## 4. Charts & Data Visualizations

- [ ] 4.1 Update Chart.js color literals in statistics/budget/economy components to the D1 chart ramps (light and dark values per mode context) — verify each series color differs from neighbors in lightness AND hue
- [ ] 4.2 Verify statistics page (43 gradients) renders correctly after sweep: bars, animated metric cards, CMCI tabs — verify tabs toggle and bars animate in dev server with no console errors

## 5. Verification & Audit

- [ ] 5.1 Run legacy-hex audit: `rg -i "0032a0|003d82|002170|f77f00|0044cc|06a77d" src` must return zero matches — verify output is empty
- [ ] 5.2 Run `./node_modules/.bin/tsc --noEmit` — verify zero type errors
- [ ] 5.3 Run production build `$env:NODE_ENV="production"; ./node_modules/.bin/next build` — verify build succeeds; revert `tsconfig.tsbuildinfo` if dirtied
- [ ] 5.4 Visual verification in dev server: homepage, services, statistics, budget, government pages in light mode, dark mode, and high-contrast mode — verify hero gradients, buttons, badges, links, and charts all render in the new palette with no blue remnants and WCAG AA pairings per design D1
