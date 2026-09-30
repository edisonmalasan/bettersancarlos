# Spec Delta

## MODIFIED Requirements

### Requirement: Parallel service data renders as scannable list rows
Where a page presents parallel service entries that carry structured metadata (such as the
responsible office, the fee, and the processing time), the system SHALL render them as
hairline-separated list rows in a single column rather than as a multi-column grid of
individually bordered cards, and SHALL render each entry's metadata as an ordered label/value
pair associated programmatically with its entry. Metadata SHALL be limited to values attested by a
canonical civic record or verified research document; a fee or processing time with no such source
SHALL be omitted rather than rendered (see `civic-data-surfacing`, "Directory facts are never
presented without a canonical source").

#### Scenario: Metadata is programmatically associated
- **WHEN** a service entry lists an attested office or other sourced fact
- **THEN** each label/value pair is exposed as a description-list term/definition pair within that entry, so assistive technology announces the metadata with its service rather than as loose text

#### Scenario: Unsourced fee or processing time is not rendered
- **WHEN** a service has no canonical or verified-research source for its fee or processing time
- **THEN** the row renders no fee or processing-time value, and the presentation component offers no prop through which one could be supplied

#### Scenario: Entries are not individually boxed
- **WHEN** a list of service entries is rendered
- **THEN** the entries are separated by rules within one surface and do not each carry their own surrounding border and shadow

#### Scenario: Narrow viewports need no re-layout
- **WHEN** the service list is viewed on a mobile viewport
- **THEN** the entries remain readable in one column without horizontal scrolling, and any metadata pairs wrap rather than truncate

#### Scenario: Directory lists emit valid list markup
- **WHEN** a page renders a set of service entries as list rows
- **THEN** every entry's list item is contained within a list element (`<ul>` or `<ol>`), and no orphaned list item is emitted directly inside a non-list container
