## MODIFIED Requirements

### Requirement: Hero 3D logo asset
The hero SHALL render the San Carlos logo as a 3D model served from `public/assets/models/san-carlos-logo-3d.glb`. The served file MUST be a web-optimized derivative of the source asset at `assets/images/logo/san-carlos-logo-3d.glb` (which MUST NOT be modified) and MUST NOT exceed 3 MB. The derivative MAY use KHR_mesh_quantization or EXT_meshopt_compression for compression; when EXT_meshopt_compression is used, the 3D loader MUST register a meshopt decoder so the model renders correctly. The derivative MUST preserve the logo's visual identity (colors, materials, proportions, orientation) at hero viewing distance AND at close viewing range: it MUST NOT exhibit simplification artifacts (shading streaks, "scratch"-like sliver-triangle artifacts, faceting) that the source model does not show.

#### Scenario: Optimized asset exists and is within budget
- **WHEN** the repository is built for production
- **THEN** `public/assets/models/san-carlos-logo-3d.glb` exists, is ≤ 3 MB, is byte-derived from the source GLB via lossless-ish optimization (simplify/quantize/meshopt), and the source file is unchanged

#### Scenario: Close-range visual identity
- **WHEN** the derivative and the original source model are rendered side-by-side with identical camera, lighting, and tone mapping, including close-up views of the ring, lettering, and rim at the idle-sway angle extremes
- **THEN** the derivative shows no shading streaks, scratch-like artifacts, or faceting that the source does not show, and colors, materials, proportions, and orientation match
