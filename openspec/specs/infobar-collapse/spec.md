# infobar-collapse Specification

## Purpose

Defines the real-time info strip's scroll-driven collapse — it smoothly collapses upward on scroll-down and re-expands at the top, without layout jumps and without affecting the sticky navbar.

## Requirements

### Requirement: InfoBar collapses on scroll and re-expands at top
The InfoBar SHALL collapse smoothly upward (to zero height) when the user scrolls down past a small threshold, SHALL re-expand smoothly when the user returns to the top, SHALL animate only transform/height properties without layout jump, and SHALL NOT affect the sticky navbar or shift it.

#### Scenario: Scroll down
- **WHEN** the user scrolls down past the collapse threshold
- **THEN** the InfoBar smoothly collapses to zero height while the navbar stays fixed and unchanged

#### Scenario: Scroll back to top
- **WHEN** the user scrolls back to the top of the page
- **THEN** the InfoBar smoothly re-expands to its full height

#### Scenario: No layout jump
- **WHEN** the collapse or expand animates
- **THEN** the navbar position stays fixed and the content below moves smoothly without visible jump or flicker

#### Scenario: Reduced motion
- **WHEN** the OS reports `prefers-reduced-motion: reduce`
- **THEN** the InfoBar collapses and expands instantly without animation

### Requirement: InfoBar presents as a compact right-aligned strip
The InfoBar SHALL render as a slim, vertically-centered information strip (compact padding, single-line items, consistent gaps and separators) rather than a secondary header, with its items right-aligned on desktop widths (the original site layout) and centered on tablet/mobile widths, while preserving readability.

#### Scenario: Visual proportions
- **WHEN** the InfoBar renders on a desktop viewport (>1024px)
- **THEN** its items are vertically aligned on one line and right-aligned as a group, and the strip's height stays minimal relative to its text size (~26px)

#### Scenario: Compact widths
- **WHEN** the InfoBar renders at tablet or mobile widths (≤1024px)
- **THEN** its items remain on one line, horizontally centered, with tightened gaps

#### Scenario: Live data
- **WHEN** the page has hydrated in the browser
- **THEN** the USD→PHP exchange rate, San Carlos temperature, and Philippine date/time populate from their live client-side sources, and PHT remains visible
