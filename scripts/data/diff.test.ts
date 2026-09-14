import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffRun, renderReport } from './diff';
import type { Candidate, CivicRecord, RunManifest, SourceRecord } from './lib/civic';

function record(overrides: Partial<CivicRecord> = {}): CivicRecord {
  return {
    id: 'city-engineer-current',
    domain: 'government',
    type: 'official',
    label: 'City Engineer',
    data: { name: 'Juan Dela Cruz' },
    claimSources: { name: ['src-dir'] },
    sourceIds: ['src-dir'],
    status: 'verified',
    lastVerified: '2026-09-01',
    acceptedBy: 'reviewer',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2099-01-01',
    updateCadence: 'quarterly',
    ...overrides,
  };
}

function candidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: 'city-engineer-current',
    domain: 'government',
    type: 'official',
    label: 'City Engineer',
    data: { name: 'Juan Dela Cruz' },
    sourceIds: ['src-dir'],
    status: 'provisional',
    collectedBy: 'agent',
    runId: '2026-09-14',
    ...overrides,
  };
}

const SOURCES: SourceRecord[] = [
  {
    id: 'src-dir',
    title: 'LGU directory',
    publisher: 'City',
    url: 'https://example.test/dir',
    documentType: 'webpage',
    retrievedAt: '2026-09-01',
    verifier: 'fixture',
    sourceState: 'active',
    registryId: 'reg-site',
  },
];

function manifest(overrides: Partial<RunManifest> = {}): RunManifest {
  return {
    runId: '2026-09-14',
    startedAt: '2026-09-14T00:00:00Z',
    endedAt: null,
    parameters: {},
    sources: [],
    ...overrides,
  };
}

const TODAY = '2026-09-14';

test('scenario A: identical candidate is UNCHANGED and canonical is untouched', () => {
  const canonical = [record()];
  const before = JSON.parse(JSON.stringify(canonical)) as unknown;
  const entries = diffRun({ canonical, candidates: [candidate()], manifest: manifest(), sources: SOURCES }, TODAY);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].outcome, 'UNCHANGED');
  assert.deepEqual(canonical, before);
});

test('scenario B: different value is CHANGED with old and candidate data', () => {
  const canonical = [record()];
  const entries = diffRun(
    {
      canonical,
      candidates: [candidate({ data: { name: 'Maria Santos' } })],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  assert.equal(entries[0].outcome, 'CHANGED');
  assert.deepEqual(entries[0].oldData, { name: 'Juan Dela Cruz' });
  assert.deepEqual(entries[0].candidateData, { name: 'Maria Santos' });
  assert.deepEqual(canonical[0].data, { name: 'Juan Dela Cruz' });
});

test('scenario C: failed source with no candidate is SOURCE_UNAVAILABLE', () => {
  const entries = diffRun(
    {
      canonical: [record()],
      candidates: [],
      manifest: manifest({
        parameters: { domain: 'government' },
        sources: [
          { sourceId: 'reg-site', checkedAt: '2026-09-14T01:00:00Z', outcome: 'failed', error: 'fetch: HTTP 500' },
        ],
      }),
      sources: SOURCES,
    },
    TODAY,
  );
  assert.equal(entries[0].outcome, 'SOURCE_UNAVAILABLE');
});

test('parse failure maps to SOURCE_CHANGED', () => {
  const entries = diffRun(
    {
      canonical: [record()],
      candidates: [],
      manifest: manifest({
        parameters: { domain: 'government' },
        sources: [
          {
            sourceId: 'reg-site',
            checkedAt: '2026-09-14T01:00:00Z',
            outcome: 'failed',
            error: 'parse: table layout changed',
          },
        ],
      }),
      sources: SOURCES,
    },
    TODAY,
  );
  assert.equal(entries[0].outcome, 'SOURCE_CHANGED');
});

test('scenario D: disagreeing candidates are CONFLICT', () => {
  const entries = diffRun(
    {
      canonical: [record()],
      candidates: [candidate({ data: { name: 'A' } }), candidate({ data: { name: 'B' } })],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  assert.equal(entries[0].outcome, 'CONFLICT');
});

test('unknown id is NEW; uncovered in-scope record is MISSING; out-of-scope skipped', () => {
  const entries = diffRun(
    {
      canonical: [record(), record({ id: 'other-record', domain: 'health' })],
      candidates: [candidate({ id: 'brand-new', domain: 'news', label: 'New', data: {} })],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
  assert.equal(byId.get('brand-new'), 'NEW');
  // The only candidate is in the news domain, so government/health records are out of scope.
  assert.ok(!byId.has('city-engineer-current'));
  assert.ok(!byId.has('other-record'));
});

test('in-scope uncovered record is MISSING', () => {
  const entries = diffRun(
    {
      canonical: [record(), record({ id: 'city-mayor-current', label: 'Mayor', data: {} })],
      candidates: [candidate()],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
  assert.equal(byId.get('city-engineer-current'), 'UNCHANGED');
  assert.equal(byId.get('city-mayor-current'), 'MISSING');
});

test('stale covered record is flagged', () => {
  const entries = diffRun(
    {
      canonical: [record({ acceptedAt: '2020-01-02', lastVerified: '2020-01-01', nextReviewOn: '2020-04-01' })],
      candidates: [candidate()],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  assert.equal(entries[0].outcome, 'UNCHANGED');
  assert.equal(entries[0].stale, true);
});

test('report renders OLD/CANDIDATE/SOURCE/RESULT/ACTION blocks', () => {
  const entries = diffRun(
    {
      canonical: [record()],
      candidates: [candidate({ data: { name: 'Maria Santos' } })],
      manifest: manifest(),
      sources: SOURCES,
    },
    TODAY,
  );
  const report = renderReport('2026-09-14', entries, TODAY);
  for (const marker of ['OLD:', 'CANDIDATE:', 'SOURCE:', 'RESULT:', 'ACTION:', 'CHANGED']) {
    assert.ok(report.includes(marker), `report missing ${marker}`);
  }
  assert.ok(report.includes('Review required.'));
});
