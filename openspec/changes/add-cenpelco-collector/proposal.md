## Why

`cenpelco` is the next roadmap collector after the archived PSA implementation (`docs/data-pipeline.md` item 8): CENPELCO is the confirmed electricity distributor for San Carlos City, yet every CENPELCO fact on the site today is hand-maintained with phones, emails, and addresses explicitly unverified. A narrow collector that watches what the public website actually publishes — provider presence and the area-office list including San Carlos City (Main) — gives the pipeline its first utilities-domain signal without inventing a single contact. Proposal-stage probing (2026-09-16) confirms the homepage shell is publicly fetchable over plain HTTP with all 15 branch links (slugs + names) in server-returned HTML, no auth, no CAPTCHA, no JS rendering needed.

## What Changes

- Add a deterministic `cenpelco` collector (`scripts/data/collectors/cenpelco.ts`) implementing the existing `Collector` contract over one evidence blob: the registry homepage shell. It emits provisional candidates for two stable new IDs — `utility-electricity-provider` (identity + serves-San-Carlos presence) and `cenpelco-area-offices` (15 offices as `{id, name}` from gallery slugs/texts, sorted by slug so presentation reorder never diffs) — with exact `buildSourceInstance` provenance and fact-level coverage of exactly those IDs.
- Register it in `COLLECTORS` and assign `collector: cenpelco` to the existing `cenpelco` entry; preserve quarterly cadence, medium tier, utilities domain, and URL; rewrite `accessNotes` to state the collector watches provider/office presence only.
- Resolve the readiness audit as collector-only + manual-surfacing: zero canonical `utilities` records exist and `generate.ts` has no utilities emitter, so this change creates no canonical records and no generator output — candidates surface as `NEW` for future review/promotion, and `data/utilities.json` stays manual (no fragile hybrid).
- Evaluate-but-defer newly observed contact/GM content: the live `contactUs.jsp` now lists a main-office trunk (532-2222), department extensions, and 13 sub-area numbers (none for San Carlos), and `GeneralManager.jsp` names Engr. Rodrigo F. Corpuz — all first seen 2026-09-16, twelve days after research recorded contacts as absent. v1 covers none of them (no stability history, missing area codes, non-dialable locals, identity unconfirmed); each is documented for a separately scoped follow-up with its own research update.
- Enforce the PSA-established fail-closed contract: missing gallery anchor, duplicate slugs, malformed rows, or ambiguous San Carlos identity throw `parse:` → `SOURCE_CHANGED`; unpublished contacts never become candidates, coverage, or `MISSING`.

## Capabilities

### New Capabilities

- None. This change implements the already-specified source-specific collector behavior for one registered source; it introduces no new architectural capability.

### Modified Capabilities

- `civic-data-pipeline`: extend source-specific collection, provenance, coverage, failure-semantics, and cadence requirements to the CENPELCO public website (deterministic office-list parsing, San Carlos Main identity guard, order-normalized composites, contacts explicitly outside coverage, fail-closed drift, quarterly `--due` eligibility with retry, research-only scheduled collection).

## Impact

- Code: one new collector module + dispatcher entry; minimal registry YAML edit; one sanitized HTML fixture; test additions under existing `scripts/data/` conventions; docs roadmap update. No `generate.ts`, frontend, research-rewrite, or canonical-data changes.
- Pipeline behavior: `bun run data:refresh -- --source=cenpelco` starts producing real runs (first runs diff `NEW` + `NEW`); quarterly `--due` may select it when due (intended, research-only, stops before promotion).
- Non-goals (explicit): no contact/email/GM/hours/address collection; no rate/tariff, outage, billing-portal, or Facebook work; no water/telecom/cable/sewage modeling; no utilities.json migration; no second collector; no pipeline/research/frontend redesign; no fuzzy municipality matching; no crawlers; no live-network tests.
