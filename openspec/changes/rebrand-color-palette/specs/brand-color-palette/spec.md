## Purpose

Defines the site's canonical color system so every surface — light mode, dark mode, high-contrast mode, charts, and PWA chrome — draws from one Bamboo Green & Mango Yellow brand palette with WCAG-compliant pairings.

## ADDED Requirements

### Requirement: Brand color tokens are the single source of truth
The system SHALL define the brand palette as design tokens (bamboo green ramp, mango yellow accent, off-white / dark-slate neutrals) in the global stylesheet, and all brand and neutral colors used by pages and components SHALL resolve to those tokens.

#### Scenario: Palette swap via tokens
- **WHEN** the brand token values are changed in the global stylesheet
- **THEN** the visible brand color of primary buttons, page headers, links, and section accents changes site-wide without further edits

### Requirement: Bamboo Green is the primary brand color
The system SHALL use Bamboo Green `#3A7D44` as the primary brand color, with a defined hover shade `#2F6136` and deep shade `#275230`, for all primary surfaces: navigation, page-header gradients, primary buttons, links, headings, and focus rings.

#### Scenario: Primary button in light mode
- **WHEN** a primary button is rendered in light mode
- **THEN** its background is Bamboo Green `#3A7D44` with white text at a minimum 4.5:1 contrast ratio

#### Scenario: Page header gradient
- **WHEN** a page with a header banner is rendered
- **THEN** the banner uses a bamboo-green gradient (no blue brand hexes) with white text meeting WCAG AA

### Requirement: Mango Yellow is the accent color with mode-aware shade
The system SHALL use Mango Yellow as the sole accent color: `#E8990A` in light mode and `#F2A900` on dark surfaces, paired with dark-slate text (`#2F3E46`) on mango backgrounds — never white text on mango.

#### Scenario: Accent badge in light mode
- **WHEN** an accent-colored badge or callout appears in light mode
- **THEN** its background is `#E8990A` with dark-slate text at minimum 4.5:1 contrast

#### Scenario: Accent on dark surfaces
- **WHEN** an accent color is used in dark mode or on a dark green surface
- **THEN** the mango shade `#F2A900` is used with dark text at minimum 4.5:1 contrast

### Requirement: Neutral surfaces use Off-White and Dark-Slate
The system SHALL use Off-White `#FAF9F6` for light-mode backgrounds and Dark-Slate `#2F3E46` for light-mode text/ink and dark-mode base surfaces, replacing the legacy near-black `#1a1a1a`, gray `#f8f9fa`, and blue-slate dark surfaces.

#### Scenario: Body text contrast
- **WHEN** body text is rendered on the default light background
- **THEN** dark-slate text on off-white meets at least 10:1 contrast

#### Scenario: Dark mode surfaces
- **WHEN** dark mode is active
- **THEN** page background is a dark green-slate (near `#141D17`), cards are a lighter step of the same family, and no blue-slate surfaces remain

### Requirement: Semantic colors remain distinguishable from the brand ramp
The system SHALL provide success, danger, and info colors that remain visually distinct from bamboo green: success reuses the bamboo ramp, danger is deepened to `#B02E2E`, and info remains `#0077BE`.

#### Scenario: Danger text on light background
- **WHEN** a danger-colored error message is rendered on off-white
- **THEN** the danger color `#B02E2E` meets at least 6:1 contrast

#### Scenario: Success is not confused with danger
- **WHEN** success and danger indicators appear side by side
- **THEN** they are distinguishable by color (green vs red family) at AA contrast

### Requirement: Charts use brand-derived colors
The system SHALL derive chart series colors (`--chart-1` through `--chart-5`) from the bamboo, mango, and slate ramp in both light and dark modes, keeping adjacent series visually distinguishable.

#### Scenario: Statistics page charts in both modes
- **WHEN** the statistics page renders its charts in light mode and in dark mode
- **THEN** chart series use only brand-derived colors and each series is distinguishable from its neighbors

### Requirement: Accessibility modes survive the rebrand
The system SHALL preserve the behavior of accessibility features — high-contrast mode, font scaling, focus-visible outlines, and skip links — with brand colors updated only in value, not in behavior.

#### Scenario: High-contrast mode
- **WHEN** the user enables high-contrast mode
- **THEN** the page renders the yellow-on-black scheme and all text passes WCAG AA in that mode

#### Scenario: Focus ring visibility
- **WHEN** a keyboard user tabs through interactive elements
- **THEN** the focus ring uses the bamboo green primary and is clearly visible on both light and dark backgrounds

### Requirement: PWA chrome reflects the brand
The system SHALL set the PWA manifest theme/background colors and the browser `theme-color` meta to bamboo green so the installed app and mobile browser chrome match the site brand.

#### Scenario: Installed PWA theme
- **WHEN** the site is installed as a PWA
- **THEN** the manifest theme color and background color are bamboo green values, and the mobile browser chrome tint matches

### Requirement: No legacy brand hexes remain
After the rebrand, the source tree SHALL contain no occurrences of the legacy brand hexes (`#0032a0`, `#003d82`, `#002170`, `#f77f00`, `#0044cc`) outside of changelog/documentation files.

#### Scenario: Repo-wide legacy hex audit
- **WHEN** the source directories (`src/`) are searched for the legacy brand hexes
- **THEN** zero matches are found
