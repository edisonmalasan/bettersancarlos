import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { diffRun } from './diff';
import { loadRecords } from './lib/civic';
import { sha256FileHex } from './lib/json';
import { runRefresh } from './refresh';

const SITE_HTML = (number: string): string =>
  `<html><body><div>City Hall trunk line: ${number}. Call during office hours.</div></body></html>`;

function fixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-refresh-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-site\n' +
      '    publisher: Fixture\n' +
      "    url: 'http://127.0.0.1:9/fixture'\n" +
      '    sourceType: website\n' +
      '    collector: city-website\n' +
      '    updateCadence: manual\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n' +
      '  - id: fix-site-b\n' +
      '    publisher: Fixture\n' +
      "    url: 'http://127.0.0.1:9/fixture-b'\n" +
      '    sourceType: website\n' +
      '    collector: city-website\n' +
      '    updateCadence: manual\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n' +
      '  - id: fix-manual\n' +
      '    publisher: Fixture\n' +
      "    discovery: 'Manual inquiry'\n" +
      '    sourceType: inquiry\n' +
      '    collector: null\n' +
      '    updateCadence: manual\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'records.json'),
    JSON.stringify({
      records: [
        {
          id: 'city-hall-trunk-line',
          domain: 'emergency',
          type: 'contact',
          label: 'City Hall (general trunk line)',
          data: { service: 'City Hall (general trunk line)', number: '(075) 600-1432' },
          claimSources: { number: ['fix-site'] },
          sourceIds: ['fix-site'],
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

function evidenceDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-evidence-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

function snapshotCanonical(root: string): Record<string, string> {
  return {
    records: sha256FileHex(path.join(root, 'data', 'civic', 'records.json')),
    sources: sha256FileHex(path.join(root, 'data', 'civic', 'sources.json')),
  };
}

function listTree(root: string): string[] {
  const out: string[] = [];
  const visit = (dir: string): void => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) visit(full);
      else out.push(path.relative(root, full));
    }
  };
  visit(root);
  return out.sort();
}

test('scenario A: unchanged source yields UNCHANGED and canonical is byte-identical', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': SITE_HTML('(075) 600-1432') });
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-site'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'scenario-a',
      date: '2026-09-14',
    });
    assert.equal(summary.outcomes['fix-site'], 'collected');
    assert.deepEqual(snapshotCanonical(root), before);
    const canonical = loadRecords(root).records;
    const { readCandidates } = await import('./lib/runs');
    const candidates = readCandidates(summary.run.dir);
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [] }, '2026-09-14');
    assert.equal(entries.length, 1);
    assert.equal(entries[0].outcome, 'UNCHANGED');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('scenario B: changed number yields CHANGED and canonical is untouched', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': SITE_HTML('(075) 600-9999') });
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-site'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'scenario-b',
      date: '2026-09-14',
    });
    assert.deepEqual(snapshotCanonical(root), before);
    const canonical = loadRecords(root).records;
    const { readCandidates } = await import('./lib/runs');
    const candidates = readCandidates(summary.run.dir);
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [] }, '2026-09-14');
    assert.equal(entries[0].outcome, 'CHANGED');
    assert.deepEqual(entries[0].candidateData, {
      service: 'City Hall (general trunk line)',
      number: '(075) 600-9999',
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('scenario C: refused endpoint is UNAVAILABLE and canonical is untouched', async () => {
  const root = fixtureRoot();
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({ root, sources: ['fix-site'], collectedBy: 'scenario-c', date: '2026-09-14' });
    assert.equal(summary.outcomes['fix-site'], 'unavailable');
    assert.equal(summary.candidates, 0);
    assert.deepEqual(snapshotCanonical(root), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('scenario D: two disagreeing evidences yield CONFLICT', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({
    'fix-site.html': SITE_HTML('(075) 600-1432'),
    'fix-site-b.html': SITE_HTML('(075) 600-9999'),
  });
  try {
    const summary = await runRefresh({
      root,
      sources: ['fix-site', 'fix-site-b'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'scenario-d',
      date: '2026-09-14',
    });
    const canonical = loadRecords(root).records;
    const { readCandidates } = await import('./lib/runs');
    const candidates = readCandidates(summary.run.dir);
    assert.equal(candidates.length, 2);
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [] }, '2026-09-14');
    assert.equal(entries[0].outcome, 'CONFLICT');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('unregistered source is reported and manual source is skipped', async () => {
  const root = fixtureRoot();
  try {
    const summary = await runRefresh({
      root,
      sources: ['nope', 'fix-manual'],
      offline: true,
      collectedBy: 'scenario-e',
      date: '2026-09-14',
    });
    assert.equal(summary.outcomes['nope'], 'unregistered');
    assert.equal(summary.outcomes['fix-manual'], 'skipped');
    assert.equal(summary.candidates, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('refresh only adds files under research/runs', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': SITE_HTML('(075) 600-1432') });
  try {
    const before = listTree(root);
    await runRefresh({
      root,
      sources: ['fix-site'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'confinement',
      date: '2026-09-14',
    });
    const added = listTree(root).filter((f) => !before.includes(f));
    assert.ok(added.length > 0);
    for (const file of added) {
      assert.ok(file.startsWith(`research${path.sep}runs${path.sep}`), `unexpected write: ${file}`);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('CLI: bun run data:refresh -- --source works against a fixture tree', () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': SITE_HTML('(075) 600-1432') });
  try {
    const out = execFileSync('bun', ['run', 'data:refresh', '--', '--source=fix-site', '--offline', `--evidence-dir=${ev}`, '--collected-by=cli', '--date=2026-09-15'], {
      cwd: process.cwd(),
      env: { ...process.env, CIVIC_ROOT: root },
      encoding: 'utf8',
    });
    assert.ok(out.includes('2026-09-15'), out);
    assert.ok(out.includes('fix-site'), out);
    const runs = fs.readdirSync(path.join(root, 'research', 'runs'));
    assert.deepEqual(runs, ['2026-09-15']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});
