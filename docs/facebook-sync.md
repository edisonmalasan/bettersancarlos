# Automated Facebook → News Ingestion

Pulls the latest posts from the official LGU San Carlos Facebook Page, categorizes
them, and records them as provisional news candidates in a research run under
`research/runs/<date>/`. Acceptance happens later through review
(`bun run data:diff`, then `bun run data:promote`), and `data/news.json` — which drives
both the homepage **Latest Updates** and the **News** page — is generated from
canonical records by `bun run data:generate`. No step overwrites verified data directly.

- Engine: [`scripts/sync-facebook.js`](../scripts/sync-facebook.js) (launcher) →
  `bun run data:ingest-facebook` (`scripts/data/ingest-facebook.ts`, shared transform
  in `scripts/data/lib/facebook.ts`)
- Scheduler: none yet — runs manually or on demand. Until a token exists the engine
  stays dormant (see below); scheduled refresh arrives with the pipeline's `refresh.yml`
  (phase 6).
- Renderer: the Next.js **News** page (`src/app/news/page.tsx`) and the homepage feed
  widget (`assets/js/fb-feed.js`) read the generated `data/news.json` unchanged.

## The one prerequisite (activation gate)

Facebook only returns a page's posts to a caller holding a **Page access token**,
and that token requires a **role on the page**. No code can bypass this.

1. **Get an Editor role on the page.** Ask the LGU San Carlos page admin (via Meta
   Business Suite → Settings → People) to add the BetterSanCarlos account/app as an
   **Editor**. Editor is enough for read access; full Admin is not required.
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
the curated `data/news.json` keeps serving the site in the meantime, and posts
flow in automatically once the token is added.

## Configure the repository

In **GitHub → Settings → Secrets and variables → Actions** (when scheduling):

| Name              | Type         | Value                                              |
| ----------------- | ------------ | -------------------------------------------------- |
| `FB_PAGE_ID`      | **Variable** | The page's numeric ID (public, safe as a variable) |
| `FB_ACCESS_TOKEN` | **Secret**   | The Page / System User access token                |

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
