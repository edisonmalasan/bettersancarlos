## Purpose

Governs the San Carlos City history quiz so it is factually accurate, traceable to verified research, playable end-to-end, accessible, and consistent with the site's design system.

## ADDED Requirements

### Requirement: Quiz content is traceable to verified research
Every quiz question, option set, correct answer, and explanation SHALL be derived exclusively from `research/culture-history/26-09-history.md` and `research/culture-history/26-09-culture-heritage.md`, and each question SHALL carry a machine-readable source reference. Where research documents a conflict (1578 vs 1587 founding), the quiz SHALL use the research-documented primary value and MAY explain the conflict in the result summary.

#### Scenario: Question source audit
- **WHEN** any quiz question is inspected
- **THEN** it references the research file and the specific claim it tests, and no question contradicts the research corpus

#### Scenario: No invented facts
- **WHEN** the question bank is reviewed against the two research files
- **THEN** every fact (dates, names, events) appears in or is directly derived from the research files

### Requirement: Complete play loop
The quiz SHALL present multiple-choice questions (4 options), track score, show a progress indicator during play, and end with a result summary that shows the score, the correct answer for every question (including ones answered wrong), and a path to further reading (`/about`). Restarting the quiz SHALL work without a page reload.

#### Scenario: Full playthrough
- **WHEN** a user answers all questions
- **THEN** they see their score, per-question correctness with correct answers highlighted, and can restart cleanly

#### Scenario: Mobile playthrough
- **WHEN** the quiz is played at 375px width
- **THEN** all controls are reachable and legible without horizontal scroll

### Requirement: Accessibility and motion restraint
Quiz interactions SHALL be keyboard-operable (options as buttons/inputs with visible focus), announce question changes to assistive technology (aria-live), and honor `prefers-reduced-motion` (transitions collapse to instant or opacity-only). Animations SHALL be limited to question transitions and result reveal, each ≤400ms, transform/opacity only, with cleanup on unmount.

#### Scenario: Keyboard playthrough
- **WHEN** a keyboard user plays the quiz
- **THEN** they can select answers, advance, and restart without a pointer, with visible focus states

#### Scenario: Reduced motion
- **WHEN** the OS reports prefers-reduced-motion
- **THEN** question transitions play without movement (opacity-only or instant)

### Requirement: Design-system consistency and bundle discipline
The quiz SHALL use the shared PageHeader, token utilities, radius/timing locks from the visual-design-system spec, and live at `/quiz` linked from `/sitemap` and at least one related page. GSAP SHALL be imported only inside the quiz client component (dynamically imported) so no other route's bundle grows.

#### Scenario: Bundle isolation
- **WHEN** any page other than `/quiz` is built
- **THEN** its first-load JS is unchanged from before this change

#### Scenario: Route discoverable
- **WHEN** a user looks for the quiz
- **THEN** `/quiz` is linked from the sitemap and from `/about` (or the homepage history section)
