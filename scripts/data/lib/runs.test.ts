import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  createRun,
  finishRun,
  nextRunId,
  readCandidates,
  readManifest,
  recordSource,
  saveEvidence,
  writeCandidates,
  writeMarkdown,
} from './runs';
import { validateRoot } from '../validate';

function fixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-runs-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\nsources:\n  - id: reg-site\n    publisher: Fixture\n    url: \'https://example.test/\'\n    sourceType: website\n    collector: null\n    updateCadence: manual\n    evidenceRef: \'research/evidence.md\'\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'sources.json'),
    JSON.stringify({
      sources: [
        {
          id: 'src-doc',
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
  return root;
}

test('run ids date with -n suffixing', () => {
  const root = fixtureRoot();
  try {
    assert.equal(nextRunId(root, '2026-09-14'), '2026-09-14');
    const first = createRun(root, { date: '2026-09-14' });
    assert.equal(first.runId, '2026-09-14');
    assert.equal(nextRunId(root, '2026-09-14'), '2026-09-14-2');
    const second = createRun(root, { date: '2026-09-14' });
    assert.equal(second.runId, '2026-09-14-2');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('fixture run round-trips and validates clean', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, {
      date: '2026-09-14',
      parameters: { source: 'reg-site' },
      collectedBy: 'fixture-agent',
    });
    const hash = saveEvidence(run.dir, 'page.html', '<html>Ada</html>');
    recordSource(run.dir, {
      sourceId: 'reg-site',
      checkedAt: '2026-09-14T01:00:00Z',
      outcome: 'collected',
      evidenceSha256: hash,
    });
    writeCandidates(run.dir, [
      {
        id: 'rec-one',
        domain: 'government',
        type: 'official',
        label: 'Record One',
        data: { name: 'Ada' },
        sourceIds: ['src-doc'],
        status: 'provisional',
        collectedBy: 'fixture-agent',
        runId: run.runId,
      },
    ]);
    writeMarkdown(run.dir, 'findings.md', '# findings\n\nOne candidate.\n');
    writeMarkdown(run.dir, 'conflicts.md', '# conflicts\n\nNone.\n');
    finishRun(run.dir, { candidatesProduced: 1, conflictsFound: 0 });

    const manifest = readManifest(run.dir);
    assert.equal(manifest.runId, '2026-09-14');
    assert.ok(manifest.endedAt);
    assert.equal(manifest.sources.length, 1);
    assert.equal(readCandidates(run.dir).length, 1);
    assert.ok(fs.existsSync(path.join(run.dir, 'evidence', 'page.html')));

    const result = validateRoot(root);
    assert.deepEqual(result.errors, []);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('validator refuses a manifest with an unknown outcome', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14' });
    recordSource(run.dir, {
      sourceId: 'reg-site',
      checkedAt: '2026-09-14T01:00:00Z',
      outcome: 'exploded' as 'collected',
    });
    const result = validateRoot(root);
    assert.ok(result.errors.some((e) => e.includes('unknown source outcome: exploded')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('writer refuses non-provisional candidates', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14' });
    assert.throws(
      () =>
        writeCandidates(run.dir, [
          {
            id: 'rec-one',
            domain: 'government',
            type: 'official',
            label: 'Record One',
            data: {},
            sourceIds: ['src-doc'],
            status: 'verified' as 'provisional',
            collectedBy: 'fixture-agent',
            runId: run.runId,
          },
        ]),
      /must be provisional/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('per-source coverage survives a manifest round-trip; absent stays absent', () => {
  const root = fixtureRoot();
  try {
    const run = createRun(root, { date: '2026-09-14' });
    recordSource(run.dir, {
      sourceId: 'reg-site',
      checkedAt: '2026-09-14T01:00:00Z',
      outcome: 'collected',
      coverage: ['rec-one', 'rec-two'],
    });
    recordSource(run.dir, {
      sourceId: 'reg-other',
      checkedAt: '2026-09-14T02:00:00Z',
      outcome: 'skipped',
    });
    const manifest = readManifest(run.dir);
    assert.deepEqual(manifest.sources[0].coverage, ['rec-one', 'rec-two']);
    assert.ok(!('coverage' in manifest.sources[1]), 'absent coverage must stay absent');
    assert.deepEqual(validateRoot(root).errors, []);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
