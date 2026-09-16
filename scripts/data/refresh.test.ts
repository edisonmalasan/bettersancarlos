import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
      '    acquisition: facebook-graph\n' +
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
    assert.equal(summary.outcomes['fix-site'], 'collected');
    assert.equal(summary.outcomes['fix-fb'], 'collected');
    const { readManifest: readManifestF } = await import('./lib/runs');
    const manifestF = readManifestF(summary.run.dir);
    assert.deepEqual(
      manifestF.sources.map((s) => [s.sourceId, s.outcome]),
      [
        ['fix-site', 'collected'],
        ['fix-fb', 'collected'],
      ],
    );
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

function fbFixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-fbrefresh-'));
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
  return root;
}

test('facebook-graph registry entries collect Graph evidence end to end', async () => {
  const root = fbFixtureRoot();
  try {
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

test('manual-cadence facebook source is excluded from due refresh but runs on explicit request', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-fbmanual-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-fb-manual\n' +
      '    publisher: Fixture CIO\n' +
      "    url: 'https://example.test/fb'\n" +
      '    sourceType: facebook-page\n' +
      '    collector: facebook\n' +
      '    acquisition: facebook-graph\n' +
      '    updateCadence: manual\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - news\n' +
      '  - id: fix-monthly\n' +
      '    publisher: Fixture\n' +
      "    url: 'http://127.0.0.1:9/fixture'\n" +
      '    sourceType: website\n' +
      '    collector: city-website\n' +
      '    updateCadence: monthly\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - emergency\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
  try {
    // Due refresh: elapsed time alone must not select the manual source,
    // while the due time-based source is still selected normally.
    const due = await runRefresh({ root, due: true, offline: true, collectedBy: 'test-fbmanual', date: '2026-09-14' });
    assert.ok(!('fix-fb-manual' in due.outcomes), 'manual source never selected by --due');
    assert.ok('fix-monthly' in due.outcomes, 'due time-based source still selected');
    // Explicit invocation still routes through the Graph acquisition path.
    const ev = evidenceDir({
      'fix-fb-manual.json': JSON.stringify({
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
      const explicit = await runRefresh({
        root,
        sources: ['fix-fb-manual'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'test-fbmanual',
        date: '2026-09-14-2',
      });
      assert.equal(explicit.outcomes['fix-fb-manual'], 'collected');
      assert.equal(explicit.candidates, 1);
      const { readCandidates } = await import('./lib/runs');
      const candidates = readCandidates(explicit.run.dir);
      assert.equal(candidates[0].status, 'provisional');
      const instances = readSourceInstances(explicit.run.dir);
      assert.equal(instances.length, 1);
      assert.equal(instances[0].registryId, 'fix-fb-manual');
    } finally {
      fs.rmSync(ev, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('lgu-facebook-cio registry entry is manual cadence with the facebook collector', () => {
  const registry = loadRegistry(process.cwd());
  const entry = registry.sources.find((s) => s.id === 'lgu-facebook-cio');
  assert.ok(entry, 'lgu-facebook-cio is registered');
  assert.equal(entry.updateCadence, 'manual');
  assert.equal(entry.collector, 'facebook');
  assert.equal(entry.acquisition, 'facebook-graph');
});

test('HTML evidence never reaches the Graph collector (parse-class failure)', async () => {
  const root = fbFixtureRoot();
  try {
    const ev = evidenceDir({
      'fix-fb.html': '<html><body><p>A normal webpage, not a Graph envelope.</p></body></html>',
    });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-fb'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'test-fb-html',
        date: '2026-09-14',
      });
      assert.equal(summary.outcomes['fix-fb'], 'failed');
      assert.equal(summary.candidates, 0);
      const { readManifest } = await import('./lib/runs');
      const manifest = readManifest(summary.run.dir);
      assert.ok((manifest.sources[0].error ?? '').startsWith('parse:'), 'collector rejected non-envelope evidence');
      assert.ok(manifest.sources[0].evidenceSha256, 'failed evidence hash still recorded');
    } finally {
      fs.rmSync(ev, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// ---- psa-philatlas pipeline tests (PSA census figures via PhilAtlas) ----

const PSA_IDS = [
  'population-total-2020',
  'demographics-census-history',
  'demographics-households',
  'demographics-barangay-populations',
] as const;

const PSA_FIXTURE_FILE = fileURLToPath(
  new URL('./fixtures/psa-philatlas-san-carlos-2026-09-16.html', import.meta.url),
);

function psaFixtureHtml(): string {
  return fs.readFileSync(PSA_FIXTURE_FILE, 'utf8');
}

function psaSwap(html: string, from: string, to: string, minExpected = 1): string {
  const count = html.split(from).length - 1;
  assert.ok(count >= minExpected, `expected ${minExpected}+ occurrence(s) of ${from}, found ${count}`);
  return html.split(from).join(to);
}

// Seeds mirror the current canonical shapes (read live so the test pins the
// last-known-good contract deliberately: a legitimate canonical or source move
// fails loudly here for a human to re-baseline, never silently).
function psaSeedRecords(): Array<Record<string, unknown>> {
  const file = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'civic', 'records.json'), 'utf8'),
  ) as { records: Array<Record<string, unknown>> };
  const prod = file.records;
  const wanted = new Set<string>([...PSA_IDS]);
  return prod
    .filter((r) => wanted.has(r.id as string))
    .map((r) => {
      const clone = JSON.parse(JSON.stringify(r)) as Record<string, unknown>;
      clone.sourceIds = ['fix-psa'];
      const claims = clone.claimSources as Record<string, string[]>;
      for (const key of Object.keys(claims ?? {})) claims[key] = ['fix-psa'];
      return clone;
    });
}

function psaFixtureRoot(extraRecords: Array<Record<string, unknown>> = []): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-psa-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-psa\n' +
      '    publisher: Philippine Statistics Authority (via PhilAtlas)\n' +
      "    url: 'https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html'\n" +
      '    sourceType: portal\n' +
      '    collector: psa-philatlas\n' +
      '    updateCadence: per-document\n' +
      '    riskTier: medium\n' +
      "    evidenceRef: 'research/demographics/26-09-demographics.md'\n" +
      '    domains:\n' +
      '      - demographics\n' +
      '      - barangays\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'records.json'),
    JSON.stringify({ records: [...psaSeedRecords(), ...extraRecords] }),
  );
  return root;
}

async function diffPsaRun(root: string, runDir: string, extraRecords: Array<Record<string, unknown>> = []) {
  const { readCandidates, readManifest } = await import('./lib/runs');
  return diffRun(
    {
      canonical: [...loadRecords(root).records, ...(extraRecords as never[])],
      candidates: readCandidates(runDir),
      manifest: readManifest(runDir),
      sources: [],
      registry: loadRegistry(root).sources,
    },
    '2026-09-16',
  );
}

interface PsaBarangay {
  name: string;
  population_2020: number;
  population_2015: number;
}

test('psa: current fixture matches three records; barangay names surface source-faithful', async () => {
  const root = psaFixtureRoot();
  const ev = evidenceDir({ 'fix-psa.html': psaFixtureHtml() });
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-psa'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'psa-unchanged',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-psa'], 'collected');
    assert.equal(summary.candidates, 4);
    assert.deepEqual(snapshotCanonical(root), before);
    const entries = await diffPsaRun(root, summary.run.dir);
    const byId = new Map(entries.map((e) => [e.recordId, e]));
    assert.equal(byId.get('population-total-2020')?.outcome, 'UNCHANGED');
    assert.equal(byId.get('demographics-census-history')?.outcome, 'UNCHANGED');
    assert.equal(byId.get('demographics-households')?.outcome, 'UNCHANGED');
    // The live source spells six barangay names differently than the current
    // canonical record (short PhilAtlas forms vs LGU long forms, plus a
    // literal-escape bug in the canonical Malaca name). The collector reports
    // them verbatim per the non-fuzzy rule, so the diff is a name-only CHANGED
    // for review — values must be untouched at every index.
    const brgy = byId.get('demographics-barangay-populations');
    assert.equal(brgy?.outcome, 'CHANGED');
    const oldList = (brgy?.oldData as { barangays: PsaBarangay[] }).barangays;
    const newList = (brgy?.candidateData as { barangays: PsaBarangay[] }).barangays;
    assert.equal(oldList.length, 86);
    assert.equal(newList.length, 86);
    // Canonical order is alphabetical while the source is numeric, so join on
    // the (2020, 2015) population pair (unique across all 86 rows): every
    // candidate pair must resolve to exactly one canonical row with identical
    // values, and only the six documented names may differ.
    const canonByPair = new Map(oldList.map((b) => [`${b.population_2020}/${b.population_2015}`, b.name]));
    assert.equal(canonByPair.size, 86, 'canonical population pairs are unique join keys');
    const nameDiffs: Array<[string, string]> = [];
    for (const nb of newList) {
      const oldName = canonByPair.get(`${nb.population_2020}/${nb.population_2015}`);
      assert.ok(oldName !== undefined, `candidate pair has no canonical match: ${nb.name}`);
      if (oldName !== nb.name) nameDiffs.push([oldName, nb.name]);
    }
    assert.deepEqual(
      nameDiffs.sort(),
      [
        ['Bugallon-Posadas St.', 'Bugallon-Posadas Street'],
        ['Burgos-Padlan', 'Burgos Padlan'],
        ['M. Soriano St.', 'M. Soriano'],
        ['Malaca\\u00f1ang', 'Malacañang'],
        ['Nelintap', 'Nilentap'],
        ['Rizal Avenue', 'Rizal'],
      ].sort(),
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('psa: changed 2020 total surfaces CHANGED on population-total-2020 only', async () => {
  const root = psaFixtureRoot();
  const html = psaSwap(psaFixtureHtml(), "<td class='iboxVal'>205,424</td>", "<td class='iboxVal'>205,425</td>");
  const ev = evidenceDir({ 'fix-psa.html': html });
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-psa'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'psa-changed-total',
      date: '2026-09-16',
    });
    assert.deepEqual(snapshotCanonical(root), before);
    const entries = await diffPsaRun(root, summary.run.dir);
    const byId = new Map(entries.map((e) => [e.recordId, e]));
    assert.equal(byId.get('population-total-2020')?.outcome, 'CHANGED');
    assert.deepEqual((byId.get('population-total-2020')?.candidateData as { total: number }).total, 205425);
    assert.equal(byId.get('demographics-census-history')?.outcome, 'UNCHANGED');
    assert.equal(byId.get('demographics-households')?.outcome, 'UNCHANGED');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('psa: changed census/household/barangay values surface on the intended record only', async () => {
  // Census history 2020 row changes: history CHANGED, total and households UNCHANGED.
  {
    const root = psaFixtureRoot();
    const html = psaSwap(psaFixtureHtml(), "<td id='pop2020'>205,424</td>", "<td id='pop2020'>205,425</td>");
    const ev = evidenceDir({ 'fix-psa.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-psa'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'psa-changed-history',
        date: '2026-09-16',
      });
      const byId = new Map((await diffPsaRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('demographics-census-history')?.outcome, 'CHANGED');
      assert.equal(byId.get('population-total-2020')?.outcome, 'UNCHANGED');
      assert.equal(byId.get('demographics-households')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Household 2015 count changes: households CHANGED, total and history UNCHANGED.
  {
    const root = psaFixtureRoot();
    const html = psaSwap(psaFixtureHtml(), '<td>42,049</td><td>4.48</td>', '<td>42,050</td><td>4.48</td>');
    const ev = evidenceDir({ 'fix-psa.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-psa'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'psa-changed-households',
        date: '2026-09-16',
      });
      const byId = new Map((await diffPsaRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('demographics-households')?.outcome, 'CHANGED');
      assert.equal(byId.get('population-total-2020')?.outcome, 'UNCHANGED');
      assert.equal(byId.get('demographics-census-history')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // One barangay value changes (footer total moves with it): barangays CHANGED,
  // total/history/households UNCHANGED.
  {
    const root = psaFixtureRoot();
    let html = psaSwap(
      psaFixtureHtml(),
      '>Abanon</a></th><td>0.96%</td><td>1,974</td><td>1,877</td>',
      '>Abanon</a></th><td>0.96%</td><td>1,975</td><td>1,877</td>',
    );
    html = psaSwap(html, "<td id='curPop'>205,424</td>", "<td id='curPop'>205,425</td>");
    const ev = evidenceDir({ 'fix-psa.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-psa'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'psa-changed-barangay',
        date: '2026-09-16',
      });
      const byId = new Map((await diffPsaRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('demographics-barangay-populations')?.outcome, 'CHANGED');
      assert.equal(byId.get('population-total-2020')?.outcome, 'UNCHANGED');
      assert.equal(byId.get('demographics-census-history')?.outcome, 'UNCHANGED');
      assert.equal(byId.get('demographics-households')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
});

test('psa: renamed table header fails closed as scoped SOURCE_CHANGED', async () => {
  const root = psaFixtureRoot();
  const html = psaSwap(psaFixtureHtml(), 'Population percentage</abbr> (2020)', 'Share</abbr> (2020)');
  const ev = evidenceDir({ 'fix-psa.html': html });
  const unrelated = {
    id: 'demographics-unrelated',
    domain: 'demographics',
    type: 'statistic',
    label: 'Unrelated',
    data: {},
    claimSources: {},
    sourceIds: ['fix-other'],
    status: 'verified',
    lastVerified: '2026-09-01',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2026-09-02',
    updateCadence: 'per-document',
  };
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-psa'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'psa-drift',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-psa'], 'failed');
    assert.equal(summary.candidates, 0);
    assert.deepEqual(snapshotCanonical(root), before);
    const { readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.ok((manifest.sources[0].error ?? '').startsWith('parse:'), 'parse-class failure recorded');
    const entries = await diffPsaRun(root, summary.run.dir, [unrelated]);
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    for (const id of PSA_IDS) assert.equal(byId.get(id), 'SOURCE_CHANGED', `${id} fails closed`);
    assert.ok(!byId.has('demographics-unrelated'), 'uncovered record is excluded, not MISSING');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('psa: wrong-city evidence fails the refresh without candidates', async () => {
  const root = psaFixtureRoot();
  const html = psaSwap(
    psaFixtureHtml(),
    'San Carlos City, Pangasinan',
    'San Carlos City, Negros Occidental',
  );
  const ev = evidenceDir({ 'fix-psa.html': html });
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-psa'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'psa-wrong-city',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-psa'], 'failed');
    assert.equal(summary.candidates, 0);
    assert.deepEqual(snapshotCanonical(root), before);
    const { readManifest } = await import('./lib/runs');
    assert.match(readManifest(summary.run.dir).sources[0].error ?? '', /Negros/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('psa: exact coverage, per-document due exclusion, confinement, and determinism', async () => {
  const root = psaFixtureRoot();
  const ev = evidenceDir({ 'fix-psa.html': psaFixtureHtml() });
  try {
    const before = snapshotCanonical(root);
    const beforeTree = listTree(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-psa'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'psa-explicit',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-psa'], 'collected');
    assert.equal(summary.candidates, 4);
    const { readCandidates, readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.deepEqual(manifest.sources[0].coverage, [...PSA_IDS]);
    const instances = readSourceInstances(summary.run.dir);
    assert.equal(instances.length, 1);
    assert.equal(instances[0].registryId, 'fix-psa');
    const candidates = readCandidates(summary.run.dir);
    for (const candidate of candidates) {
      assert.deepEqual(candidate.sourceInstanceIds, [instances[0].id]);
      assert.equal(candidate.status, 'provisional');
    }
    // Per-document sources never join --due runs, no matter the elapsed time.
    const due = await runRefresh({ root, due: true, offline: true, collectedBy: 'psa-due', date: '2026-09-17' });
    assert.ok(!('fix-psa' in due.outcomes), 'per-document source excluded from --due');
    // Confinement + immutability: only research/runs grows; canonical identical.
    assert.deepEqual(snapshotCanonical(root), before);
    for (const file of listTree(root).filter((f) => !beforeTree.includes(f))) {
      assert.ok(file.startsWith(`research${path.sep}runs${path.sep}`), `unexpected write: ${file}`);
    }
    // Determinism: a second run over identical evidence yields identical data.
    const ev2 = evidenceDir({ 'fix-psa.html': psaFixtureHtml() });
    try {
      const again = await runRefresh({
        root,
        sources: ['fix-psa'],
        offline: true,
        evidenceDir: ev2,
        collectedBy: 'psa-explicit',
        date: '2026-09-18',
      });
      const first = readCandidates(summary.run.dir).map((c) => JSON.stringify(c.data)).sort();
      const second = readCandidates(again.run.dir).map((c) => JSON.stringify(c.data)).sort();
      assert.deepEqual(second, first);
    } finally {
      fs.rmSync(ev2, { recursive: true, force: true });
    }
    // No secrets, tokens, cookies, tracking IDs, or machine-local paths leak
    // into any artifact of the run.
    const dump: string[] = [];
    const visit = (dir: string): void => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) visit(full);
        else dump.push(fs.readFileSync(full, 'utf8'));
      }
    };
    visit(summary.run.dir);
    const blob = dump.join('\n');
    assert.ok(!blob.includes(os.tmpdir()), 'machine-local path leaked into run');
    assert.ok(!/token|cookie/i.test(blob), 'credential-like material in run');
    assert.ok(!blob.includes('ca-pub'), 'tracking ID leaked into run');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('psa: CLI explicit refresh works against a fixture tree', () => {
  const root = psaFixtureRoot();
  const ev = evidenceDir({ 'fix-psa.html': psaFixtureHtml() });
  try {
    const out = execFileSync('bun', ['run', 'data:refresh', '--', '--source=fix-psa', '--offline', `--evidence-dir=${ev}`, '--collected-by=cli', '--date=2026-09-16'], {
      cwd: process.cwd(),
      env: { ...process.env, CIVIC_ROOT: root },
      encoding: 'utf8',
    });
    assert.ok(out.includes('2026-09-16'), out);
    assert.ok(out.includes('fix-psa'), out);
    assert.ok(out.includes('4 candidate(s)'), out);
    const runs = fs.readdirSync(path.join(root, 'research', 'runs'));
    assert.deepEqual(runs, ['2026-09-16']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

// ---- cenpelco pipeline tests (CENPELCO branch gallery) ----

const CENPELCO_IDS = ['utility-electricity-provider', 'cenpelco-area-offices'] as const;

const CENPELCO_FIXTURE_FILE = fileURLToPath(
  new URL('./fixtures/cenpelco-branch-gallery-2026-09-16.html', import.meta.url),
);

// Independently pinned contract (NOT derived from the collector): if parsing
// drifts, these seeds mismatch and the tests fail loudly for a human.
const CENPELCO_EXPECTED_OFFICES = [
  { id: 'aguilar', name: 'Aguilar' },
  { id: 'alcala', name: 'Alcala' },
  { id: 'basista', name: 'Basista' },
  { id: 'bautista', name: 'Bautista' },
  { id: 'bayambang', name: 'Bayambang' },
  { id: 'binmaley', name: 'Binmaley' },
  { id: 'bugallon', name: 'Bugallon' },
  { id: 'labrador', name: 'Labrador' },
  { id: 'lingayen', name: 'Lingayen' },
  { id: 'malasiqui', name: 'Malasiqui' },
  { id: 'mangaldan', name: 'Mangaldan' },
  { id: 'mangatarem', name: 'Mangatarem' },
  { id: 'sancarlos', name: 'San Carlos City (Main)' },
  { id: 'sual', name: 'Sual' },
  { id: 'urbiztondo', name: 'Urbiztondo' },
];

const CENPELCO_EXPECTED_PROVIDER = {
  provider_short: 'CENPELCO',
  provider_full: 'Central Pangasinan Electric Cooperative',
  serves_san_carlos_city: true,
  san_carlos_office: 'San Carlos City (Main)',
};

function cenFixtureHtml(): string {
  return fs.readFileSync(CENPELCO_FIXTURE_FILE, 'utf8');
}

function cenSwap(html: string, from: string, to: string, minExpected = 1): string {
  const count = html.split(from).length - 1;
  assert.ok(count >= minExpected, `expected ${minExpected}+ occurrence(s) of ${from}, found ${count}`);
  return html.split(from).join(to);
}

function cenSeedRecords(): Array<Record<string, unknown>> {
  const claim = (keys: string[]): Record<string, string[]> =>
    Object.fromEntries(keys.map((k) => [k, ['fix-cen']]));
  const base = {
    domain: 'utilities',
    sourceIds: ['fix-cen'],
    status: 'verified',
    riskTier: 'medium',
    lastVerified: '2026-06-16',
    acceptedBy: 'fixture',
    acceptedAt: '2026-06-16',
    nextReviewOn: '2026-09-16',
    updateCadence: 'quarterly',
  };
  return [
    {
      ...base,
      id: 'utility-electricity-provider',
      type: 'service',
      label: 'Electricity distribution provider (CENPELCO)',
      data: { ...CENPELCO_EXPECTED_PROVIDER },
      claimSources: claim(['provider_short', 'provider_full', 'serves_san_carlos_city', 'san_carlos_office']),
    },
    {
      ...base,
      id: 'cenpelco-area-offices',
      type: 'directory',
      label: 'CENPELCO area offices',
      data: { offices: CENPELCO_EXPECTED_OFFICES.map((o) => ({ ...o })) },
      claimSources: claim(['offices']),
    },
  ];
}

function cenFixtureRoot(extraRecords: Array<Record<string, unknown>> = []): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-cen-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: fix-cen\n' +
      '    publisher: Central Pangasinan Electric Cooperative\n' +
      "    url: 'https://cenpelco.com/'\n" +
      '    sourceType: website\n' +
      '    collector: cenpelco\n' +
      '    updateCadence: quarterly\n' +
      '    riskTier: medium\n' +
      "    evidenceRef: 'research/utilities/26-09-cenpelco-contacts.md'\n" +
      '    domains:\n' +
      '      - utilities\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'records.json'),
    JSON.stringify({ records: [...cenSeedRecords(), ...extraRecords] }),
  );
  return root;
}

async function diffCenRun(root: string, runDir: string, extraRecords: Array<Record<string, unknown>> = []) {
  const { readCandidates, readManifest } = await import('./lib/runs');
  return diffRun(
    {
      canonical: [...loadRecords(root).records, ...(extraRecords as never[])],
      candidates: readCandidates(runDir),
      manifest: readManifest(runDir),
      sources: [],
      registry: loadRegistry(root).sources,
    },
    '2026-09-16',
  );
}

test('cen: current fixture matches seeds; empty slice yields exactly two NEW', async () => {
  // UNCHANGED against matching seeds.
  {
    const root = cenFixtureRoot();
    const ev = evidenceDir({ 'fix-cen.html': cenFixtureHtml() });
    try {
      const before = snapshotCanonical(root);
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-unchanged',
        date: '2026-09-16',
      });
      assert.equal(summary.outcomes['fix-cen'], 'collected');
      assert.equal(summary.candidates, 2);
      assert.deepEqual(snapshotCanonical(root), before);
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e.outcome]));
      assert.equal(byId.get('utility-electricity-provider'), 'UNCHANGED');
      assert.equal(byId.get('cenpelco-area-offices'), 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // NEW against an empty utilities slice (collector-only flow: no canonical records yet).
  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-cen-empty-'));
    try {
      fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
      fs.mkdirSync(path.join(root, 'research'), { recursive: true });
      fs.writeFileSync(
        path.join(root, 'data', 'civic', 'source-registry.yaml'),
        'version: 1\n' +
          'sources:\n' +
          '  - id: fix-cen\n' +
          '    publisher: Central Pangasinan Electric Cooperative\n' +
          "    url: 'https://cenpelco.com/'\n" +
          '    sourceType: website\n' +
          '    collector: cenpelco\n' +
          '    updateCadence: quarterly\n' +
          "    evidenceRef: 'research/utilities/26-09-cenpelco-contacts.md'\n" +
          '    domains:\n' +
          '      - utilities\n',
      );
      fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
      fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
      fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
      const ev = evidenceDir({ 'fix-cen.html': cenFixtureHtml() });
      try {
        const summary = await runRefresh({
          root,
          sources: ['fix-cen'],
          offline: true,
          evidenceDir: ev,
          collectedBy: 'cen-new',
          date: '2026-09-16',
        });
        assert.equal(summary.candidates, 2);
        const entries = await diffCenRun(root, summary.run.dir);
        assert.deepEqual(
          entries.map((e) => [e.recordId, e.outcome]).sort(),
          [...CENPELCO_IDS].map((id) => [id, 'NEW']).sort(),
        );
      } finally {
        fs.rmSync(ev, { recursive: true, force: true });
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('cen: office add/remove/rename is CHANGED; reorder alone is UNCHANGED', async () => {
  const galleryItem = (slug: string, name: string): string =>
    `<li><a href="../branches/${slug}/${slug}.jsp" target="frame1">${name}</a></li>`;
  // Added office: offices CHANGED, provider UNCHANGED.
  {
    const root = cenFixtureRoot();
    const html = cenFixtureHtml().replace(
      '</ul>',
      `${galleryItem('infanta', 'Infanta')}</ul>`,
    );
    const ev = evidenceDir({ 'fix-cen.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-added',
        date: '2026-09-16',
      });
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('cenpelco-area-offices')?.outcome, 'CHANGED');
      assert.equal(
        ((byId.get('cenpelco-area-offices')?.candidateData as { offices: Array<{ id: string }> }).offices.length),
        16,
      );
      assert.equal(byId.get('utility-electricity-provider')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Removed office: offices CHANGED, provider UNCHANGED.
  {
    const root = cenFixtureRoot();
    const html = cenSwap(
      cenFixtureHtml(),
      galleryItem('sual', 'Sual'),
      '',
    );
    const ev = evidenceDir({ 'fix-cen.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-removed',
        date: '2026-09-16',
      });
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('cenpelco-area-offices')?.outcome, 'CHANGED');
      assert.equal(byId.get('utility-electricity-provider')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Renamed office: offices CHANGED, provider UNCHANGED.
  {
    const root = cenFixtureRoot();
    const html = cenSwap(cenFixtureHtml(), '>Bugallon</a>', '>Bugallon City</a>');
    const ev = evidenceDir({ 'fix-cen.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-renamed',
        date: '2026-09-16',
      });
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('cenpelco-area-offices')?.outcome, 'CHANGED');
      assert.equal(byId.get('utility-electricity-provider')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Reordered gallery: both UNCHANGED (order is normalized by slug).
  {
    const root = cenFixtureRoot();
    const html = cenFixtureHtml();
    const ulOpen = html.indexOf('<ul>');
    const ulClose = html.indexOf('</ul>', ulOpen);
    const items = [...html.slice(ulOpen, ulClose).matchAll(/<li>[\s\S]*?<\/li>/g)].map((m) => m[0]);
    assert.equal(items.length, 15);
    const reordered = html.slice(0, ulOpen) + '<ul>' + [...items].reverse().join('') + html.slice(ulClose);
    const ev = evidenceDir({ 'fix-cen.html': reordered });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-reordered',
        date: '2026-09-16',
      });
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e]));
      assert.equal(byId.get('cenpelco-area-offices')?.outcome, 'UNCHANGED');
      assert.equal(byId.get('utility-electricity-provider')?.outcome, 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
});

test('cen: missing gallery fails closed as scoped SOURCE_CHANGED', async () => {
  const root = cenFixtureRoot();
  const html = cenSwap(cenFixtureHtml(), 'CENPELCO Gallery of Branches', 'Our Branches');
  const ev = evidenceDir({ 'fix-cen.html': html });
  const unrelated = {
    id: 'utility-water-provider',
    domain: 'utilities',
    type: 'service',
    label: 'Unrelated water provider',
    data: {},
    claimSources: {},
    sourceIds: ['fix-other'],
    status: 'verified',
    lastVerified: '2026-09-01',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2026-09-02',
    updateCadence: 'per-document',
  };
  try {
    const before = snapshotCanonical(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-cen'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'cen-drift',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-cen'], 'failed');
    assert.equal(summary.candidates, 0);
    assert.deepEqual(snapshotCanonical(root), before);
    const { readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.ok((manifest.sources[0].error ?? '').startsWith('parse:'), 'parse-class failure recorded');
    const entries = await diffCenRun(root, summary.run.dir, [unrelated]);
    const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
    for (const id of CENPELCO_IDS) assert.equal(byId.get(id), 'SOURCE_CHANGED', `${id} fails closed`);
    assert.ok(!byId.has('utility-water-provider'), 'uncovered record is excluded, not MISSING');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('cen: ambiguous San Carlos and duplicate offices fail without candidates', async () => {
  // Ambiguous San Carlos variant: refresh fails, zero candidates.
  {
    const root = cenFixtureRoot();
    const html = cenFixtureHtml().replace(
      '</ul>',
      '<li><a href="../branches/sancarlos-north/sancarlos-north.jsp">San Carlos City (North)</a></li></ul>',
    );
    const ev = evidenceDir({ 'fix-cen.html': html });
    try {
      const before = snapshotCanonical(root);
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-ambiguous',
        date: '2026-09-16',
      });
      assert.equal(summary.outcomes['fix-cen'], 'failed');
      assert.equal(summary.candidates, 0);
      assert.deepEqual(snapshotCanonical(root), before);
      const { readManifest } = await import('./lib/runs');
      assert.match(readManifest(summary.run.dir).sources[0].error ?? '', /ambiguous San Carlos/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Duplicate office variant: refresh fails, zero candidates.
  {
    const root = cenFixtureRoot();
    const li = '<li><a href="../branches/sual/sual.jsp" target="frame1">Sual</a></li>';
    const html = cenFixtureHtml().replace(li, `${li}${li}`);
    const ev = evidenceDir({ 'fix-cen.html': html });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-duplicate',
        date: '2026-09-16',
      });
      assert.equal(summary.outcomes['fix-cen'], 'failed');
      assert.equal(summary.candidates, 0);
      const { readManifest } = await import('./lib/runs');
      assert.match(readManifest(summary.run.dir).sources[0].error ?? '', /duplicate office identity/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
  // Injected contact text changes nothing: unpublished contacts stay out of
  // candidates, coverage, and MISSING.
  {
    const root = cenFixtureRoot();
    const injected = cenFixtureHtml().replace(
      '</body>',
      '<p>San Carlos Main Office 532-2222. Email info@cenpelco.com. GM on duty.</p></body>',
    );
    const ev = evidenceDir({ 'fix-cen.html': injected });
    try {
      const summary = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev,
        collectedBy: 'cen-contacts',
        date: '2026-09-16',
      });
      assert.equal(summary.candidates, 2);
      const { readCandidates, readManifest } = await import('./lib/runs');
      assert.deepEqual(readManifest(summary.run.dir).sources[0].coverage, [...CENPELCO_IDS]);
      const blob = JSON.stringify(readCandidates(summary.run.dir).map((c) => c.data));
      assert.ok(!blob.includes('532-2222'), 'injected phone must not enter candidate data');
      assert.ok(!blob.includes('info@cenpelco.com'), 'injected email must not enter candidate data');
      const byId = new Map((await diffCenRun(root, summary.run.dir)).map((e) => [e.recordId, e.outcome]));
      assert.equal(byId.get('utility-electricity-provider'), 'UNCHANGED');
      assert.equal(byId.get('cenpelco-area-offices'), 'UNCHANGED');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(ev, { recursive: true, force: true });
    }
  }
});

test('cen: quarterly due selects when due, skips when fresh; runs stay confined', async () => {
  const root = cenFixtureRoot();
  const ev = evidenceDir({ 'fix-cen.html': cenFixtureHtml() });
  try {
    const before = snapshotCanonical(root);
    const beforeTree = listTree(root);
    const summary = await runRefresh({
      root,
      sources: ['fix-cen'],
      offline: true,
      evidenceDir: ev,
      collectedBy: 'cen-explicit',
      date: '2026-09-16',
    });
    assert.equal(summary.outcomes['fix-cen'], 'collected');
    assert.equal(summary.candidates, 2);
    const { readCandidates, readManifest } = await import('./lib/runs');
    const manifest = readManifest(summary.run.dir);
    assert.deepEqual(manifest.sources[0].coverage, [...CENPELCO_IDS]);
    const instances = readSourceInstances(summary.run.dir);
    assert.equal(instances.length, 1);
    assert.equal(instances[0].registryId, 'fix-cen');
    for (const candidate of readCandidates(summary.run.dir)) {
      assert.deepEqual(candidate.sourceInstanceIds, [instances[0].id]);
      assert.equal(candidate.status, 'provisional');
    }
    // Quarterly source with a recent successful check is not due again yet.
    writeHistoryManifest(root, '2026-09-07', [
      { sourceId: 'fix-cen', checkedAt: daysAgoIso(9), outcome: 'collected' },
    ]);
    const fresh = await runRefresh({ root, due: true, offline: true, collectedBy: 'cen-due-fresh', date: '2026-09-17' });
    assert.ok(!('fix-cen' in fresh.outcomes), 'recently collected quarterly source is not due');
    // Quarterly source with an old failure retries instead of waiting out the quarter.
    const root2 = cenFixtureRoot();
    try {
      writeHistoryManifest(root2, '2026-09-07', [
        { sourceId: 'fix-cen', checkedAt: daysAgoIso(8), outcome: 'failed', error: 'fetch: refused' },
      ]);
      const retry = await runRefresh({ root: root2, due: true, offline: true, collectedBy: 'cen-due-retry', date: '2026-09-17' });
      assert.ok('fix-cen' in retry.outcomes, 'failed quarterly source retries via policy');
    } finally {
      fs.rmSync(root2, { recursive: true, force: true });
    }
    // Confinement + immutability.
    assert.deepEqual(snapshotCanonical(root), before);
    for (const file of listTree(root).filter((f) => !beforeTree.includes(f))) {
      assert.ok(file.startsWith(`research${path.sep}runs${path.sep}`), `unexpected write: ${file}`);
    }
    // Determinism across runs.
    const ev2 = evidenceDir({ 'fix-cen.html': cenFixtureHtml() });
    try {
      const again = await runRefresh({
        root,
        sources: ['fix-cen'],
        offline: true,
        evidenceDir: ev2,
        collectedBy: 'cen-explicit',
        date: '2026-09-18',
      });
      const first = readCandidates(summary.run.dir).map((c) => JSON.stringify(c.data)).sort();
      const second = readCandidates(again.run.dir).map((c) => JSON.stringify(c.data)).sort();
      assert.deepEqual(second, first);
    } finally {
      fs.rmSync(ev2, { recursive: true, force: true });
    }
    // No secrets or machine-local paths leak into run artifacts.
    const dump: string[] = [];
    const visit = (dir: string): void => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) visit(full);
        else dump.push(fs.readFileSync(full, 'utf8'));
      }
    };
    visit(summary.run.dir);
    const blob = dump.join('\n');
    assert.ok(!blob.includes(os.tmpdir()), 'machine-local path leaked into run');
    assert.ok(!/token|cookie/i.test(blob), 'credential-like material in run');
    assert.ok(!blob.includes('ca-pub'), 'tracking ID leaked into run');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});

test('cen: CLI explicit refresh works against a fixture tree', () => {
  const root = cenFixtureRoot();
  const ev = evidenceDir({ 'fix-cen.html': cenFixtureHtml() });
  try {
    const out = execFileSync('bun', ['run', 'data:refresh', '--', '--source=fix-cen', '--offline', `--evidence-dir=${ev}`, '--collected-by=cli', '--date=2026-09-16'], {
      cwd: process.cwd(),
      env: { ...process.env, CIVIC_ROOT: root },
      encoding: 'utf8',
    });
    assert.ok(out.includes('2026-09-16'), out);
    assert.ok(out.includes('fix-cen'), out);
    assert.ok(out.includes('2 candidate(s)'), out);
    const runs = fs.readdirSync(path.join(root, 'research', 'runs'));
    assert.deepEqual(runs, ['2026-09-16']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(ev, { recursive: true, force: true });
  }
});
