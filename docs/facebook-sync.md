# Optional Facebook → News Ingestion (manual by default)

Facebook collection is optional and manual by default.

BetterSanCarlos is an independent community civic-data project and does not
assume administrative or task access to official LGU Facebook Pages.

The Graph API integration remains available for authorized use, fixture
testing, or future cooperation with the Page owner.

Normal scheduled civic-data refreshes do not require Facebook credentials.

Pulls the latest posts from the official LGU San Carlos Facebook Page, categorizes
them, and records them as provisional news candidates in a research run under
`research/runs/<date>/`. Acceptance happens later through review
(`bun run data:diff`, then `bun run data:promote`), and `data/news.json` — which drives
both the homepage **Latest Updates** and the **News** page — is generated from
canonical records by `bun run data:generate`. No step overwrites verified data directly.

- Engine: [`scripts/sync-facebook.js`](../scripts/sync-facebook.js) (launcher) →
  `bun run data:ingest-facebook` (`scripts/data/ingest-facebook.ts`, shared transform
  in `scripts/data/lib/facebook.ts`, shared Graph acquisition in
  `scripts/data/lib/acquire.ts`). The registry entry `lgu-facebook-cio` sets
  `acquisition: facebook-graph`, so `bun run data:refresh` routes it to the
  same Graph path — never the generic page fetcher.
- Scheduler: the registry entry `lgu-facebook-cio` uses `updateCadence: manual`,
  so the scheduled workflow (`data:refresh -- --due`) never selects it on
  elapsed time and requires no Facebook credentials. Facebook runs only when
  explicitly requested (`bun run data:refresh -- --source=lgu-facebook-cio` or
  `bun run data:ingest-facebook`); without credentials that explicit path
  records a dormant skip and continues with other sources. The manual engine
  likewise logs "staying dormant" and creates **no run**.
- Renderer: the Next.js **News** page (`src/app/news/page.tsx`) and the homepage feed
  widget (`assets/js/fb-feed.js`) read the generated `data/news.json` unchanged.
- Token safety: the access token travels in memory only and is redacted from
  every log line, error, and manifest entry; it never lands in evidence,
  candidates, source instances, or git.

## Optional future activation (not part of normal setup)

A Page access token is not expected as part of normal project setup, and no
contributor is expected to obtain LGU Page administration privileges. The
project operates fully without Facebook credentials. Only if authorized Page
access is voluntarily provided in the future do these technical steps apply.

Facebook only returns a page's posts to a caller holding a **Page access token**,
and that token requires a **role on the page**. No code can bypass this.

1. **Page role (only if the Page owner volunteers it).** The Page owner would add
   the BetterSanCarlos account/app as an **Editor** via Meta Business Suite →
   Settings → People. Editor is enough for read access; full Admin is not
   required. Never request this as a routine setup step.
2. **Create a Meta app** at developers.facebook.com → add the **Facebook Login**
   / **Pages** products, request `pages_read_engagement`.
3. **Generate a long-lived Page access token.** Use Graph API Explorer to get a
   user token, exchange it for a long-lived one, then call `/me/accounts` to get
   the **Page** token. For a token that never expires, create a **System User**
   in Business Manager and generate its token. (A short-lived token works for
   testing but will stop the sync in ~1 hour.)
4. **Find the Page ID** — visible in the page's About section or via
   `/me/accounts`.

Until step 3 is done, the engine logs "staying dormant" and creates **no run**:
the curated `data/news.json` keeps serving the site in the meantime. Missing
Facebook credentials are normal operation — never a broken deployment.

## Configure the repository (future authorized use only)

Only when scheduling with voluntarily provided authorized access:

| Name              | Type         | Value                                              |
| ----------------- | ------------ | -------------------------------------------------- |
| `FB_PAGE_ID`      | **Variable** | The page's numeric ID (public, safe as a variable) |
| `FB_ACCESS_TOKEN` | **Secret**   | The Page / System User access token                |

The scheduled civic-data workflow does not configure these and must never
require them.

## How it behaves (reliability guarantees)

- **Categorization:** deterministic keyword + `#hashtag` rules map each post to
  Announcement / Advisory / Project / Event and a badge color
  (`info` / `success` / `warning`). Editors can force a category by adding e.g.
  `#advisory` or `#project` to the post.
- **Candidates, not overwrites:** each run stores raw Graph evidence (with SHA-256),
  provisional candidates, and findings. Canonical records and `data/news.json`
  are byte-identical after a run — nothing is accepted without review.
- **Promotion:** official-page candidates may take the low-risk auto-path
  (`bun run data:promote -- --auto-news`), which records them as `reported`
  (never `verified`). Anything else needs an independent reviewer. Then
  `bun run data:generate` rebuilds `news.json` (manual curated order first,
  Facebook items newest-first, capped at 30).
- **Never blanks the feed:** on a fetch error the engine exits non-zero with no
  run created; an empty post list records a zero-candidate run as audit evidence.
  Either way existing data is untouched. Writes are atomic (temp file + rename).
- **Idempotent:** re-collecting identical evidence records outcome `unchanged`
  with equivalent candidates; promotion and generation are no-ops.
- **Token expiry:** an expired/invalid token (Graph error 190) fails the run
  loudly — your signal to refresh the token.

## Test it locally (no token needed)

The engine accepts a saved Graph response via `FB_FIXTURE`, bypassing the network:

```bash
# Save a sample Graph /posts response to fixture.json, then:
FB_FIXTURE=fixture.json node scripts/sync-facebook.js -- --date=2026-09-14
# Inspect research/runs/2026-09-14/, then:
bun run data:diff
```

Use `CIVIC_ROOT=/tmp/scratch` (with a civic tree) to keep dry runs out of the repo.
Once a real token exists, dry-run against the live API the same way (omit the
fixture vars) and inspect the run before promoting anything.

## Optional upgrade: smarter categorization

The current categorizer is deterministic and dependency-free (the right default
for reliability). For cleaner headlines and more accurate categories on messy
posts, the transform step can call **Claude Haiku** (`claude-haiku-4-5`, ~pennies/
month at this volume) with structured output, falling back to the keyword rules if
the API is unavailable. Ask to enable Tier 2 if you want it.
