import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { loadRecords, type Candidate, type CivicRecord } from './lib/civic';
import { writeJsonAtomic, stableStringify } from './lib/json';
import { recordsPath, runsDir } from './lib/paths';
import { readCandidates } from './lib/runs';
import { todayUtc } from './validate';

export interface PromoteOptions {
  root: string;
  runId?: string;
  records?: string[];
  all?: boolean;
  reviewer?: string;
  cadence?: string;
  autoNews?: boolean;
}

export interface PromoteSummary {
  runId: string;
  promoted: string[];
  reviewer: string;
}

// Cadence to review-horizon mapping used when promotion recomputes
// nextReviewOn. `manual` means review is due immediately (today).
const CADENCE_INTERVAL_DAYS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 91,
  annually: 365,
  'per-term': 1096,
  'per-document': 365,
  manual: 0,
  'event-driven': 91,
};

// Domains whose NEW records always require an independent reviewer.
const HIGH_RISK_DOMAINS = new Set(['government', 'emergency', 'health', 'transparency', 'legislation']);

export const NEWS_AUTO_PRINCIPAL = 'news-auto-path';
const NEWS_AUTO_REGISTRY = 'lgu-facebook-cio';

function addDays(date: string, days: number): string {
  const dt = new Date(date + 'T00:00:00Z');
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function resolveReviewer(explicit?: string): string {
  if (explicit) return explicit;
  try {
    const name = execFileSync('git', ['config', 'user.name'], { encoding: 'utf8' }).trim();
    if (name) return name;
  } catch {
    // No git identity available; the caller must pass --reviewer.
  }
  throw new Error('promote: no reviewer identity (pass --reviewer=<name>)');
}

function latestRunId(root: string): string {
  const names = fs
    .readdirSync(runsDir(root))
    .filter((n) => fs.statSync(path.join(runsDir(root), n)).isDirectory())
    .sort();
  if (names.length === 0) throw new Error('promote: no research runs found');
  return names[names.length - 1];
}

export function promoteRun(options: PromoteOptions, today: string = todayUtc()): PromoteSummary {
  const { root } = options;
  if ((options.records?.length ?? 0) > 0 && options.all) {
    throw new Error('promote: --record and --all are mutually exclusive');
  }
  if ((options.records?.length ?? 0) === 0 && !options.all && !options.autoNews) {
    throw new Error('promote: select candidates with --record=<id>, --all, or --auto-news');
  }
  const runId = options.runId ?? latestRunId(root);
  const runDir = path.join(runsDir(root), runId);
  const candidates = readCandidates(runDir);
  if (candidates.length === 0) throw new Error(`promote: run ${runId} has no candidates`);

  const file = loadRecords(root);
  const records = new Map(file.records.map((r) => [r.id, r]));
  const byId = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const list = byId.get(candidate.id) ?? [];
    list.push(candidate);
    byId.set(candidate.id, list);
  }

  const autoNews = options.autoNews ?? false;
  const reviewer = autoNews ? NEWS_AUTO_PRINCIPAL : resolveReviewer(options.reviewer);
  // --auto-news processes every candidate in the run; each one is still
  // eligibility-checked, and any ineligible candidate aborts the batch
  // with no partial writes.
  const wanted = options.all || (autoNews && (options.records?.length ?? 0) === 0) ? [...byId.keys()] : (options.records ?? []);
  const promoted: string[] = [];

  for (const id of wanted) {
    const list = byId.get(id);
    if (!list || list.length === 0) throw new Error(`promote: run ${runId} has no candidate for ${id}`);
    if (new Set(list.map((c) => stableStringify(c.data))).size > 1) {
      throw new Error(`promote: ${id} has conflicting candidates; resolve before promoting`);
    }
    const candidate = list[0];
    if (candidate.status !== 'provisional') {
      throw new Error(`promote: candidate ${id} is not provisional`);
    }
    const existing = records.get(id);

    if (autoNews) {
      if (candidate.domain !== 'news' || !candidate.sourceIds.includes(NEWS_AUTO_REGISTRY)) {
        throw new Error(`promote: --auto-news applies only to official-page news candidates (${id} refused)`);
      }
      if (existing) {
        throw new Error(`promote: --auto-news creates new records only (${id} already canonical)`);
      }
      records.set(id, {
        id: candidate.id,
        domain: candidate.domain,
        type: candidate.type,
        label: candidate.label,
        data: candidate.data,
        claimSources: candidate.claimSources,
        sourceIds: candidate.sourceIds,
        status: 'reported',
        lastVerified: today,
        acceptedBy: NEWS_AUTO_PRINCIPAL,
        acceptedAt: today,
        nextReviewOn: addDays(today, CADENCE_INTERVAL_DAYS['weekly']),
        updateCadence: 'weekly',
        collectedBy: candidate.collectedBy,
        notes: candidate.notes,
        history: [],
      });
      promoted.push(id);
      continue;
    }

    const highRisk = existing
      ? (existing.riskTier ?? 'medium') === 'high'
      : HIGH_RISK_DOMAINS.has(candidate.domain);
    if (highRisk && candidate.collectedBy === reviewer) {
      throw new Error(
        `promote: high-risk ${id} was collected by ${reviewer}; an independent reviewer must accept it`,
      );
    }

    if (existing) {
      const history = existing.history ?? [];
      const revision = {
        revision: history.length + 1,
        data: existing.data,
        acceptedBy: existing.acceptedBy,
        acceptedAt: existing.acceptedAt,
        sourceIds: existing.sourceIds,
      };
      const interval = CADENCE_INTERVAL_DAYS[existing.updateCadence] ?? 91;
      records.set(id, {
        ...existing,
        data: candidate.data,
        claimSources: candidate.claimSources ?? existing.claimSources,
        sourceIds: candidate.sourceIds,
        status: 'verified',
        lastVerified: today,
        acceptedBy: reviewer,
        acceptedAt: today,
        nextReviewOn: addDays(today, interval),
        collectedBy: candidate.collectedBy,
        history: [...history, revision],
      });
    } else {
      const cadence = options.cadence ?? 'quarterly';
      if (!(cadence in CADENCE_INTERVAL_DAYS)) throw new Error(`promote: unknown cadence: ${cadence}`);
      records.set(id, {
        id: candidate.id,
        domain: candidate.domain,
        type: candidate.type,
        label: candidate.label,
        data: candidate.data,
        claimSources: candidate.claimSources,
        sourceIds: candidate.sourceIds,
        status: 'verified',
        lastVerified: today,
        acceptedBy: reviewer,
        acceptedAt: today,
        nextReviewOn: addDays(today, CADENCE_INTERVAL_DAYS[cadence]),
        updateCadence: cadence as CivicRecord['updateCadence'],
        collectedBy: candidate.collectedBy,
        notes: candidate.notes,
        history: [],
      });
    }
    promoted.push(id);
  }

  writeJsonAtomic(recordsPath(root), { records: [...records.values()] });
  return { runId, promoted, reviewer };
}

function parseArgs(argv: string[]): PromoteOptions & { root: string } {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const multi = (prefix: string): string[] =>
    argv.filter((a) => a.startsWith(prefix)).map((a) => a.slice(prefix.length));
  const one = (prefix: string): string | undefined => {
    const found = multi(prefix);
    return found.length > 0 ? found[found.length - 1] : undefined;
  };
  const records = multi('--record=');
  return {
    root,
    runId: one('--run='),
    records: records.length > 0 ? records : undefined,
    all: argv.includes('--all'),
    reviewer: one('--reviewer='),
    cadence: one('--cadence='),
    autoNews: argv.includes('--auto-news'),
  };
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/promote.ts');

if (invokedDirectly) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(
      'usage: bun run data:promote -- --run=<id> (--record=<id> ... | --all | --auto-news) [--reviewer=<name>] [--cadence=<c>]',
    );
    process.exit(0);
  }
  try {
    const { root, ...options } = parseArgs(argv);
    const summary = promoteRun({ ...options, root });
    console.log(`promote: run ${summary.runId} accepted by ${summary.reviewer}: ${summary.promoted.join(', ')}`);
    console.log('promote: run `bun run data:generate` and `bun run verify` next');
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
