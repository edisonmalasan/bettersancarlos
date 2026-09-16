import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDomainJson } from './generate';
import { diffRun } from './diff';
import { loadRecords, loadRegistry, loadSources, type CivicRecord } from './lib/civic';
import { readSourceInstances } from './lib/instances';
import { sha256FileHex, sha256Hex } from './lib/json';
import { promoteRun } from './promote';
import { runRefresh } from './refresh';

// Test 1 — exact source provenance, end to end:
// refresh source → evidence stored → candidate produced → independent
// promotion → source instance added to sources.json → canonical record
// references the exact instance → generate succeeds. Fully offline.
function emg(id: string, service: string, number = '(075) 000-0000'): CivicRecord {
  return {
    id,
    domain: 'emergency',
    type: 'contact',
    label: service,
    data: { service, number },
    sourceIds: ['src-fix'],
    status: 'verified',
    riskTier: 'high',
    lastVerified: '2026-09-01',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-02',
    nextReviewOn: '2099-01-01',
    updateCadence: 'quarterly',
  };
}

test('end-to-end exact provenance: refresh to promotion to generate', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-e2e-'));
  const evidenceBytes = '<html><body><div>City Hall trunk line: (075) 600-1432. Call during office hours.</div></body></html>';
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
        '    updateCadence: quarterly\n' +
        "    evidenceRef: 'research/evidence.md'\n" +
        '    domains:\n' +
        '      - emergency\n',
    );
    fs.writeFileSync(path.join(root, 'research', 'evidence.md'), '# fixture\n');
    fs.writeFileSync(path.join(root, 'data', 'civic', 'sources.json'), JSON.stringify({
      sources: [
        {
          id: 'src-fix',
          title: 'Fixture doc',
          publisher: 'Fixture',
          url: 'https://example.test/doc',
          documentType: 'webpage',
          retrievedAt: '2026-09-04',
          verifier: 'fixture',
          sourceState: 'active',
          registryId: 'fix-site',
        },
      ],
    }));
    const seeds: CivicRecord[] = [
      'emergency-national-911',
      'emergency-pnp-117',
      'emergency-redcross-143',
      'emergency-complaint-8888',
      'cdrmo-emergency-contact',
      'pnp-sancarlos-contact',
      'bfp-sancarlos-contact',
    ].map((id) => emg(id, id));
    seeds.push({
      id: 'emergency-publication-note',
      domain: 'emergency',
      type: 'document',
      label: 'Note',
      data: { note: 'fixture note' },
      sourceIds: ['src-fix'],
      status: 'verified',
      riskTier: 'low',
      lastVerified: '2026-09-01',
      acceptedBy: 'fixture',
      acceptedAt: '2026-09-02',
      nextReviewOn: '2099-01-01',
      updateCadence: 'manual',
    } as CivicRecord);
    fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), JSON.stringify({ records: seeds }));

    const evDir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-e2e-evidence-'));
    try {
      fs.writeFileSync(path.join(evDir, 'fix-site.html'), evidenceBytes);

      const summary = await runRefresh({
        root,
        sources: ['fix-site'],
        offline: true,
        evidenceDir: evDir,
        collectedBy: 'agent',
        date: '2026-09-14',
      });
      assert.equal(summary.candidates, 1);

      const promoted = promoteRun(
        { root, runId: summary.run.runId, records: ['city-hall-trunk-line'], reviewer: 'reviewer' },
        '2026-09-14',
      );
      assert.deepEqual(promoted.promoted, ['city-hall-trunk-line']);
      assert.equal(promoted.promotedSources.length, 1);
      const [instanceId] = promoted.promotedSources;
      assert.match(instanceId, /^src-fix-site-2026-09-14-[0-9a-f]{8}$/);

      const sources = loadSources(root).sources;
      const instance = sources.find((s) => s.id === instanceId);
      assert.ok(instance, 'instance must be appended to sources.json');
      assert.equal(instance.registryId, 'fix-site');
      assert.equal(instance.sha256, sha256Hex(evidenceBytes));
      assert.equal(instance.evidencePath ?? '', `research/runs/${summary.run.runId}/evidence/fix-site.html`);

      const records = loadRecords(root).records;
      const trunk = records.find((r) => r.id === 'city-hall-trunk-line');
      assert.ok(trunk);
      assert.deepEqual(trunk.sourceIds, [instanceId]);
      assert.equal(trunk.nextReviewOn, '2026-12-15');

      const out = buildDomainJson('emergency', records, sources) as {
        city_hotlines: Array<{ number: string }>;
      };
      assert.ok(out.city_hotlines.some((h) => h.number === '(075) 600-1432'));
    } finally {
      fs.rmSync(evDir, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// Test 2 — PSA demographics end to end on an isolated fixture tree:
// staged PhilAtlas evidence -> refresh (instance + 4 provisional candidates)
// -> diff -> independent reviewed promotion -> canonical records point at the
// exact new source instance -> demographics compatibility JSON regenerates.
// Production canonical data is snapshotted and must remain byte-identical.
const PSA_E2E_IDS = [
  'population-total-2020',
  'demographics-census-history',
  'demographics-households',
  'demographics-barangay-populations',
  'demographics-core',
  'city-geo-core',
  'demographics-publication-note',
];

test('end-to-end PSA provenance: refresh to promotion to generate', async () => {
  const prodRecords = path.join(process.cwd(), 'data', 'civic', 'records.json');
  const prodSources = path.join(process.cwd(), 'data', 'civic', 'sources.json');
  const prodBefore = { records: sha256FileHex(prodRecords), sources: sha256FileHex(prodSources) };
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-psa-e2e-'));
  try {
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
    fs.writeFileSync(
      path.join(root, 'data', 'civic', 'sources.json'),
      JSON.stringify({
        sources: [
          {
            id: 'src-psa-seed',
            title: 'Seed source',
            publisher: 'Philippine Statistics Authority (via PhilAtlas)',
            url: 'https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html',
            documentType: 'webpage',
            retrievedAt: '2026-09-04',
            verifier: 'fixture',
            sourceState: 'active',
            registryId: 'fix-psa',
          },
        ],
      }),
    );
    const prod = JSON.parse(fs.readFileSync(prodRecords, 'utf8')) as { records: CivicRecord[] };
    const wanted = new Set(PSA_E2E_IDS);
    const seeds = prod.records
      .filter((r) => wanted.has(r.id))
      .map((r) => {
        const clone = JSON.parse(JSON.stringify(r)) as CivicRecord;
        clone.sourceIds = ['src-psa-seed'];
        for (const key of Object.keys(clone.claimSources ?? {})) {
          (clone.claimSources as Record<string, string[]>)[key] = ['src-psa-seed'];
        }
        return clone;
      });
    assert.equal(seeds.length, 7, 'all demographics records seeded');
    // Stale the year-specific total so promotion must revise exactly one value.
    const staleTotal = seeds.find((r) => r.id === 'population-total-2020');
    assert.ok(staleTotal);
    (staleTotal.data as Record<string, unknown>).total = 205000;
    fs.writeFileSync(path.join(root, 'data', 'civic', 'records.json'), JSON.stringify({ records: seeds }));

    const evDir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-psa-e2e-evidence-'));
    try {
      const fixtureBytes = fs.readFileSync(
        fileURLToPath(new URL('./fixtures/psa-philatlas-san-carlos-2026-09-16.html', import.meta.url)),
        'utf8',
      );
      fs.writeFileSync(path.join(evDir, 'fix-psa.html'), fixtureBytes);

      const summary = await runRefresh({
        root,
        sources: ['fix-psa'],
        offline: true,
        evidenceDir: evDir,
        collectedBy: 'e2e-collector',
        date: '2026-09-16',
      });
      assert.equal(summary.outcomes['fix-psa'], 'collected');
      assert.equal(summary.candidates, 4);

      const instances = readSourceInstances(summary.run.dir);
      assert.equal(instances.length, 1);
      assert.equal(instances[0].registryId, 'fix-psa');
      assert.equal(instances[0].sha256, sha256Hex(fixtureBytes));

      const { readCandidates, readManifest } = await import('./lib/runs');
      const entries = diffRun(
        {
          canonical: loadRecords(root).records,
          candidates: readCandidates(summary.run.dir),
          manifest: readManifest(summary.run.dir),
          sources: loadSources(root).sources,
          registry: loadRegistry(root).sources,
        },
        '2026-09-16',
      );
      const byId = new Map(entries.map((e) => [e.recordId, e.outcome]));
      assert.equal(byId.get('population-total-2020'), 'CHANGED');
      assert.equal(byId.get('demographics-census-history'), 'UNCHANGED');
      assert.equal(byId.get('demographics-households'), 'UNCHANGED');
      assert.equal(byId.get('demographics-barangay-populations'), 'CHANGED');

      const promoted = promoteRun(
        { root, runId: summary.run.runId, all: true, reviewer: 'e2e-reviewer' },
        '2026-09-16',
      );
      assert.deepEqual([...promoted.promoted].sort(), [...PSA_E2E_IDS.slice(0, 4)].sort());
      assert.equal(promoted.promotedSources.length, 1);
      const [instanceId] = promoted.promotedSources;
      assert.match(instanceId, /^src-fix-psa-2026-09-16-[0-9a-f]{8}$/);
      assert.equal(instanceId, instances[0].id, 'canonical instance is the exact run instance');

      const sources = loadSources(root).sources;
      const instance = sources.find((s) => s.id === instanceId);
      assert.ok(instance, 'instance must be appended to sources.json');
      assert.equal(instance.registryId, 'fix-psa');
      assert.equal(instance.sha256, sha256Hex(fixtureBytes));
      assert.equal(instance.evidencePath ?? '', `research/runs/${summary.run.runId}/evidence/fix-psa.html`);

      const records = loadRecords(root).records;
      const total = records.find((r) => r.id === 'population-total-2020');
      assert.ok(total);
      assert.equal((total.data as Record<string, unknown>).total, 205424);
      assert.deepEqual(total.sourceIds, [instanceId]);
      assert.deepEqual(total.claimSources?.total, [instanceId]);
      assert.equal(total.nextReviewOn, '2026-09-16', 'per-document sentinel preserved');

      const out = buildDomainJson('demographics', records, sources) as {
        population: { total: number };
        barangays: unknown[];
        census_history: unknown[];
        municipality: string;
      };
      assert.equal(out.population.total, 205424);
      assert.equal(out.barangays.length, 86);
      assert.equal(out.census_history.length, 15);
      assert.equal(out.municipality, 'San Carlos City');
    } finally {
      fs.rmSync(evDir, { recursive: true, force: true });
    }
    assert.deepEqual(
      { records: sha256FileHex(prodRecords), sources: sha256FileHex(prodSources) },
      prodBefore,
      'production canonical data untouched',
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
