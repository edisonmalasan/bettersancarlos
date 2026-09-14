import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDomainJson } from './generate';
import { loadRecords, loadSources, type CivicRecord } from './lib/civic';
import { sha256Hex } from './lib/json';
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
