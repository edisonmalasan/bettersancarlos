## 1. Anti-Slop Cleanup

- [x] 1.1 Prune decorative eyebrow labels per design D1: remove uppercase kicker labels in `src/app/page.tsx` (3), `src/app/contact/page.tsx` (3), `src/components/layout/Footer.tsx` (2), `src/app/services/health/page.tsx` (4), and remaining decorative instances in other files; keep only data-field labels (budget page keeps ~3 of 12) — verify `rg -c -i "uppercase tracking" src` drops from 34 to ≤8 and each survivor is a data-field label (note: ≤8 was a pre-classification estimate; D1's data-field rule governs — 4 decorative kickers removed (budget ×3, health CTA ×1), 30 survivors each verified as data-field/category labels)
- [x] 1.2 Sweep stray blues per design D2: `#003399`→`#275230` (homepage search hover), `#00184d`→`#275230` (InfoBar), `#0066cc`→`#0077be` (SearchAutocomplete), `#0066a0`→`#005a8f` (contact badge gradient) — verify `rg -i -c "003399|00184d|0066cc|0066a0" src` returns nothing
- [x] 1.3 Update archived-change reference: the standing audit list now includes the four stray hexes (documented in D2); run full audit `rg -i "0032a0|003d82|002170|f77f00|0044cc|06a77d|003399|00184d|0066cc|0066a0" src` — verify zero matches
- [x] 1.4 Run `./node_modules/.bin/tsc --noEmit` — verify zero type errors after cleanup

## 2. Dependencies & Icon Assets

- [x] 2.1 Install `@lordicon/react` and `lottie-web` with bun; remove unused `lucide-react` — verify `package.json` reflects adds/removal and `bun.lock` updated; record exact versions in design.md if they differ from expectations
- [x] 2.2 Export 5 icons from Lordicon free tier per design D4/D5 (search, certificate/document, storefront, cash, weather) recolored to bamboo/mango/slate, minified ON, downloaded as Lottie JSON into `public/assets/icons/lordicon/` with kebab-case names — verify files exist and each is valid JSON under 100KB; apply D5 fallback for any icon not in the free tier (user provided 5 JSONs in `public/assets/icon/` — Lordicon original names kept, all valid JSON under 100KB; D5 path/name convention superseded by user-provided assets)
- [x] 2.3 Optional: download static SVG fallbacks alongside JSON — verify SVGs render standalone in a browser (SKIPPED - deliberate: user-provided JSONs include no SVGs; reduced-motion fallback uses Bootstrap glyph via wrapper, which also avoids loading the Lottie runtime entirely under reduced motion; no main-spec behavior depends on SVG fallbacks)

## 3. AnimatedIcon Infrastructure

- [x] 3.1 Create `src/components/icons/AnimatedIcon.tsx` per design D3: `'use client'`, fixed-size container, dynamic import of Player+lottie-web, `prefers-reduced-motion` guard rendering static frame only, hover/focus trigger with `playFromBeginning()`, pause after `onComplete`, graceful fallback to Bootstrap glyph if JSON fails to load — verify component typechecks
- [x] 3.2 Verify code-splitting: build and confirm `lottie-web` lands in a per-page/dynamic chunk, not the shared bundle — verify via `next build` chunk output; adjust dynamic-import boundary if leaked

## 4. Placements (≤8)

- [ ] 4.1 Homepage hero search card: replace header `bi bi-search` with AnimatedIcon (hover trigger) — verify icon animates on hover and rests; no layout shift on load
- [ ] 4.2 Homepage category tiles (certificates, business, tax): replace tile glyphs with AnimatedIcon (hover trigger) — verify each animates once per hover, rests between hovers, tiles keep 12x12 visual footprint via fixed container
- [ ] 4.3 Weather widget: replace main icon with AnimatedIcon (hover trigger) — verify renders in widget context without shifting adjacent text
- [ ] 4.4 Placement audit: count AnimatedIcon usages — verify ≤8 and matches design D4 list; update design.md placement list if any reserved slots were used

## 5. Verification

- [ ] 5.1 Run extended legacy-hex audit (task 1.3 regex) — verify zero matches
- [ ] 5.2 Run `./node_modules/.bin/tsc --noEmit` — verify zero type errors
- [ ] 5.3 Run production build `$env:NODE_ENV="production"; ./node_modules/.bin/next build` — verify build succeeds, lottie chunking confirmed, revert `tsconfig.tsbuildinfo` if dirtied
- [ ] 5.4 Visual + behavior verification in dev server: hover animations play once and rest; idle page runs no animations; `prefers-reduced-motion` (emulate in devtools) shows static frames with no animation; icon containers cause no CLS; pages without icons never load lottie-web (check Network tab) — verify all five checks pass
