// Facebook ingestion for the civic-data pipeline (thin manual entry point).
//
// All acquisition logic lives in the shared module (./lib/acquire): Graph API
// fetching with retry/backoff, auth/permission taxonomy, fixture handling,
// dormant-without-credentials behavior, and token redaction. This file only
// preserves the long-standing CLI/env contract, stages evidence, and feeds it
// through runRefresh, producing a research run with provisional news
// candidates. It never writes canonical records or data/news.json: refresh
// only adds files under research/runs/, and acceptance happens later via
// data:diff + data:promote (low-risk official-page items may use the
// --auto-news path, which promotes as `reported`, never `verified`).
//
// Preserved behavior:
// - dormant without token/fixture: log + exit 0, no run created
// - fetch failure: exit 1 with no run, so canonical data is untouched
// - an empty post list still records a run (0 candidates) as audit evidence;
//   canonical records are byte-identical either way
//
// Env: FB_PAGE_ID, FB_ACCESS_TOKEN (secret, never written to disk),
// FB_API_VERSION (default v21.0), FB_LIMIT (default 25), FB_FIXTURE,
// CIVIC_ROOT (repo root override). Args: [-- --date=<YYYY-MM-DD>].

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { acquireEvidence } from './lib/acquire';
import { loadRegistry } from './lib/civic';
import { runRefresh } from './refresh';

const INGEST_COLLECTED_BY = 'sync-facebook';
const INGEST_REGISTRY_ID = 'lgu-facebook-cio';

function facebookRegistry() {
  const entry = loadRegistry().sources.find((s) => s.id === INGEST_REGISTRY_ID);
  if (!entry) throw new Error(`ingest: registry entry missing: ${INGEST_REGISTRY_ID}`);
  return entry;
}

async function loadEvidence(): Promise<{ name: string; bytes: Buffer } | null> {
  const fixture = process.env.FB_FIXTURE ?? '';
  if (fixture) {
    console.log(`Using fixture: ${fixture}`);
    return { name: `${INGEST_REGISTRY_ID}.json`, bytes: fs.readFileSync(fixture) };
  }
  const pageId = process.env.FB_PAGE_ID ?? '';
  const token = process.env.FB_ACCESS_TOKEN ?? '';
  if (!token || !pageId) return null;
  const acquired = await acquireEvidence(facebookRegistry(), {
    offline: false,
    evidenceDir: null,
    env: process.env,
  });
  if (acquired.kind === 'skipped') return null;
  if (acquired.kind === 'failed') throw new Error(acquired.error);
  return { name: acquired.name, bytes: acquired.bytes };
}

async function main(): Promise<number> {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('usage: bun run data:ingest-facebook [-- --date=<YYYY-MM-DD>]');
    console.log('env: FB_PAGE_ID, FB_ACCESS_TOKEN, FB_API_VERSION, FB_LIMIT, FB_FIXTURE, CIVIC_ROOT');
    return 0;
  }
  const date = argv.find((a) => a.startsWith('--date='))?.slice('--date='.length);

  let evidence: { name: string; bytes: Buffer } | null;
  try {
    evidence = await loadEvidence();
  } catch (err) {
    // Fetch failure: no run is created, canonical data is untouched.
    console.error(`ingest failed: ${(err as Error).message}`);
    return 1;
  }
  if (!evidence) {
    console.log('FB_ACCESS_TOKEN / FB_PAGE_ID not set — staying dormant. No changes made.');
    return 0;
  }

  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-fb-ingest-'));
  try {
    fs.writeFileSync(path.join(staging, evidence.name), evidence.bytes);
    const summary = await runRefresh({
      root,
      sources: [INGEST_REGISTRY_ID],
      offline: true,
      evidenceDir: staging,
      collectedBy: INGEST_COLLECTED_BY,
      date,
    });
    console.log(`ingest: run ${summary.run.runId}: ${summary.candidates} candidate(s)`);
    for (const [id, outcome] of Object.entries(summary.outcomes)) console.log(`  ${id}: ${outcome}`);
    console.log('ingest: canonical records untouched; review with `bun run data:diff`');
    return 0;
  } catch (err) {
    console.error(`ingest failed: ${(err as Error).message}`);
    return 1;
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/ingest-facebook.ts');

if (invokedDirectly) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(`ingest failed: ${(err as Error).message}`);
      process.exit(1);
    },
  );
}
