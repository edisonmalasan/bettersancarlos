#!/usr/bin/env node
/**
 * Facebook → research-run ingestion entry point.
 *
 * Collects the latest posts from the official LGU San Carlos Facebook Page
 * via the Graph API and produces a research run with provisional news
 * candidates under research/runs/<date>/ (manifest, evidence, candidates,
 * findings). It never writes canonical records or data/news.json directly:
 * acceptance happens later through review (bun run data:diff, then
 * bun run data:promote), and data/news.json is generated from canonical
 * records by bun run data:generate.
 *
 * The heavy lifting lives in the TypeScript pipeline
 * (scripts/data/ingest-facebook.ts + scripts/data/lib/facebook.ts, shared
 * with the fixture-driven collectors); this file only preserves the
 * long-standing engine contract before delegating to bun:
 *
 * REQUIRED ENV (to actually fetch):
 *   FB_PAGE_ID         numeric/short id of the page (public — safe as a repo var)
 *   FB_ACCESS_TOKEN    Page access token (SECRET; requires an Editor role on the page)
 *
 * OPTIONAL ENV:
 *   FB_API_VERSION     Graph API version (default v21.0)
 *   FB_LIMIT           posts to request per run (default 25)
 *   FB_FIXTURE         path to a saved Graph response JSON — bypasses the network
 *                      (for local testing / dry runs; no token needed)
 *   CIVIC_ROOT         repo root override (tests / alternate checkouts)
 *
 * Behaviour when FB_ACCESS_TOKEN (and FB_FIXTURE) are absent: logs a notice and
 * exits 0 without creating a run — safe to schedule before the token exists.
 * On fetch failure it exits non-zero with no run created, so a bad run can
 * never touch verified production data. An empty post list still records a
 * run with zero candidates as audit evidence; canonical data stays untouched.
 *
 * NOTE: FB_FIXTURE replaces the old NEWS_JSON_PATH / MAX_FB_ITEMS knobs, which
 * no longer apply now that output is a research run instead of news.json.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function main(argv = process.argv.slice(2), env = process.env) {
  const fixture = env.FB_FIXTURE || '';
  const token = env.FB_ACCESS_TOKEN || '';
  const pageId = env.FB_PAGE_ID || '';
  if (!fixture && (!token || !pageId)) {
    console.log('FB_ACCESS_TOKEN / FB_PAGE_ID not set — staying dormant. No changes made.');
    return 0;
  }
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const forward = argv.filter((a) => a.startsWith('--date='));
  // Run bun from the repo checkout (where package.json scripts live);
  // CIVIC_ROOT in env already redirects the pipeline at the data tree.
  const child = spawnSync('bun', ['run', 'data:ingest-facebook', '--', ...forward], {
    cwd: repoRoot,
    env,
    stdio: 'inherit',
  });
  if (child.error) {
    console.error(`Sync failed: could not launch ingestion (${child.error.message})`);
    return 1;
  }
  return child.status ?? 1;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/sync-facebook.js');

if (invokedDirectly) {
  process.exit(main());
}
