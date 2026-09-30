# civic-composition Specification

## Purpose

Defines the site's shared civic layout primitives — the container, section rhythm and page
masthead — and the list-row presentation used for parallel service data, so that pages stop
re-declaring duplicated utility strings and stop presenting every set of parallel items as an
identical card grid.

## Requirements

### Requirement: Shared layout primitives replace duplicated utility strings
The system SHALL provide a single shared definition of the page container width, its responsive
horizontal padding, and the canonical section vertical rhythm, and pages SHALL consume that shared
definition rather than re-declaring the equivalent utility string inline.

#### Scenario: Container is defined once
- **WHEN** the source tree is searched for the container width and horizontal padding utilities
- **THEN** they appear in the shared primitive definition and are not duplicated as literal class strings across page files

#### Scenario: Pages inherit rhythm changes
- **WHEN** the canonical section rhythm is changed in the shared definition
- **THEN** every section using the shared primitive updates without editing individual page files

### Requirement: Section rhythm descends monotonically across breakpoints
The canonical section vertical rhythm SHALL decrease (or hold) monotonically from desktop to
tablet to mobile, and SHALL NOT more than halve padding in a single breakpoint step.

#### Scenario: No jarring collapse between breakpoints
- **WHEN** any section's responsive padding classes are inspected
- **THEN** padding at tablet is never larger than at desktop, and no single step reduces padding by more than half

### Requirement: Parallel service data renders as scannable list rows
Where a page presents parallel service entries that carry structured metadata (such as the
responsible office, the fee, and the processing time), the system SHALL render them as
hairline-separated list rows in a single column rather than as a multi-column grid of
individually bordered cards, and SHALL render each entry's metadata as an ordered label/value
pair associated programmatically with its entry. Metadata SHALL be limited to values attested by a
canonical civic record or verified research document; a fee or processing time with no such source
SHALL be omitted rather than rendered (see `civic-data-surfacing`, "Directory facts are never
presented without a canonical source").

#### Scenario: Metadata is programmatically associated
- **WHEN** a service entry lists an attested office or other sourced fact
- **THEN** each label/value pair is exposed as a description-list term/definition pair within that entry, so assistive technology announces the metadata with its service rather than as loose text

#### Scenario: Unsourced fee or processing time is not rendered
- **WHEN** a service has no canonical or verified-research source for its fee or processing time
- **THEN** the row renders no fee or processing-time value, and the presentation component offers no prop through which one could be supplied

#### Scenario: Entries are not individually boxed
- **WHEN** a list of service entries is rendered
- **THEN** the entries are separated by rules within one surface and do not each carry their own surrounding border and shadow

#### Scenario: Narrow viewports need no re-layout
- **WHEN** the service list is viewed on a mobile viewport
- **THEN** the entries remain readable in one column without horizontal scrolling, and any metadata pairs wrap rather than truncate

#### Scenario: Directory lists emit valid list markup
- **WHEN** a page renders a set of service entries as list rows
- **THEN** every entry's list item is contained within a list element (`<ul>` or `<ol>`), and no orphaned list item is emitted directly inside a non-list container

### Requirement: Page masthead is a flat restrained band
An inner page's masthead SHALL render as a flat solid brand-colored band with left-aligned title
and description, and SHALL NOT render a gradient fill, a pill-shaped badge, or a centered
text block.

#### Scenario: Masthead has no gradient or pill
- **WHEN** any inner page masthead is rendered
- **THEN** its background is a single solid brand color, it contains no pill or rounded badge, and its title and description are left-aligned

#### Scenario: Masthead is identical across pages
- **WHEN** two different inner pages are compared
- **THEN** their mastheads use the same band, padding and type treatment, differing only in title, description and breadcrumb text

### Requirement: Surfaces are not nested inside one another
A bordered or elevated surface SHALL NOT be placed inside another bordered or elevated surface
for visual grouping alone. Content that would otherwise be nested SHALL sit flush on its parent
surface, separated by a rule.

#### Scenario: No card inside a card
- **WHEN** a page is inspected for nested containers
- **THEN** no surface that itself carries a border, background fill and shadow is rendered inside another such surface

#### Scenario: Grouped content is separated by a rule
- **WHEN** content is grouped inside a band that already provides a surface
- **THEN** the grouped content is separated from its neighbours by a border rule rather than by an additional enclosing container
