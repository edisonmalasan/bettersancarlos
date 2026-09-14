// Source-specific acquisition: fetching raw evidence bytes per registry source.
//
// Refresh used to fetch every URL source with the shared HTTP text fetcher,
// which silently fed Facebook page HTML into the collector expecting a Graph
// API JSON envelope. Acquisition is now dispatched per source: normal HTTP(S)
// sources keep the polite text fetcher; API-backed sources (starting with the
// Facebook Graph API) use their dedicated path. Both feed the SAME
// research-run/candidate/source-instance contract downstream.
//
// Credential rule: tokens travel in memory only (request headers/params) and
// are redacted from every log line, error, and manifest entry this module
// produces. Nothing here writes canonical data.

import fs from 'node:fs';
import path from 'node:path';
import { CIVIC_USER_AGENT, fetchText } from './fetch';
import type { RegistryEntry } from './civic';

export type AcquisitionKind = 'http' | 'facebook-graph';

/** Registry `acquisition` field selects the fetcher; absent means plain HTTP. */
export function acquisitionKind(entry: RegistryEntry): AcquisitionKind {
  return entry.acquisition === 'facebook-graph' ? 'facebook-graph' : 'http';
}

export interface AcquireOptions {
  offline: boolean;
  evidenceDir: string | null;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}

export type AcquireResult =
  | { kind: 'evidence'; name: string; bytes: Buffer }
  | { kind: 'skipped'; reason: string }
  | { kind: 'failed'; error: string };

const GRAPH_FIELDS = 'id,message,story,created_time,permalink_url,full_picture,status_type';

/** Strip credential material (Graph access tokens) from any diagnostic text. */
export function redactSecrets(text: string): string {
  return text.replace(/access_token=[^&\s'"]*/gi, 'access_token=[REDACTED]');
}

function findEvidenceFile(evidenceDir: string, registryId: string): string | null {
  let names: string[] = [];
  try {
    names = fs.readdirSync(evidenceDir);
  } catch {
    return null;
  }
  const hit = names.filter((n) => n === registryId || n.startsWith(registryId + '.')).sort()[0];
  return hit ? path.join(evidenceDir, hit) : null;
}

async function fetchGraphWithRetry(
  url: string,
  fetchImpl: typeof fetch,
  retries = 3,
): Promise<unknown> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, {
        headers: { 'user-agent': CIVIC_USER_AGENT, accept: 'application/json' },
      });
      const body = (await res.json()) as { error?: { code?: number; message?: string }; data?: unknown };
      if (body && body.error) {
        const code = body.error.code;
        // 190 = expired/invalid token; 10/200 = permission — all unrecoverable.
        if (code === 190 || code === 10 || code === 200) {
          throw new Error(`FB auth/permission error (code ${code}): ${body.error.message}`);
        }
        // 4/17/32/613 = rate limited — retryable.
        if (code === 4 || code === 17 || code === 32 || code === 613) {
          throw Object.assign(new Error(`rate limited (code ${code})`), { retryable: true });
        }
        throw new Error(`FB API error: ${body.error.message}`);
      }
      if (!res.ok) {
        throw Object.assign(new Error(`HTTP ${res.status}`), { retryable: res.status >= 500 });
      }
      return body;
    } catch (err) {
      lastErr = err;
      const retryable = (err as { retryable?: boolean }).retryable || (err as Error).name === 'TypeError';
      if (!retryable || attempt === retries) break;
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function acquireFacebookGraph(
  entry: RegistryEntry,
  opts: AcquireOptions,
): Promise<AcquireResult> {
  const env = opts.env ?? process.env;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const fixture = env.FB_FIXTURE ?? '';
  if (fixture) {
    return { kind: 'evidence', name: `${entry.id}.json`, bytes: fs.readFileSync(fixture) };
  }
  const pageId = env.FB_PAGE_ID ?? '';
  const token = env.FB_ACCESS_TOKEN ?? '';
  if (!token || !pageId) {
    return { kind: 'skipped', reason: 'Facebook credentials not configured; staying dormant (no token/page ID)' };
  }
  const apiVersion = env.FB_API_VERSION || 'v21.0';
  const limit = parseInt(env.FB_LIMIT || '25', 10);
  const url =
    `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(pageId)}/posts` +
    `?fields=${encodeURIComponent(GRAPH_FIELDS)}&limit=${limit}` +
    `&access_token=${encodeURIComponent(token)}`;
  try {
    const body = await fetchGraphWithRetry(url, fetchImpl);
    return { kind: 'evidence', name: `${entry.id}.json`, bytes: Buffer.from(JSON.stringify(body), 'utf8') };
  } catch (err) {
    return { kind: 'failed', error: redactSecrets((err as Error).message) };
  }
}

export async function acquireEvidence(entry: RegistryEntry, opts: AcquireOptions): Promise<AcquireResult> {
  if (acquisitionKind(entry) === 'facebook-graph') {
    return acquireFacebookGraph(entry, opts);
  }
  if (opts.evidenceDir) {
    const fixture = findEvidenceFile(opts.evidenceDir, entry.id);
    if (fixture) {
      return { name: path.basename(fixture), bytes: fs.readFileSync(fixture), kind: 'evidence' };
    }
    if (opts.offline || !entry.url) {
      return { kind: 'skipped', reason: 'no evidence file and no live fetch (offline)' };
    }
  }
  if (opts.offline) {
    return { kind: 'skipped', reason: 'offline mode: no live fetch without supplied evidence' };
  }
  if (!entry.url) {
    return { kind: 'skipped', reason: 'source has no URL and no evidence file' };
  }
  try {
    const text = await fetchText(entry.url);
    return { kind: 'evidence', name: `${entry.id}.html`, bytes: Buffer.from(text, 'utf8') };
  } catch (err) {
    return { kind: 'failed', error: (err as Error).message };
  }
}
