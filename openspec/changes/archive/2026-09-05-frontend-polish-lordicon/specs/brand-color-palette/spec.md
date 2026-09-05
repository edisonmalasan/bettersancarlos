## MODIFIED Requirements

### Requirement: No legacy brand hexes remain
After the rebrand, the source tree SHALL contain no occurrences of the legacy brand hexes (`#0032a0`, `#003d82`, `#002170`, `#f77f00`, `#0044cc`) or the stray rebrand remnants (`#003399`, `#00184d`, `#0066cc`, `#0066a0`) outside of changelog/documentation files.

#### Scenario: Repo-wide legacy hex audit
- **WHEN** the source directories (`src/`) are searched for the legacy brand hexes and stray rebrand remnants
- **THEN** zero matches are found
