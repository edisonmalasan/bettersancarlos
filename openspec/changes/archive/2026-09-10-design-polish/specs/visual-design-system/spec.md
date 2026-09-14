## Purpose

Locks the site's visual consistency contract — token exclusivity for brand/neutral colors, the corner-radius scale, transition-timing and hover-lift rules, section rhythm, and icon-renderer consistency — so pages and components cannot reintroduce the drift and AI-slop patterns found in the 2026-09-10 design audit.

## ADDED Requirements

### Requirement: Brand and neutral colors resolve through tokens
All brand and neutral colors used by pages and components SHALL resolve to the design tokens defined in the global stylesheet (`@theme` block and its `:root`/`.dark` mappings). New and modified markup SHALL use token-based utilities (e.g. `bg-primary`, `text-foreground`, `border-border`) rather than raw brand hex values in arbitrary-value classes. Gradients mandated by the brand-color-palette spec MAY embed hex/var values inside `linear-gradient()` literals. Semantic status colors that have no token (e.g. `#dc2626`, `#16a34a`, badge pastel pairs) MAY be used raw where no token exists, but each such value MUST be used for exactly one semantic role site-wide.

#### Scenario: Palette swap propagates
- **WHEN** a brand token value is changed in the global stylesheet
- **THEN** every surface using token utilities (text, borders, backgrounds, buttons) updates site-wide without editing page files

#### Scenario: No raw brand hexes in new markup
- **WHEN** page or component markup is added or modified
- **THEN** it contains no raw occurrences of the tokenized hexes (`#2f3e46`, `#5c6b73`, `#e2e8e0`, `#faf9f6`, flat `#3a7d44`, `#275230`, `#2f6136`, `#0077be`, `#e8990a`) outside `linear-gradient()` literals and values with no existing token

### Requirement: One corner-radius scale
Interactive cards, panels, and large surfaces SHALL use `rounded-xl`; inputs, chips, small icon boxes, and inner elements SHALL use `rounded-lg` or `rounded-full` (pills); inline-style arbitrary radii SHALL be replaced by the nearest scale step. A page SHALL NOT mix radius values for the same kind of element.

#### Scenario: Card radii are uniform
- **WHEN** any two cards of the same kind (service card, stat card, news card, contact card) are rendered anywhere on the site
- **THEN** both use the same radius class from the locked scale

#### Scenario: No arbitrary pixel radii in markup
- **WHEN** component markup is inspected
- **THEN** no `rounded-[Npx]` arbitrary values remain on cards, panels, or buttons (icon-canvas exceptions documented in design.md excepted)

### Requirement: Consistent transition timing and hover behavior
Hover/focus transitions SHALL use `duration-200` with an explicit property list (`transition-colors`, `transition-shadow`, `transition-transform`, or `transition-[gap]`); `transition-all` SHALL NOT be used on new or modified markup. Interactive cards SHALL use one lift value (`hover:-translate-y-0.5`) and one hover-shadow family. Primary buttons SHALL provide press feedback via `active:scale-[0.97]`. Continuous data animations (charts, rate tickers) SHALL NOT re-run on every data refresh.

#### Scenario: Card hover is uniform
- **WHEN** a user hovers any interactive card on the site
- **THEN** the lift, shadow, and timing behave identically to other interactive cards

#### Scenario: No transition-all remains
- **WHEN** modified components are inspected
- **THEN** hover/focus transitions declare exact properties and a `duration-*` class rather than `transition-all`

#### Scenario: InfoBar does not re-animate on refresh
- **WHEN** the InfoBar refreshes its exchange-rate data
- **THEN** values update without replaying an entrance animation

### Requirement: Canonical section rhythm
Page sections SHALL use `py-16 max-[1024px]:py-8 max-[767px]:py-6` as the default vertical rhythm; band-specific spacing MAY deviate only where documented in design.md. The hero and page-header bands MAY use their own larger padding. No section SHALL use an inverted responsive scale (larger padding on tablet than mobile).

#### Scenario: Section padding is consistent
- **WHEN** adjacent content sections on any page are compared
- **THEN** they use the same responsive padding pattern (or a documented band exception)

#### Scenario: No inverted responsive padding
- **WHEN** any section's responsive classes are inspected
- **THEN** tablet padding is never larger than its desktop or mobile padding within the same section

### Requirement: Icon renderer consistency
A row, grid, or list of parallel items SHALL render its icons with a single icon system (Bootstrap Icons glyphs via the existing `AnimatedIcon` fallback behavior, or `AnimatedIcon` for every item where animated state is meaningful). Decorative animated-icon scripts with no consuming element SHALL NOT be loaded.

#### Scenario: Parallel items use one icon system
- **WHEN** a grid of service cards (or any parallel item row) renders
- **THEN** all items in that row use the same icon renderer and sizing treatment

#### Scenario: No orphan icon scripts
- **WHEN** the document is inspected at load
- **THEN** no icon/player script loads without at least one consuming element on the page

### Requirement: Design-consistency defects from the audit are corrected
The system SHALL NOT exhibit the following audit-found defects: links to non-existent routes; third-party embeds referencing entities other than San Carlos City, Pangasinan; placeholder content rendered as final content (e.g. a loading state styled as a real article card); decorative background patterns on content sections; a hand-rolled duplicate of the shared page-header component.

#### Scenario: No broken internal routes
- **WHEN** every internal link in the site shell is followed
- **THEN** each resolves to an existing route

#### Scenario: Embeds match the site's subject
- **WHEN** a third-party embed (social page plugin, map, video) renders
- **THEN** it references San Carlos City, Pangasinan or an asset explicitly documented for the site

#### Scenario: Loading states are honest
- **WHEN** a data-driven section is loading
- **THEN** it renders a skeleton or loading indicator, not content styled as a real item
