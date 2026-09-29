# icon-system Specification

## Purpose

Defines the site's icon behavior contract: a static glyph baseline for functional chrome, and a tightly limited set of self-hosted animated icons used only where motion communicates meaning, with accessibility and layout-stability guarantees.

## Requirements

### Requirement: Icons convey meaning rather than ornamentation

An icon SHALL be rendered only where it carries meaning that the adjacent text does not already
convey — for example a contact method, a status, a file or record type, or a navigation
affordance. Icons SHALL NOT be used as decoration on every row, tile or card of a repeated set,
and a repeated set of parallel items SHALL NOT render an identical icon container on every item
solely for visual rhythm.

#### Scenario: Repeated sets are not icon-per-item

- **WHEN** a page renders a set of parallel items such as a service list, category directory or statistics set
- **THEN** the items are not each wrapped in an identical rounded icon container used only for visual rhythm, unless the icon identifies a genuinely different item type

#### Scenario: Decorative-only icon containers are removed

- **WHEN** an icon container's glyph duplicates information already present in the item's text
- **THEN** the icon container is not rendered

#### Scenario: Meaningful icons are preserved

- **WHEN** an icon identifies a contact method, a status, or a navigation affordance
- **THEN** the icon is retained, remains visually consistent with other functional icons, and does not depend on colour alone to convey its meaning


### Requirement: Static icon baseline for functional chrome
The system SHALL render all functional icons (navigation arrows, info circles, form glyphs, list markers) as static icons, and SHALL NOT apply animation to them.

#### Scenario: Functional icon renders statically
- **WHEN** a functional icon such as an arrow link or info circle is rendered on any page
- **THEN** it displays as a static glyph with no animation and requires no animation runtime

### Requirement: Animated icons are limited to designated high-emphasis placements
The system SHALL restrict animated icons to a defined set of at most 8 high-emphasis placements (hero search card, homepage service category tiles, weather widget, and comparable emphasis moments), and SHALL NOT introduce animated icons into body copy, tables, forms, or lists.

#### Scenario: Placement count audit
- **WHEN** the source tree is searched for animated-icon component usages
- **THEN** no more than 8 distinct placements exist, each corresponding to a documented high-emphasis moment

### Requirement: Animated icons trigger on interaction or once on reveal
The system SHALL play animated icons only on user interaction (hover, focus) or once when first revealed, and SHALL NOT loop any icon animation continuously.

#### Scenario: Hover trigger on service category tile
- **WHEN** a user hovers a service category tile carrying an animated icon
- **THEN** the icon plays its animation once and comes to rest, and does not restart or loop while hover persists

#### Scenario: No perpetual motion
- **WHEN** any page is left idle with no user input
- **THEN** no icon animation is running

### Requirement: Animated icons respect reduced motion
The system SHALL render animated icons as their static first or last frame when the user prefers reduced motion, and SHALL NOT load or start any icon animation in that mode.

#### Scenario: Reduced motion user
- **WHEN** the operating system reports `prefers-reduced-motion: reduce` and a page with an animated icon loads
- **THEN** the icon displays as a static frame and the animation runtime never plays it

### Requirement: Animated icon assets are self-hosted and brand-colored
The system SHALL load animated icon assets as minified Lottie JSON files hosted under the site's own static assets (no third-party CDN dependency at runtime), with brand colors applied in the exported asset rather than recolored at runtime.

#### Scenario: Offline/static-host integrity
- **WHEN** the statically exported site is served without any third-party CDN access
- **THEN** all animated icons render correctly from self-hosted assets

### Requirement: Animated icons preserve layout stability
The system SHALL reserve fixed dimensions for animated icon containers equal to the icon's rendered size, so that icon hydration or asset loading causes no layout shift.

#### Scenario: Icon load causes no reflow
- **WHEN** an animated icon's Lottie asset finishes loading after hydration
- **THEN** surrounding content does not shift (container dimensions are fixed before load)
