import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRun, finishRun, recordSource, writeCandidates } from './lib/runs';
import { buildReport } from './report';

function fixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-report-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: reg-site\n' +
      '    publisher: Fixture\n' +
      "    url: 'https://example.test/'\n" +
      '    sourceType: website\n' +
      '    collector: null\n' +
      '    updateCadence: manual\n' +
      "    evidenceRef: 'research/evidence.md'\n",
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'records.json'),
    JSON.stringify({
      records: [
        {
          id: 'stale-record',
          domain: 'government',
          type: 'official',
          label: 'Stale Office',
          data: { name: 'Old Name' },
          sourceIds: ['reg-site'],
          status: 'verified',
          lastVerified: '2020-01-01',
          acceptedBy: 'fixture',
          acceptedAt: '2020-01-02',
          nextReviewOn: '2020-04-01',
          updateCadence: 'quarterly',
        },
        {
          id: 'fresh-record',
          domain: 'government',
          type: 'official',
          label: 'Fresh Office',
          data: { name: 'New Name' },
          sourceIds: ['reg-site'],
          status: 'verified',
          lastVerified: '2026-09-01',
          acceptedBy: 'fixture',
          acceptedAt: '2026-09-02',
          nextReviewOn: '2099-01-01',
          updateCadence: 'quarterly',
        },
      ],
    }),
  );
  return root;
}

test('report flags a deliberately stale record and an uncovered source', () => {
  const root = fixtureRoot();
  try {
    const report = buildReport(root, '2026-09-14');
    assert.ok(report.stale.some((r) => r.id === 'stale-record'));
    assert.ok(!report.stale.some((r) => r.id === 'fresh-record'));
    assert.ok(report.uncoveredSources.some((s) => s.id === 'reg-site'));
    assert.ok(report.markdown.includes('stale-record'));
    assert.ok(report.markdown.includes('## Staleness'));
    assert.ok(report.markdown.includes('## Conflicts'));
    assert.ok(report.markdown.includes('## Coverage gaps'));
    assert.ok(report.markdown.includes('## Source health'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('report surfaces conflicting candidates', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, [
      {
        id: 'stale-record',
        domain: 'government',
        type: 'official',
        label: 'Stale Office',
        data: { name: 'A' },
        sourceIds: ['reg-site'],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
      {
        id: 'stale-record',
        domain: 'government',
        type: 'official',
        label: 'Stale Office',
        data: { name: 'B' },
        sourceIds: ['reg-site'],
        status: 'provisional',
        collectedBy: 'agent',
        runId: run.runId,
      },
    ]);
    recordSource(run.dir, {
      sourceId: 'reg-site',
      checkedAt: '2026-09-14T01:00:00Z',
      outcome: 'collected',
    });
    finishRun(run.dir, { candidatesProduced: 2, conflictsFound: 0 });
    const report = buildReport(root, '2026-09-14');
    assert.ok(report.conflicts.some((c) => c.recordId === 'stale-record'));
    assert.ok(!report.uncoveredSources.some((s) => s.id === 'reg-site'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('CLI: bun run data:report runs offline against a fixture tree', () => {
  const root = fixtureRoot();
  try {
    const out = execFileSync('bun', ['run', 'data:report'], {
      cwd: process.cwd(),
      env: { ...process.env, CIVIC_ROOT: root },
      encoding: 'utf8',
    });
    assert.ok(out.includes('Civic-data health report'), out);
    assert.ok(out.includes('stale-record'), out);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('report groups records by review class without fake horizons', () => {
  const root = fixtureRoot();
  try {
    const rec = (
      id: string,
      updateCadence: string,
      acceptedAt: string,
      nextReviewOn: string,
    ): Record<string, unknown> => ({
      id,
      domain: 'government',
      type: 'official',
      label: id,
      data: { name: id },
      sourceIds: ['reg-site'],
      status: 'verified',
      lastVerified: acceptedAt,
      acceptedBy: 'fixture',
      acceptedAt,
      nextReviewOn,
      updateCadence,
    });
    fs.writeFileSync(
      path.join(root, 'data', 'civic', 'records.json'),
      JSON.stringify({
        records: [
          rec('sched-past-due', 'quarterly', '2020-01-02', '2020-04-01'),
          rec('event-past-due', 'event-driven', '2020-01-02', '2020-04-01'),
          rec('manual-sentinel', 'manual', '2026-09-02', '2026-09-02'),
          rec('doc-sentinel', 'per-document', '2026-09-02', '2026-09-02'),
        ],
      }),
    );
    const report = buildReport(root, '2026-09-14');
    assert.deepEqual(report.reviewClasses.scheduled, { total: 1, pastDue: 1 });
    assert.deepEqual(report.reviewClasses['event-driven'], { total: 1, pastDue: 1 });
    assert.deepEqual(report.reviewClasses.manual, { total: 1, pastDue: 0 });
    assert.deepEqual(report.reviewClasses.document, { total: 1, pastDue: 0 });
    assert.ok(report.markdown.includes('## Review classes'));
    assert.ok(report.markdown.includes('- scheduled: 1 record(s), 1 past due'));
    assert.ok(report.markdown.includes('- manual: 1 record(s), 0 past due — review on demand (no scheduled horizon)'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
