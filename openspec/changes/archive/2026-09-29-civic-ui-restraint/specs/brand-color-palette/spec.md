# Spec Delta

## MODIFIED Requirements

### Requirement: Bamboo Green is the primary brand color
The system SHALL use Bamboo Green `#3A7D44` as the primary brand color, with a defined hover shade `#2F6136` and deep shade `#275230`, for all primary surfaces: navigation, page-masthead bands, primary buttons, links, headings, and focus rings. Large brand bands (the page masthead, the hero) SHALL use a flat solid fill from the bamboo ramp and SHALL NOT use a gradient fill, a glow, or a decorative overlay tint, so that the brand reads as a stable institutional surface rather than as marketing decoration.

#### Scenario: Primary button in light mode
- **WHEN** a primary button is rendered in light mode
- **THEN** its background is Bamboo Green `#3A7D44` with white text at a minimum 4.5:1 contrast ratio

#### Scenario: Page header gradient
- **WHEN** a page with a header banner is rendered
- **THEN** the banner uses bamboo green (no blue brand hexes) as a flat solid fill — not a gradient — with white text meeting WCAG AA

#### Scenario: No decorative gradient on brand bands
- **WHEN** a brand-colored band is rendered on any page
- **THEN** its background is a single solid color from the bamboo ramp, and it carries no gradient, radial glow, or blend-mode overlay tint
