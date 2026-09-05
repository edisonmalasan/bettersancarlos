# Design: Rebrand Color Palette

## Context

The site is a statically exported Next.js 15 PWA styled with Tailwind v4 CSS-first tokens (`src/app/globals.css` `@theme` + `:root` + `.dark` blocks) and shadcn/ui semantic variables. The brand palette is currently deep blue `#0032a0`/`#003d82`/`#002170` with orange accent `#f77f00`. Tokens exist but ~19 component/page files hardcode brand hexes — dominated by two gradient strings (37× `135deg` + 25× `90deg` blue gradients) — and ~1,000 neutral hexes (`#1a1a1a` ×524, `#f8f9fa` ×74, `#e5e7eb` ×153, `#f0f0f0` ×46) are scattered inline. Dark mode is a separate blue-slate family (`#0f172a` bg, `#3b82f6` primary) that would clash with a green brand. Vanilla JS toggles class hooks (`.cmci-tab`, `.metric-card`, `.visible`) whose names must not change. Verified contrast math (WCAG relative luminance) backs every pairing below.

## Goals / Non-Goals

**Goals:**
- One token-level palette definition driving the whole site (light, dark, high-contrast, charts, PWA chrome)
- Brand parity: Bamboo Green primary, Mango Yellow accent, Off-White/Dark-Slate neutrals
- WCAG AA minimum for every text/background pairing, verified numerically
- Complete removal of legacy brand hexes from `src/`

**Non-Goals:**
- No logo/asset redesign (raster logo files untouched)
- No layout, spacing, typography, or component-structure changes
- No dependency changes (no new Tailwind plugins, no theme libraries)
- No behavior changes to accessibility toggles, search, tabs, or animations
- Do not touch `.next/`, `out/`, `dist/`, `public/sw.js*`, `version.json`, `package.json` version

## Decisions

### D1 — The final palette (contrast-verified)

| Token | Light mode | Dark mode | Role |
|---|---|---|---|
| `--color-primary` | `#3A7D44` bamboo | `#7FB069` light bamboo | Nav, buttons, links, headings, focus ring |
| `--color-primary-dark` (hover/deep) | `#2F6136` | `#5C9152` | Hover, active, pressed |
| `--color-primary-deep` (gradient end) | `#275230` | `#3A5A3F` | Header/hero gradient ends |
| `--color-accent` (mango) | `#E8990A` | `#F2A900` | Badges, highlights, CTA fills, chart-5 |
| `--color-bg` | `#FFFFFF` | `#141D17` | Page background |
| `--color-bg-alt` | `#FAF9F6` off-white | `#1B2A1F` | Alt sections, cards |
| `--color-text` | `#2F3E46` dark-slate | `#EAF3EA` | Body text |
| `--color-text-light` | `#5C6B73` | `#A8BCA8` | Secondary text |
| `--color-success` | `#3A7D44` (ramp) | `#7FB069` | Success states (folded into brand) |
| `--color-danger` | `#B02E2E` | `#E05B5B` | Errors, destructive |
| `--color-info` | `#0077BE` | `#4DA8D8` | Info states (retained, retuned for dark) |
| `--chart-1..5` | `#3A7D44`, `#275230`, `#0077BE`, `#E8990A`, `#2F3E46` | `#7FB069`, `#A8D08D`, `#4DA8D8`, `#F2A900`, `#EAF3EA` | Chart.js series |

Mango shade rationale: user asked for a "balanced/darker" mango. `#E8990A` keeps 4.74:1 with slate ink (AA); `#DB8E00` drops to 4.15:1 (fails) — so `#E8990A` is the darkest mango that still carries text. `#F2A900` is reserved for dark surfaces where it scores 8.58:1.

Verified pairings: white on `#3A7D44` 5.00:1 · slate on `#FAF9F6` 10.26:1 · slate on `#E8990A` 4.74:1 · `#7FB069` on `#141D17` 6.83:1 · `#F2A900` on `#141D17` 8.58:1 · `#B02E2E` on white 6.41:1 · bamboo-hover `#2F6136` on white 7.28:1.

**Alternatives considered:** `#2F6B3F` (deeper, 6.37:1 — rejected, user picked fresher `#3A7D44`); `#FFB703` mango (too neon per user); blue-undertone slate `#263238` (rejected — green-undertone `#2F3E46` keeps neutrals in the brand family).

### D2 — Token strategy: keep the existing dual-block structure, extend it

Edit the palette in place: `@theme` block (Tailwind v4 utilities), `:root` block (legacy vars + shadcn mapping), and `.dark` block. Add missing steps (`--color-primary-deep`, dark-mode `--color-bg`/`--color-bg-alt` already exist in `.dark` semantics). Do NOT introduce a new token layer (e.g. HSL triples à la default shadcn) — the codebase is hex-based and `@theme inline` already re-exports the `:root` vars; a second system would double maintenance.

### D3 — Gradient migration is a mechanical string swap

The two dominant gradients become:
- `linear-gradient(135deg,#0032a0_0%,#003d82_100%)` → `linear-gradient(135deg,#3A7D44_0%,#275230_100%)`
- `linear-gradient(90deg,#0032a0_0%,#003d82_100%)` → `linear-gradient(90deg,#3A7D44_0%,#275230_100%)`

All 62 instances live in `className` strings; swap values, keep positions/deg. Secondary variants (`90deg,#0032a0_0%,#0077be_100%` ×4, `180deg`, `#0044cc`) map to the nearest ramp pair. Indigo tint `#eef2ff` (×26) → bamboo tint `#EAF3EA`.

### D4 — Neutral sweep scope

Phase the sweep by exact hex so it stays mechanical and reviewable:
1. Brand hexes + gradients (the 19 files, ~90 swaps) — visual identity flips here
2. Neutral hexes site-wide: `#1a1a1a`→`#2F3E46` (text contexts), `#f8f9fa`→`#FAF9F6`, `#e5e7eb`→`#E2E8E0` (green-tinted border), `#f0f0f0`→`#EAECE8`, `#666666`→`#5C6B73`
3. Tailwind gray/slate utility classes (`gray-800`, `slate-50`, etc.) are LEFT AS-IS: they are already neutral and wholesale class renaming would explode the diff for near-zero visual gain. Only the hardcoded hexes tied to the legacy palette move.

**Alternative rejected:** converting every inline hex to `bg-primary`/`text-foreground` utilities. Correct long-term, but it's a refactor with per-instance judgment calls; this change is a palette swap and keeps diffs reviewable. Follow-up tokenization can be its own change.

### D5 — Dark mode rebase, not just darkening

`.dark` moves from blue-slate (`#0f172a`/`#1e293b`/`#3b82f6`) to the green-slate family (`#141D17` bg, `#1B2A1F` cards, `#7FB069` primary, `#F2A900` accent, `#EAF3EA` text). Mango flips to the brighter `#F2A900` shade in dark mode (D1). Charts get a dark ramp (D1). Green-tinted dark surfaces keep the brand visible at night without glare.

### D6 — Semantic color handling

- Success `#06a77d` currently sits ~30° hue-away from danger-adjacent orange and close to brand green; it folds INTO the bamboo ramp (success == primary family). Distinctness from danger is preserved (green vs red family); this removes one competing hue per the design-taste "one accent, locked" rule.
- Danger `#d62828` → `#B02E2E` (4.16:1 → 6.41:1 on off-white; the old value failed AA on the NEW off-white).
- Info `#0077BE` stays (4.79:1 on white, functional, far from green in hue). Dark-mode info lightens to `#4DA8D8`.
- High-contrast mode (`body.high-contrast`) keeps its yellow-on-black scheme — already AA and now harmonious with mango. Only no-op value updates if any var is missing.

### D7 — Chart.js colors pass through the tokens

Chart components read literal hexes; replace them with the `--chart-1..5` values from D1 per mode. Statistics page (43 gradients) gets the same D3 treatment. Series order chosen so adjacent series differ in lightness AND hue (green → deep green → blue → mango → slate).

### D8 — PWA chrome

`manifest.ts` `theme_color`/`background_color` and the `<meta name="theme-color">` in `layout.tsx` move to bamboo `#3A7D44` / off-white `#FAF9F6`. Favicon/OG images are raster assets — untouched (Non-Goal).

## Risks / Trade-offs

- [Missed hardcoded hex leaves blue remnants] → Final audit task greps `src/` for every legacy hex (`0032a0|003d82|002170|f77f00|0044cc|06a77d`) and must return zero before build verification
- [`#eef2ff` tint appears in components we don't grep for] → Audit also sweeps `eef2ff` and the neutral hexes; tint swap is included in D3
- [Vanilla JS class hooks break if classNames change] → Only color values change inside classNames; hook names (`.cmci-tab`, `.metric-card`, `.visible`, `.selected`) are untouched
- [AA failures from naive value swaps] → Pairing table in D1 is pre-verified; any component pairing not in the table gets checked before commit
- [Charts with 5 similar greens unreadable] → D7 order mixes lightness + one blue + one mango; statistics page is the visual smoke test
- [Large mechanical diff obscures review] → Two-phase commit strategy in tasks (brand first, neutrals second) keeps each diff greppable by hex
- [`tsconfig.tsbuildinfo` dirtied by build verification] → Revert it after `next build` per AGENTS.md boundaries

## Migration Plan

1. Phase 1 (brand): tokens in `globals.css` + 19 brand-hex files + gradients + manifest/layout chrome → site is fully green/yellow, neutrals still legacy
2. Phase 2 (neutrals): exact-hex sweep of the five neutral values site-wide
3. Audit: zero legacy hexes in `src/`; run `tsc --noEmit` and production `next build`
4. Visual verification in light / dark / high-contrast modes
5. Rollback: `git revert` of the two phase commits restores blue exactly (no data, API, or config migration involved)

## Open Questions

None — palette values, scope (dark mode + neutral sweep), and mango shade were confirmed with the user during exploration.
