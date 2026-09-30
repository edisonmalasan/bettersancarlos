# Design

## Context

`civic-ui-restraint` (merged) replaced service card grids with `ServiceEntry` list rows. The rows
accept a `meta` prop that page files populate with `Office` / `Fee` / `Time` literals. An audit of
those literals found no source anywhere in the repository.

**Evidence gathered:**

| Question | Method | Result |
| --- | --- | --- |
| Do canonical records carry fees/times? | Enumerated all keys in all 177 records in `data/civic/records.json`, including nested `.data` | No `fee` / `cost` / `time` / `duration` / `processing` key exists |
| Does verified research document them? | Searched `research/**` excluding `unverified-` for `₱` and fee language | Every peso figure is a budget, appropriation, or infrastructure amount; none is a service charge |
| Are the values plausible? | Read the 11 call sites | `₱50-100`, `Same day`, `1-2 weeks`, `Varies` — plausible but wholly unattested |

`civic-data-surfacing` already requires that hardcoded page-file values be removed where a JSON
source exists, and that unverified data never be presented as fact. Both are violated. A resident
reading `Fee: ₱50-100` has no way to know it is unverified, so the site currently misinforms.

## Goals / Non-Goals

**Goals**
- Remove every unsourced fee and processing-time claim from rendered output.
- Remove the prop that made such claims convenient, so the regression cannot silently return.
- Restore valid list semantics in the category directory.
- Add an automated guard that fails loudly if page files reintroduce such claims.

**Non-Goals**
- Sourcing real fees and processing times. That requires a research run and reviewer promotion
  through `docs/data-pipeline.md`; inventing values in a frontend change would repeat the defect.
- Adding fee/time fields to the civic-data schema or the `ServiceEntry` API for future use.
- Any visual change. The row layout, spacing, and type treatment are untouched.

## Decisions

### Decision 1: Remove the claims rather than label them

**Alternatives considered:** (a) remove the values; (b) keep them with a "verify" notice;
(c) source real values now.

We choose (a). Option (c) is not available — no source exists. Option (b) was seriously considered
because the existing `civic-data-surfacing` requirement permits labeling unverified data, and it
would preserve information. It is rejected because a fee is a decision input: a resident shown
`Fee: ₱50-100 (unverified)` may still budget against it, and a wrong peso amount on a city portal
is the highest-consequence unverified claim the site can make. Omitting the field is the honest
representation of "we do not have a verified figure". The information is not lost — the rows still
link to the service detail page, and the directory's own note text points residents to the Citizen's
Charter for authoritative fees.

### Decision 2: Delete the `meta` prop instead of just its call sites

Removing only the 11 literals would leave the prop in place, and the next contributor would refill
it. The prop is deleted from `ServiceEntry`, along with the `ServiceEntryMeta` interface and the
`<dl>` rendering block. The `status` prop stays, because it carries provenance meaning
(`Verified`) rather than an unsourced numeric claim.

**Trade-off:** the component can no longer render any sourced metadata. If a future data run
produces attested fees, the `<dl>` rendering is reinstated then, driven by canonical data — which
is the point: the primitive should not be able to express a fact the pipeline cannot back.

### Decision 3: Guard pattern is a literal scan, not a dataflow analysis

The guard (`scripts/validate-fact-provenance.ts`) scans `src/**` for object properties whose key
matches `/^(fee|cost|processing\s*time|turnaround)/i` and whose value is a string literal. It fails
with file and line.

- **Why a scan and not a build-time type constraint:** TypeScript cannot express "this string must
  appear in `records.json`", and a lint rule would need the same textual approximation. A scan is
  honest about its own limits and runs in ~50ms.
- **Known limitation:** a value assembled at runtime (template literal, concatenation, imported
  constant) evades the scan. This is acceptable because the pipeline's own promotion review is the
  real control; the guard catches the common and most damaging case — a literal typed into a page.
- The guard is wired into the `verify` script and therefore into CI, so it blocks merges.

### Decision 4: Category directory gets a real `<ul>`

`/services/page.tsx` maps `CATEGORIES` to `ServiceEntry` inside a `<div>`, so each row's `<li>` is an
orphan. The fix is to make that wrapper a `<ul>` with the same reset classes the category pages
already use (`m-0 list-none p-0 border-t border-line`), which is visually identical and structurally
valid. Verified against the other five adopters, which already use `<ul>` correctly.

## Risks / Trade-offs

- **Information loss:** residents lose fee/turnaround hints on four category pages. Mitigated by
  the Citizen's Charter pointer already present in the directory copy. Tracked as a real gap, not
  dismissed — the correct fix is a research run, tracked separately.
- **Guard false negatives:** see Decision 3. Accepted with the stated limitation.
- **Guard false positives:** a page legitimately rendering a *sourced* fee as a literal would be
  flagged. Acceptable — sourced values should be read from the record, per `civic-data-surfacing`
  "One canonical data source per fact".

## Migration Plan

Single PR: delete the `meta` prop and its 11 call sites, add the `<ul>` wrapper, add the guard
script, wire it into `verify`. No data or schema migration. Rollback is a single revert.

## Open Questions

- Should the guard also cover `src/app/service-details/**`, where per-service fee text may be
  authored? Deferred: those pages were not changed here, and broadening the guard risks unrelated
  churn. Worth a follow-up audit.
