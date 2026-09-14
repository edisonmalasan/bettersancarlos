import fs from 'node:fs';
import path from 'node:path';
import { loadRegistry, type RegistryEntry } from './lib/civic';
import { resolveCollector } from './collectors/index';
import { fetchText } from './lib/fetch';
import {
  createRun,
  finishRun,
  recordSource,
  saveEvidence,
  writeCandidates,
  writeMarkdown,
  type RunHandle,
} from './lib/runs';
import { runsDir } from './lib/paths';
import type { Candidate } from './lib/civic';

export interface RefreshOptions {
  root: string;
  sources?: string[];
  domains?: string[];
  due?: boolean;
  offline?: boolean;
  evidenceDir?: string;
  collectedBy?: string;
  date?: string;
}

// Cadence to re-check interval. Null means "never automatically due":
// per-term, per-document, manual, and event-driven sources are collected
// only when explicitly requested.
const CADENCE_DAYS: Record<string, number | null> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 91,
  annually: 365,
  'per-term': null,
  'per-document': null,
  manual: null,
  'event-driven': null,
};

export function cadenceDueDays(cadence: string): number | null {
  return CADENCE_DAYS[cadence] ?? null;
}

function lastCheckedAt(root: string, registryId: string): string | null {
  let latest: string | null = null;
  let names: string[] = [];
  try {
    names = fs.readdirSync(runsDir(root));
  } catch {
    return null;
  }
  for (const name of names) {
    const manifestPath = path.join(runsDir(root), name, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
        sources?: Array<{ sourceId?: string; checkedAt?: string }>;
      };
      for (const entry of manifest.sources ?? []) {
        if (entry.sourceId === registryId && entry.checkedAt) {
          if (!latest || entry.checkedAt > latest) latest = entry.checkedAt;
        }
      }
    } catch {
      // A corrupt manifest never blocks refresh; validation reports it.
    }
  }
  return latest;
}

function isDue(registry: RegistryEntry, lastChecked: string | null, nowMs: number): boolean {
  if (!lastChecked) return true;
  const days = cadenceDueDays(registry.updateCadence);
  if (days === null) return false;
  return nowMs - Date.parse(lastChecked) >= days * 24 * 60 * 60 * 1000;
}

function findEvidenceFile(evidenceDir: string, registryId: string): string | null {
  let names: string[] = [];
  try {
    names = fs.readdirSync(evidenceDir);
  } catch {
    return null;
  }
  const hit = names.filter((n) => n === registryId || n.startsWith(registryId + '.')).sort()[0];
  return hit ? path.join(evidenceDir, hit) : null;
}

export interface RefreshSummary {
  run: RunHandle;
  outcomes: Record<string, string>;
  candidates: number;
}

export async function runRefresh(options: RefreshOptions): Promise<RefreshSummary> {
  const {
    root,
    collectedBy = 'agent',
    offline = false,
    evidenceDir = null,
  } = options as RefreshOptions & { evidenceDir?: string | null };
  const registry = loadRegistry(root);
  const byId = new Map(registry.sources.map((s) => [s.id, s]));
  const nowMs = Date.now();

  const selected: RegistryEntry[] = [];
  const unregistered: string[] = [];
  if (options.sources && options.sources.length > 0) {
    for (const id of options.sources) {
      const entry = byId.get(id);
      if (!entry) unregistered.push(id);
      else selected.push(entry);
    }
  } else {
    for (const entry of registry.sources) {
      if (options.domains && options.domains.length > 0) {
        if (!entry.domains || !entry.domains.some((d) => options.domains?.includes(d))) continue;
      } else if (options.due || !options.domains) {
        // Default (and --due): only sources whose review date is due.
        if (!isDue(entry, lastCheckedAt(root, entry.id), nowMs)) continue;
      }
      selected.push(entry);
    }
  }

  const run = createRun(root, {
    parameters: {
      sources: options.sources ?? null,
      domains: options.domains ?? null,
      due: options.due ?? (!options.sources && !options.domains),
      offline,
    },
    collectedBy,
    date: options.date,
  });

  const outcomes: Record<string, string> = {};
  const allCandidates: Candidate[] = [];
  const findingLines = [
    `# Refresh findings — run ${run.runId}`,
    '',
    `Collector: ${collectedBy}. Canonical records were not modified by this refresh.`,
    '',
  ];

  for (const unknownId of unregistered) {
    outcomes[unknownId] = 'unregistered';
    recordSource(run.dir, {
      sourceId: unknownId,
      checkedAt: new Date().toISOString(),
      outcome: 'unregistered',
      error: `no registry entry for source: ${unknownId}`,
    });
    findingLines.push(`- ${unknownId}: UNREGISTERED (no registry entry; nothing collected)`);
  }

  for (const entry of selected) {
    const checkedAt = new Date().toISOString();
    const collector = resolveCollector(entry.collector);
    if (!collector) {
      outcomes[entry.id] = 'skipped';
      recordSource(run.dir, { sourceId: entry.id, checkedAt, outcome: 'skipped' });
      findingLines.push(`- ${entry.id}: SKIPPED (manual-only source, no collector)`);
      continue;
    }
    let evidence: { name: string; bytes: Buffer } | null = null;
    if (evidenceDir) {
      const fixture = findEvidenceFile(evidenceDir, entry.id);
      if (!fixture) {
        if (offline || !entry.url) {
          outcomes[entry.id] = 'skipped';
          recordSource(run.dir, {
            sourceId: entry.id,
            checkedAt,
            outcome: 'skipped',
            error: 'no evidence file and no live fetch (offline)',
          });
          findingLines.push(`- ${entry.id}: SKIPPED (no evidence file, offline)`);
          continue;
        }
      } else {
        evidence = { name: path.basename(fixture), bytes: fs.readFileSync(fixture) };
      }
    }
    if (!evidence) {
      if (offline) {
        outcomes[entry.id] = 'skipped';
        recordSource(run.dir, {
          sourceId: entry.id,
          checkedAt,
          outcome: 'skipped',
          error: 'offline mode: no live fetch without supplied evidence',
        });
        findingLines.push(`- ${entry.id}: SKIPPED (offline, no evidence supplied)`);
        continue;
      }
      if (!entry.url) {
        outcomes[entry.id] = 'skipped';
        recordSource(run.dir, {
          sourceId: entry.id,
          checkedAt,
          outcome: 'skipped',
          error: 'source has no URL and no evidence file',
        });
        findingLines.push(`- ${entry.id}: SKIPPED (no URL, no evidence)`);
        continue;
      }
      try {
        const text = await fetchText(entry.url);
        evidence = { name: `${entry.id}.html`, bytes: Buffer.from(text, 'utf8') };
      } catch (err) {
        outcomes[entry.id] = 'unavailable';
        recordSource(run.dir, {
          sourceId: entry.id,
          checkedAt,
          outcome: 'unavailable',
          error: (err as Error).message,
        });
        findingLines.push(`- ${entry.id}: UNAVAILABLE (${(err as Error).message})`);
        continue;
      }
    }
    const sha = saveEvidence(run.dir, evidence.name, evidence.bytes);
    const previous = lastCheckedEvidenceSha(root, entry.id, run.runId);
    const outcome = previous === sha ? 'unchanged' : 'collected';
    try {
      const result = collector({
        registryId: entry.id,
        evidenceName: evidence.name,
        evidenceText: evidence.bytes.toString('utf8'),
        sourceUrl: entry.url,
        runId: run.runId,
        collectedBy,
      });
      outcomes[entry.id] = outcome;
      recordSource(run.dir, { sourceId: entry.id, checkedAt, outcome, evidenceSha256: sha });
      allCandidates.push(...result.candidates);
      findingLines.push(`- ${entry.id}: ${outcome.toUpperCase()} (${result.candidates.length} candidate(s))`);
      for (const note of result.notes) findingLines.push(`  - ${note}`);
    } catch (err) {
      outcomes[entry.id] = 'failed';
      recordSource(run.dir, {
        sourceId: entry.id,
        checkedAt,
        outcome: 'failed',
        error: (err as Error).message,
        evidenceSha256: sha,
      });
      findingLines.push(`- ${entry.id}: FAILED (${(err as Error).message})`);
    }
  }

  // Candidates are provisional by construction; the writer enforces it.
  writeCandidates(run.dir, allCandidates);
  writeMarkdown(run.dir, 'findings.md', findingLines.join('\n'));
  writeMarkdown(
    run.dir,
    'conflicts.md',
    '# Conflicts\n\nConflicts are detected by `bun run data:diff`; none recorded at collection.\n',
  );
  finishRun(run.dir, { candidatesProduced: allCandidates.length, conflictsFound: 0 });
  return { run: run, outcomes, candidates: allCandidates.length };
}

// SHA of the most recent evidence stored for a source, excluding the run
// currently being built (used to mark repeat evidence as unchanged).
function lastCheckedEvidenceSha(root: string, registryId: string, excludeRunId: string): string | null {
  let names: string[] = [];
  try {
    names = fs.readdirSync(runsDir(root));
  } catch {
    return null;
  }
  let latest: { checkedAt: string; sha: string } | null = null;
  for (const name of names) {
    if (name === excludeRunId) continue;
    const manifestPath = path.join(runsDir(root), name, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
        sources?: Array<{ sourceId?: string; checkedAt?: string; evidenceSha256?: string }>;
      };
      for (const entry of manifest.sources ?? []) {
        if (entry.sourceId === registryId && entry.checkedAt && entry.evidenceSha256) {
          if (!latest || entry.checkedAt > latest.checkedAt) {
            latest = { checkedAt: entry.checkedAt, sha: entry.evidenceSha256 };
          }
        }
      }
    } catch {
      // Ignore unreadable manifests here; validation reports them.
    }
  }
  return latest?.sha ?? null;
}

function parseArgs(argv: string[]): { options: RefreshOptions; root: string } {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const multi = (prefix: string): string[] =>
    argv.filter((a) => a.startsWith(prefix)).map((a) => a.slice(prefix.length));
  const one = (prefix: string): string | undefined => {
    const found = multi(prefix);
    return found.length > 0 ? found[found.length - 1] : undefined;
  };
  const sources = multi('--source=');
  const domains = multi('--domain=');
  return {
    root,
    options: {
      root,
      sources: sources.length > 0 ? sources : undefined,
      domains: domains.length > 0 ? domains : undefined,
      due: argv.includes('--due'),
      offline: argv.includes('--offline'),
      evidenceDir: one('--evidence-dir='),
      collectedBy: one('--collected-by='),
      date: one('--date='),
    },
  };
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(
      'usage: bun run data:refresh [-- --source=<id> ...] [-- --domain=<d> ...] [-- --due] [-- --offline] [-- --evidence-dir=<dir>] [-- --collected-by=<name>]',
    );
    return 0;
  }
  const { options } = parseArgs(argv);
  try {
    const summary = await runRefresh(options);
    console.log(`refresh: run ${summary.run.runId}: ${summary.candidates} candidate(s)`);
    for (const [id, outcome] of Object.entries(summary.outcomes)) console.log(`  ${id}: ${outcome}`);
    return 0;
  } catch (err) {
    console.error(`refresh failed: ${(err as Error).message}`);
    return 1;
  }
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/refresh.ts');

if (invokedDirectly) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(`refresh failed: ${(err as Error).message}`);
      process.exit(1);
    },
  );
}
