import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadRecords, loadRegistry, loadSources } from './civic';

test('loads the real registry: 23 entries, known fields, url-or-discovery', () => {
  const registry = loadRegistry();
  assert.equal(registry.version, 1);
  assert.equal(registry.sources.length, 23);
  const ids = registry.sources.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of registry.sources) {
    assert.ok(entry.url ?? entry.discovery, `${entry.id} needs url or discovery`);
    assert.ok(entry.publisher.length > 0, `${entry.id} needs a publisher`);
    assert.ok(
      fs.existsSync(path.join(process.cwd(), entry.evidenceRef)),
      `${entry.id} evidenceRef missing: ${entry.evidenceRef}`,
    );
  }
  const site = registry.sources.find((s) => s.id === 'lgu-website');
  assert.equal(site?.collector, 'city-website');
  assert.equal(site?.url, 'https://sancarlospangasinan.gov.ph/');
});

test('loads records and sources envelopes with unique ids', () => {
  const records = loadRecords().records;
  assert.ok(records.length > 0, 'expected seeded canonical records');
  const ids = records.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  const mayor = records.find((r) => r.id === 'city-mayor-current');
  assert.equal(mayor?.domain, 'government');
  assert.ok((mayor?.sourceIds.length ?? 0) > 0);
  const sources = loadSources().sources;
  const sourceIds = sources.map((s) => s.id);
  assert.equal(new Set(sourceIds).size, sourceIds.length);
});

test('CIVIC_ROOT redirects loaders to a fixture tree', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-'));
  const prev = process.env.CIVIC_ROOT;
  try {
    fs.mkdirSync(path.join(dir, 'data', 'civic'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'data', 'civic', 'source-registry.yaml'),
      'version: 1\nsources:\n  - id: fixture-src\n    publisher: Fixture\n    url: \'https://example.test/\'\n    sourceType: website\n    collector: null\n    updateCadence: manual\n',
    );
    fs.writeFileSync(path.join(dir, 'data', 'civic', 'records.json'), '{"records": []}');
    fs.writeFileSync(path.join(dir, 'data', 'civic', 'sources.json'), '{"sources": []}');
    process.env.CIVIC_ROOT = dir;
    const registry = loadRegistry();
    assert.equal(registry.sources.length, 1);
    assert.equal(registry.sources[0].id, 'fixture-src');
    assert.deepEqual(loadRecords().records, []);
  } finally {
    if (prev === undefined) delete process.env.CIVIC_ROOT;
    else process.env.CIVIC_ROOT = prev;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
