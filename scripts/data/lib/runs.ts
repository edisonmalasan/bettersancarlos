import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile, sha256Hex, writeJsonAtomic } from './json';
import { runsDir } from './paths';
import type { Candidate, RunManifest, RunSourceEntry } from './civic';

export interface RunHandle {
  runId: string;
  dir: string;
}

export function todayRunId(): string {
  return new Date().toISOString().slice(0, 10);
}

// Runs are write-once: a second run on the same date gets a -2/-3 suffix.
export function nextRunId(root: string, date: string = todayRunId()): string {
  const base = path.join(runsDir(root));
  let candidate = date;
  let n = 2;
  while (fs.existsSync(path.join(base, candidate))) {
    candidate = `${date}-${n}`;
    n++;
  }
  return candidate;
}

export function createRun(
  root: string,
  options: { parameters?: Record<string, unknown>; collectedBy?: string; date?: string } = {},
): RunHandle {
  const runId = nextRunId(root, options.date);
  const dir = path.join(runsDir(root), runId);
  fs.mkdirSync(path.join(dir, 'evidence'), { recursive: true });
  const manifest: RunManifest = {
    runId,
    startedAt: new Date().toISOString(),
    endedAt: null,
    parameters: options.parameters ?? {},
    sources: [],
    candidatesProduced: 0,
    conflictsFound: 0,
    collectedBy: options.collectedBy,
  };
  writeJsonAtomic(path.join(dir, 'manifest.json'), manifest);
  return { runId, dir };
}

export function readManifest(dir: string): RunManifest {
  return readJsonFile<RunManifest>(path.join(dir, 'manifest.json'));
}

export function recordSource(
  dir: string,
  entry: RunSourceEntry,
  mutate?: (manifest: RunManifest) => void,
): RunManifest {
  const manifest = readManifest(dir);
  manifest.sources.push(entry);
  mutate?.(manifest);
  writeJsonAtomic(path.join(dir, 'manifest.json'), manifest);
  return manifest;
}

export function finishRun(
  dir: string,
  summary: { candidatesProduced: number; conflictsFound: number },
): RunManifest {
  const manifest = readManifest(dir);
  manifest.endedAt = new Date().toISOString();
  manifest.candidatesProduced = summary.candidatesProduced;
  manifest.conflictsFound = summary.conflictsFound;
  writeJsonAtomic(path.join(dir, 'manifest.json'), manifest);
  return manifest;
}

export function writeCandidates(dir: string, candidates: Candidate[]): void {
  for (const candidate of candidates) {
    if (!candidate.id || !candidate.collectedBy || !candidate.runId) {
      throw new Error('runs: candidate is missing id/collectedBy/runId');
    }
    if (candidate.status !== 'provisional') throw new Error('runs: candidates must be provisional');
  }
  writeJsonAtomic(path.join(dir, 'candidates.json'), { candidates });
}

export function readCandidates(dir: string): Candidate[] {
  if (!fs.existsSync(path.join(dir, 'candidates.json'))) return [];
  return readJsonFile<{ candidates: Candidate[] }>(path.join(dir, 'candidates.json')).candidates ?? [];
}

export function writeMarkdown(dir: string, name: 'findings.md' | 'conflicts.md', body: string): void {
  const target = path.join(dir, name);
  const tmp = `${target}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, body.endsWith('\n') ? body : body + '\n');
  fs.renameSync(tmp, target);
}

// Stores raw evidence bytes and returns the SHA-256 for the manifest.
export function saveEvidence(dir: string, filename: string, content: string | Buffer): string {
  if (filename.includes('/') || filename.includes('\\') || filename === '') {
    throw new Error('runs: evidence filename must be a bare filename');
  }
  const target = path.join(dir, 'evidence', filename);
  fs.writeFileSync(target, content);
  return sha256Hex(content);
}
