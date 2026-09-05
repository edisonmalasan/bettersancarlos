# Proposal: Rebrand Color Palette to Bamboo Green & Mango Yellow

## Why

The site's current identity is a deep blue (`#0032a0`) with orange accent (`#f77f00`), which does not match the official San Carlos City branding of **Bamboo Green & Mango Yellow**. The user confirmed a full-site palette rebrand, including dark mode and a neutral-color sweep, so residents see a portal that visually belongs to the city it serves.

## What Changes

- Replace the brand palette everywhere:
  - Primary: blue `#0032a0` / `#003d82` / `#002170` → bamboo green ramp (`#3A7D44` base, hover `#2F6136`, deep `#275230`)
  - Accent: orange `#f77f00` → mango yellow `#E8990A` in light mode, `#F2A900` on dark surfaces
  - Neutrals: `#1a1a1a` text → dark-slate `#2F3E46`; `#f8f9fa` alt background → off-white `#FAF9F6`
- Rebase dark mode from blue-slate (`#0f172a`/`#3b82f6`) onto the green-slate family (`#141D17` surfaces, `#7FB069` primary, `#F2A900` accent)
- Retune semantic colors: danger `#d62828` → `#B02E2E` (AA on off-white), success folds into the bamboo ramp, info `#0077BE` retained
- Rebuild chart colors (`--chart-1..5`) from the bamboo/mango/slate ramp in both modes
- Update the ~19 files carrying hardcoded brand hexes: 62 blue gradients → green gradients, indigo tints `#eef2ff` → bamboo tint `#EAF3EA`
- Update `manifest.ts` theme colors and PWA meta theme-color to bamboo green
- Sweep neutral hardcodes (`#1a1a1a` ×524, `#f8f9fa` ×74, `#e5e7eb` borders, `#f0f0f0`, `#666666`) to the new slate/off-white family
- Accessibility modes (`high-contrast`, font scaling, focus rings) keep working; focus ring and link colors follow the new primary
- Do NOT touch: logo image files (raster), generated output dirs, `version.json`/`package.json` version

## Capabilities

### New Capabilities

- `brand-color-palette`: The canonical color token system — brand ramp (bamboo/mango), neutrals (off-white/dark-slate), semantic colors (success/danger/info), dark-mode and high-contrast mappings, chart colors, and the WCAG contrast rules each pairing must satisfy.

### Modified Capabilities

- (none — no specs exist yet under `openspec/specs/`; this change establishes the first capability spec)

## Impact

- **Files**: `src/app/globals.css` (all token blocks), `manifest.ts`, `layout.tsx` (theme-color meta), plus ~17 component/page files with hardcoded brand hexes (`src/app/page.tsx`, `statistics/page.tsx` ×43 gradients, `PageHeader.tsx`, `Footer.tsx`, `WeatherWidget.tsx`, government/legislative/budget pages, etc.)
- **Scale**: ~90 brand-hex swaps + ~800 mechanical neutral swaps; all within `src/`
- **Systems**: Tailwind v4 `@theme` tokens, shadcn/ui semantic variables, vanilla-JS-toggled class hooks (names unchanged), Chart.js colors, PWA manifest
- **Verification**: `tsc --noEmit` + production `next build`; visual check of light/dark/high-contrast modes
- **Risk**: missing a hardcoded hex leaves blue remnants; mitigated by a final repo-wide hex audit task
