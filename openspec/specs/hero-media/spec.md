# hero-media Specification

## Purpose

Defines the homepage hero as a restrained cinematic band — footage fills the section behind the existing hero content, with readability guaranteed by baked-in blur plus a brand scrim, and with performance-conscious fallbacks (poster, mobile, reduced motion). The band is deliberately shorter than a full viewport so that the service directory is reachable with a short scroll rather than a full-screen marketing interlude.

## Requirements

### Requirement: Hero fills the viewport height accounting for site chrome
The homepage hero section SHALL occupy a restrained band that accounts for the sticky navbar and InfoBar, sized so that the hero and its primary content (headline, description and the Find a Service search) fit within the first screen at common desktop and mobile viewports, while leaving the following content section's heading reachable with a short, natural scroll. The hero SHALL NOT be a full-viewport (`100dvh`) marketing composition. The video background, the readability scrim, the 3D logo column, the search card and all hero behaviour are otherwise unchanged by this requirement.

#### Scenario: Primary content fits the first screen
- **WHEN** the homepage loads on a desktop viewport
- **THEN** the hero headline, description and Find a Service search are fully visible within the first screen without scrolling, and the following section's heading becomes visible after a short natural scroll

#### Scenario: Hero is not a full-viewport marketing block
- **WHEN** the hero's computed height is compared to the viewport height
- **THEN** the hero is shorter than the full dynamic viewport height, and the page does not devote an entire screen to the hero

#### Scenario: Mobile dynamic viewport
- **WHEN** the mobile browser's address bar collapses or expands
- **THEN** the hero height adjusts without content being cut off or causing scroll jump

### Requirement: Hero content is not nested inside a floating container
The hero's search control SHALL be presented flush within the hero band — separated from the hero background by a rule or a flat panel that does not itself appear to float as an inset card — and the hero SHALL NOT overlay more than one readability treatment on the background video.

#### Scenario: No floating inset card in the hero
- **WHEN** the hero is rendered
- **THEN** the search control is not presented as a separately rounded, shadowed card floating inside the hero band

#### Scenario: Single readability treatment
- **WHEN** the hero overlays readability treatments on the background video
- **THEN** at most one such overlay is present, and the hero text still meets WCAG AA contrast against it

### Requirement: Video background fills the hero with readability treatment
The hero SHALL render `hero-bettersc.mp4` as an absolutely positioned background covering the full hero area (`object-cover`), with a SUBTLE baked-in blur that keeps the footage recognizable, and a layered readability treatment (a directional dark gradient densest behind the text content plus a light brand-color tint) sufficient for WCAG AA contrast of the hero's white text and buttons — the treatment SHALL NOT reduce the footage to an unreadable solid wash — and the existing hero content SHALL render above it with unchanged functionality.

#### Scenario: Text readability over footage
- **WHEN** the hero renders over any frame of the video
- **THEN** the headline, subtitle, CTAs, and search card meet WCAG AA contrast against the scrim composite

#### Scenario: Footage remains visible
- **WHEN** the hero renders with its readability treatments
- **THEN** the video footage is clearly recognizable as moving imagery (not a flat color wash), preserving the cinematic intent

#### Scenario: Hero functionality unchanged
- **WHEN** a user interacts with the hero search card, CTAs, or popular links
- **THEN** behavior is identical to the current hero (video is decorative, `aria-hidden`, non-interactive)

### Requirement: Harmonized transition to the next section
The hero SHALL include a bottom gradient hand-off from the hero treatment into the next section's surface tone so the two sections read as coordinated rather than stacked.

#### Scenario: Scroll from hero to next section
- **WHEN** the user scrolls from the hero into the next section
- **THEN** the transition passes through a gradual fade rather than a hard edge

### Requirement: Video autoplays muted, loops, and plays inline
The background video SHALL render with `autoPlay`, `muted`, `loop`, and `playsInline` attributes so it autoplays across browsers without user gesture, and SHALL NOT include an audio track.

#### Scenario: Autoplay without gesture
- **WHEN** the homepage loads in a standard browser
- **THEN** the video plays automatically with no sound and no play controls

### Requirement: Performance-conscious delivery with poster and mobile fallback
The system SHALL ship an optimized video (muted, no audio track, faststart, target under ~6 MB) plus a poster image extracted from the footage, and SHALL load the video only on viewports ≥768px, using the poster image as the hero background below that breakpoint, and the poster SHALL be the LCP asset (`fetchpriority="high"`, `preload`).

#### Scenario: Mobile data savings
- **WHEN** the homepage loads at a viewport below 768px
- **THEN** no video bytes are downloaded and the poster image renders as the hero background (with scrim and content unchanged)

#### Scenario: Fast first paint on desktop
- **WHEN** the homepage loads on desktop
- **THEN** the poster image renders immediately (preloaded, high fetch priority) and the video swaps in when ready without layout shift

### Requirement: Reduced motion falls back to poster
Under `prefers-reduced-motion: reduce`, the system SHALL render the poster image instead of playing the video, and the InfoBar collapse SHALL apply instantly without animation.

#### Scenario: Reduced motion user
- **WHEN** the OS reports `prefers-reduced-motion: reduce`
- **THEN** the hero shows a static poster background and the InfoBar collapses without animation
