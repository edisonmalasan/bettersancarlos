# hero-logo Specification

## Purpose

Governs the homepage hero's right-column 3D San Carlos logo: which asset is served, how it is framed and animated, how it degrades (reduced motion, no WebGL), and the performance and accessibility constraints that keep the homepage fast and the search form unaffected.

## Requirements

### Requirement: Hero 3D logo asset
The hero SHALL render the San Carlos logo as a 3D model served from `public/assets/models/san-carlos-logo-3d.glb`. The served file MUST be a web-optimized derivative of the source asset at `assets/images/logo/san-carlos-logo-3d.glb` (which MUST NOT be modified) and MUST NOT exceed 3 MB. The derivative MUST preserve the logo's visual identity (colors, materials, proportions, orientation).

#### Scenario: Optimized asset exists and is within budget
- **WHEN** the repository is built for production
- **THEN** `public/assets/models/san-carlos-logo-3d.glb` exists, is ≤ 3 MB, and is byte-derived from the source GLB via lossless-ish optimization (simplify/quantize), with the source file unchanged

### Requirement: Hero 3D logo renders centered in the right hero column
The hero's right column SHALL display the 3D logo in a transparent-background rendering, horizontally and vertically centered within the column, fully visible (not cropped), proportional (no stretching), with breathing room, and not overlapping the hero text or the search card at any viewport width from 320px up.

#### Scenario: Desktop two-column composition
- **WHEN** the homepage is viewed at a desktop viewport (> 992px)
- **THEN** the hero shows a two-column layout with hero content + search card on the left and the 3D logo centered in the right column, with no overlap between the logo and any text or card

#### Scenario: Logo fits without cropping
- **WHEN** the 3D logo is rendered at any supported viewport width
- **THEN** the entire logo is visible within its canvas area, maintains its original aspect ratio, and has visible margin between the model bounds and the canvas edges

### Requirement: Subtle idle animation
The 3D logo SHALL animate with a slow, eased Y-axis oscillation around the front-facing orientation (amplitude within ±20°–±35°, one full cycle taking at least 8 seconds) plus a subtle vertical float. The animation MUST NOT be a full 360° rotation, MUST NOT spin rapidly, and MUST feel appropriate for an official government website. Exact amplitude and period MAY be tuned during apply to visually fit the asset, staying within these bounds.

#### Scenario: Idle motion is present and subtle
- **WHEN** the hero is idle on a desktop viewport with motion allowed
- **THEN** the logo slowly sways around its front-facing orientation within the specified amplitude bounds and gently floats vertically, with smooth continuous motion and no abrupt direction changes

#### Scenario: Oscillation never presents the logo edge-on
- **WHEN** the idle oscillation runs through a full cycle
- **THEN** the logo's front face remains the dominant visible orientation (the plate is never seen edge-on or from behind at a grazing angle that would make it unreadable)

### Requirement: Pointer parallax interaction
On devices with a fine pointer (mouse), the 3D logo MAY tilt subtly (a few degrees) toward the cursor position within the hero area, eased, and SHALL return to the idle orientation when the pointer leaves. The interaction MUST be restrained (no game-like behavior) and MUST NOT be required for any functionality. Touch-only devices MUST NOT require pointer interaction for correct display.

#### Scenario: Pointer moves over the hero
- **WHEN** a mouse pointer moves across the hero on a desktop device
- **THEN** the logo tilts by a small amount toward the pointer, the tilt transitions smoothly (eased, no snapping), and the logo eases back to its idle orientation when the pointer leaves the hero area

#### Scenario: Touch device unaffected
- **WHEN** the hero is used on a touch-only device
- **THEN** the logo displays and animates normally without any pointer-driven behavior, and scrolling is not obstructed

### Requirement: Reduced motion renders the logo static
Under `prefers-reduced-motion: reduce`, the 3D logo SHALL render in a static state: no idle rotation, no floating, no pointer-driven motion. The logo remains visible and correctly framed.

#### Scenario: Reduced-motion preference honored
- **WHEN** the user's OS is set to `prefers-reduced-motion: reduce` and the page loads
- **THEN** the 3D logo renders in its front-facing orientation without any continuous or pointer-driven animation

### Requirement: Graceful fallback when 3D is unavailable
If the 3D renderer cannot initialize (WebGL unavailable/context creation fails) or the model asset fails to load, the hero SHALL fall back to displaying the existing static logo image (`better-san-carlos-logo-white.png`) in the same right-column position, centered and scaled appropriately. The fallback MUST NOT affect the hero layout or the search card.

#### Scenario: WebGL unavailable
- **WHEN** the page is viewed in a browser context where WebGL cannot initialize or the model fails to load
- **THEN** a static logo image is shown in the right column instead, centered and correctly scaled, with no layout shift to the rest of the hero

### Requirement: Decorative status and accessibility
The 3D logo rendering SHALL be decorative: it MUST NOT be keyboard-focusable, MUST NOT be exposed as an interactive control, and MUST NOT alter the accessibility of the search form. Assistive technology users MUST NOT encounter an unlabeled interactive canvas.

#### Scenario: Keyboard and assistive technology bypass
- **WHEN** a keyboard user tabs through the hero
- **THEN** focus moves through the search form controls and popular links only, and the 3D logo canvas is not focusable and exposes no interactive semantics

### Requirement: Performance constraints
The 3D logo rendering MUST NOT degrade homepage load performance: 3D runtime code MUST be excluded from the critical bundle (loaded lazily after first paint), the render loop MUST use an efficient frame loop with proper cleanup on unmount, device pixel ratio MUST be limited (≤ 2), no post-processing effects MUST be added, lighting MUST be minimal, and the animation loop MUST stop when the page is hidden or the hero is unmounted.

#### Scenario: Lazy loading keeps critical path clean
- **WHEN** the homepage first paints
- **THEN** the initial JS bundle does not include the 3D runtime; it is fetched and initialized afterward without blocking first paint or the hero content

#### Scenario: Resources cleaned up
- **WHEN** the hero is unmounted or the page is navigated away
- **THEN** the WebGL renderer, geometries, materials, and animation frame loop are disposed/cancelled with no leaked per-frame callbacks

### Requirement: Responsive hero composition
The hero SHALL maintain the responsive behavior across viewports: desktop (> 992px) uses the two-column composition (left: eyebrow/heading/description/search card; right: 3D logo); at tablet widths columns adjust without cramping the search controls or shrinking the logo to unusability; on mobile (≤ 767px) the layout stacks in reading order (hero content, then search card, then 3D logo), with the logo scaled down, never overflowing horizontally, never creating excessive vertical height, and never interfering with scrolling. The search card MUST remain easy to use at every width.

#### Scenario: Mobile stacked layout order
- **WHEN** the homepage is viewed at a mobile viewport (≤ 767px)
- **THEN** the hero stacks in the order: hero content, Find a Service card, 3D logo; the search input and submit button remain comfortably usable; the logo scales down without horizontal overflow or scroll interference

#### Scenario: Tablet intermediate widths
- **WHEN** the homepage is viewed at a tablet viewport (768px–992px)
- **THEN** the search card remains usable (not cramped) and the logo remains reasonably sized, with no text/model collisions

### Requirement: Search card relocation preserves behavior
The Find a Service card SHALL appear directly beneath the hero description in the left column, replacing the removed CTA row's position in the reading flow. All existing search behavior MUST be preserved unchanged: submission, autocomplete, routing/navigation, keyboard behavior, accessibility attributes, popular service links (Birth Certificate, Business Permit, Real Property Tax), and service data integration. The search component's implementation MUST NOT be duplicated or re-implemented.

#### Scenario: Search card position and function preserved
- **WHEN** the hero renders on any viewport
- **THEN** the Find a Service card sits directly under the hero description with no CTA buttons between or around it, and typing, autocomplete, keyboard navigation, submission, and the popular links all behave exactly as before the change

#### Scenario: CTA row removed without dead markup
- **WHEN** the hero markup is inspected after the change
- **THEN** no `Browse Services` or `Contact Us` links exist in the hero, and no leftover empty wrappers or spacing from the removed CTA row remain
