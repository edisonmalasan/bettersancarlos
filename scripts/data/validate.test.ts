import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateRoot } from './validate';

interface Fixture {
  root: string;
  records: Array<Record<string, unknown>>;
  sources: Array<Record<string, unknown>>;
  registryText: string;
}

function baseRegistry(): string {
  return (
    'version: 1\n' +
    'sources:\n' +
    '  - id: reg-site\n' +
    '    publisher: Fixture Publisher\n' +
    "    url: 'https://example.test/'\n" +
    '    sourceType: website\n' +
    '    collector: null\n' +
    '    updateCadence: quarterly\n' +
    "    evidenceRef: 'research/evidence.md'\n"
  );
}

function baseRecord(): Record<string, unknown> {
  return {
    id: 'rec-one',
    domain: 'government',
    type: 'official',
    label: 'Record One',
    data: { name: 'Ada' },
    claimSources: { name: ['src-doc'] },
    sourceIds: ['src-doc'],
    status: 'verified',
    lastVerified: '2026-09-01',
    acceptedBy: 'reviewer',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2099-01-01',
    updateCadence: 'quarterly',
  };
}

function baseSource(): Record<string, unknown> {
  return {
    id: 'src-doc',
    title: 'Fixture document',
    publisher: 'Fixture Publisher',
    url: 'https://example.test/doc',
    documentType: 'webpage',
    retrievedAt: '2026-09-01',
    verifier: 'reviewer',
    sourceState: 'active',
    registryId: 'reg-site',
  };
}

function writeTree(mutate?: (fix: Fixture) => void): Fixture {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-validate-'));
  const fix: Fixture = { root, records: [baseRecord()], sources: [baseSource()], registryText: baseRegistry() };
  mutate?.(fix);
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture evidence\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'source-registry.yaml'), fix.registryText);
  fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), JSON.stringify({ records: fix.records }));
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), JSON.stringify({ sources: fix.sources }));
  return fix;
}

function cleanup(fix: Fixture): void {
  fs.rmSync(fix.root, { recursive: true, force: true });
}

function expectError(fix: Fixture, fragment: string): void {
  try {
    const result = validateRoot(fix.root);
    assert.ok(
      result.errors.some((e) => e.includes(fragment)),
      `expected error containing "${fragment}", got: ${JSON.stringify(result.errors)}`,
    );
  } finally {
    cleanup(fix);
  }
}

test('valid fixture passes with no errors', () => {
  const fix = writeTree();
  try {
    const result = validateRoot(fix.root);
    assert.deepEqual(result.errors, []);
  } finally {
    cleanup(fix);
  }
});

test('unknown status fails naming the record', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].status = 'maybe';
    }),
    'record rec-one has unknown status: maybe',
  );
});

test('duplicate record ids fail', () => {
  expectError(
    writeTree((fix) => {
      fix.records.push({ ...baseRecord() });
    }),
    'duplicate civic record id: rec-one',
  );
});

test('unknown source reference fails naming record and source', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].sourceIds = ['nope'];
      fix.records[0].claimSources = {};
    }),
    'record rec-one references unknown source id: nope',
  );
});

test('claimSources path must exist in data', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].claimSources = { missing: ['src-doc'] };
    }),
    'record rec-one claimSources path does not exist in data: missing',
  );
});

test('stale verified record fails', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].acceptedAt = '2020-01-02';
      fix.records[0].lastVerified = '2020-01-01';
      fix.records[0].nextReviewOn = '2020-04-01';
    }),
    'record rec-one is verified but past nextReviewOn',
  );
});

test('lastVerified after acceptedAt fails', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].lastVerified = '2026-09-05';
    }),
    'record rec-one lastVerified is after acceptedAt',
  );
});

test('nextReviewOn before acceptedAt fails', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].nextReviewOn = '2026-09-01';
    }),
    'record rec-one nextReviewOn is before acceptedAt',
  );
});

test('secret token in civic data fails', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].notes = 'backup api_key = "abcdef1234567890" do not share';
    }),
    'possible secret',
  );
});

test('machine-local path in civic data fails', () => {
  expectError(
    writeTree((fix) => {
      fix.records[0].notes = 'stored at C:\\Users\\tester\\doc.txt temporarily';
    }),
    'machine-local path',
  );
});

test('evidence hash mismatch fails naming the source', () => {
  const fix = writeTree((fix2) => {
    fix2.sources[0].evidencePath = 'research/runs/2026-09-14/evidence/doc.txt';
    fix2.sources[0].sha256 = '0'.repeat(64);
  });
  try {
    const evidence = path.join(fix.root, 'research', 'runs', '2026-09-14', 'evidence');
    fs.mkdirSync(evidence, { recursive: true });
    fs.writeFileSync(path.join(evidence, 'doc.txt'), 'real bytes');
    const result = validateRoot(fix.root);
    assert.ok(result.errors.some((e) => e.includes('source src-doc evidence hash mismatch')));
  } finally {
    cleanup(fix);
  }
});

test('missing evidence file fails', () => {
  expectError(
    writeTree((fix) => {
      fix.sources[0].evidencePath = 'research/runs/2026-09-14/evidence/gone.txt';
      fix.sources[0].sha256 = '0'.repeat(64);
    }),
    'source src-doc declares missing evidence file',
  );
});

test('verified record citing unavailable source fails', () => {
  expectError(
    writeTree((fix) => {
      fix.sources[0].sourceState = 'unavailable';
    }),
    'record rec-one is verified but cites unavailable source: src-doc',
  );
});

test('registry entry with missing evidenceRef fails', () => {
  expectError(
    writeTree((fix) => {
      fix.registryText = fix.registryText.replace('research/evidence.md', 'research/gone.md');
    }),
    'registry entry reg-site cites missing evidenceRef',
  );
});

test('needs-reverification record warns but passes', () => {
  const fix = writeTree((fix2) => {
    fix2.records[0].status = 'needs-reverification';
    // Review due immediately: nextReviewOn equals acceptedAt (in the past).
    fix2.records[0].acceptedAt = '2020-01-02';
    fix2.records[0].lastVerified = '2020-01-01';
    fix2.records[0].nextReviewOn = '2020-01-02';
  });
  try {
    const result = validateRoot(fix.root);
    assert.deepEqual(result.errors, []);
    assert.ok(result.warnings.some((w) => w.includes('record rec-one is needs-reverification')));
  } finally {
    cleanup(fix);
  }
});

test('unknown run manifest outcome fails', () => {
  const fix = writeTree();
  try {
    const runDir = path.join(fix.root, 'research', 'runs', '2026-09-14');
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(
      path.join(runDir, 'manifest.json'),
      JSON.stringify({
        runId: '2026-09-14',
        startedAt: '2026-09-14T00:00:00Z',
        parameters: {},
        sources: [{ sourceId: 'reg-site', checkedAt: '2026-09-14T01:00:00Z', outcome: 'exploded' }],
      }),
    );
    const result = validateRoot(fix.root);
    assert.ok(result.errors.some((e) => e.includes('unknown source outcome: exploded')));
  } finally {
    cleanup(fix);
  }
});

test('candidate with reviewer fields fails', () => {
  const fix = writeTree();
  try {
    const runDir = path.join(fix.root, 'research', 'runs', '2026-09-14');
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(
      path.join(runDir, 'manifest.json'),
      JSON.stringify({ runId: '2026-09-14', startedAt: '2026-09-14T00:00:00Z', parameters: {}, sources: [] }),
    );
    fs.writeFileSync(
      path.join(runDir, 'candidates.json'),
      JSON.stringify({
        candidates: [
          {
            id: 'rec-one',
            domain: 'government',
            type: 'official',
            label: 'Record One',
            data: { name: 'Bob' },
            sourceIds: ['src-doc'],
            status: 'provisional',
            collectedBy: 'agent',
            runId: '2026-09-14',
            acceptedBy: 'agent',
          },
        ],
      }),
    );
    const result = validateRoot(fix.root);
    assert.ok(
      result.errors.some((e) => e.includes('must not carry reviewer-owned acceptance fields')),
      JSON.stringify(result.errors),
    );
  } finally {
    cleanup(fix);
  }
});

test('pipeline artifact outside research/runs fails', () => {
  const fix = writeTree();
  try {
    const strayDir = path.join(fix.root, 'research', 'government');
    fs.mkdirSync(strayDir, { recursive: true });
    fs.writeFileSync(
      path.join(strayDir, 'candidates.json'),
      JSON.stringify({ candidates: [] }),
    );
    const result = validateRoot(fix.root);
    assert.ok(
      result.errors.some((e) => e.includes('pipeline artifact outside research/runs')),
      JSON.stringify(result.errors),
    );
  } finally {
    cleanup(fix);
  }
});

test('fixture run leaves topic research files byte-identical', async () => {
  const fix = writeTree();
  try {
    const topicDir = path.join(fix.root, 'research', 'government');
    fs.mkdirSync(topicDir, { recursive: true });
    const topicFile = path.join(topicDir, 'notes.md');
    fs.writeFileSync(topicFile, '# topic notes\n\nDo not touch.\n');
    const before = fs.readFileSync(topicFile, 'utf8');
    const { createRun, finishRun, writeCandidates } = await import('./lib/runs');
    const run = createRun(fix.root, { date: '2026-09-14', collectedBy: 'agent' });
    writeCandidates(run.dir, []);
    finishRun(run.dir, { candidatesProduced: 0, conflictsFound: 0 });
    assert.equal(fs.readFileSync(topicFile, 'utf8'), before);
    const result = validateRoot(fix.root);
    assert.deepEqual(result.errors, []);
  } finally {
    cleanup(fix);
  }
});

test('candidate linking an unknown source instance fails', () => {
  const fix = writeTree();
  try {
    const runDir = path.join(fix.root, 'research', 'runs', '2026-09-14');
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(
      path.join(runDir, 'manifest.json'),
      JSON.stringify({ runId: '2026-09-14', startedAt: '2026-09-14T00:00:00Z', parameters: {}, sources: [] }),
    );
    fs.writeFileSync(
      path.join(runDir, 'candidates.json'),
      JSON.stringify({
        candidates: [
          {
            id: 'rec-one',
            domain: 'government',
            type: 'official',
            label: 'Record One',
            data: { name: 'Bob' },
            sourceIds: ['src-doc'],
            sourceInstanceIds: ['src-reg-site-2026-09-14-deadbeef'],
            status: 'provisional',
            collectedBy: 'agent',
            runId: '2026-09-14',
          },
        ],
      }),
    );
    const result = validateRoot(fix.root);
    assert.ok(
      result.errors.some((e) => e.includes('links unknown source instance')),
      JSON.stringify(result.errors),
    );
  } finally {
    cleanup(fix);
  }
});

test('canonical record citing a bare registry ID fails; candidates stay exempt', () => {
  const fix = writeTree((fix2) => {
    fix2.records[0].sourceIds = ['reg-site'];
    fix2.records[0].claimSources = {};
  });
  try {
    const runDir = path.join(fix.root, 'research', 'runs', '2026-09-14');
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(
      path.join(runDir, 'manifest.json'),
      JSON.stringify({ runId: '2026-09-14', startedAt: '2026-09-14T00:00:00Z', parameters: {}, sources: [] }),
    );
    fs.writeFileSync(
      path.join(runDir, 'candidates.json'),
      JSON.stringify({
        candidates: [
          {
            id: 'rec-two',
            domain: 'government',
            type: 'official',
            label: 'Record Two',
            data: { name: 'Zed' },
            sourceIds: ['reg-site'],
            status: 'provisional',
            collectedBy: 'agent',
            runId: '2026-09-14',
          },
        ],
      }),
    );
    const result = validateRoot(fix.root);
    assert.ok(
      result.errors.some((e) => e.includes('record rec-one cites registry reg-site without an exact sources.json record')),
      JSON.stringify(result.errors),
    );
    assert.ok(
      !result.errors.some((e) => e.includes('rec-two')),
      `candidates must stay exempt: ${JSON.stringify(result.errors)}`,
    );
  } finally {
    cleanup(fix);
  }
});
