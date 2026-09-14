import fs from 'node:fs';
import path from 'node:path';
import {
  loadRecords,
  loadRegistry,
  loadSources,
  type Candidate,
  type CivicRecord,
  type DiffOutcome,
  type RegistryEntry,
  type RunManifest,
  type SourceRecord,
} from './lib/civic';
import { stableStringify } from './lib/json';
import { isPublishedStatus, isTimeBasedCadence } from './lib/policy';
import { readCandidates, readManifest } from './lib/runs';
import { runsDir } from './lib/paths';
import { todayUtc } from './validate';

export interface DiffEntry {
  recordId: string;
  label: string;
  outcome: DiffOutcome;
  oldData?: Record<string, unknown>;
  candidateData?: Record<string, unknown>;
  sourceIds: string[];
  sourceTitles: string[];
  stale: boolean;
  detail: string;
}

export interface DiffInput {
  canonical: CivicRecord[];
  candidates: Candidate[];
  manifest: RunManifest | null;
  sources: SourceRecord[];
  registry: RegistryEntry[];
}

function sourceTitle(sources: Map<string, SourceRecord>, id: string): string {
  const found = sources.get(id);
  return found ? `${found.title} (${found.id})` : id;
}

function recordSourceIds(record: CivicRecord, sources: Map<string, SourceRecord>): string[] {
  const ids = new Set<string>(record.sourceIds);
  for (const sid of record.sourceIds) {
    const source = sources.get(sid);
    if (source?.registryId) ids.add(source.registryId);
  }
  return [...ids];
}

function isStale(record: CivicRecord, today: string): boolean {
  return isPublishedStatus(record.status) && isTimeBasedCadence(record.updateCadence) && record.nextReviewOn < today;
}

/**
 * Canonical run scope: what the refresh actually attempted, derived from the
 * real manifest — explicitly requested domains, registry domains of attempted
 * sources (collected/unchanged/failed/unavailable; skipped and unregistered
 * sources attempted nothing), plus observed candidate domains. Attempted
 * evidence outranks candidate absence: a failed attempt is informative, a
 * missing candidate is not.
 */
export function diffScope(
  manifest: RunManifest | null,
  candidates: Candidate[],
  registry: RegistryEntry[],
): Set<string> {
  const scope = new Set(candidates.map((c) => c.domain));
  const params = manifest?.parameters ?? {};
  const requested = Array.isArray(params.domains) ? params.domains : [];
  for (const domain of requested) {
    if (typeof domain === 'string') scope.add(domain);
  }
  const byRegistryId = new Map(registry.map((e) => [e.id, e]));
  for (const entry of manifest?.sources ?? []) {
    if (entry.outcome !== 'collected' && entry.outcome !== 'unchanged' && entry.outcome !== 'failed' && entry.outcome !== 'unavailable') {
      continue;
    }
    for (const domain of byRegistryId.get(entry.sourceId)?.domains ?? []) {
      scope.add(domain);
    }
  }
  return scope;
}

export function diffRun(input: DiffInput, today: string = todayUtc()): DiffEntry[] {
  const { canonical, candidates, manifest, sources, registry } = input;
  const sourceMap = new Map(sources.map((s) => [s.id, s]));
  const byId = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const list = byId.get(candidate.id) ?? [];
    list.push(candidate);
    byId.set(candidate.id, list);
  }
  const canonicalIds = new Set(canonical.map((r) => r.id));
  const scope = diffScope(manifest, candidates, registry);

  const failedSources = new Map<string, 'unavailable' | 'changed'>();
  for (const entry of manifest?.sources ?? []) {
    if (entry.outcome === 'failed' || entry.outcome === 'unavailable') {
      // Collector convention (see refresh.ts): errors starting with "parse:"
      // mean the source was reached but its format changed.
      const changed = entry.outcome === 'failed' && (entry.error ?? '').startsWith('parse:');
      failedSources.set(entry.sourceId, changed ? 'changed' : 'unavailable');
    }
  }

  const entries: DiffEntry[] = [];
  for (const candidate of candidates) {
    if (canonicalIds.has(candidate.id)) continue;
    entries.push({
      recordId: candidate.id,
      label: candidate.label,
      outcome: 'NEW',
      candidateData: candidate.data,
      sourceIds: candidate.sourceIds,
      sourceTitles: candidate.sourceIds.map((id) => sourceTitle(sourceMap, id)),
      stale: false,
      detail: 'No canonical record with this ID exists yet.',
    });
  }

  for (const record of canonical) {
    const list = byId.get(record.id) ?? [];
    const sids = recordSourceIds(record, sourceMap);
    const titles = sids.map((id) => sourceTitle(sourceMap, id));
    const stale = isStale(record, today);
    if (list.length > 1) {
      const variants = new Set(list.map((c) => stableStringify(c.data)));
      if (variants.size > 1) {
        entries.push({
          recordId: record.id,
          label: record.label,
          outcome: 'CONFLICT',
          oldData: record.data,
          candidateData: list[0].data,
          sourceIds: [...new Set(list.flatMap((c) => c.sourceIds))],
          sourceTitles: [...new Set(list.flatMap((c) => c.sourceIds))].map((id) =>
            sourceTitle(sourceMap, id),
          ),
          stale,
          detail: `${list.length} candidates disagree; blocked from promotion until a reviewer resolves the conflict.`,
        });
        continue;
      }
    }
    if (list.length > 0) {
      const changed = stableStringify(list[0].data) !== stableStringify(record.data);
      entries.push({
        recordId: record.id,
        label: record.label,
        outcome: changed ? 'CHANGED' : 'UNCHANGED',
        oldData: record.data,
        candidateData: list[0].data,
        sourceIds: [...new Set([...sids, ...list[0].sourceIds])],
        sourceTitles: [...new Set([...sids, ...list[0].sourceIds])].map((id) =>
          sourceTitle(sourceMap, id),
        ),
        stale,
        detail: changed
          ? 'Candidate differs from the accepted record; review required.'
          : 'Candidate matches the accepted record; no action needed.',
      });
      continue;
    }
    if (!scope.has(record.domain)) continue; // Out of this run's scope.
    const failed = [...failedSources.entries()].find(([sid]) => sids.includes(sid));
    if (failed) {
      entries.push({
        recordId: record.id,
        label: record.label,
        outcome: failed[1] === 'changed' ? 'SOURCE_CHANGED' : 'SOURCE_UNAVAILABLE',
        oldData: record.data,
        sourceIds: sids,
        sourceTitles: titles,
        stale,
        detail:
          failed[1] === 'changed'
            ? `Source ${failed[0]} was reached but its format changed; existing data kept.`
            : `Source ${failed[0]} could not be reached; existing data kept, deadlines unchanged.`,
      });
      continue;
    }
    entries.push({
      recordId: record.id,
      label: record.label,
      outcome: 'MISSING',
      oldData: record.data,
      sourceIds: sids,
      sourceTitles: titles,
      stale,
      detail: 'No candidate covered this record in a run scoped to its domain; coverage gap, not a deletion.',
    });
  }
  return entries.sort((a, b) => (a.recordId < b.recordId ? -1 : a.recordId > b.recordId ? 1 : 0));
}

export function renderReport(runId: string, entries: DiffEntry[], today: string): string {
  const counts = new Map<DiffOutcome, number>();
  for (const entry of entries) counts.set(entry.outcome, (counts.get(entry.outcome) ?? 0) + 1);
  const lines = [
    `# Civic-data diff report — run ${runId}`,
    '',
    `Generated: ${today}. Canonical records were not modified by this diff.`,
    '',
    '## Outcome counts',
    '',
    ...([...counts.entries()].map(([outcome, n]) => `- ${outcome}: ${n}`)),
    '',
  ];
  const actionable = entries.filter((e) => e.outcome !== 'UNCHANGED');
  if (actionable.length === 0) {
    lines.push('All covered records are UNCHANGED. No review action required.', '');
  }
  for (const entry of actionable) {
    lines.push(`## ${entry.outcome} ${entry.recordId} — ${entry.label}`, '');
    if (entry.oldData !== undefined) {
      lines.push('OLD:', '```json', JSON.stringify(entry.oldData, null, 2), '```', '');
    }
    if (entry.candidateData !== undefined) {
      lines.push('CANDIDATE:', '```json', JSON.stringify(entry.candidateData, null, 2), '```', '');
    }
    lines.push('SOURCE:', ...entry.sourceTitles.map((t) => `- ${t}`), '');
    lines.push(`RESULT:\n${entry.outcome}`, '');
    const action =
      entry.outcome === 'NEW'
        ? 'Review candidate, then promote if accepted.'
        : entry.outcome === 'CHANGED'
          ? 'Review required.'
          : entry.outcome === 'CONFLICT'
            ? 'Blocked: resolve the conflict, do not auto-promote.'
            : entry.outcome === 'MISSING'
              ? 'Investigate coverage gap; do not delete the canonical record.'
              : 'Keep existing data; re-check the source next run.';
    lines.push(`ACTION:\n${action}`, '');
    if (entry.stale) lines.push('NOTE: this record is also past its nextReviewOn (STALE).', '');
    if (entry.detail) lines.push(`${entry.detail}`, '');
  }
  const stale = entries.filter((e) => e.stale);
  if (stale.length > 0) {
    lines.push('## Staleness notes', '');
    for (const entry of stale) lines.push(`- ${entry.recordId} is past nextReviewOn.`);
    lines.push('');
  }
  return lines.join('\n');
}

function latestRunDir(root: string): string {
  const names = fs
    .readdirSync(runsDir(root))
    .filter((n) => fs.statSync(path.join(runsDir(root), n)).isDirectory())
    .sort();
  if (names.length === 0) throw new Error('diff: no research runs found');
  return path.join(runsDir(root), names[names.length - 1]);
}

function main(): number {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('usage: bun run data:diff [-- --run=<run-id>]');
    return 0;
  }
  const runArg = args.find((a) => a.startsWith('--run='))?.slice('--run='.length);
  let runDir: string;
  try {
    runDir = runArg ? path.join(runsDir(root), runArg) : latestRunDir(root);
    if (!fs.existsSync(path.join(runDir, 'manifest.json'))) throw new Error(`diff: no such run: ${runArg}`);
  } catch (err) {
    console.error((err as Error).message);
    return 1;
  }
  const manifest = readManifest(runDir);
  const candidates = readCandidates(runDir);
  const canonical = loadRecords(root).records;
  const sources = loadSources(root).sources;
  const registry = loadRegistry(root).sources;
  const today = todayUtc();
  const entries = diffRun({ canonical, candidates, manifest, sources, registry }, today);
  const report = renderReport(manifest.runId, entries, today);
  const target = path.join(runDir, 'review-report.md');
  const tmp = `${target}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, report);
  fs.renameSync(tmp, target);
  const counts = new Map<DiffOutcome, number>();
  for (const entry of entries) counts.set(entry.outcome, (counts.get(entry.outcome) ?? 0) + 1);
  console.log(`diff: run ${manifest.runId}: ${entries.length} record(s) compared`);
  for (const [outcome, n] of [...counts.entries()].sort()) console.log(`  ${outcome}: ${n}`);
  console.log(`diff: report written to ${path.relative(root, target)}`);
  return 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/diff.ts');

if (invokedDirectly) {
  process.exit(main());
}
