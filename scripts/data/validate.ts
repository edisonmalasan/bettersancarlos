import fs from 'node:fs';
import path from 'node:path';
import {
  loadRecords,
  loadRegistry,
  loadSources,
  type Candidate,
  type CivicRecord,
  type RegistryFile,
  type RunManifest,
} from './lib/civic';
import { readJsonFile, sha256FileHex } from './lib/json';
import { detectTornPair } from './lib/atomic';
import { isPublishedStatus, isTimeBasedCadence, cadenceWindowDays } from './lib/policy';
import { readSourceInstances } from './lib/instances';
import { civicDir, registryPath, runsDir } from './lib/paths';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export const STATUSES = ['provisional', 'verified', 'reported', 'needs-reverification', 'blocked', 'retired'];
export const CADENCES = [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annually',
  'per-term',
  'per-document',
  'manual',
  'event-driven',
];
export const RISK_TIERS = ['high', 'medium', 'low'];
const DOMAINS = [
  'government',
  'barangays',
  'demographics',
  'emergency',
  'health',
  'education',
  'economy',
  'agriculture',
  'tourism',
  'transportation',
  'legislation',
  'transparency',
  'infrastructure',
  'disaster-risk',
  'environment',
  'utilities',
  'competitiveness',
  'culture-history',
  'news',
  'official-presence',
  'city-profile',
];
export const RECORD_TYPES = [
  'official',
  'contact',
  'statistic',
  'document',
  'service',
  'facility',
  'event',
  'project',
  'directory',
  'announcement',
];
const DOCUMENT_TYPES = [
  'webpage',
  'facebook-post',
  'pdf',
  'xlsx',
  'csv',
  'json',
  'gis',
  'image',
  'inquiry-note',
  'other',
];
const SOURCE_STATES = ['active', 'archived', 'unavailable', 'moved'];
const SOURCE_TYPES = ['website', 'facebook-page', 'portal', 'document', 'archive', 'inquiry'];
const RUN_OUTCOMES = ['collected', 'unchanged', 'unavailable', 'failed', 'skipped', 'unregistered'];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resolveClaimPath(data: Record<string, unknown>, dotted: string): boolean {
  let node: unknown = data;
  for (const seg of dotted.split('.')) {
    if (Array.isArray(node)) {
      if (!/^\d+$/.test(seg) || parseInt(seg, 10) >= node.length) return false;
      node = node[parseInt(seg, 10)];
    } else if (node !== null && typeof node === 'object') {
      if (!(seg in (node as Record<string, unknown>))) return false;
      node = (node as Record<string, unknown>)[seg];
    } else {
      return false;
    }
  }
  return true;
}

const SECRET_PATTERNS: RegExp[] = [
  /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /\b(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|xox[bpas]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35})\b/,
  /\b(api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['"]?[A-Za-z0-9_.\-/+=]{12,}['"]?/i,
  /\bBearer\s+[A-Za-z0-9\-._~+/]{20,}={0,2}/,
];
const LOCAL_PATH_PATTERNS: RegExp[] = [/[A-Za-z]:\\[^\s'"]*/, /\/(home|Users)\/[^\s'"]+/];
const SCAN_EXTENSIONS = new Set(['.json', '.md', '.yaml', '.yml', '.txt', '.csv', '.html']);

function collectJsonStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectJsonStrings(item, out);
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value as Record<string, unknown>)) collectJsonStrings(item, out);
  }
}

function checkContent(rel: string, candidates: string[], result: ValidationResult): void {
  const reported = new Set<string>();
  for (const text of candidates) {
    for (const pattern of SECRET_PATTERNS) {
      const key = `secret:${pattern}`;
      if (!reported.has(key) && pattern.test(text)) {
        reported.add(key);
        result.errors.push(`possible secret in ${rel} (matches ${pattern})`);
      }
    }
    for (const pattern of LOCAL_PATH_PATTERNS) {
      const key = `path:${pattern}`;
      if (!reported.has(key) && pattern.test(text)) {
        reported.add(key);
        result.errors.push(`machine-local path in ${rel} (matches ${pattern})`);
      }
    }
  }
}
function scanTextFiles(root: string, dirs: string[], result: ValidationResult): void {
  const scanFile = (full: string, rel: string): void => {
    let text = '';
    try {
      text = fs.readFileSync(full, 'utf8');
    } catch {
      result.errors.push(`unreadable civic file: ${rel}`);
      return;
    }
    if (path.extname(full).toLowerCase() === '.json') {
      try {
        // Scan decoded string values so JSON escaping cannot hide a secret.
        const strings: string[] = [];
        collectJsonStrings(JSON.parse(text) as unknown, strings);
        checkContent(rel, strings, result);
        return;
      } catch {
        // Fall through to a raw scan when the JSON does not parse.
      }
    }
    checkContent(rel, [text], result);
  };
  const visit = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return; // Missing optional directory (e.g. research/runs before phase 3).
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        visit(full);
        continue;
      }
      if (!SCAN_EXTENSIONS.has(path.extname(name).toLowerCase())) continue;
      scanFile(full, path.relative(root, full));
    }
  };
  for (const dir of dirs) visit(dir);
}

function checkRegistry(registry: RegistryFile, root: string, result: ValidationResult): void {
  const seen = new Set<string>();
  for (const entry of registry.sources ?? []) {
    if (seen.has(entry.id)) result.errors.push(`duplicate source-registry id: ${entry.id}`);
    seen.add(entry.id);
    if (!entry.url && !entry.discovery) {
      result.errors.push(`registry entry ${entry.id} has neither url nor discovery`);
    }
    if (entry.sourceType && !SOURCE_TYPES.includes(entry.sourceType)) {
      result.errors.push(`registry entry ${entry.id} has unknown sourceType: ${entry.sourceType}`);
    }
    if (entry.updateCadence && !CADENCES.includes(entry.updateCadence)) {
      result.errors.push(`registry entry ${entry.id} has unknown cadence: ${entry.updateCadence}`);
    }
    if (entry.riskTier && !RISK_TIERS.includes(entry.riskTier)) {
      result.errors.push(`registry entry ${entry.id} has unknown riskTier: ${entry.riskTier}`);
    }
    if (entry.acquisition !== undefined && entry.acquisition !== 'http' && entry.acquisition !== 'facebook-graph') {
      result.errors.push(`registry entry ${entry.id} has unknown acquisition: ${entry.acquisition}`);
    }
    if (!entry.evidenceRef || !fs.existsSync(path.join(root, entry.evidenceRef))) {
      result.errors.push(`registry entry ${entry.id} cites missing evidenceRef: ${entry.evidenceRef}`);
    }
  }
}

export function validateRoot(root: string): ValidationResult {
  const result: ValidationResult = { errors: [], warnings: [] };
  const today = todayUtc();

  let registry: RegistryFile;
  try {
    registry = loadRegistry(root);
  } catch (err) {
    result.errors.push(`cannot load source registry: ${(err as Error).message}`);
    return result;
  }
  checkRegistry(registry, root, result);
  const registryIds = new Set(registry.sources.map((s) => s.id));

  for (const artifact of detectTornPair(civicDir(root), ['records.json', 'sources.json'])) {
    result.errors.push(
      `torn canonical transaction artifact: ${artifact} (finish or roll back promotion, then re-validate)`,
    );
  }

  let records: CivicRecord[];
  try {
    const file = loadRecords(root);
    if (!file || !Array.isArray(file.records)) throw new Error('records.json must be {"records": [...]}');
    records = file.records;
  } catch (err) {
    result.errors.push(`cannot load civic records: ${(err as Error).message}`);
    return result;
  }

  let sources: ReturnType<typeof loadSources>['sources'];
  try {
    const file = loadSources(root);
    if (!file || !Array.isArray(file.sources)) throw new Error('sources.json must be {"sources": [...]}');
    sources = file.sources;
  } catch (err) {
    result.errors.push(`cannot load civic sources: ${(err as Error).message}`);
    return result;
  }

  const sourceById = new Map(sources.map((s) => [s.id, s]));
  for (const [id, seen] of countDuplicates(sources.map((s) => s.id))) {
    if (seen > 1) result.errors.push(`duplicate source id: ${id}`);
  }
  for (const source of sources) {
    if (typeof source.id !== 'string' || source.id === '') {
      result.errors.push('source record with missing id');
      continue;
    }
    if (source.documentType && !DOCUMENT_TYPES.includes(source.documentType)) {
      result.errors.push(`source ${source.id} has unknown documentType: ${source.documentType}`);
    }
    if (!SOURCE_STATES.includes(source.sourceState)) {
      result.errors.push(`source ${source.id} has unknown sourceState: ${source.sourceState}`);
    }
    for (const field of ['retrievedAt', 'verifiedAt', 'publishedAt'] as const) {
      const value = source[field];
      if (value !== undefined && value !== null && !isValidDate(value)) {
        result.errors.push(`source ${source.id} has invalid ${field}: ${value}`);
      }
    }
    if (source.registryId && !registryIds.has(source.registryId)) {
      result.errors.push(`source ${source.id} references unknown registry id: ${source.registryId}`);
    }
    if (source.evidencePath || source.sha256) {
      const evidenceFile = path.join(root, source.evidencePath ?? '');
      if (!source.evidencePath || !fs.existsSync(evidenceFile)) {
        result.errors.push(`source ${source.id} declares missing evidence file: ${source.evidencePath}`);
      } else if (source.sha256) {
        const actual = sha256FileHex(evidenceFile);
        if (actual !== source.sha256.toLowerCase()) {
          result.errors.push(`source ${source.id} evidence hash mismatch: ${source.evidencePath}`);
        }
      } else {
        result.warnings.push(`source ${source.id} stores evidence without a sha256 hash`);
      }
    }
  }

  const resolveSource = (id: string): boolean => sourceById.has(id) || registryIds.has(id);

  for (const [id, seen] of countDuplicates(records.map((r) => r.id))) {
    if (seen > 1) result.errors.push(`duplicate civic record id: ${id}`);
  }
  for (const record of records) {
    const tag = `record ${record.id || '(missing id)'}`;
    if (!record.id) {
      result.errors.push('civic record with missing id');
      continue;
    }
    if (!STATUSES.includes(record.status)) {
      result.errors.push(`${tag} has unknown status: ${record.status}`);
      continue;
    }
    if (!DOMAINS.includes(record.domain)) result.errors.push(`${tag} has unknown domain: ${record.domain}`);
    if (!RECORD_TYPES.includes(record.type)) result.errors.push(`${tag} has unknown type: ${record.type}`);
    if (!CADENCES.includes(record.updateCadence)) {
      result.errors.push(`${tag} has unknown updateCadence: ${record.updateCadence}`);
    }
    if (!record.riskTier) {
      result.errors.push(`${tag} is missing riskTier`);
    } else if (!RISK_TIERS.includes(record.riskTier)) {
      result.errors.push(`${tag} has unknown riskTier: ${record.riskTier}`);
    }
    if (!Array.isArray(record.sourceIds) || record.sourceIds.length === 0) {
      result.errors.push(`${tag} has no sourceIds`);
    } else {
      for (const sid of record.sourceIds) {
        if (!resolveSource(sid)) result.errors.push(`${tag} references unknown source id: ${sid}`);
        else if (!sourceById.has(sid)) {
          result.errors.push(
            `${tag} cites registry ${sid} without an exact sources.json record; canonical claims require evidence instances`,
          );
        }
        const cited = sourceById.get(sid);
        if (
          cited &&
          cited.sourceState === 'unavailable' &&
          (record.status === 'verified' || record.status === 'reported')
        ) {
          result.errors.push(`${tag} is ${record.status} but cites unavailable source: ${sid}`);
        }
        if (cited && cited.sourceState === 'moved') {
          result.warnings.push(`${tag} cites moved source (re-verify location): ${sid}`);
        }
      }
    }
    if (record.claimSources) {
      for (const [claimPath, sids] of Object.entries(record.claimSources)) {
        if (!resolveClaimPath(record.data ?? {}, claimPath)) {
          result.errors.push(`${tag} claimSources path does not exist in data: ${claimPath}`);
        }
        for (const sid of sids ?? []) {
          if (!resolveSource(sid)) result.errors.push(`${tag} claim "${claimPath}" references unknown source: ${sid}`);
          else if (!sourceById.has(sid)) {
            result.errors.push(
              `${tag} claim "${claimPath}" cites registry ${sid} without an exact sources.json record`,
            );
          }
        }
      }
    }
    for (const field of ['lastVerified', 'acceptedAt', 'nextReviewOn'] as const) {
      if (!isValidDate(record[field])) result.errors.push(`${tag} has invalid ${field}: ${record[field]}`);
    }
    for (const field of ['effectiveFrom', 'effectiveTo'] as const) {
      const value = record[field];
      if (value !== undefined && value !== null && !isValidDate(value)) {
        result.errors.push(`${tag} has invalid ${field}: ${value}`);
      }
    }
    if (isValidDate(record.lastVerified) && isValidDate(record.acceptedAt) && record.lastVerified > record.acceptedAt) {
      result.errors.push(`${tag} lastVerified is after acceptedAt`);
    }
    if (
      isValidDate(record.effectiveFrom ?? '') &&
      isValidDate(record.effectiveTo ?? '') &&
      (record.effectiveFrom as string) > (record.effectiveTo as string)
    ) {
      result.errors.push(`${tag} effectiveFrom is after effectiveTo`);
    }
    if (isValidDate(record.acceptedAt) && isValidDate(record.nextReviewOn)) {
      if (record.nextReviewOn < record.acceptedAt) {
        result.errors.push(`${tag} nextReviewOn is before acceptedAt`);
      }
      const published = isPublishedStatus(record.status);
      const changing = isTimeBasedCadence(record.updateCadence);
      if (published && changing && record.nextReviewOn < today) {
        result.errors.push(`${tag} is ${record.status} but past nextReviewOn (${record.nextReviewOn})`);
      }
      // Shared cadence windows (lib/policy): a review deadline may not exceed
      // its cadence's maximum window. Non-time-based cadences (manual,
      // per-document) carry no scheduled horizon: nextReviewOn must equal
      // acceptedAt as an explicit "no scheduled review" sentinel.
      const window = cadenceWindowDays(record.updateCadence);
      if (window !== null) {
        const span = Math.round((Date.parse(record.nextReviewOn) - Date.parse(record.acceptedAt)) / 86400000);
        if (changing && span > window) {
          result.errors.push(
            `${tag} nextReviewOn exceeds the ${record.updateCadence} window (${window} days from acceptedAt)`,
          );
        } else if (!changing && record.nextReviewOn !== record.acceptedAt) {
          result.errors.push(
            `${tag} uses non-scheduled cadence ${record.updateCadence} but nextReviewOn != acceptedAt; keep the sentinel instead of a fake horizon`,
          );
        }
      }
    }
    if (record.status === 'needs-reverification' || record.status === 'blocked' || record.status === 'provisional') {
      result.warnings.push(`${tag} is ${record.status} and must not be presented as current fact`);
    }
    if (Array.isArray(record.history)) {
      const revisions = record.history.map((h) => h.revision);
      for (const [rev, seen] of countDuplicates(revisions)) {
        if (seen > 1) result.errors.push(`${tag} has duplicate history revision: ${rev}`);
      }
    }
  }

  validateRuns(root, result, resolveSource);

  validateResearchConfinement(root, result);

  scanTextFiles(root, [civicDir(root), runsDir(root)], result);

  return result;
}

function countDuplicates(ids: Array<string | number>): Map<string | number, number> {
  const counts = new Map<string | number, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}

// Pipeline automation may only write under research/runs/. A pipeline
// artifact (manifest, candidates, review report, findings, conflicts, or
// collected evidence) anywhere else under research/ means a command escaped
// its confinement and touched topic-organized research.
const PIPELINE_ARTIFACT_NAMES = new Set([
  'manifest.json',
  'candidates.json',
  'review-report.md',
  'findings.md',
  'conflicts.md',
]);

function validateResearchConfinement(root: string, result: ValidationResult): void {
  const researchDir = path.join(root, 'research');
  const runsRoot = runsDir(root);
  let top: string[];
  try {
    top = fs.readdirSync(researchDir);
  } catch {
    return; // No research dir in a minimal fixture; nothing to confine.
  }
  const visit = (dir: string): void => {
    let entries: string[];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      let stat: fs.Stats;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        if (full === runsRoot) continue; // Research runs are the allowed write area.
        if (name === 'evidence') {
          result.errors.push(
            `pipeline artifact outside research/runs: ${path.relative(root, full)} (evidence belongs under research/runs/<run>/evidence)`,
          );
          continue;
        }
        visit(full);
        continue;
      }
      if (PIPELINE_ARTIFACT_NAMES.has(name)) {
        result.errors.push(`pipeline artifact outside research/runs: ${path.relative(root, full)}`);
      }
    }
  };
  // Walk each top-level entry except runs/ so a missing runs/ dir is fine.
  for (const name of top) {
    if (path.join(researchDir, name) === runsRoot) continue;
    const full = path.join(researchDir, name);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) visit(full);
    else if (PIPELINE_ARTIFACT_NAMES.has(name)) {
      result.errors.push(`pipeline artifact outside research/runs: ${path.relative(root, full)}`);
    }
  }
}

function validateRuns(
  root: string,
  result: ValidationResult,
  resolveSource: (id: string) => boolean,
): void {
  const runs = runsDir(root);
  let names: string[] = [];
  try {
    names = fs.readdirSync(runs);
  } catch {
    return; // No research runs yet.
  }
  for (const name of names) {
    const runDir = path.join(runs, name);
    if (!fs.statSync(runDir).isDirectory()) continue;
    const manifestPath = path.join(runDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      result.warnings.push(`research run ${name} has no manifest.json`);
      continue;
    }
    let manifest: RunManifest;
    try {
      manifest = readJsonFile<RunManifest>(manifestPath);
    } catch (err) {
      result.errors.push(`research run ${name} has an unreadable manifest: ${(err as Error).message}`);
      continue;
    }
    for (const entry of manifest.sources ?? []) {
      if (!entry.sourceId || !entry.checkedAt) {
        result.errors.push(`research run ${name} has a manifest entry missing sourceId/checkedAt`);
      }
      if (!RUN_OUTCOMES.includes(entry.outcome)) {
        result.errors.push(`research run ${name} has unknown source outcome: ${entry.outcome}`);
      }
    }
    if (!manifest.endedAt) {
      result.warnings.push(`research run ${name} has no endedAt (incomplete or interrupted run)`);
    }
    const candidatesPath = path.join(runDir, 'candidates.json');
    if (!fs.existsSync(candidatesPath)) continue;
    let candidates: { candidates: Candidate[] };
    try {
      candidates = readJsonFile<{ candidates: Candidate[] }>(candidatesPath);
    } catch (err) {
      result.errors.push(`research run ${name} has unreadable candidates: ${(err as Error).message}`);
      continue;
    }
    let instanceIds: Set<string> | null = null;
    try {
      instanceIds = new Set(readSourceInstances(runDir).map((i) => i.id));
    } catch (err) {
      result.errors.push(`research run ${name} has unreadable source-instances: ${(err as Error).message}`);
      continue;
    }
    for (const candidate of candidates.candidates ?? []) {
      const tag = `candidate ${candidate.id || '(missing id)'} in run ${name}`;
      if (candidate.status !== 'provisional') {
        result.errors.push(`${tag} must be provisional, found: ${candidate.status}`);
      }
      if ('acceptedBy' in candidate || 'acceptedAt' in candidate) {
        result.errors.push(`${tag} must not carry reviewer-owned acceptance fields`);
      }
      if (!candidate.collectedBy || !candidate.runId) {
        result.errors.push(`${tag} is missing collectedBy/runId`);
      }
      for (const sid of candidate.sourceIds ?? []) {
        if (!resolveSource(sid)) result.errors.push(`${tag} references unknown source id: ${sid}`);
      }
      for (const iid of candidate.sourceInstanceIds ?? []) {
        if (!instanceIds.has(iid)) {
          result.errors.push(`${tag} links unknown source instance: ${iid}`);
        }
      }
    }
  }
}

function main(): number {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  if (!fs.existsSync(registryPath(root))) {
    console.error(`no civic-data registry found under ${root} (is CIVIC_ROOT wrong?)`);
    return 2;
  }
  const result = validateRoot(root);
  for (const warning of result.warnings) console.log(`warning: ${warning}`);
  for (const error of result.errors) console.error(`error: ${error}`);
  console.log(
    `civic-data validation: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`,
  );
  return result.errors.length > 0 ? 1 : 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/validate.ts');

if (invokedDirectly) {
  process.exit(main());
}
