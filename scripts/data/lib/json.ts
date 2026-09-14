import { createHash } from 'node:crypto';
import fs from 'node:fs';

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

// Write JSON with the repo's 2-space style. Atomic: readers never see a
// partial file even if the process is interrupted mid-write.
export function writeJsonAtomic(filePath: string, value: unknown): void {
  const tmp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, filePath);
}

export function sha256Hex(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

export function sha256FileHex(filePath: string): string {
  return sha256Hex(fs.readFileSync(filePath));
}

// Canonical JSON encoding for comparisons: object keys sorted recursively,
// arrays keep their order, undefined values dropped.
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry) => entry[1] !== undefined)
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
}
