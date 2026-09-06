## Purpose

hero-media: defines the homepage hero as a full-viewport cinematic video experience — footage fills the section behind the existing hero content, with readability guaranteed by baked-in blur plus a brand scrim, and with performance-conscious fallbacks (poster, mobile, reduced motion).

infobar-collapse: defines the real-time info strip's scroll-driven collapse — it smoothly collapses upward on scroll-down and re-expands at the top, without layout jumps and without affecting the sticky navbar.

## ADDED Requirements

### Requirement: Hero fills the viewport height accounting for site chrome
The homepage hero section SHALL span the remaining viewport height below the sticky navbar and InfoBar (`min-h-[calc(100dvh-<chrome-height>)]` or equivalent dynamic-viewport calculation) so that the hero plus visible chrome compose one full screen and the next section becomes reachable after a natural scroll, with its content positioned within the visible area.

#### Scenario: Desktop viewport
- **WHEN** the homepage loads on a desktop viewport
- **THEN** the hero (video, scrim, content) fills the first screen below the navbar and InfoBar, and the next section becomes visible after a natural scroll

#### Scenario: Mobile dynamic viewport
- **WHEN** the mobile browser's address bar collapses or expands
- **THEN** the hero height adjusts via the dynamic viewport unit without content being cut off or causing scroll jump

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
