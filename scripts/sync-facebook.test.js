import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sha256FileHex } from './data/lib/json';

const GRAPH_FIXTURE = JSON.stringify({
  data: [
    {
      id: '123_456',
      message: 'Power interruption advisory for Barangay Talang tomorrow',
      created_time: '2026-09-10T08:30:00+0000',
      permalink_url: 'https://www.facebook.com/post/1',
    },
    {
      id: '123_789',
      message: 'Join us for the Mango-Bamboo Festival opening parade!',
      created_time: '2026-09-09T08:30:00+0000',
      permalink_url: 'https://www.facebook.com/post/2',
    },
  ],
});

function fixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-sync-fb-'));
  fs.mkdirSync(path.join(root, 'data', 'civic'), { recursive: true });
  fs.mkdirSync(path.join(root, 'research'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'data', 'civic', 'source-registry.yaml'),
    'version: 1\n' +
      'sources:\n' +
      '  - id: lgu-facebook-cio\n' +
      '    publisher: City Information Office\n' +
      "    url: 'https://www.facebook.com/sccp.cio'\n" +
      '    sourceType: facebook-page\n' +
      '    collector: facebook\n' +
      '    updateCadence: weekly\n' +
      "    evidenceRef: 'research/evidence.md'\n" +
      '    domains:\n' +
      '      - news\n',
  );
  fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), '{"records": []}');
  fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), '{"sources": []}');
  fs.writeFileSync(
    path.join(root, 'data', 'news.json'),
    JSON.stringify({ news: [{ id: 'sentinel', title: 'Do not touch' }] }),
  );
  const fixture = path.join(root, 'graph-fixture.json');
  fs.writeFileSync(fixture, GRAPH_FIXTURE);
  return { root, fixture };
}

function cleanup(root) {
  fs.rmSync(root, { recursive: true, force: true });
}

function syncEnv(root, fixture) {
  const env = { ...process.env, CIVIC_ROOT: root };
  delete env.FB_PAGE_ID;
  delete env.FB_ACCESS_TOKEN;
  if (fixture) env.FB_FIXTURE = fixture;
  else delete env.FB_FIXTURE;
  return env;
}

test('fixture ingestion produces a research run with candidates and never writes news.json', () => {
  const { root, fixture } = fixtureRoot();
  try {
    const newsPath = path.join(root, 'data', 'news.json');
    const before = sha256FileHex(newsPath);
    const out = execFileSync('node', ['scripts/sync-facebook.js', '--date=2026-09-14'], {
      cwd: process.cwd(),
      env: syncEnv(root, fixture),
      encoding: 'utf8',
    });
    assert.ok(out.includes('2026-09-14'), out);
    const runDir = path.join(root, 'research', 'runs', '2026-09-14');
    const manifest = JSON.parse(fs.readFileSync(path.join(runDir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.sources[0].sourceId, 'lgu-facebook-cio');
    assert.equal(manifest.sources[0].outcome, 'collected');
    assert.ok(manifest.sources[0].evidenceSha256);
    const candidates = JSON.parse(fs.readFileSync(path.join(runDir, 'candidates.json'), 'utf8')).candidates;
    assert.equal(candidates.length, 2);
    for (const candidate of candidates) {
      assert.equal(candidate.domain, 'news');
      assert.equal(candidate.status, 'provisional');
      assert.ok(candidate.id.startsWith('news-fb-'), candidate.id);
      assert.deepEqual(candidate.sourceIds, ['lgu-facebook-cio']);
    }
    assert.ok(fs.existsSync(path.join(runDir, 'evidence', 'lgu-facebook-cio.json')));
    // No direct news.json write: the sentinel file is byte-identical.
    assert.equal(sha256FileHex(newsPath), before);
  } finally {
    cleanup(root);
  }
});

test('dormant without token or fixture: exit 0, no run, no writes', () => {
  const { root } = fixtureRoot();
  try {
    const out = execFileSync('node', ['scripts/sync-facebook.js'], {
      cwd: process.cwd(),
      env: syncEnv(root, null),
      encoding: 'utf8',
    });
    assert.ok(out.includes('dormant'), out);
    assert.ok(!fs.existsSync(path.join(root, 'research', 'runs')));
  } finally {
    cleanup(root);
  }
});
