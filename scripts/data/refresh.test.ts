import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { diffRun } from './diff';
import { loadRecords, loadRegistry } from './lib/civic';
import { readSourceInstances } from './lib/instances';
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
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [], registry: [] }, '2026-09-14');
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
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [], registry: [] }, '2026-09-14');
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
    const entries = diffRun({ canonical, candidates, manifest: null, sources: [], registry: [] }, '2026-09-14');
    assert.equal(entries[0].outcome, 'CONFLICT');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('Test 4a: source-scoped refresh with unavailable source reports SOURCE_UNAVAILABLE (real manifest)', async () => {
  const root = fixtureRoot();
  try {
    const summary = await runRefresh({ root, sources: ['fix-site'], collectedBy: 'test-4a', date: '2026-09-14' });
    assert.equal(summary.outcomes['fix-site'], 'unavailable');
    assert.equal(summary.candidates, 0);
    const { readCandidates, readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    const params = manifest.parameters as Record<string, unknown>;
    assert.ok(params.domains === null || Array.isArray(params.domains), 'manifest scope uses plural arrays');
    const entries = diffRun(
      {
        canonical: loadRecords(root).records,
        candidates: readCandidates(summary.run.dir),
        manifest,
        sources: [],
        registry: loadRegistry(root).sources,
      },
      '2026-09-14',
    );
    assert.equal(entries.length, 1);
    assert.equal(entries[0].recordId, 'city-hall-trunk-line');
    assert.equal(entries[0].outcome, 'SOURCE_UNAVAILABLE');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('Test 4b: domain-scoped refresh with unavailable sources and zero candidates still reports scope', { timeout: 30000 }, async () => {
  const root = fixtureRoot();
  try {
    const summary = await runRefresh({ root, domains: ['emergency'], collectedBy: 'test-4b', date: '2026-09-14' });
    assert.equal(summary.candidates, 0);
    const { readCandidates, readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.deepEqual((manifest.parameters as Record<string, unknown>).domains, ['emergency']);
    const entries = diffRun(
      {
        canonical: loadRecords(root).records,
        candidates: readCandidates(summary.run.dir),
        manifest,
        sources: [],
        registry: loadRegistry(root).sources,
      },
      '2026-09-14',
    );
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    assert.equal(byId.get('city-hall-trunk-line'), 'SOURCE_UNAVAILABLE');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('Test 5: covered-but-absent is MISSING; uncovered and out-of-scope are skipped', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': '<html><body><div>Office hours apply.</div></body></html>' });
  try {
    const summary = await runRefresh({
      root,
      domains: ['emergency'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'test-5',
      date: '2026-09-14',
    });
    assert.equal(summary.candidates, 0);
    const { readCandidates, readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    const [trunk] = loadRecords(root).records;
    const canonical = [
      ...loadRecords(root).records,
      { ...trunk, id: 'cdrmo-emergency-contact', label: 'CDRRMO', data: {} },
      { ...trunk, id: 'other-record', domain: 'health', label: 'Other' },
    ];
    const entries = diffRun(
      {
        canonical,
        candidates: readCandidates(summary.run.dir),
        manifest,
        sources: [],
        registry: loadRegistry(root).sources,
      },
      '2026-09-14',
    );
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    assert.equal(byId.get('city-hall-trunk-line'), 'MISSING');
    assert.ok(!byId.has('cdrmo-emergency-contact'), 'shares the domain but no collector covers it');
    assert.ok(!byId.has('other-record'), 'health record is out of scope');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

function wideFixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-wide-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-wide\n' +
      '    publisher: Fixture\n' +
      "    url: 'http://127.0.0.1:9/wide'\n" +
      '    sourceType: website\n' +
      '    collector: city-website\n' +
      '    updateCadence: quarterly\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - government\n' +
      '      - emergency\n' +
      '      - transparency\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  const rec = (id: string, domain: string, sid = 'fix-other') => ({
    id,
    domain,
    type: 'contact',
    label: id,
    data: {},
    claimSources: {},
    sourceIds: [sid],
    status: 'verified',
    lastVerified: '2026-09-01',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2099-01-01',
    updateCadence: 'quarterly',
  });
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
          claimSources: { number: ['fix-wide'] },
          sourceIds: ['fix-wide'],
          status: 'verified',
          lastVerified: '2026-09-01',
          acceptedBy: 'fixture',
          acceptedAt: '2026-09-02',
          nextReviewOn: '2099-01-01',
          updateCadence: 'quarterly',
        },
        rec('gov-official', 'government'),
        rec('transp-record', 'transparency'),
        rec('health-record', 'health'),
      ],
    }),
  );
  return root;
}

async function diffRealRun(root: string, runDir: string, extraRecords: Array<Record<string, unknown>> = []) {
  const { readCandidates, readManifest } = await import('./lib/runs');
  return diffRun(
    {
      canonical: [...loadRecords(root).records, ...(extraRecords as never[])],
      candidates: readCandidates(runDir),
      manifest: readManifest(runDir),
      sources: [],
      registry: loadRegistry(root).sources,
    },
    '2026-09-14',
  );
}

test('Test A: narrow coverage excludes unrelated multi-domain records', async () => {
  const root = wideFixtureRoot();
  const ev = evidenceDir({ 'fix-wide.html': SITE_HTML('(075) 600-1432') });
  try {
    const summary = await runRefresh({
      root,
      sources: ['fix-wide'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'test-a',
      date: '2026-09-14',
    });
    assert.equal(summary.candidates, 1);
    const { readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.deepEqual(manifest.sources[0].coverage, ['city-hall-trunk-line']);
    const entries = await diffRealRun(root, summary.run.dir);
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    assert.equal(byId.get('city-hall-trunk-line'), 'UNCHANGED');
    assert.ok(!byId.has('gov-official'), 'same-domain but uncovered record is excluded');
    assert.ok(!byId.has('transp-record'), 'same-domain but uncovered record is excluded');
    assert.ok(!byId.has('health-record'), 'out-of-scope record is excluded');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('Test D: parse failure yields scoped SOURCE_CHANGED, others excluded', async () => {
  const root = wideFixtureRoot();
  const ev = evidenceDir({ 'fix-wide.html': '' });
  try {
    const summary = await runRefresh({
      root,
      sources: ['fix-wide'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'test-d',
      date: '2026-09-14',
    });
    assert.equal(summary.candidates, 0);
    assert.equal(summary.outcomes['fix-wide'], 'failed');
    const { readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.ok((manifest.sources[0].error ?? '').startsWith('parse:'), 'parse-class failure recorded');
    const entries = await diffRealRun(root, summary.run.dir);
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    assert.equal(byId.get('city-hall-trunk-line'), 'SOURCE_CHANGED');
    assert.ok(!byId.has('gov-official'));
    assert.ok(!byId.has('transp-record'));
    assert.ok(!byId.has('health-record'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('Test F: one source run leaves another collector record untouched, NEW still discovered', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-multicol-'));
  try {
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
        '  - id: fix-fb\n' +
        '    publisher: Fixture\n' +
        "    url: 'https://example.test/fb'\n" +
        '    sourceType: facebook-page\n' +
        '    collector: facebook\n' +
        '    updateCadence: manual\n' +
        "    evidenceRef: 'research/evidence.md'\n" +
        '    domains:\n' +
        '      - news\n',
    );
    fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
    fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
    const trunk = {
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
    };
    const staleNews = {
      ...trunk,
      id: 'news-fb-stale',
      domain: 'news',
      type: 'announcement',
      label: 'Stale news',
      data: { title: 'Stale news' },
    };
    fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), JSON.stringify({ records: [trunk, staleNews] }));
    const ev = evidenceDir({
      'fix-site.html': SITE_HTML('(075) 600-1432'),
      'fix-fb.json': JSON.stringify({
        data: [
          {
            id: '999_111',
            message: 'Join us for the festival!',
            created_time: '2026-09-09T08:30:00+0000',
            permalink_url: 'https://www.facebook.com/post/9',
          },
        ],
      }),
    });
    const summary = await runRefresh({
      root,
      sources: ['fix-site', 'fix-fb'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'test-f',
      date: '2026-09-14',
    });
    assert.equal(summary.candidates, 2);
    const entries = await diffRealRun(root, summary.run.dir);
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    assert.equal(byId.get('city-hall-trunk-line'), 'UNCHANGED');
    assert.equal(byId.get('news-fb-999-111'), 'NEW');
    assert.ok(!byId.has('news-fb-stale'), 'aged-out feed item is churn, not MISSING');
    fs.rmSync(ev, { recursive: true, force: true });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
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

test('offline mode never fetches: source is skipped but the run is still recorded', async () => {
  const root = fixtureRoot();
  try {
    const summary = await runRefresh({
      root,
      sources: ['fix-site'],
      offline: true,
      collectedBy: 'offline-check',
      date: '2026-09-14',
    });
    assert.equal(summary.outcomes['fix-site'], 'skipped');
    assert.equal(summary.candidates, 0);
    const { readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.equal(manifest.sources[0].outcome, 'skipped');
    assert.ok((manifest.sources[0].error ?? '').includes('offline'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
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

test('refresh writes source-instances.json with every candidate link resolving', async () => {
  const root = fixtureRoot();
  const ev = evidenceDir({ 'fix-site.html': SITE_HTML('(075) 600-1432') });
  try {
    const summary = await runRefresh({
      root,
      sources: ['fix-site'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'scenario-instances',
      date: '2026-09-14',
    });
    assert.ok(summary.candidates > 0);
    const instances = readSourceInstances(summary.run.dir);
    assert.equal(instances.length, 1);
    assert.match(instances[0].id, /^src-fix-site-2026-09-14-[0-9a-f]{8}$/);
    const { readCandidates } = await import('./lib/runs');
    const candidates = readCandidates(summary.run.dir);
    assert.ok(candidates.length > 0);
    const known = new Set(instances.map((i) => i.id));
    for (const candidate of candidates) {
      assert.ok((candidate.sourceInstanceIds ?? []).length > 0, `${candidate.id} must link an instance`);
      for (const iid of candidate.sourceInstanceIds ?? []) {
        assert.ok(known.has(iid), `unknown instance link: ${iid}`);
      }
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

function dueFixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-due-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-monthly\n' +
      '    publisher: Fixture\n' +
      "    url: 'http://127.0.0.1:9/fixture'\n" +
      '    sourceType: website\n' +
      '    collector: city-website\n' +
      '    updateCadence: monthly\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n' +
      '  - id: fix-manual-only\n' +
      '    publisher: Fixture\n' +
      "    discovery: 'Manual inquiry'\n" +
      '    sourceType: inquiry\n' +
      '    collector: null\n' +
      '    updateCadence: quarterly\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
  return root;
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function writeHistoryManifest(root: string, runId: string, entries: Array<Record<string, unknown>>): void {
  const dir = path.join(root, 'research', 'runs', runId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify({ runId, startedAt: daysAgoIso(9), parameters: {}, sources: entries }),
  );
}

test('Test 6: failed attempts do not satisfy cadence; retry applies, skips never count', async () => {
  // Failed 8 days ago on a monthly source: eligible via the 7-day retry,
  // where the old any-outcome rule would have waited out the full month.
  {
    const root = dueFixtureRoot();
    try {
      writeHistoryManifest(root, '2026-09-01', [
        { sourceId: 'fix-monthly', checkedAt: daysAgoIso(8), outcome: 'failed', error: 'fetch: refused' },
      ]);
      const summary = await runRefresh({ root, due: true, offline: true, collectedBy: 'test-6a', date: '2026-09-14' });
      assert.ok('fix-monthly' in summary.outcomes, 'failed source stays eligible via retry');
      assert.ok(!('fix-manual-only' in summary.outcomes), 'collector-less source never auto-runs');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  // Failed 1 day ago: retry not yet elapsed, source stays out.
  {
    const root = dueFixtureRoot();
    try {
      writeHistoryManifest(root, '2026-09-01', [
        { sourceId: 'fix-monthly', checkedAt: daysAgoIso(1), outcome: 'unavailable', error: 'fetch: refused' },
      ]);
      const summary = await runRefresh({ root, due: true, offline: true, collectedBy: 'test-6b', date: '2026-09-14' });
      assert.ok(!('fix-monthly' in summary.outcomes), 'recent failure waits out the retry window');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  // Successful check 40 days ago on monthly: due via the normal window (unchanged behavior).
  {
    const root = dueFixtureRoot();
    try {
      writeHistoryManifest(root, '2026-09-01', [
        { sourceId: 'fix-monthly', checkedAt: daysAgoIso(40), outcome: 'collected' },
      ]);
      const summary = await runRefresh({ root, due: true, offline: true, collectedBy: 'test-6c', date: '2026-09-14' });
      assert.ok('fix-monthly' in summary.outcomes, 'stale success still drives normal cadence');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  // Skipped 8 days ago with no success: still due (skips never count), like a fresh source.
  {
    const root = dueFixtureRoot();
    try {
      writeHistoryManifest(root, '2026-09-01', [
        { sourceId: 'fix-monthly', checkedAt: daysAgoIso(8), outcome: 'skipped', error: 'offline' },
      ]);
      const summary = await runRefresh({ root, due: true, offline: true, collectedBy: 'test-6d', date: '2026-09-14' });
      assert.ok('fix-monthly' in summary.outcomes, 'skipped attempts never satisfy cadence');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('facebook-graph registry entries collect Graph evidence end to end', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-fbrefresh-'));
  try {
    fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
    fs.mkdirSync(path.join(root, 'research'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'data', 'civic', 'source-registry.yaml'),
      'version: 1\n' +
        'sources:\n' +
        '  - id: fix-fb\n' +
        '    publisher: Fixture CIO\n' +
        "    url: 'https://example.test/fb'\n" +
        '    sourceType: facebook-page\n' +
        '    collector: facebook\n' +
        '    acquisition: facebook-graph\n' +
        '    updateCadence: weekly\n' +
        "    evidenceRef: 'research/evidence.md'\n" +
        '    domains:\n' +
        '      - news\n',
    );
    fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
    fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
    fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
    const ev = evidenceDir({
      'fix-fb.json': JSON.stringify({
        data: [
          {
            id: '123_456',
            message: 'Power interruption advisory for Barangay Talang tomorrow',
            created_time: '2026-09-10T08:30:00+0000',
            permalink_url: 'https://www.facebook.com/post/1',
          },
        ],
      }),
    });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-fb'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'test-fb-route',
        date: '2026-09-14',
      });
      assert.equal(summary.outcomes['fix-fb'], 'collected');
      assert.equal(summary.candidates, 1);
      const { readCandidates } = await import('./lib/runs');
      const candidates = readCandidates(summary.run.dir);
      assert.equal(candidates[0].domain, 'news');
      assert.equal(candidates[0].status, 'provisional');
      const instances = readSourceInstances(summary.run.dir);
      assert.equal(instances.length, 1);
      assert.equal(instances[0].registryId, 'fix-fb');
    } finally {
      fs.rmSync(ev, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
