## Purpose

infobar-collapse: defines the real-time info strip's scroll-driven collapse — it smoothly collapses upward on scroll-down and re-expands at the top, without layout jumps and without affecting the sticky navbar.

## ADDED Requirements

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

### Requirement: InfoBar presents as a compact centered strip
The InfoBar SHALL render as a slim, vertically-centered, horizontally-balanced information strip (compact padding, centered items, consistent gaps and separators) rather than a secondary header, while preserving readability.

#### Scenario: Visual proportions
- **WHEN** the InfoBar renders at any width
- **THEN** its items are vertically aligned on one line, horizontally centered as a balanced group, and the strip's height stays minimal relative to its text size
