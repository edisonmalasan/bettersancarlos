# Proposal: Frontend Polish — Anti-Slop Cleanup & Lordicon Animated Icons

## Why

An audit against the design-taste-frontend skill found AI-slop patterns in the frontend — most prominently 34 decorative uppercase eyebrow labels (the skill's #1 flagged AI tell) and four leftover blue hexes from the pre-rebrand palette — while the icon layer is static Bootstrap glyphs everywhere, including the few high-emphasis moments (hero search, service category tiles) where motion would communicate meaning rather than decorate.

## What Changes

- **Eyebrow pruning**: remove decorative uppercase micro-labels across pages, keeping only labels with genuine data semantics (target: 34 → ~5). Budget page alone carries 12.
- **Stray-blue cleanup**: 4 legacy blues missed by the rebrand audit — homepage search-button hover gradient `#003399` → deep bamboo `#275230`, InfoBar background `#00184d` → dark green-slate `#275230`, SearchAutocomplete link `#0066cc` → info `#0077BE`, contact badge gradient end `#0066a0` → deep info `#005A8F`. Extend the standing legacy-hex audit list with these four.
- **Lordicon animated icons (targeted)**: introduce `@lordicon/react` + `lottie-web` with a shared client-side `AnimatedIcon` wrapper component. Replace 5–8 high-emphasis Bootstrap glyphs only: hero search card icon, 3 homepage service category tiles, weather widget icon, and up to 3 more if a natural fit emerges. All other ~535 Bootstrap glyphs stay static.
- **Icon assets**: 5–8 Lordicon icons from the free tier, System family (minimalist, fits civic tone), exported as minified Lottie JSON, pre-colored to bamboo/mango/slate in the Lordicon editor, self-hosted under `public/assets/icons/lordicon/`.
- **Motion discipline**: icons animate on hover or once-on-reveal — never infinite loop; static first frame rendered under `prefers-reduced-motion`.
- **Dead dependency removal**: `lucide-react` is in package.json with zero imports — uninstall.

## Capabilities

### New Capabilities

- `icon-system`: Rules for how icons behave on the site — the static Bootstrap baseline, where animated Lordicon icons are permitted and how they must behave (trigger, size stability, reduced-motion fallback, self-hosted assets, brand recoloring).

### Modified Capabilities

- `brand-color-palette`: The "No legacy brand hexes remain" requirement's audit list expands to include the four stray blues (`#003399`, `#00184d`, `#0066cc`, `#0066a0`), and the eyebrow-pruning work touches the palette spec's scope only insofar as labels carry primary color — no requirement text changes to color values.

## Impact

- **Files**: `src/app/page.tsx` (hero + category tiles), `src/components/WeatherWidget.tsx`, `src/components/layout/InfoBar.tsx`, `src/components/SearchAutocomplete.tsx`, `src/app/contact/page.tsx`, ~10 page files for eyebrow removal, `src/app/globals.css` (no changes expected), `package.json` (+`@lordicon/react`/`lottie-web`, −`lucide-react`), new `src/components/icons/AnimatedIcon.tsx`, new `public/assets/icons/lordicon/*.json`
- **Dependencies**: add `@lordicon/react` (player) + `lottie-web` (runtime, ~100KB gz — code-split via dynamic import so only icon-bearing pages pay it); remove `lucide-react`
- **Systems**: Next.js 15 static export (client component + dynamic import verified compatible); Serwist PWA (JSON assets cached like other static assets)
- **Risk**: Lottie JSON assets must be hand-exported from the Lordicon editor (user action needed during apply); icon flash on hydration mitigated by fixed-size containers; free-tier license restricts icon selection — verified per icon at selection time
- **Verification**: `tsc --noEmit`, production `next build`, visual check of animated vs reduced-motion states
