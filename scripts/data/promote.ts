import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { loadRecords, loadRegistry, loadSources, type Candidate, type CivicRecord, type SourceInstance, type SourceRecord } from './lib/civic';
import { writeJsonAtomic, stableStringify } from './lib/json';
import { findSourceByContent } from './lib/instances';
import { CADENCE_POLICY, cadenceWindowDays, isHighRisk, isTimeBasedCadence, nextReviewDate, policyDefaultRiskTier } from './lib/policy';
import { recordsPath, sourcesPath, runsDir } from './lib/paths';
import { readCandidates } from './lib/runs';
import { readSourceInstances } from './lib/instances';
import { CADENCES, RECORD_TYPES, RISK_TIERS, STATUSES, isValidDate, resolveClaimPath, todayUtc } from './validate';

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
  /** Accepted canonical source IDs (deduped), in promotion order. */
  promotedSources: string[];
  reviewer: string;
}

// High-risk classification lives in lib/policy.ts isHighRisk (single rule over
// record tier, domain, and type); nothing here duplicates it.

export const NEWS_AUTO_PRINCIPAL = 'news-auto-path';
const NEWS_AUTO_REGISTRY = 'lgu-facebook-cio';

/**
 * Accept a candidate's source-instance links against the run's instances.
 * Returns the accepted canonical source ID per cited ID (registry IDs and
 * instance IDs both resolve here). New instances are appended to `sources`
 * (deduplicated on registry + evidence hash); anything unresolvable throws —
 * promotion never accepts a claim it cannot trace to exact evidence.
 */
function acceptCandidateSources(
  candidate: Candidate,
  runInstances: Map<string, SourceInstance>,
  sources: Map<string, SourceRecord>,
  registryIds: Set<string>,
  reviewer: string,
  runId: string,
): { sourceIds: string[]; claimSources: Record<string, string[]> | undefined; appended: string[] } {
  const links = candidate.sourceInstanceIds ?? [];
  if (links.length === 0) {
    throw new Error(
      `promote: candidate ${candidate.id} links no source instances; re-collect with instance metadata`,
    );
  }
  const acceptedByRegistry = new Map<string, string>();
  const acceptedByInstance = new Map<string, string>();
  const appended: string[] = [];
  for (const iid of links) {
    const instance = runInstances.get(iid);
    if (!instance) {
      throw new Error(`promote: candidate ${candidate.id} links unknown source instance: ${iid}`);
    }
    const reused = findSourceByContent([...sources.values()], instance.registryId, instance.sha256);
    if (reused) {
      acceptedByRegistry.set(instance.registryId, reused.id);
      acceptedByInstance.set(iid, reused.id);
      continue;
    }
    if (sources.has(instance.id)) {
      acceptedByRegistry.set(instance.registryId, instance.id);
      acceptedByInstance.set(iid, instance.id);
      continue;
    }
    sources.set(instance.id, {
      id: instance.id,
      title: instance.title,
      publisher: instance.publisher,
      ...(instance.url ? { url: instance.url } : {}),
      ...(instance.discovery ? { discovery: instance.discovery } : {}),
      documentType: instance.documentType,
      ...(instance.publishedAt !== undefined ? { publishedAt: instance.publishedAt } : {}),
      ...(instance.effectivePeriod !== undefined ? { effectivePeriod: instance.effectivePeriod } : {}),
      retrievedAt: instance.retrievedAt,
      verifier: reviewer,
      sourceState: instance.sourceState,
      ...(instance.sha256 ? { sha256: instance.sha256 } : {}),
      ...(instance.evidencePath ? { evidencePath: instance.evidencePath } : {}),
      registryId: instance.registryId,
      notes: `Collected by ${instance.collectedBy} in run ${runId}; accepted by ${reviewer}.${instance.notes ? ` ${instance.notes}` : ''}`,
    });
    appended.push(instance.id);
    acceptedByRegistry.set(instance.registryId, instance.id);
    acceptedByInstance.set(iid, instance.id);
  }
  const resolveClaim = (sid: string, field: string): string => {
    if (acceptedByRegistry.has(sid)) return acceptedByRegistry.get(sid) as string;
    if (acceptedByInstance.has(sid)) return acceptedByInstance.get(sid) as string;
    if (sources.has(sid)) return sid;
    if (registryIds.has(sid)) {
      throw new Error(
        `promote: candidate ${candidate.id} cites registry ${sid} with no run evidence for it`,
      );
    }
    throw new Error(`promote: candidate ${candidate.id} claim "${field}" cites unknown source: ${sid}`);
  };
  // The accepted instances ARE the record's provenance: the current revision
  // references exactly the evidence behind this candidacy (Test 2: current
  // points at B while history preserves A). Pre-existing exact IDs survive
  // only inside per-claim attributions, never as bare registry pointers.
  const sourceIds = [...new Set(links.map((iid) => acceptedByInstance.get(iid) as string))];
  let claimSources: Record<string, string[]> | undefined;
  if (candidate.claimSources) {
    claimSources = Object.fromEntries(
      Object.entries(candidate.claimSources).map(([field, sids]) => [
        field,
        [...new Set((sids ?? []).map((sid) => resolveClaim(sid, field)))],
      ]),
    );
  }
  return { sourceIds, claimSources, appended };
}

/**
 * Pre-write gate over the proposed in-memory state: every touched record and
 * every appended source must already satisfy the contract, so a logic error
 * can never reach disk. Only touched records are checked (untouched canonical
 * records keep their grandfathered state until their own migration task).
 */
function validateProposedState(
  records: Map<string, CivicRecord>,
  sources: Map<string, SourceRecord>,
  registryIds: Set<string>,
  touchedRecords: Set<string>,
  touchedSources: Set<string>,
): void {
  const fail = (message: string): never => {
    throw new Error(`promote: proposed state invalid: ${message}`);
  };
  for (const sid of touchedSources) {
    const source = sources.get(sid);
    if (!source) fail(`missing appended source: ${sid}`);
    else {
      if (!source.title || !source.publisher) fail(`source ${sid} is missing title/publisher`);
      if (!isValidDate(source.retrievedAt)) fail(`source ${sid} has invalid retrievedAt: ${source.retrievedAt}`);
      if (source.registryId !== undefined && !registryIds.has(source.registryId)) {
        fail(`source ${sid} cites unknown registry: ${source.registryId}`);
      }
    }
  }
  for (const id of touchedRecords) {
    const record = records.get(id);
    if (!record) fail(`missing touched record: ${id}`);
    else {
      if (!STATUSES.includes(record.status)) fail(`record ${id} has unknown status: ${record.status}`);
      if (!CADENCES.includes(record.updateCadence)) fail(`record ${id} has unknown cadence: ${record.updateCadence}`);
      if (!RECORD_TYPES.includes(record.type)) fail(`record ${id} has unknown type: ${record.type}`);
      if (!RISK_TIERS.includes(record.riskTier)) fail(`record ${id} is missing riskTier`);
      if (!Array.isArray(record.sourceIds) || record.sourceIds.length === 0) fail(`record ${id} has no sourceIds`);
      else {
        for (const sid of record.sourceIds) {
          if (!sources.has(sid)) fail(`record ${id} cites non-exact source: ${sid}`);
        }
      }
      if (record.claimSources) {
        for (const [claimPath, sids] of Object.entries(record.claimSources)) {
          if (!resolveClaimPath(record.data ?? {}, claimPath)) {
            fail(`record ${id} claimSources path does not exist in data: ${claimPath}`);
          }
          for (const sid of sids ?? []) {
            if (!sources.has(sid)) fail(`record ${id} claim "${claimPath}" cites non-exact source: ${sid}`);
          }
        }
      }
      for (const field of ['lastVerified', 'acceptedAt', 'nextReviewOn'] as const) {
        if (!isValidDate(record[field])) fail(`record ${id} has invalid ${field}: ${record[field]}`);
      }
      if (record.nextReviewOn < record.acceptedAt) fail(`record ${id} nextReviewOn is before acceptedAt`);
      if (isTimeBasedCadence(record.updateCadence)) {
        const span = Math.round((Date.parse(record.nextReviewOn) - Date.parse(record.acceptedAt)) / 86400000);
        const max = cadenceWindowDays(record.updateCadence) ?? 0;
        if (span > max) fail(`record ${id} nextReviewOn exceeds the ${record.updateCadence} window`);
      } else if (record.nextReviewOn !== record.acceptedAt) {
        fail(`record ${id} uses a non-scheduled cadence but nextReviewOn != acceptedAt`);
      }
    }
  }
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
  const sources = new Map(loadSources(root).sources.map((s) => [s.id, s]));
  const registryIds = new Set(loadRegistry(root).sources.map((s) => s.id));
  const runInstances = new Map(readSourceInstances(runDir).map((i) => [i.id, i]));
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
  const promotedSources: string[] = [];
  const touchedRecords = new Set<string>();
  const touchedSources = new Set<string>();
  const trackSources = (accepted: { sourceIds: string[]; appended: string[] }): string[] => {
    for (const sid of accepted.appended) touchedSources.add(sid);
    for (const sid of accepted.sourceIds) {
      if (!promotedSources.includes(sid)) promotedSources.push(sid);
    }
    return accepted.sourceIds;
  };

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
      const accepted = acceptCandidateSources(candidate, runInstances, sources, registryIds, NEWS_AUTO_PRINCIPAL, runId);
      records.set(id, {
        id: candidate.id,
        domain: candidate.domain,
        type: candidate.type,
        label: candidate.label,
        data: candidate.data,
        claimSources: accepted.claimSources,
        sourceIds: trackSources(accepted),
        status: 'reported',
        lastVerified: today,
        acceptedBy: NEWS_AUTO_PRINCIPAL,
        acceptedAt: today,
        nextReviewOn: nextReviewDate('weekly', today),
        updateCadence: 'weekly',
        riskTier: policyDefaultRiskTier(candidate.domain, candidate.type),
        collectedBy: candidate.collectedBy,
        notes: candidate.notes,
        history: [],
      });
      touchedRecords.add(id);
      promoted.push(id);
      continue;
    }

    const highRisk = isHighRisk({
      riskTier: existing?.riskTier,
      domain: (existing ?? candidate).domain,
      type: (existing ?? candidate).type,
    });
    if (highRisk && candidate.collectedBy === reviewer) {
      throw new Error(
        `promote: high-risk ${id} was collected by ${reviewer}; an independent reviewer must accept it`,
      );
    }
    const accepted = acceptCandidateSources(candidate, runInstances, sources, registryIds, reviewer, runId);
    const acceptedIds = trackSources(accepted);

    if (existing) {
      const history = existing.history ?? [];
      const revision = {
        revision: history.length + 1,
        data: existing.data,
        acceptedBy: existing.acceptedBy,
        acceptedAt: existing.acceptedAt,
        sourceIds: existing.sourceIds,
      };
      records.set(id, {
        ...existing,
        data: candidate.data,
        claimSources: accepted.claimSources ?? existing.claimSources,
        sourceIds: acceptedIds,
        status: 'verified',
        lastVerified: today,
        acceptedBy: reviewer,
        acceptedAt: today,
        nextReviewOn: nextReviewDate(existing.updateCadence, today),
        collectedBy: candidate.collectedBy,
        history: [...history, revision],
      });
    } else {
      const cadence = options.cadence ?? 'quarterly';
      if (!(cadence in CADENCE_POLICY)) throw new Error(`promote: unknown cadence: ${cadence}`);
      records.set(id, {
        id: candidate.id,
        domain: candidate.domain,
        type: candidate.type,
        label: candidate.label,
        data: candidate.data,
        claimSources: accepted.claimSources,
        sourceIds: acceptedIds,
        status: 'verified',
        lastVerified: today,
        acceptedBy: reviewer,
        acceptedAt: today,
        nextReviewOn: nextReviewDate(cadence as CivicRecord['updateCadence'], today),
        updateCadence: cadence as CivicRecord['updateCadence'],
        riskTier: policyDefaultRiskTier(candidate.domain, candidate.type),
        collectedBy: candidate.collectedBy,
        notes: candidate.notes,
        history: [],
      });
    }
    touchedRecords.add(id);
    promoted.push(id);
  }

  // Validate the complete proposed state in memory before touching disk:
  // a logic error aborts with both files byte-identical to before.
  validateProposedState(records, sources, registryIds, touchedRecords, touchedSources);
  writeJsonAtomic(recordsPath(root), { records: [...records.values()] });
  writeJsonAtomic(sourcesPath(root), { sources: [...sources.values()] });
  return { runId, promoted, promotedSources, reviewer };
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
