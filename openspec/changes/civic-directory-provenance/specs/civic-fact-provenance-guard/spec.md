# Spec Delta

## Purpose

Governs the provenance bar for civic facts rendered by the frontend, and adds a repository check
that prevents presentation code from reintroducing citizen-facing claims the civic-data pipeline
does not support.

## ADDED Requirements

### Requirement: Page files may not hardcode unsourced civic fee or processing-time claims

No page or component file under `src/` SHALL contain a hardcoded civic fee, cost, or
processing-time claim. A check run over the source tree SHALL fail when a page file declares a
`Fee`, `Cost`, `Processing time`, or `Turnaround` value that is not sourced from a canonical civic
record or verified research document.

#### Scenario: Unsourced fee literal fails the check

- **WHEN** a page file is introduced that hardcodes a fee value such as `₱50-100` or `Free` in a
  `Fee` / `Cost` field
- **THEN** the provenance check fails and names the offending file and line

#### Scenario: Unsourced processing time fails the check

- **WHEN** a page file is introduced that hardcodes a processing-time value such as `Same day` or
  `1-2 weeks` in a `Time` / `Processing time` / `Turnaround` field
- **THEN** the provenance check fails and names the offending file and line

#### Scenario: Sourced values remain allowed

- **WHEN** a fee or processing time is rendered from a canonical civic record or a verified
  research document rather than a page-file literal
- **THEN** the provenance check passes

#### Scenario: Check runs in verification

- **WHEN** the repository's verification or CI path runs
- **THEN** the provenance check executes and a failure blocks the change
