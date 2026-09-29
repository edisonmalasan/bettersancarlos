# Spec Delta

## MODIFIED Requirements

### Requirement: One corner-radius scale

Interactive cards, panels, and large surfaces SHALL use `rounded-xl`; inputs, chips, small icon boxes, and inner elements SHALL use `rounded-lg` or `rounded-full` (pills); inline-style arbitrary radii SHALL be replaced by the nearest scale step. A page SHALL NOT mix radius values for the same kind of element. The base `--radius` token SHALL be `0.25rem`, so the scale resolves to a restrained civic set in which `rounded-xl` is at most `0.35rem` (5.6px) and no large surface resolves beyond `0.5rem` (8px). Rounded containers SHALL NOT be used as a default grouping device; grouping SHALL prefer a rule or a band.

#### Scenario: Card radii are uniform
- **WHEN** any two cards of the same kind (service card, stat card, news card, contact card) are rendered anywhere on the site
- **THEN** both use the same radius class from the locked scale

#### Scenario: No arbitrary pixel radii in markup
- **WHEN** component markup is inspected
- **THEN** no `rounded-[Npx]` arbitrary values remain on cards, panels, or buttons (icon-canvas exceptions documented in design.md excepted)

#### Scenario: Large surfaces stay visually restrained
- **WHEN** the radius scale is resolved from the base token
- **THEN** `rounded-xl` resolves to at most 5.6px and no card, panel or band resolves beyond 8px, so surfaces read as document surfaces rather than as soft containers

### Requirement: Consistent transition timing and hover behavior

Hover/focus transitions SHALL use `duration-200` with an explicit property list (`transition-colors`, `transition-shadow`, or `transition-transform`); `transition-all` SHALL NOT be used on new or modified markup. Interactive cards SHALL NOT lift on hover and SHALL NOT gain a colored or glowing drop shadow: hover SHALL be expressed through border-color and background-color emphasis on a flat surface. Primary buttons SHALL provide press feedback via `active:scale-[0.97]`. Continuous data animations (charts, rate tickers) SHALL NOT re-run on every data refresh. Entrance animations that stagger purely decorative content into view on scroll SHALL NOT be applied to informational lists and timelines.

#### Scenario: Card hover is uniform
- **WHEN** a user hovers any interactive card on the site
- **THEN** the border/background emphasis and timing behave identically to other interactive cards, and no translation or shadow is introduced

#### Scenario: No transition-all remains
- **WHEN** modified components are inspected
- **THEN** hover/focus transitions declare exact properties and a `duration-*` class rather than `transition-all`

#### Scenario: InfoBar does not re-animate on refresh
- **WHEN** the InfoBar refreshes its exchange-rate data
- **THEN** values update without replaying an entrance animation

#### Scenario: No decorative entrance animation on informational content
- **WHEN** an informational list or timeline enters the viewport
- **THEN** its content is visible without a staggered translate/fade entrance animation

### Requirement: Canonical section rhythm

Page sections SHALL use the canonical section rhythm defined by the shared layout primitive (`py-12 max-[1024px]:py-10 max-[767px]:py-8` by default) as the default vertical rhythm; band-specific spacing MAY deviate only where documented in design.md. The hero and page-masthead bands MAY use their own larger padding. No section SHALL use an inverted responsive scale (larger padding on tablet than mobile), and no single breakpoint step SHALL reduce vertical padding by more than half.

#### Scenario: Section padding is consistent
- **WHEN** adjacent content sections on any page are compared
- **THEN** they use the same responsive padding pattern (or a documented band exception)

#### Scenario: No inverted responsive padding
- **WHEN** any section's responsive classes are inspected
- **THEN** tablet padding is never larger than its desktop or mobile padding within the same section

#### Scenario: Padding does not collapse abruptly
- **WHEN** the desktop, tablet and mobile padding values of any section are compared
- **THEN** no adjacent step reduces the padding by more than half

### Requirement: Icon renderer consistency

A row, grid, or list of parallel items SHALL render its icons with a single icon system (Bootstrap Icons glyphs via the existing `AnimatedIcon` fallback behavior, or `AnimatedIcon` for every item where animated state is meaningful). Decorative animated-icon scripts with no consuming element SHALL NOT be loaded. Where a list of parallel items is presented as text rows separated by rules rather than as cards, the rows SHALL NOT each carry a decorative icon container, and any icon retained SHALL convey meaning (such as a contact method or a status) rather than ornament.

#### Scenario: Parallel items use one icon system
- **WHEN** a grid of service cards (or any parallel item row) renders
- **THEN** all items in that row use the same icon renderer and sizing treatment

#### Scenario: No orphan icon scripts
- **WHEN** the document is inspected at load
- **THEN** no icon/player script loads without at least one consuming element on the page

#### Scenario: Rule-separated rows carry no decorative icons
- **WHEN** parallel items are rendered as rule-separated text rows
- **THEN** the rows present their title and metadata without a per-row decorative icon container, except where the icon conveys meaning
