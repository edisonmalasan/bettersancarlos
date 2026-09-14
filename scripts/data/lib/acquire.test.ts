import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { acquireEvidence, acquisitionKind, redactSecrets } from './acquire';
import type { RegistryEntry } from './civic';

function httpEntry(overrides: Partial<RegistryEntry> = {}): RegistryEntry {
  return {
    id: 'reg-site',
    publisher: 'Fixture',
    url: 'https://example.test/',
    sourceType: 'website',
    collector: 'city-website',
    updateCadence: 'quarterly',
    evidenceRef: 'research/evidence.md',
    ...overrides,
  };
}

function fbEntry(overrides: Partial<RegistryEntry> = {}): RegistryEntry {
  return {
    id: 'lgu-facebook-cio',
    publisher: 'City Information Office',
    url: 'https://www.facebook.com/sccp.cio',
    sourceType: 'facebook-page',
    collector: 'facebook',
    acquisition: 'facebook-graph',
    updateCadence: 'weekly',
    evidenceRef: 'research/evidence.md',
    ...overrides,
  };
}

function mockFetch(handler: (url: string, init?: unknown) => unknown) {
  let calls = 0;
  const seen: string[] = [];
  const impl = (async (url: string, init?: unknown) => {
    calls++;
    seen.push(String(url));
    return handler(String(url), init);
  }) as unknown as typeof fetch;
  return { impl, calls: () => calls, seen: () => seen };
}

const graphBody = { data: [{ id: '1_2', message: 'Hello', created_time: '2026-09-10T08:30:00+0000' }] };
const okGraph = () => ({ ok: true, json: async () => graphBody });

test('acquisition kind defaults to http; facebook-graph is explicit', () => {
  assert.equal(acquisitionKind(httpEntry()), 'http');
  assert.equal(acquisitionKind(fbEntry()), 'facebook-graph');
  assert.equal(acquisitionKind(httpEntry({ acquisition: 'http' })), 'http');
});

test('redactSecrets strips tokens and leaves clean text alone', () => {
  const dirty = 'https://graph.facebook.com/v21.0/1/posts?access_token=SECRET-TOKEN-XYZ&limit=25';
  const clean = redactSecrets(dirty);
  assert.ok(!clean.includes('SECRET-TOKEN-XYZ'), clean);
  assert.ok(clean.includes('access_token=[REDACTED]'), clean);
  assert.equal(redactSecrets('fetch: HTTP 500 for https://example.test/'), 'fetch: HTTP 500 for https://example.test/');
});

test('fixture mode returns file bytes without touching the network', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-acq-'));
  try {
    const fixture = path.join(dir, 'graph.json');
    fs.writeFileSync(fixture, JSON.stringify(graphBody));
    const seen: string[] = [];
    const result = await acquireEvidence(fbEntry(), {
      offline: false,
      evidenceDir: null,
      env: { FB_FIXTURE: fixture },
      fetchImpl: (async (url: string) => {
        seen.push(url);
        throw new Error('network must not be used');
      }) as unknown as typeof fetch,
    });
    assert.equal(result.kind, 'evidence');
    assert.deepEqual(JSON.parse((result as { bytes: Buffer }).bytes.toString('utf8')), graphBody);
    assert.deepEqual(seen, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('missing credentials stay dormant without fetching', async () => {
  const { impl, calls } = mockFetch(() => {
    throw new Error('must not fetch');
  });
  const result = await acquireEvidence(fbEntry(), { offline: false, evidenceDir: null, env: {}, fetchImpl: impl });
  assert.equal(result.kind, 'skipped');
  assert.ok((result as { reason: string }).reason.includes('dormant'));
  assert.equal(calls(), 0);
});

test('expired token fails visibly on the first attempt with no leakage', async () => {
  const { impl, calls } = mockFetch(() => ({
    ok: true,
    json: async () => ({ error: { code: 190, message: 'Invalid OAuth access token' } }),
  }));
  const result = await acquireEvidence(
    fbEntry(),
    { offline: false, evidenceDir: null, env: { FB_PAGE_ID: '123', FB_ACCESS_TOKEN: 'SECRET-TOKEN-XYZ' }, fetchImpl: impl },
  );
  assert.equal(result.kind, 'failed');
  assert.equal(calls(), 1);
  const error = (result as { error: string }).error;
  assert.ok(error.includes('190'), error);
  assert.ok(!error.includes('SECRET-TOKEN-XYZ'), error);
});

test('rate limits retry with a bound, then succeed', async () => {
  let n = 0;
  const { impl, calls } = mockFetch(() => {
    n++;
    if (n === 1) return { ok: true, json: async () => ({ error: { code: 4, message: 'throttled' } }) };
    return okGraph();
  });
  const result = await acquireEvidence(
    fbEntry(),
    { offline: false, evidenceDir: null, env: { FB_PAGE_ID: '123', FB_ACCESS_TOKEN: 'tok' }, fetchImpl: impl },
  );
  assert.equal(result.kind, 'evidence');
  assert.equal(calls(), 2);
});

test('leaking fetch errors are redacted before recording', async () => {
  const { impl } = mockFetch(() => {
    throw new Error('socket failed for https://graph.facebook.com/x?access_token=ABC123');
  });
  const result = await acquireEvidence(
    fbEntry(),
    { offline: false, evidenceDir: null, env: { FB_PAGE_ID: '123', FB_ACCESS_TOKEN: 'ABC123' }, fetchImpl: impl },
  );
  assert.equal(result.kind, 'failed');
  const error = (result as { error: string }).error;
  assert.ok(!error.includes('ABC123'), error);
});
