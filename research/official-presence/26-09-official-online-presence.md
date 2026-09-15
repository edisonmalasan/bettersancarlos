---
schema: research.v2
id: official-online-presence
title: Official Online Presence
category: official-presence
research_type: directory
verification_status: verified
temporal_status: current
risk: low
researched_at: 2026-09-04
last_checked: 2026-09-04
canonical_domains:
  - government
---

# San Carlos City, Pangasinan — Official Online Presence

## Scope

Official and related online channels of San Carlos City, Pangasinan: live domains and accounts, decommissioned domains, unverified presences, and technical notes on the current site.

## Summary

The current official site is live (single-page app); the old WordPress domain is decommissioned; Instagram/Twitter links are generic homepages, not city accounts; the SB legislation subdomain was unreachable.

## Findings

### Directory

| ID | Entity | Detail | Verification | Temporal | As of | Sources |
|---|---|---|---|---|---|---|
| channel-website | Official website (current) | https://sancarlospangasinan.gov.ph — single-page site on Hostinger/Zyro architecture | verified | current | 2026-09-04 | S1 |
| channel-facebook-cio | Official Facebook — City Information Office | https://www.facebook.com/sccp.cio — live, linked from official site | verified | current | 2026-09-04 | S1, S4 |
| channel-ebpls | eBPLS (Business permit online) | https://prod4.ebpls.com/sancarlospangasinan/index.php — live, linked from official site | verified | current | 2026-09-04 | S1, S3 |
| channel-gov-links | Offsite gov.ph links (Official Gazette, Congress, Judiciary, OVP, etc.) | via official site's "Government Links" — standard gov map | verified | current | 2026-09-04 | S1 |
| channel-old-site | Original official city website (WordPress, c. 2016–2020) | sancarloscitypangasinan.gov.ph — "Mango and Bamboo Capital of the Philippines" branding; hosted History, City Profile, Officials, Barangays, E-services, Tourism, Contact, News | verified | historical | 2020 | S2 |
| channel-old-site-https | Old domain over https | No longer resolves (DNS error, 2026-09-04) | verified | historical | 2026-09-04 | — |
| channel-www-variants | sancarlospangasinan.gov.ph variants | The "www" subdomain and root both serve the single-page app | verified | current | 2026-09-04 | S1 |

### Other Online Presence (to Verify)

- **Instagram/Twitter links** on the current official site point to generic homepages (`instagram.com`, `twitter.com`) — **not** city-specific accounts; do not treat as official accounts.
- **Sangguniang Bayan subdomain** (`sangguniangbayan.sancarlospangasinan.gov.ph`) — documented in project README as the legislation portal but **unreachable during this research** (connection failed). Needs follow-up.
- HON. Officials' pages on the current site render the same single-page template; no separate subdomains.

### About the Current Official Website

- Built on **Hostinger Website Builder (Zyro)** → serving an **Astro** static app with Vue islands; all routes under the same shell return the homepage SDK content (observed behavior).
- It exposes limited content: Home, virtual pages (City Profile, History, Governance, Transparency, Projects, Bids, News), and forms.
- `robots.txt` route returns the SPA shell (no robots directives seen).

## Verification & Uncertainty

- Social links on the official site are generic homepages, not city accounts.
- SB legislation subdomain needs follow-up (connection failed).

## Conflicts

None identified.

## Gaps

- SB subdomain legislation portal (follow-up).
- Department email addresses beyond CIO/CMO (not found).

## Notes

- **Implication for Better San Carlos:** the LGU's own site lacks a REST API or open-data feed. Collection relies on (a) the City Info Office Facebook, (b) archived snapshots, and (c) direct FOI/requests to the City Information Office.
- Official email addresses recorded: CIO@sancarlospangasinan.com and CMO@sancarlospangasinan.com (published on official site). All other email addresses for departments were not found.
- The Facebook page's exact handle (facebook.com/sccp.cio) is crowd-verifiable; the CIO posts election proclamations there.

## Sources

| ID | Publisher | Document | Published | Accessed | Type | URL |
|---|---|---|---|---|---|---|
| S1 | City Government of San Carlos | Official website | — | 2026-09-04 | official | https://sancarlospangasinan.gov.ph/ |
| S2 | Internet Archive | CDX index of the old official domain (2017–2020) | — | 2026-09-04 | other | http://web.archive.org/cdx/search/cdx?url=sancarloscitypangasinan.gov.ph/* |
| S3 | eBPLS | City online business one-stop shop | — | 2026-09-04 | official | https://prod4.ebpls.com/sancarlospangasinan/index.php |
| S4 | City Government of San Carlos | City Information Office (Facebook) | — | 2026-09-04 | official | https://www.facebook.com/sccp.cio |
