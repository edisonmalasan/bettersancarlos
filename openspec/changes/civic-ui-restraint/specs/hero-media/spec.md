# Spec Delta

## MODIFIED Requirements

### Requirement: Hero fills the viewport height accounting for site chrome
The homepage hero section SHALL occupy a restrained band that accounts for the sticky navbar and InfoBar, sized so that the hero and its primary content (headline, description and the Find a Service search) fit within the first screen at common desktop and mobile viewports, while leaving the following content section's heading reachable with a short, natural scroll. The hero SHALL NOT be a full-viewport (`100dvh`) marketing composition. The video background, the readability scrim, the 3D logo column, the search card and all hero behaviour are otherwise unchanged by this requirement.

#### Scenario: Desktop viewport
- **WHEN** the homepage loads on a desktop viewport
- **THEN** the hero headline, description and Find a Service search are fully visible within the first screen below the navbar and InfoBar without scrolling, and the following section's heading becomes visible after a short natural scroll

#### Scenario: Hero is not a full-viewport marketing block
- **WHEN** the hero's computed height is compared to the viewport height
- **THEN** the hero is shorter than the full dynamic viewport height, and the page does not devote an entire screen to the hero

#### Scenario: Mobile dynamic viewport
- **WHEN** the mobile browser's address bar collapses or expands
- **THEN** the hero height adjusts without content being cut off or causing scroll jump

## ADDED Requirements

### Requirement: Hero content is not nested inside a floating container

The hero's search control SHALL be presented flush within the hero band — separated from the hero
background by a rule or a flat panel that does not itself appear to float as an inset card — and
the hero SHALL NOT overlay more than one readability treatment on the background video.

#### Scenario: No floating inset card in the hero
- **WHEN** the hero is rendered
- **THEN** the search control is not presented as a separately rounded, shadowed card floating inside the hero band

#### Scenario: Single readability treatment
- **WHEN** the hero overlays readability treatments on the background video
- **THEN** at most one such overlay is present, and the hero text still meets WCAG AA contrast against it
