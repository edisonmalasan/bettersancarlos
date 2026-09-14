import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRun, writeCandidates } from './lib/runs';
import { writeSourceInstances } from './lib/instances';
import { sha256FileHex } from './lib/json';
import type { SourceInstance } from './lib/civic';
import { collectFacebook } from './collectors/facebook';
import { promoteRun } from './promote';

const FB_INSTANCE_ID = 'src-lgu-facebook-cio-2026-09-14-ec53f768';
const REG_INSTANCE_ID = 'src-reg-site-2026-09-14-a1b2c3d4';

function regSiteInstance(runId: string): SourceInstance {
  return {
    id: REG_INSTANCE_ID,
    registryId: 'reg-site',
    title: 'Fixture evidence',
    publisher: 'Fixture',
    url: 'https://example.test/',
    documentType: 'webpage',
    retrievedAt: '2026-09-14',
    sourceState: 'active',
    evidencePath: `research/runs/${runId}/evidence/page.html`,
    sha256: 'a1b2c3d4'.padEnd(64, '0'),
    collectedBy: 'agent',
    runId,
  };
}

function fbInstance(runId: string): SourceInstance {
  return {
    id: FB_INSTANCE_ID,
    registryId: 'lgu-facebook-cio',
    title: 'Fixture Graph response',
    publisher: 'City Information Office',
    url: 'https://www.facebook.com/sccp.cio',
    documentType: 'json',
    retrievedAt: '2026-09-14',
    sourceState: 'active',
    evidencePath: `research/runs/${runId}/evidence/graph-fixture.json`,
    sha256: 'ec53f768'.padEnd(64, '0'),
    collectedBy: 'agent',
    runId,
  };
}

function fixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-promote-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\nsources:\n  - id: reg-site\n    publisher: Fixture\n    url: \'https://example.test/\'\n    sourceType: website\n    collector: null\n    updateCadence: manual\n    evidenceRef: \'research/evidence.md\'\n  - id: lgu-facebook-cio\n    publisher: City Information Office\n    url: \'https://www.facebook.com/sccp.cio\'\n    sourceType: facebook-page\n    collector: facebook\n    updateCadence: weekly\n    evidenceRef: \'research/evidence.md\'\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'sources.json'),
    JSON.stringify({
      sources: [
        {
          id: 'src-dir',
          title: 'Fixture doc',
          publisher: 'Fixture',
          url: 'https://example.test/doc',
          documentType: 'webpage',
          retrievedAt: '2026-09-04',
          verifier: 'fixture',
          sourceState: 'active',
          registryId: 'reg-site',
        },
      ],
    }),
  );
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'records.json'),
    JSON.stringify({
      records: [
        {
          id: 'city-engineer-current',
          domain: 'government',
          type: 'official',
          label: 'City Engineer',
          data: { name: 'Juan Dela Cruz' },
          claimSources: { name: ['src-dir'] },
          sourceIds: ['src-dir'],
          status: 'verified',
          riskTier: 'high',
          lastVerified: '2026-09-01',
          acceptedBy: 'maintainer',
          acceptedAt: '2026-09-02',
          nextReviewOn: '2099-01-01',
          updateCadence: 'quarterly',
          history: [],
        },
      ],
    }),
  );
  return root;
}

test('promotion accepts a changed candidate and preserves history (scenario F)', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: [REG_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    writeSourceInstances(run.dir, [regSiteInstance(run.runId)]);
    const summary = promoteRun(
      { root, runId: run.runId, records: ['city-engineer-current'], reviewer: 'reviewer' },
      '2026-09-14',
    );
    assert.deepEqual(summary.promoted, ['city-engineer-current']);
    assert.deepEqual(summary.promotedSources, [REG_INSTANCE_ID]);
    const file = JSON.parse(fs.readFileSync(path.join(root, 'data', 'civic', 'records.json'), 'utf8')) as {
      records: Array<{
        id: string;
        data: unknown;
        status: string;
        acceptedBy: string;
        acceptedAt: string;
        lastVerified: string;
        nextReviewOn: string;
        sourceIds: string[];
        history: Array<{ revision: number; data: unknown; sourceIds: string[] }>;
      }>;
    };
    const record = file.records.find((r) => r.id === 'city-engineer-current');
    assert.ok(record);
    assert.deepEqual(record.data, { name: 'Maria Santos' });
    // Current revision points at the new exact evidence (Test 2 semantics).
    assert.deepEqual(record.sourceIds, [REG_INSTANCE_ID]);
    assert.equal(record.status, 'verified');
    assert.equal(record.acceptedBy, 'reviewer');
    assert.equal(record.acceptedAt, '2026-09-14');
    assert.equal(record.lastVerified, '2026-09-14');
    // Quarterly cadence from 2026-09-14 recomputes the review date (92-day
    // shared policy window).
    assert.equal(record.nextReviewOn, '2026-12-15');
    assert.equal(record.history.length, 1);
    assert.deepEqual(record.history[0].data, { name: 'Juan Dela Cruz' });
    // Superseded evidence stays in history while the current revision moved on.
    assert.deepEqual(record.history[0].sourceIds, ['src-dir']);
    const sources = JSON.parse(fs.readFileSync(path.join(root, 'data', 'civic', 'sources.json'), 'utf8')) as {
      sources: Array<{ id: string; registryId?: string }>;
    };
    assert.ok(sources.sources.some((s) => s.id === REG_INSTANCE_ID && s.registryId === 'reg-site'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('high-risk self-verification is refused', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: [REG_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    writeSourceInstances(run.dir, [regSiteInstance(run.runId)]);
    assert.throws(
      () => promoteRun({ root, runId: run.runId, records: ['city-engineer-current'], reviewer: 'agent' }, '2026-09-14'),
      /independent reviewer/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('conflicting candidates are refused promotion', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'A' },
        sourceIds: ['src-dir'],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'B' },
        sourceIds: ['src-dir'],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    assert.throws(
      () =>
        promoteRun({ root, runId: run.runId, records: ['city-engineer-current'], reviewer: 'reviewer' }, '2026-09-14'),
      /conflicting candidates/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('news auto-path promotes as reported and refuses non-news', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'news-fb-123-456',
        domain: 'news',
        type: 'announcement',
        label: 'Advisory',
        data: { title: 'Advisory' },
        sourceIds: ['lgu-facebook-cio'],
        sourceInstanceIds: [FB_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: [REG_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    writeSourceInstances(run.dir, [fbInstance(run.runId), regSiteInstance(run.runId)]);
    const summary = promoteRun({ root, runId: run.runId, records: ['news-fb-123-456'], autoNews: true }, '2026-09-14');
    assert.deepEqual(summary.promoted, ['news-fb-123-456']);
    const file = JSON.parse(fs.readFileSync(path.join(root, 'data', 'civic', 'records.json'), 'utf8')) as {
      records: Array<{ id: string; status: string; sourceIds: string[] }>;
    };
    const promoted = file.records.find((r) => r.id === 'news-fb-123-456');
    assert.equal(promoted?.status, 'reported');
    assert.deepEqual(promoted?.sourceIds, [FB_INSTANCE_ID]);
    assert.throws(
      () => promoteRun({ root, runId: run.runId, records: ['city-engineer-current'], autoNews: true }, '2026-09-14'),
      /auto-news applies only/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('collector-produced official-page items take the auto-path as reported, never verified', () => {
  const root = fixtureRoot();
  try {
    const collected = collectFacebook({
      registryId: 'lgu-facebook-cio',
      registry: {
        id: 'lgu-facebook-cio',
        publisher: 'City Information Office',
        url: 'https://www.facebook.com/sccp.cio',
        sourceType: 'facebook-page',
        collector: 'facebook',
        updateCadence: 'weekly',
        evidenceRef: 'research/evidence.md',
      },
      evidenceName: 'graph-fixture.json',
      evidenceText: JSON.stringify({
        data: [
          {
            id: '123_456',
            message: 'Power interruption advisory for Barangay Talang tomorrow',
            created_time: '2026-09-10T08:30:00+0000',
            permalink_url: 'https://www.facebook.com/post/1',
          },
        ],
      }),
      runId: '2026-09-14',
      collectedBy: 'sync-facebook',
    });
    assert.equal(collected.candidates.length, 1);
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'sync-facebook' });
    writeCandidates(run.dir, collected.candidates);
    writeSourceInstances(run.dir, collected.sourceInstances);
    const summary = promoteRun({ root, runId: run.runId, autoNews: true }, '2026-09-14');
    assert.deepEqual(summary.promoted, ['news-fb-123-456']);
    const file = JSON.parse(fs.readFileSync(path.join(root, 'data', 'civic', 'records.json'), 'utf8')) as {
      records: Array<{ id: string; status: string; data: Record<string, unknown> }>;
    };
    const record = file.records.find((r) => r.id === 'news-fb-123-456');
    assert.ok(String(record?.status) !== 'verified', 'auto-path must never verify');
    assert.equal(record?.status, 'reported');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function snapshotCivic(root: string): Record<string, string> {
  return {
    records: sha256FileHex(path.join(root, 'data', 'civic', 'records.json')),
    sources: sha256FileHex(path.join(root, 'data', 'civic', 'sources.json')),
  };
}

test('promotion failure leaves records.json and sources.json byte-identical (Test 3)', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: ['src-reg-site-2026-09-14-deadbeef'],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    writeSourceInstances(run.dir, [regSiteInstance(run.runId)]);
    const before = snapshotCivic(root);
    assert.throws(
      () => promoteRun({ root, runId: run.runId, records: ['city-engineer-current'], reviewer: 'reviewer' }, '2026-09-14'),
      /links unknown source instance/,
    );
    assert.deepEqual(snapshotCivic(root), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('registry citation without run evidence is refused', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['reg-site'],
        claimSources: { name: ['reg-site'] },
        sourceInstanceIds: [FB_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    // Instance belongs to a different registry than the cited claims.
    writeSourceInstances(run.dir, [fbInstance(run.runId)]);
    const before = snapshotCivic(root);
    assert.throws(
      () => promoteRun({ root, runId: run.runId, records: ['city-engineer-current'], reviewer: 'reviewer' }, '2026-09-14'),
      /with no run evidence/,
    );
    assert.deepEqual(snapshotCivic(root), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('byte-identical re-collection reuses the accepted instance (dedupe)', () => {
  const root = fixtureRoot();
  try {
    const first = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(first.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Maria Santos' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: [REG_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: first.runId,
      },
    ]);
    writeSourceInstances(first.dir, [regSiteInstance(first.runId)]);
    const one = promoteRun({ root, runId: first.runId, records: ['city-engineer-current'], reviewer: 'reviewer' }, '2026-09-14');
    const countSources = (): number =>
      (JSON.parse(fs.readFileSync(path.join(root, 'data', 'civic', 'sources.json'), 'utf8')) as { sources: unknown[] }).sources.length;
    assert.equal(countSources(), 2);
    // Second run retrieves byte-identical evidence (same sha, new run id).
    const second = createRun(root, { date: '2026-09-15', collectedBy: 'agent' });
    writeCandidates(second.dir, [
      {
        id: 'city-engineer-current',
        domain: 'government',
        type: 'official',
        label: 'City Engineer',
        data: { name: 'Ana Reyes' },
        sourceIds: ['src-dir'],
        sourceInstanceIds: [REG_INSTANCE_ID],
        status: 'provisional',
        collectedBy: 'agent',
        runId: second.runId,
      },
    ]);
    writeSourceInstances(second.dir, [{ ...regSiteInstance(second.runId), id: REG_INSTANCE_ID }]);
    const two = promoteRun({ root, runId: second.runId, records: ['city-engineer-current'], reviewer: 'reviewer' }, '2026-09-15');
    assert.equal(countSources(), 2, 'no duplicate source record for identical evidence');
    assert.deepEqual(two.promotedSources, [REG_INSTANCE_ID]);
    assert.deepEqual(one.promotedSources, [REG_INSTANCE_ID]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
