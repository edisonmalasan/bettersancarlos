// Source-instance helpers: exact retrieved-evidence identity for the pipeline.
//
// A source-registry entry (e.g. `lgu-website`) names a collectable source
// family; a source INSTANCE names one exact retrieval:
// `src-<registry>-<yyyymmdd>-<hash8>`. Instances are created by collectors
// (which interpret the evidence), persisted per run in
// `source-instances.json`, and appended to canonical `sources.json` only by
// promotion — never for unaccepted evidence. Promotion dedupes on the content
// key (registryId + full SHA-256), so byte-identical re-collection reuses the
// existing instance instead of appending a meaningless duplicate.

import path from 'node:path';
import { readJsonFile, sha256Hex, writeJsonAtomic } from './json';
import type { RegistryEntry, SourceInstance, SourceInstancesFile, SourceRecord } from './civic';

export const SOURCE_INSTANCES_FILENAME = 'source-instances.json';
export const SOURCE_INSTANCES_VERSION = 1;

function sanitizeSegment(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'source';
}

/** Stable instance ID: `src-<registry>-<yyyymmdd>-<sha256[0:8]>`. */
export function makeSourceInstanceId(registryId: string, date: string, evidenceSha256: string): string {
  return `src-${sanitizeSegment(registryId)}-${date}-${evidenceSha256.slice(0, 8).toLowerCase()}`;
}

/** Content key for promotion-time dedupe: same registry + same bytes. */
export function sourceContentKey(registryId: string, sha256: string): string {
  return `${registryId}${sha256.toLowerCase()}`;
}

/** Find an accepted source with identical content (dedupe target), if any. */
export function findSourceByContent(
  sources: SourceRecord[],
  registryId: string,
  sha256: string | undefined,
): SourceRecord | undefined {
  if (!sha256) return undefined;
  const want = sourceContentKey(registryId, sha256);
  return sources.find((s) => s.registryId !== undefined && s.sha256 !== undefined && sourceContentKey(s.registryId, s.sha256) === want);
}

export interface BuildInstanceInput {
  registry: RegistryEntry;
  evidenceName: string;
  evidenceBytes: Buffer | string;
  runId: string;
  collectedBy: string;
  documentType: string;
  title?: string;
  sourceState?: SourceInstance['sourceState'];
  notes?: string;
  /** YYYY-MM-DD retrieval date; defaults to the run ID's date prefix (run IDs are YYYY-MM-DD[-n] by construction). */
  retrievedAt?: string;
}

export function buildSourceInstance(input: BuildInstanceInput): SourceInstance {
  const sha = sha256Hex(input.evidenceBytes);
  const date = (input.retrievedAt ?? input.runId.slice(0, 10));
  return {
    id: makeSourceInstanceId(input.registry.id, date, sha),
    registryId: input.registry.id,
    title: input.title ?? `${input.registry.publisher} evidence (${input.evidenceName})`,
    publisher: input.registry.publisher,
    ...(input.registry.url ? { url: input.registry.url } : {}),
    ...(input.registry.discovery ? { discovery: input.registry.discovery } : {}),
    documentType: input.documentType,
    retrievedAt: date,
    sourceState: input.sourceState ?? 'active',
    evidencePath: ['research', 'runs', input.runId, 'evidence', input.evidenceName].join('/'),
    sha256: sha,
    collectedBy: input.collectedBy,
    runId: input.runId,
    ...(input.notes ? { notes: input.notes } : {}),
  };
}

function instancesPath(dir: string): string {
  return path.join(dir, SOURCE_INSTANCES_FILENAME);
}

export function writeSourceInstances(dir: string, instances: SourceInstance[]): void {
  for (const instance of instances) {
    if (!instance.id || !instance.registryId || !instance.collectedBy || !instance.runId) {
      throw new Error('instances: instance is missing id/registryId/collectedBy/runId');
    }
  }
  const file: SourceInstancesFile = { version: SOURCE_INSTANCES_VERSION, instances };
  writeJsonAtomic(instancesPath(dir), file);
}

/** Missing file means a pre-instances run: return [] (backwards compatible). */
export function readSourceInstances(dir: string): SourceInstance[] {
  try {
    return readJsonFile<SourceInstancesFile>(instancesPath(dir)).instances ?? [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}
