## ADDED Requirements

### Requirement: Generation fails loudly on unresolvable source references
Generation SHALL resolve every source label from exact `sources.json` records. A canonical record whose `sourceIds` do not resolve SHALL fail generation with an error naming the record, instead of rendering a raw unresolved ID into a shipped file.

#### Scenario: Dangling source reference stops generation
- **WHEN** `data:generate` encounters a canonical record citing an unknown source ID
- **THEN** it exits non-zero naming the record, and no mirror location is left partially written
