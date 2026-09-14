## MODIFIED Requirements

### Requirement: Hero 3D logo asset
The hero SHALL render the San Carlos logo as a single self-contained 3D model served from `public/assets/models/san-carlos-logo-3d.glb`. There is intentionally no separate source file in the repository — the served file IS the asset. The served file MUST NOT exceed 30 MB. The 3D loader MUST support every extension the served file requires; no specific compression extension is mandated, and no decoder registration is required beyond what the file's own extensions demand. The asset MUST preserve the logo's visual identity (colors, materials, proportions, orientation) at hero viewing distance AND at close viewing range: it MUST NOT exhibit simplification artifacts (shading streaks, "scratch"-like sliver-triangle artifacts, faceting) beyond what the authored model shows.

#### Scenario: Optimized asset exists and is within budget
- **WHEN** the repository is built for production
- **THEN** `public/assets/models/san-carlos-logo-3d.glb` exists and is ≤ 30 MB as a single self-contained asset with no second copy required anywhere in the repository

#### Scenario: Close-range visual identity
- **WHEN** the served model is rendered, including close-up views of the ring, lettering, and rim at the idle-sway angle extremes
- **THEN** it shows no shading streaks, scratch-like artifacts, or faceting beyond the authored model, and colors, materials, proportions, and orientation match the city seal
