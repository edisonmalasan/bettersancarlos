# Spec Delta

## ADDED Requirements

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
