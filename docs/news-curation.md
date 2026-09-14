# News Curation Workflow

How the **Latest Updates** (homepage) and **News** page are kept up to date.

## How it works

Both sections read a single file: [`data/news.json`](../data/news.json) — generated
from canonical news records by `bun run data:generate` (see
[`data-pipeline.md`](data-pipeline.md)). The homepage shows the 3 most recent items;
the News page shows all of them, newest first. No backend is involved — it is a static
JSON file served from cPanel.

To avoid hand-editing JSON, use the curation tool:

```
admin/news-editor.html
```

This is an **internal tool**. It is excluded from the production build
([`build.sh`](../build.sh)), so it is never deployed publicly. You run it locally.

## Adding or editing an update

1. Start the local server from the project root:
   ```bash
   npm run dev          # serves on http://localhost:8000
   ```
2. Open **http://localhost:8000/admin/news-editor.html**. It loads the current
   `data/news.json` automatically.
3. Click **Add new update** (or **Edit** on an existing entry) and fill in:
   - **Title** (≤120 chars) and **Summary** (≤300 chars)
   - **Date**, **Category label**, and **Badge color** (`info` blue / `success` green
     / `warning` amber — common categories auto-pick a color)
   - **Link URL** (optional) — e.g. the original Facebook post; adds a "Read more" link
     on the News page card and makes the homepage title link out
   - **ID** auto-fills from the title and must be unique
     The live preview shows the resulting News-page card. Validation blocks bad entries.
4. Click **Save update**.
5. Click **Download news.json**.
6. Replace [`data/news.json`](../data/news.json) with the downloaded file, commit, and
   deploy (`npm run build` → upload `dist/`).
   NOTE: `data/news.json` is now generated from canonical civic records
   (`bun run data:generate`). Do not hand-edit it as the source of truth —
   route editor changes through the pipeline instead (add/update the canonical
   `news-<slug>` record, then regenerate).

`Copy JSON` and `Import file…` are available if you prefer pasting, or want to resume
editing a file you saved earlier.

## Schema

```jsonc
{
  "news": [
    {
      "id": "unique-slug", // required, lowercase + dashes
      "title": "string", // required, ≤120 chars
      "date": "YYYY-MM-DD", // required
      "category": "Announcement", // required label shown on the badge
      "badge": "info", // required: info | success | warning
      "summary": "string", // required, ≤300 chars
      "url": "https://...", // optional outbound link (or null)
      "source": "View on Facebook", // optional link label (defaults to "Read more")
    },
  ],
}
```

The News page and homepage widget escape all fields before rendering and ignore
non-`http(s)` URLs, so the
feed is safe even with automated entries in the same shape. Facebook-sourced
entries now arrive through the pipeline: `scripts/sync-facebook.js` collects
Graph posts into research-run candidates, review promotes them as `reported`,
and `bun run data:generate` merges them with the manually curated ones
(see [`facebook-sync.md`](facebook-sync.md)).
