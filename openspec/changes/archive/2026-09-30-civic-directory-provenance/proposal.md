# Proposal

## Why

The `civic-ui-restraint` change converted service directory card grids into `ServiceEntry` list
rows. While reviewing that work, an audit of the metadata those rows introduced found a civic-data
integrity defect that is more serious than any visual issue:

**The `Office` / `Fee` / `Time` facts rendered on 11 service rows across
`/services/certificates`, `/services/education`, `/services/public-safety` and
`/services/social-services` are hardcoded string literals with no provenance anywhere.**

Verified evidence:

- `data/civic/records.json` holds 177 canonical records. Across every record and every key nested
  inside `.data`, there is **no** `fee`, `cost`, `time`, `duration`, or `processing` field.
- No verified research document (files prefixed `26-09-`, excluding `unverified-`) states a service
  fee or processing time for any of these services. Every `₱` figure in the verified corpus is a
  budget, appropriation, or infrastructure-project amount — never a citizen-facing service charge.
- Values such as `₱50-100`, `Same day`, `1-2 weeks` and `Varies` therefore have **no source
  instance, no verification status, and no review date**.

This directly violates two existing, already-merged requirements:

- `civic-data-surfacing` → *"duplicated hardcoded values in page files SHALL be removed where a
  JSON source exists"* and *"Unverified data is labeled, never presented as fact."*
- The original task mandate to **preserve data semantics and provenance.**

The values are also the highest-consequence facts on a civic portal: a resident deciding whether to
walk to a city office is being told a fee and a turnaround time that nothing substantiates. On a
transparency site this is the one class of defect that must not ship, and it shipped in the
previous change.

## What Changes

- **Remove all 11 unprovenanced `Fee` and `Time` facts** from the service directory rows. `Office`
  values are retained only where that office is attested in canonical data or verified research;
  otherwise the row renders title and description alone.
- **Retire the `meta` prop from `ServiceEntry`** so an unprovenanced fact cannot be reintroduced
  through a convenient prop. The `ServiceEntry` primitive returns to title + description +
  optional meaningful `status`.
- **Restore list semantics.** `/services/page.tsx` wraps `<li>`-producing `ServiceEntry` elements
  in a plain `<div>`, producing orphaned list items. Wrap the category directory in a `<ul>`.
- **Add a regression guard** so page files cannot silently reintroduce hardcoded civic fee/time
  claims.

Explicitly **not** in scope: adding fee/time fields to the civic-data pipeline. Fees and processing
times are genuine citizen needs, but sourcing them requires a research run through
`docs/data-pipeline.md` and reviewer promotion — it cannot be invented in a frontend change. This
change removes the unsourced claims and leaves the accurate path open.

## Capabilities

### New Capabilities
- `civic-fact-provenance-guard`: a repository check that rejects unsourced civic fee/time literals
  in page files, so presentation code cannot reintroduce claims the pipeline does not support.

### Modified Capabilities
- `civic-data-surfacing`: directory pages SHALL NOT render a fee, cost, or processing-time value
  that is not present in a canonical civic record; where no canonical value exists the field is
  omitted rather than hardcoded.
- `civic-composition`: `ServiceEntry` presents only attested facts, and directory lists SHALL emit
  valid list markup (`<li>` inside `<ul>`/`<ol>`).

## Impact

**In scope:** `src/components/layout/ServiceEntry.tsx`; `src/app/services/page.tsx`; the four
service category pages listed above; a new guard script wired into `package.json` and the
`verify`/CI path.

**Out of scope (untouched):** `data/civic/` and every data/research script and spec; the
`civic-data-pipeline` and `research-evidence` specs; visual tokens and layout primitives; all
other pages.

**Risk:** low, and strictly corrective. This removes published claims rather than adding any. No
schema, route, dependency, or layout change.
