## Purpose

hero-media: defines the homepage hero as a full-viewport cinematic video experience — footage fills the section behind the existing hero content, with readability guaranteed by baked-in blur plus a brand scrim, and with performance-conscious fallbacks (poster, mobile, reduced motion).

infobar-collapse: defines the real-time info strip's scroll-driven collapse — it smoothly collapses upward on scroll-down and re-expands at the top, without layout jumps and without affecting the sticky navbar.

## ADDED Requirements

### Requirement: Hero fills the viewport height
The homepage hero section SHALL span at least the full viewport height (`min-h-[100dvh]` or equivalent dynamic-viewport unit) with its content positioned within the visible area, accounting for the sticky navbar above it.

#### Scenario: Desktop viewport
- **WHEN** the homepage loads on a desktop viewport
- **THEN** the hero section (video, scrim, content) fills the entire first screen and the Popular Services section begins below the fold

#### Scenario: Mobile dynamic viewport
- **WHEN** the mobile browser's address bar collapses or expands
- **THEN** the hero height adjusts via the dynamic viewport unit without content being cut off or causing scroll jump

### Requirement: Video background fills the hero with readability treatment
The hero SHALL render `hero-bettersc.mp4` as an absolutely positioned background covering the full hero area (`object-cover`), with a baked-in blur applied to the footage and a brand-colored scrim overlay sufficient for WCAG AA contrast of the hero's white text and buttons, and the existing hero content SHALL render above it with unchanged functionality.

#### Scenario: Text readability over footage
- **WHEN** the hero renders over any frame of the video
- **THEN** the headline, subtitle, CTAs, and search card meet WCAG AA contrast against the scrim composite

#### Scenario: Hero functionality unchanged
- **WHEN** a user interacts with the hero search card, CTAs, or popular links
- **THEN** behavior is identical to the current hero (video is decorative, `aria-hidden`, non-interactive)

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
