import fs from 'node:fs';
import path from 'node:path';
import {
  loadRecords,
  loadRegistry,
  loadSources,
  type CivicRecord,
  type RegistryEntry,
  type RunManifest,
} from './lib/civic';
import { stableStringify } from './lib/json';
import { isPublishedStatus, isTimeBasedCadence } from './lib/policy';
import { readCandidates } from './lib/runs';
import { runsDir } from './lib/paths';
import { todayUtc } from './validate';

export interface ConflictItem {
  runId: string;
  recordId: string;
  variants: number;
}

export interface SourceHealthItem {
  registryId: string;
  lastCheckedAt: string | null;
  lastOutcome: string | null;
}

export interface HealthReport {
  today: string;
  stale: CivicRecord[];
  conflicts: ConflictItem[];
  uncoveredSources: RegistryEntry[];
  sourceHealth: SourceHealthItem[];
  markdown: string;
}

function isStale(record: CivicRecord, today: string): boolean {
  return isPublishedStatus(record.status) && isTimeBasedCadence(record.updateCadence) && record.nextReviewOn < today;
}

function listRunDirs(root: string): Array<{ name: string; dir: string }> {
  let names: string[] = [];
  try {
    names = fs.readdirSync(runsDir(root));
  } catch {
    return [];
  }
  return names
    .map((name) => ({ name, dir: path.join(runsDir(root), name) }))
    .filter(({ dir }) => {
      try {
        return fs.statSync(dir).isDirectory();
      } catch {
        // An unreadable run dir is reported by validation, not here.
        return false;
      }
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

function findConflicts(root: string): ConflictItem[] {
  const items: ConflictItem[] = [];
  for (const { name, dir } of listRunDirs(root)) {
    let candidates: ReturnType<typeof readCandidates>;
    try {
      candidates = readCandidates(dir);
    } catch {
      // Corrupt candidates are a validation error; the health report skips them.
      continue;
    }
    const byId = new Map<string, Set<string>>();
    for (const candidate of candidates) {
      const set = byId.get(candidate.id) ?? new Set<string>();
      set.add(stableStringify(candidate.data));
      byId.set(candidate.id, set);
    }
    for (const [recordId, variants] of byId) {
      if (variants.size > 1) items.push({ runId: name, recordId, variants: variants.size });
    }
  }
  return items.sort((a, b) =>
    a.runId === b.runId ? (a.recordId < b.recordId ? -1 : 1) : a.runId < b.runId ? -1 : 1,
  );
}

function collectSourceHealth(root: string, registry: RegistryEntry[]): Map<string, SourceHealthItem> {
  const health = new Map<string, SourceHealthItem>(
    registry.map((entry) => [entry.id, { registryId: entry.id, lastCheckedAt: null, lastOutcome: null }]),
  );
  for (const { dir } of listRunDirs(root)) {
    let manifest: RunManifest;
    try {
      manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')) as RunManifest;
    } catch {
      // Unreadable manifests are validation errors; health keeps last known state.
      continue;
    }
    for (const entry of manifest.sources ?? []) {
      const item = health.get(entry.sourceId);
      if (!item) continue;
      if (!item.lastCheckedAt || (entry.checkedAt && entry.checkedAt > item.lastCheckedAt)) {
        item.lastCheckedAt = entry.checkedAt ?? item.lastCheckedAt;
        item.lastOutcome = entry.outcome ?? item.lastOutcome;
      }
    }
  }
  return health;
}

export function buildReport(root: string, today: string = todayUtc()): HealthReport {
  const records = loadRecords(root).records;
  const registry = loadRegistry(root).sources;
  const stale = records
    .filter((r) => isStale(r, today))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const conflicts = findConflicts(root);
  const health = collectSourceHealth(root, registry);
  const uncoveredSources = registry
    .filter((entry) => (health.get(entry.id)?.lastCheckedAt ?? null) === null)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const sourceHealth = [...health.values()].sort((a, b) =>
    a.registryId < b.registryId ? -1 : 1,
  );

  const lines = [
    '# Civic-data health report',
    '',
    `Generated: ${today}. Offline summary; canonical records were not modified.`,
    '',
    `Records: ${records.length}. Stale: ${stale.length}. Conflicts: ${conflicts.length}. Uncovered sources: ${uncoveredSources.length}.`,
    '',
    '## Staleness',
    '',
  ];
  if (stale.length === 0) {
    lines.push('No published changing record is past its nextReviewOn.', '');
  } else {
    for (const record of stale) {
      lines.push(`- ${record.id} (${record.status}, cadence ${record.updateCadence}) past nextReviewOn ${record.nextReviewOn}`);
    }
    lines.push('');
  }
  lines.push('## Conflicts', '');
  if (conflicts.length === 0) {
    lines.push('No conflicting candidates found in research runs.', '');
  } else {
    for (const item of conflicts) {
      lines.push(`- ${item.recordId} in run ${item.runId}: ${item.variants} disagreeing candidates (blocked from promotion)`);
    }
    lines.push('');
  }
  lines.push('## Coverage gaps', '');
  if (uncoveredSources.length === 0) {
    lines.push('Every registered source has at least one recorded check.', '');
  } else {
    for (const entry of uncoveredSources) {
      lines.push(`- ${entry.id}: never checked (no research-run entry)`);
    }
    lines.push('');
  }
  lines.push('## Source health', '');
  if (sourceHealth.length === 0) {
    lines.push('No registered sources.', '');
  } else {
    for (const item of sourceHealth) {
      const state = item.lastCheckedAt ? `${item.lastOutcome} at ${item.lastCheckedAt}` : 'never checked';
      lines.push(`- ${item.registryId}: ${state}`);
    }
    lines.push('');
  }
  // Keep sources resolvable for reviewers without extra lookups.
  const sourceIds = new Set(loadSources(root).sources.map((s) => s.id));
  const dangling = records
    .filter((r) => r.sourceIds.some((sid) => !sourceIds.has(sid)))
    .map((r) => r.id);
  if (dangling.length > 0) {
    lines.push('## Notes', '');
    lines.push(`- ${dangling.length} record(s) reference registry-only sources: ${dangling.join(', ')}`, '');
  }
  return { today, stale, conflicts, uncoveredSources, sourceHealth, markdown: lines.join('\n') };
}

function main(): number {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('usage: bun run data:report');
    return 0;
  }
  try {
    const report = buildReport(root);
    console.log(report.markdown);
    return 0;
  } catch (err) {
    console.error(`report failed: ${(err as Error).message}`);
    return 1;
  }
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/report.ts');

if (invokedDirectly) {
  process.exit(main());
}
