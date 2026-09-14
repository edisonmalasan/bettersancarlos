import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildSourceInstance,
  findSourceByContent,
  makeSourceInstanceId,
  readSourceInstances,
  sourceContentKey,
  writeSourceInstances,
} from './instances';
import type { RegistryEntry, SourceRecord } from './civic';

function registry(overrides: Partial<RegistryEntry> = {}): RegistryEntry {
  return {
    id: 'lgu-website',
    publisher: 'City Government of San Carlos',
    url: 'https://example.test/',
    sourceType: 'website',
    collector: 'city-website',
    updateCadence: 'quarterly',
    evidenceRef: 'research/evidence.md',
    ...overrides,
  };
}

test('instance IDs are stable and content-addressed', () => {
  const sha = 'a13f92c1'.padEnd(64, '0');
  assert.equal(makeSourceInstanceId('lgu-website', '2026-09-15', sha), 'src-lgu-website-2026-09-15-a13f92c1');
  assert.equal(makeSourceInstanceId('lgu-website', '2026-09-15', sha), makeSourceInstanceId('lgu-website', '2026-09-15', sha.toUpperCase()));
  assert.notEqual(
    makeSourceInstanceId('lgu-website', '2026-09-15', sha),
    makeSourceInstanceId('lgu-website', '2026-09-15', 'b'.repeat(64)),
  );
  assert.notEqual(
    makeSourceInstanceId('lgu-website', '2026-09-15', sha),
    makeSourceInstanceId('other-site', '2026-09-15', sha),
  );
});

test('buildSourceInstance fills evidence identity with posix evidence path', () => {
  const instance = buildSourceInstance({
    registry: registry(),
    evidenceName: 'lgu-website.html',
    evidenceBytes: Buffer.from('<html>hi</html>'),
    runId: '2026-09-15',
    collectedBy: 'agent',
    documentType: 'webpage',
  });
  assert.match(instance.id, /^src-lgu-website-2026-09-15-[0-9a-f]{8}$/);
  assert.equal(instance.registryId, 'lgu-website');
  assert.equal(instance.retrievedAt, '2026-09-15');
  assert.equal(instance.evidencePath, 'research/runs/2026-09-15/evidence/lgu-website.html');
  assert.ok(!instance.evidencePath.includes('\\'));
  assert.match(instance.sha256 ?? '', /^[0-9a-f]{64}$/);
  assert.equal(instance.sourceState, 'active');
  // Suffixed run IDs still yield the calendar date.
  const suffixed = buildSourceInstance({
    registry: registry(),
    evidenceName: 'x.html',
    evidenceBytes: 'bytes',
    runId: '2026-09-15-2',
    collectedBy: 'agent',
    documentType: 'webpage',
  });
  assert.equal(suffixed.retrievedAt, '2026-09-15');
});

test('write/read round-trips the run artifact; missing file reads as empty', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-instances-'));
  try {
    assert.deepEqual(readSourceInstances(dir), []);
    const instance = buildSourceInstance({
      registry: registry(),
      evidenceName: 'lgu-website.html',
      evidenceBytes: 'bytes',
      runId: '2026-09-15',
      collectedBy: 'agent',
      documentType: 'webpage',
    });
    writeSourceInstances(dir, [instance]);
    assert.deepEqual(readSourceInstances(dir), [instance]);
    const envelope = JSON.parse(fs.readFileSync(path.join(dir, 'source-instances.json'), 'utf8')) as {
      version: number;
    };
    assert.equal(envelope.version, 1);
    assert.throws(() => writeSourceInstances(dir, [{ ...instance, id: '' }]), /missing id/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('byte-identical re-collection reuses the same content key (dedupe)', () => {
  const bytes = Buffer.from('<html>same</html>');
  const first = buildSourceInstance({
    registry: registry(),
    evidenceName: 'lgu-website.html',
    evidenceBytes: bytes,
    runId: '2026-09-15',
    collectedBy: 'agent',
    documentType: 'webpage',
  });
  const second = buildSourceInstance({
    registry: registry(),
    evidenceName: 'lgu-website.html',
    evidenceBytes: Buffer.from('<html>same</html>'),
    runId: '2026-09-16-2',
    collectedBy: 'agent',
    documentType: 'webpage',
  });
  // Different run/date → different IDs, but identical content keys.
  assert.notEqual(first.id, second.id);
  assert.equal(sourceContentKey(first.registryId, first.sha256 ?? ''), sourceContentKey(second.registryId, second.sha256 ?? ''));
  const accepted: SourceRecord[] = [
    {
      id: first.id,
      title: first.title,
      publisher: first.publisher,
      documentType: 'webpage',
      retrievedAt: '2026-09-15',
      verifier: 'agent',
      sourceState: 'active',
      registryId: 'lgu-website',
      sha256: first.sha256,
    },
  ];
  assert.equal(findSourceByContent(accepted, second.registryId, second.sha256)?.id, first.id);
  assert.equal(findSourceByContent(accepted, 'other-site', second.sha256), undefined);
  assert.equal(findSourceByContent(accepted, second.registryId, undefined), undefined);
  assert.equal(findSourceByContent(accepted, second.registryId, 'f'.repeat(64)), undefined);
});
