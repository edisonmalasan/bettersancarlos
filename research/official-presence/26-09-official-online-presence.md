# San Carlos City, Pangasinan — Official Online Presence

**Category:** official-presence
**Verification status:** Verified (domain/URL observation) — the current official site is live; the Wikimedia-listed domain does not resolve; old official site is archived.
**Research date:** 2026-09-04

## Current Official Domains & Accounts

| Channel | URL | Status |
|---|---|---|
| **Official website (current)** | https://sancarlospangasinan.gov.ph | ✅ Live (single-page site on Hostinger/Zyro architecture) |
| Official Facebook — City Information Office | https://www.facebook.com/sccp.cio | ✅ Live (linked from official site) |
| eBPLS (Business permit online) | https://prod4.ebpls.com/sancarlospangasinan/index.php | ✅ Live (linked from official site) |
| Offsite gov.ph links (Official Gazette, Congress, Judiciary, OVP, etc.) | via official site's "Government Links" | ✅ Standard gov map |

## Decommissioned / Historical Official Domains

| Domain | Description | Evidence |
|---|---|---|
| sancarloscitypangasinan.gov.ph | **Original official city website** (WordPress, c. 2016–2020); used "Mango and Bamboo Capital of the Philippines" branding; hosted History, City Profile, Officials, Barangays, E-services, Tourism, Contact, News. | [Internet Archive snapshots (2017–2020)](http://web.archive.org/cdx/search/cdx?url=sancarloscitypangasinan.gov.ph/*) |
| sancarloscitypangasinan.gov.ph (https) | No longer resolves (DNS error, 2026-09-04) | Direct DNS check |
| sancarlospangasinan.gov.ph variants | The "www" subdomain and root both serve the single-page app | Direct fetch |

## Other Online Presence (to verify)

- **Instagram/Twitter links** on the current official site point to generic homepages (`instagram.com`, `twitter.com`) — **not** city-specific accounts; do not treat as official accounts.
- **Sangguniang Bayan subdomain** (`sangguniangbayan.sancarlospangasinan.gov.ph`) — documented in project README as the legislation portal but **unreachable during this research** (connection failed). Needs follow-up.
- HON. Officials' pages on the current site render the same single-page template; no separate subdomains.

## About the Current Official Website

- Built on **Hostinger Website Builder (Zyro)** → serving an **Astro** static app with Vue islands; all routes under the same shell return the homepage SDK content (observed behavior).
- It exposes limited content: Home, virtual pages (City Profile, History, Governance, Transparency, Projects, Bids, News), and forms.
- `robots.txt` route returns the SPA shell (no robots directives seen).
- **Implication for Better San Carlos:** the LGU's own site lacks a REST API or open-data feed. Our scrapers should rely on (a) the City Info Office Facebook, (b) archived snapshots, and (c) direct FOI/requests to the City Information Office (CIO@...).

## Potential Better San Carlos Features

- **Official source registry** — track official LGU channels vs community/unofficial pages (important for data provenance).
- **Watchdog/archive** — "official site changed" notifications.
- **Scraper target list** (Facebook, sitemap, eBPLS) for automated sync (see `docs/facebook-sync.md` in the project).

## Notes / Gaps

- Official email addresses recorded: CIO@sancarlospangasinan.com and CMO@sancarlospangasinan.com (published on official site). All other email addresses for departments were not found.
- The Facebook page's exact handle (facebook.com/sccp.cio) is crowd-verifiable; also note the CIO posts election proclamations there.

## Sources

1. Official LGU website: https://sancarlospangasinan.gov.ph/
2. Internet Archive CDX for sancarloscitypangasinan.gov.ph (2017–2020): http://web.archive.org/cdx/search/cdx?url=sancarloscitypangasinan.gov.ph/*
3. eBPLS portal: https://prod4.ebpls.com/sancarlospangasinan/index.php
4. Facebook (City Information Office): https://www.facebook.com/sccp.cio