# Spec Delta

## ADDED Requirements

### Requirement: Directory facts are never presented without a canonical source

A page SHALL NOT render a citizen-facing fee, cost, or processing-time value for a service unless
that value is present in a canonical civic record or a verified research document. Where no such
source exists, the field SHALL be omitted from the page entirely rather than filled with a
hardcoded literal, an estimate, or a placeholder. A presentation component SHALL NOT expose a
convenience prop through which an unsourced fee or processing-time string can be supplied.

#### Scenario: Unsourced fee is omitted, not estimated

- **WHEN** a service directory page is rendered for a service that has no canonical fee record
- **THEN** no fee value appears on the page, and no estimated or placeholder amount is shown in its place

#### Scenario: Unsourced processing time is omitted, not estimated

- **WHEN** a service directory page is rendered for a service that has no canonical processing-time record
- **THEN** no turnaround estimate appears on the page

#### Scenario: No convenience prop for unsourced facts

- **WHEN** a shared directory component is inspected
- **THEN** it offers no prop that accepts a fee, cost or processing-time string for a page to fill in

#### Scenario: Sourced values still render

- **WHEN** a canonical civic record supplies an attested fact for a service
- **THEN** the page MAY render that value, and it SHALL be traceable to the record

### Requirement: Retired unsourced claims are removed from the published site

Any fee, cost, or processing-time value previously published from a page-file literal, and having
no canonical or verified-research source, SHALL be removed from the rendered output of every page
that displayed it.

#### Scenario: Previously published estimate no longer renders

- **WHEN** a service directory page that previously displayed a hardcoded fee or turnaround value is
  built
- **THEN** that value is absent from the generated HTML output
