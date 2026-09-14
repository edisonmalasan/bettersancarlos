import fs from 'node:fs';
import { recordsPath, registryPath, sourcesPath } from './paths';
import { readJsonFile } from './json';
import { parseYamlSubset } from './yaml';

export type CivicStatus =
  | 'provisional'
  | 'verified'
  | 'reported'
  | 'needs-reverification'
  | 'blocked'
  | 'retired';

export type Cadence =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'per-term'
  | 'per-document'
  | 'manual'
  | 'event-driven';

export type RiskTier = 'high' | 'medium' | 'low';

export interface CivicRecordHistoryEntry {
  revision: number;
  data: Record<string, unknown>;
  acceptedBy: string;
  acceptedAt: string;
  sourceIds: string[];
  notes?: string;
}

export interface CivicRecord {
  id: string;
  domain: string;
  type: string;
  label: string;
  data: Record<string, unknown>;
  claimSources?: Record<string, string[]>;
  sourceIds: string[];
  status: CivicStatus;
  /** Required: explicit impact tier. Absent tiers never silently default away high-impact facts (see lib/policy isHighRisk). */
  riskTier: RiskTier;
  lastVerified: string;
  acceptedBy: string;
  acceptedAt: string;
  nextReviewOn: string;
  updateCadence: Cadence;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  collectedBy?: string;
  notes?: string;
  history?: CivicRecordHistoryEntry[];
}

export interface RecordsFile {
  records: CivicRecord[];
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  discovery?: string;
  documentType: string;
  publishedAt?: string | null;
  effectivePeriod?: { from?: string | null; to?: string | null } | null;
  retrievedAt: string;
  verifiedAt?: string | null;
  verifier: string;
  sourceState: 'active' | 'archived' | 'unavailable' | 'moved';
  sha256?: string;
  evidencePath?: string;
  registryId?: string;
  notes?: string;
}

export interface SourcesFile {
  sources: SourceRecord[];
}

export type SourceType = 'website' | 'facebook-page' | 'portal' | 'document' | 'archive' | 'inquiry';

export interface RegistryEntry {
  id: string;
  publisher: string;
  url?: string;
  discovery?: string;
  sourceType: SourceType;
  collector: string | null;
  /**
   * Acquisition mechanism: `http` (shared polite fetcher, default) or
   * `facebook-graph` (Graph API path with credentials). Absent means `http`.
   */
  acquisition?: 'http' | 'facebook-graph';
  updateCadence: Cadence;
  riskTier?: RiskTier;
  accessNotes?: string;
  evidenceRef: string;
  domains?: string[];
}

export interface RegistryFile {
  version: number;
  sources: RegistryEntry[];
}

export interface Candidate {
  id: string;
  domain: string;
  type: string;
  label: string;
  data: Record<string, unknown>;
  claimSources?: Record<string, string[]>;
  sourceIds: string[];
  /** Exact evidence instances backing this candidate (source-instances.json). Optional for backwards compatibility; required for promotion of new evidence. */
  sourceInstanceIds?: string[];
  status: 'provisional';
  collectedBy: string;
  runId: string;
  notes?: string;
}

/** Exact retrieved-evidence instance produced by a refresh run. Unaccepted instances never reach canonical sources.json. */
export interface SourceInstance {
  id: string;
  registryId: string;
  title: string;
  publisher: string;
  url?: string;
  discovery?: string;
  documentType: string;
  publishedAt?: string | null;
  effectivePeriod?: { from?: string | null; to?: string | null } | null;
  retrievedAt: string;
  sourceState: 'active' | 'archived' | 'unavailable' | 'moved';
  evidencePath?: string;
  sha256?: string;
  collectedBy: string;
  runId: string;
  notes?: string;
}

export interface SourceInstancesFile {
  version: 1;
  instances: SourceInstance[];
}

export type RunSourceOutcome =
  | 'collected'
  | 'unchanged'
  | 'unavailable'
  | 'failed'
  | 'skipped'
  | 'unregistered';

export interface RunSourceEntry {
  sourceId: string;
  checkedAt: string;
  outcome: RunSourceOutcome;
  error?: string;
  evidenceSha256?: string;
  /**
   * Fact-level coverage: existing canonical record IDs the collector
   * attempted to extract from this source in this run. Absent means unknown
   * coverage (pre-coverage runs); the diff then reports no MISSING for it.
   */
  coverage?: string[];
}

export interface RunManifest {
  runId: string;
  startedAt: string;
  endedAt?: string | null;
  /** Manifest format version. Absent means v1 legacy (still readable). */
  schemaVersion?: number;
  parameters: Record<string, unknown>;
  sources: RunSourceEntry[];
  candidatesProduced?: number;
  conflictsFound?: number;
  collectedBy?: string;
}

export type DiffOutcome =
  | 'UNCHANGED'
  | 'NEW'
  | 'CHANGED'
  | 'MISSING'
  | 'STALE'
  | 'CONFLICT'
  | 'SOURCE_UNAVAILABLE'
  | 'SOURCE_CHANGED';

export function loadRecords(root?: string): RecordsFile {
  return readJsonFile<RecordsFile>(recordsPath(root));
}

export function loadSources(root?: string): SourcesFile {
  return readJsonFile<SourcesFile>(sourcesPath(root));
}

export function loadRegistry(root?: string): RegistryFile {
  return parseYamlSubset(fs.readFileSync(registryPath(root), 'utf8')) as RegistryFile;
}
